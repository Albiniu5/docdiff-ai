import os
import tempfile
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import PyPDF2
from docx import Document
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size
ALLOWED_EXTENSIONS = {'pdf', 'txt', 'docx'}

# Configure Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
    except Exception as e:
        raise Exception(f"Error reading PDF: {str(e)}")

def extract_text_from_docx(file_path):
    """Extract text from DOCX file"""
    try:
        doc = Document(file_path)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text.strip()
    except Exception as e:
        raise Exception(f"Error reading DOCX: {str(e)}")

def extract_text_from_txt(file_path):
    """Extract text from TXT file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read().strip()
    except UnicodeDecodeError:
        # Try with different encoding if UTF-8 fails
        try:
            with open(file_path, 'r', encoding='latin-1') as file:
                return file.read().strip()
        except Exception as e:
            raise Exception(f"Error reading TXT file: {str(e)}")
    except Exception as e:
        raise Exception(f"Error reading TXT file: {str(e)}")

def extract_text(file_path, filename):
    """Extract text based on file extension"""
    extension = filename.rsplit('.', 1)[1].lower()
    
    if extension == 'pdf':
        return extract_text_from_pdf(file_path)
    elif extension == 'docx':
        return extract_text_from_docx(file_path)
    elif extension == 'txt':
        return extract_text_from_txt(file_path)
    else:
        raise Exception("Unsupported file type")

def compare_documents_with_ai(text_a, text_b):
    """Use Gemini AI to compare two documents with fallbacks"""
    if not GEMINI_API_KEY:
        raise Exception("Gemini API key not configured. Please set GEMINI_API_KEY in your .env file")
    
    # List of models to try in order of preference
    models_to_try = [
        'gemini-2.5-pro',
        'gemini-3-flash-preview',
        'gemini-2.5-flash',
        'gemini-1.5-pro',
        'gemini-1.5-flash'
    ]
    
    last_error = None
    
    for model_name in models_to_try:
        try:
            print(f"Trying model: {model_name}...")
            model = genai.GenerativeModel(model_name)
            
            prompt = f"""You are a document comparison expert. Compare the following two documents and identify all differences.

Document A:
---
{text_a}
---

Document B:
---
{text_b}
---

Please analyze these documents and provide:
1. A summary of key differences
2. Detailed changes organized by category (additions, deletions, modifications)

Format your response as JSON with this structure:
{{
  "summary": "Brief summary of overall changes",
  "additions": ["List of content added in Document B"],
  "deletions": ["List of content removed from Document A"],
  "modifications": [
    {{"original": "text from A", "changed": "text from B", "description": "what changed"}}
  ],
  "statistics": {{
    "total_changes": number,
    "additions_count": number,
    "deletions_count": number,
    "modifications_count": number
  }}
}}

Be precise and highlight meaningful differences. Ignore minor formatting differences unless they affect meaning."""

            response = model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            print(f"Model {model_name} failed: {str(e)}")
            last_error = e
            continue
            
    # If all models fail
    raise Exception(f"All AI models failed. Last error: {str(last_error)}")

@app.route('/')
def index():
    """Serve landing page"""
    return send_from_directory('static', 'index.html')

@app.route('/compare')
def compare_page():
    """Serve comparison page"""
    return send_from_directory('static', 'compare.html')

@app.route('/api/compare', methods=['POST'])
def compare_documents():
    """API endpoint to compare two documents"""
    try:
        # Validate request
        if 'documentA' not in request.files or 'documentB' not in request.files:
            return jsonify({'error': 'Both documents are required'}), 400
        
        file_a = request.files['documentA']
        file_b = request.files['documentB']
        
        # Validate filenames
        if file_a.filename == '' or file_b.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file types
        if not allowed_file(file_a.filename) or not allowed_file(file_b.filename):
            return jsonify({'error': f'Invalid file type. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        # Create temporary files
        temp_dir = tempfile.mkdtemp()
        try:
            # Save files temporarily
            filename_a = secure_filename(file_a.filename)
            filename_b = secure_filename(file_b.filename)
            path_a = os.path.join(temp_dir, filename_a)
            path_b = os.path.join(temp_dir, filename_b)
            
            file_a.save(path_a)
            file_b.save(path_b)
            
            # Extract text from both documents
            text_a = extract_text(path_a, filename_a)
            text_b = extract_text(path_b, filename_b)
            
            if not text_a or not text_b:
                return jsonify({'error': 'One or both documents are empty'}), 400
            
            # Compare using AI
            comparison_result = compare_documents_with_ai(text_a, text_b)
            
            return jsonify({
                'success': True,
                'comparison': comparison_result,
                'metadata': {
                    'documentA': filename_a,
                    'documentB': filename_b,
                    'lengthA': len(text_a),
                    'lengthB': len(text_b)
                }
            })
            
        finally:
            # Clean up temporary files
            import shutil
            shutil.rmtree(temp_dir, ignore_errors=True)
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/compare-text', methods=['POST'])
def compare_text():
    """API endpoint to compare two text inputs directly"""
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        text_a = data.get('textA', '').strip()
        text_b = data.get('textB', '').strip()
        
        if not text_a or not text_b:
            return jsonify({'error': 'Both text inputs are required'}), 400
        
        # Compare using AI
        comparison_result = compare_documents_with_ai(text_a, text_b)
        
        return jsonify({
            'success': True,
            'comparison': comparison_result,
            'metadata': {
                'lengthA': len(text_a),
                'lengthB': len(text_b)
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'gemini_configured': bool(GEMINI_API_KEY)
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)

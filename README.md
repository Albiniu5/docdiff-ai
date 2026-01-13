# DocDiff AI 📄

A modern web application that uses AI to intelligently compare documents and highlight differences. Built with Python Flask backend and vanilla JavaScript frontend.

![DocDiff AI](https://img.shields.io/badge/AI-Powered-blue) ![Flask](https://img.shields.io/badge/Flask-3.0-green) ![Gemini](https://img.shields.io/badge/Google-Gemini-orange)

## ✨ Features

- **📤 Easy Upload**: Drag & drop interface for PDF, DOCX, and TXT files
- **🤖 AI-Powered Comparison**: Uses Google Gemini to understand context and meaning
- **🎨 Beautiful Visualization**: Color-coded highlights for additions, deletions, and modifications
- **⚡ Lightning Fast**: Results in seconds with optimized processing
- **🔒 100% Private**: Documents processed in-memory, never stored
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Python 3.11 or higher
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Local Setup

1. **Clone or download this repository**

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
FLASK_ENV=development
PORT=5000
```

4. **Run the application**
```bash
python app.py
```

5. **Open your browser**

Navigate to `http://localhost:5000`

## 🐳 Docker Deployment

### Build and run with Docker

```bash
# Build the image
docker build -t docdiff-ai .

# Run the container
docker run -p 5000:5000 --env-file .env docdiff-ai
```

## 🌐 Cloud Deployment

### Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Click the button above
2. Connect your GitHub repository
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy!

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python app.py`
5. Add environment variable: `GEMINI_API_KEY`
6. Deploy!

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create a new app
heroku create your-app-name

# Set environment variables
heroku config:set GEMINI_API_KEY=your_gemini_api_key_here

# Deploy
git push heroku main
```

## 📁 Project Structure

```
docdiff-ai/
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── .env.example          # Environment template
├── README.md             # This file
└── static/
    ├── index.html        # Landing page
    ├── compare.html      # Comparison interface
    ├── css/
    │   └── styles.css    # All styles
    └── js/
        ├── app.js        # Landing page JS
        └── compare.js    # Comparison page JS
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |
| `FLASK_ENV` | Flask environment (development/production) | No (default: production) |
| `PORT` | Server port | No (default: 5000) |

### Supported File Formats

- **PDF** (.pdf) - Extracted using PyPDF2
- **DOCX** (.docx) - Extracted using python-docx
- **TXT** (.txt) - Plain text files

### File Size Limits

- Maximum file size: **10MB** per document
- This can be adjusted in `app.py` by modifying `MAX_CONTENT_LENGTH`

## 🎨 Tech Stack

### Backend
- **Flask** - Lightweight Python web framework
- **Google Gemini API** - Advanced AI for document comparison
- **PyPDF2** - PDF text extraction
- **python-docx** - DOCX text extraction

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No framework dependencies
- **Inter Font** - Clean, modern typography

### Design Features
- Dark theme with vibrant gradients
- Glassmorphism effects
- Smooth animations and transitions
- Fully responsive layouts
- Accessible UI components

## 🔒 Privacy & Security

- **No Storage**: Documents are processed in-memory only
- **Automatic Cleanup**: Temporary files deleted immediately after processing
- **File Validation**: Type and size checks before processing
- **CORS Protection**: Configured for security
- **Error Handling**: Graceful error handling without exposing sensitive information

## 🧪 Testing

### Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "gemini_configured": true
}
```

### Test Comparison

1. Prepare two test documents (PDF, DOCX, or TXT)
2. Navigate to `/compare`
3. Upload both documents
4. Click "Compare Documents"
5. View the AI-generated comparison results

## 📝 API Endpoints

### `GET /`
Serves the landing page

### `GET /compare`
Serves the comparison interface

### `POST /api/compare`
Compares two documents

**Request**: `multipart/form-data`
- `documentA`: File (PDF, DOCX, or TXT)
- `documentB`: File (PDF, DOCX, or TXT)

**Response**: `application/json`
```json
{
  "success": true,
  "comparison": "AI-generated comparison in JSON format",
  "metadata": {
    "documentA": "filename.pdf",
    "documentB": "filename.docx",
    "lengthA": 1234,
    "lengthB": 1456
  }
}
```

### `GET /api/health`
Health check endpoint

**Response**: `application/json`
```json
{
  "status": "healthy",
  "gemini_configured": true
}
```

## 🐛 Troubleshooting

### "Gemini API key not configured"
- Make sure you've created a `.env` file
- Verify your API key is correct
- Restart the application after adding the key

### "Error reading PDF/DOCX"
- Ensure the file is not corrupted
- Try with a different file
- Check file size is under 10MB

### Port already in use
```bash
# Change the port in .env
PORT=8000

# Or specify when running
python app.py
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Google Gemini](https://deepmind.google/technologies/gemini/)
- Styled with modern web design principles
- Inspired by the need for intelligent document comparison

---

**Built with ❤️ using AI**

For questions or support, please open an issue on GitHub.

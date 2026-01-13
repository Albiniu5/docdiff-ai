FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for document processing
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Create directory for temporary files
RUN mkdir -p /tmp/docdiff

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app.py
ENV PORT=5000

# Run the application
CMD ["python", "app.py"]

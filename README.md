![FriesenjungAI logo](https://drive.google.com/file/d/1mDQRCkyIuE1JN__no9bDBEEkDFevzu_F/view)


# CV Analyzer: AI-Powered Resume Optimization

A Flask-based web application that uses OpenAI GPT-4 to analyze CVs/resumes against job descriptions and provide tailored improvement suggestions.

## 🚀 Features

- **CV Processing**: Upload and extract text from PDF and DOCX files
- **Job Description Management**: Save and organize job postings
- **AI Analysis**: Powered by OpenAI GPT-4 to compare CVs against job requirements
- **Detailed Feedback**: 
  - Match scoring (0-100)
  - Strengths and weaknesses assessment
  - Specific improvement suggestions
  - AI-generated optimized version of your CV
- **User Management**: Register, login, and track your analyses
- **Export Functionality**: Download your improved CV
- **Analysis History**: Review past analyses and track progress

## 📋 Prerequisites

- Python 3.8 or higher
- OpenAI API key
- pip (Python package manager)

## ⚙️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/NikolasRoufas/AI-Scanner.git
cd AI-Scanner
```

2. **Set up a virtual environment**

```bash
# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Activate it (macOS/Linux)
source venv/bin/activate
```

3. **Install dependencies**

```bash
pip install flask flask-cors pdfplumber python-docx openai sqlite3 werkzeug
```

4. **Set up the OpenAI API key**

```bash
# For Windows
set OPENAI_API_KEY=your_openai_api_key_here

# For macOS/Linux
export OPENAI_API_KEY=your_openai_api_key_here
```

For persistent configuration, consider using a `.env` file with python-dotenv.

5. **Create upload directory**

```bash
mkdir uploads
```

## 🏃‍♂️ Running the Application

Start the Flask server:

```bash
python app.py
```

The application will run on http://localhost:5000 by default.

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - Create a new user account
- `POST /api/login` - Log in to an existing account

### CV Management
- `POST /api/upload-cv` - Upload a CV file (PDF/DOCX)
- `GET /api/user-cvs` - Get all CVs for a user

### Job Descriptions
- `POST /api/job-description` - Save a job description
- `GET /api/user-job-descriptions` - Get all job descriptions for a user

### Analysis
- `POST /api/analyze` - Analyze a CV against a job description
- `GET /api/analysis-history` - Get analysis history for a user
- `GET /api/analysis-result/{result_id}` - Get a specific analysis result
- `GET /api/export-cv/{result_id}` - Export an improved CV as a downloadable file

### System
- `GET /api/health` - Health check endpoint

### Job Search (Placeholder Implementation)
- `GET /api/job-search` - Search for jobs (currently returns mock data)
- `POST /api/send-application` - Send a job application (simulation)

## 📐 Database Structure

The application uses SQLite with the following schema:

- **users**: User accounts and authentication
  - id, email, password_hash, created_at

- **cvs**: Stored CV files and their extracted content
  - id, user_id, file_name, file_path, content, created_at

- **job_descriptions**: Stored job descriptions
  - id, user_id, title, content, created_at

- **analysis_results**: Results from CV analysis
  - id, user_id, cv_id, job_description_id, score, feedback, suggestions, improved_cv, created_at

## 🔒 Security Considerations for Production

The current implementation is suitable for development but requires these enhancements for production:

1. **Secure API Key Storage**: Use environment variables or a secure vault for the OpenAI API key
2. **Password Security**: Implement proper password hashing using bcrypt or similar
3. **Authentication**: Add JWT or session-based authentication
4. **CORS Configuration**: Restrict to trusted domains only
5. **HTTPS**: Configure SSL/TLS encryption
6. **Input Validation**: Add more robust request validation
7. **Rate Limiting**: Implement API rate limiting
8. **File Validation**: Enhanced validation of uploaded files
9. **Database Optimization**: Consider a more robust database for production scale

## 🌐 Frontend Development

This repository contains only the backend API. To create a complete application:

1. Develop a frontend using a framework like React, Vue.js, or Angular
2. Connect to the API endpoints
3. Create UI components for:
   - User registration/login
   - CV upload
   - Job description entry
   - Analysis results display
   - Results history

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

# This Project was conducted for Ionian University as part of the class.

# AI-Scanner

AI-Scanner is a full-stack web application that analyzes a candidate’s resume (CV) against a job description and generates an AI-powered compatibility report, including a match score and qualitative feedback.

The system consists of:

* A **Flask backend** that handles file uploads, parsing, and AI analysis
* A **React (Vite) frontend** that provides the user interface

---

## Features

* Upload CVs in PDF or DOCX format
* Input or select job descriptions
* AI-powered resume ↔ job matching
* Match score and detailed analysis report
* User authentication (basic)
* Clean modern frontend (Vite + React)

---

## Project Structure

```
AI-Scanner/
├── backend/
│   ├── app.py
│   ├── cv_scanner.db
│   ├── uploads/
│   └── venv/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Requirements

### Backend

* Python 3.9+
* pip
* OpenAI API key

### Frontend

* Node.js 18+
* npm

---

## Backend Setup (Flask)

### 1. Navigate to backend

```bash
cd backend
```

### 2. Create and activate virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install flask flask-cors pdfplumber python-docx openai werkzeug
```

### 4. Set environment variables

```bash
export OPENAI_API_KEY="your_openai_api_key"
export OPENAI_MODEL="gpt-4o-mini"
```

`gpt-4o-mini` is recommended for availability, speed, and cost.

### 5. Create uploads directory (if missing)

```bash
mkdir uploads
```

### 6. Run backend server

```bash
python app.py
```

The backend will run at:

```
http://localhost:5000
```

---

## Frontend Setup (React + Vite)

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

## Running the Full Application

Open **two terminals**:

### Terminal 1 — Backend

```bash
cd backend
source venv/bin/activate
python app.py
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Then open your browser at:

```
http://localhost:5173
```

---

## Common Issues

### `Missing script: "start"`

The frontend uses **Vite**, not Create-React-App.

Use:

```bash
npm run dev
```

---

### OpenAI model error (404 / model_not_found)

If you see errors related to `gpt-4-turbo-preview`, that model is deprecated.

Use:

```bash
export OPENAI_MODEL="gpt-4o-mini"
```

Or update the model directly in `backend/app.py`.

---

## Notes

* The backend and frontend must both be running for the app to function correctly.
* The OpenAI API key is required for analysis features.
* This project is intended for educational and experimental use.


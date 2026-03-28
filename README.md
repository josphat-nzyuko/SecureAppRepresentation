# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

# 🔐 SecureApp

A full-stack secure web application prototype built with 
**React** (frontend) and **Python FastAPI** (backend).

## Security Features
- JWT Authentication
- bcrypt Password Hashing
- XSS Protection with DOMPurify
- Input Validation with Pydantic
- Security Headers (CSP, HSTS, X-Frame-Options)
- CORS Protection
- SQL Injection Prevention with SQLAlchemy ORM
- Audit Logging on every request
- Protected Routes on frontend
- Rate Limiting ready

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, Vite, Axios, DOMPurify |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | SQLite |
| Auth | JWT Tokens, bcrypt |

## How to Run

### Backend
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python run.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Documentation
Once the backend is running visit:
```
http://localhost:8000/docs
```

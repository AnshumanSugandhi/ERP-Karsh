# ERP System - Custom Enterprise ERP & Analytics Management System

This repository contains the codebase for the **K.A.R.S.H. Technologies ERP System**. 

The system is built as an API-first platform utilizing:
- **Backend**: Python, Django, Django REST Framework, PostgreSQL
- **Frontend**: React, Next.js, Tailwind CSS
- **Infrastructure**: Docker, Redis

## Architecture Overview
See the `/artifacts/PRD_and_TechStack.md` file for full architectural details and module breakdowns.

---

## 🚀 Quick Start Guide

### 1. Database Setup (Local PostgreSQL)
Ensure you have PostgreSQL installed on your Windows machine.
1. Open pgAdmin or your psql CLI.
2. Create a new database named `erp_db`.
3. Ensure your local PostgreSQL user credentials match what is in `backend/erp_core/settings.py` (or update the settings file to match your local credentials).

### 2. Backend Setup (Django)
Open a terminal in the root folder and navigate to the `backend` directory:
```bash
cd backend
```
Activate the virtual environment:
- **Windows**: `.\venv\Scripts\activate`
- **Mac/Linux**: `source venv/bin/activate`

Apply database migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

Start the Django development server:
```bash
python manage.py runserver
```
*Backend runs on `http://127.0.0.1:8000/`*

### 3. Frontend Setup (Next.js)
Open a new terminal, navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000/`*

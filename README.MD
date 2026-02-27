# HRMS - Human Resource Management System

A full-stack HR management system built with **React + Vite** (frontend) and **FastAPI + PostgreSQL** (backend). Manage employees, track attendance, and view real-time dashboard analytics with a modern, responsive UI.

## Live Demo

- **Frontend**: https://hrms-self-chi.vercel.app/dashboard
- **Backend API**: https://hrms-8ndw.onrender.com
- **API Docs**: https://hrms-8ndw.onrender.com/docs

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router, Axios, Lucide Icons |
| **Backend** | Python, FastAPI, SQLAlchemy, Pydantic |
| **Database** | PostgreSQL |
| **Deployment** | Vercel (frontend) + Render (backend) |

## Features

- Employee Management - Add, edit, delete, search employees by name/ID/department
- Attendance Tracking - Mark present, absent, late, half-day with edit & delete support
- Live Dashboard - Real-time employee stats, attendance rate, department breakdown
- Time-Based Greeting - Dynamic greeting changes (Good Morning/Afternoon/Evening) with color-coded UI
- Dynamic Theme Colors - Sidebar and buttons change color based on time of day
- New Joinings Section - View recently added employees on dashboard
- Advanced Filtering - Filter attendance by employee or date
- Data Validation - Phone and email validation on both frontend and backend
- Responsive Design - Works perfectly on mobile, tablet, and desktop
- Professional UI - Modern gradient design with smooth animations

## Project Structure

```
hrms/
├── backend/
│   ├── main.py                   # FastAPI entry point
│   ├── requirements.txt
│   ├── start.sh                  # Render start command
│   ├── .env.example
│   └── app/
│       ├── api/
│       │   └── routes/
│       │       ├── employees.py
│       │       └── attendance.py
│       ├── core/
│       │   └── config.py         # Settings & CORS config
│       ├── db/
│       │   └── database.py       # SQLAlchemy setup
│       ├── models/               # SQLAlchemy ORM models
│       ├── schemas/              # Pydantic request/response schemas
│       └── services/             # Business logic
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── vercel.json               # SPA routing fix for Vercel
    ├── .env.example
    ├── public/
    │   └── admin image.jpg       # HRMS logo
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── pages/                # Dashboard, Employees, Attendance
        ├── components/           # Layout, forms, UI components
        ├── services/api.js       # Axios API calls
        └── hooks/useGreeting.js  # Time-based greeting hook
```

## Running Locally

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- PostgreSQL installed locally

### Backend Setup

```bash
cd hrms/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hrms > .env

# Run the server
uvicorn main:app --reload
```

Backend runs at: http://localhost:8000  
API documentation: http://localhost:8000/docs

### Frontend Setup

```bash
cd hrms/frontend

# Install dependencies
npm install

# Create .env file
echo VITE_API_URL=http://localhost:8000 > .env

# Run development server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Deployment Guide

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yugalsharmaandtc/HRMS.git
git branch -M main
git push -u origin main
```

### Step 2: Set up PostgreSQL on Render

1. Go to [render.com](https://render.com) → Sign up/Log in
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `hrms-db`
   - **Database**: `hrms`
   - **User**: `hrms_user`
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **Create Database**
5. Once ready, copy the **Internal Database URL** from Connection section
   - Format: `postgresql://hrms_user:PASSWORD@dpg-xxxx.internal/hrms`

### Step 3: Deploy Backend on Render

1. Click **New +** → **Web Service**
2. Connect GitHub and select your HRMS repo
3. Configure:
   - **Name**: `hrms-api`
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
4. Add Environment Variables:
   - `DATABASE_URL`: Paste the Internal Database URL from Step 2
   - `FRONTEND_URL`: Leave blank (update after Vercel deploy)
5. Click **Create Web Service**
6. Once deployed, note your backend URL (e.g., `https://hrms-8ndw.onrender.com`)

### Step 4: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **Add New Project** → Select HRMS repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://hrms-8ndw.onrender.com`)
5. Click **Deploy**
6. Once done, note your frontend URL (e.g., `https://hrms-self-chi.vercel.app`)

### Step 5: Fix CORS (Update Backend with Frontend URL)

1. Go to Render → `hrms-api` service
2. Go to **Environment** tab
3. Update `FRONTEND_URL` with your Vercel URL (e.g., `https://hrms-self-chi.vercel.app`)
4. Render will auto-redeploy (~2 minutes)

Your app is now live and ready to use!

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees/` | List all employees |
| POST | `/api/employees/` | Add new employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |
| GET | `/api/employees/stats` | Get dashboard stats |
| GET | `/api/attendance/` | List attendance records |
| POST | `/api/attendance/` | Mark attendance |
| PUT | `/api/attendance/{id}` | Edit attendance record |
| DELETE | `/api/attendance/{id}` | Delete attendance record |

Full interactive documentation: https://hrms-8ndw.onrender.com/docs

---

## Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=https://hrms-8ndw.onrender.com
```

### Backend (`.env`)
```env
DATABASE_URL=postgresql://user:password@host/dbname
FRONTEND_URL=https://hrms-self-chi.vercel.app
```

---

## Important Notes

- **No Authentication**: This is a single-admin system. No login required.
- **Attendance Rules**: One attendance record per employee per day (editing allowed)
- **Free Tier**: Render may spin down after inactivity. First request may take 30 seconds.
- **Database**: Tables are created automatically on first backend startup.

---

## Features in Action

### Dashboard
- Live clock with time-based greeting
- Employee stats card (total, present, absent, attendance %)
- New joinings section
- Quick action buttons (color-coded by time of day)
- Department breakdown

### Employees Page
- Search employees by name, ID, email, or department
- Add, edit, delete employees
- View contact info and department
- Dynamic add button color

### Attendance Page
- Mark attendance with status (present, absent, late, half-day)
- View attendance statistics
- Filter by employee or date
- Edit/delete attendance records
- Dynamic mark attendance button color

---

## Contributing

Feel free to fork, contribute, or suggest improvements!

---

## License

This project is open source and free to use.

---

## Author

**Yugal Sharma**  
GitHub: https://github.com/yugalsharmaandtc


Happy HR Management!
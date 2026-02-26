HRMS - Human Resource Management System
A full-stack HR management system built with React + Vite (frontend) and FastAPI + PostgreSQL (backend).
Tech Stack
Frontend: React 18, Vite, Tailwind CSS, React Router, Axios
Backend: Python, FastAPI, SQLAlchemy, Pydantic
Database: PostgreSQL
Deployment: Vercel (frontend) + Render (backend + database)
Features
Employee management: add, edit, delete, change department/position
Attendance tracking: mark present, absent, half day, late — with edit support
Dashboard with live stats and time-based greeting (Good Morning/Afternoon/Evening)
Phone and email validation on both frontend and backend
Filter attendance by employee or date
Fully responsive, professional UI
Project Structure
hrms/
├── backend/
│   ├── main.py                   # FastAPI entry point
│   ├── requirements.txt
│   ├── start.sh                  # Render start command
│   ├── .env.example
│   └── app/
│       ├── api/routes/           # employees.py, attendance.py
│       ├── core/config.py        # Settings & CORS config
│       ├── db/database.py        # SQLAlchemy setup
│       ├── models/               # SQLAlchemy ORM models
│       ├── schemas/              # Pydantic request/response schemas
│       └── services/             # Business logic
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── vercel.json               # SPA routing fix for Vercel
    ├── .env.example
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── pages/                # Dashboard, Employees, Attendance
        ├── components/           # Layout, forms, UI components
        ├── services/api.js       # Axios API calls
        └── hooks/useGreeting.js  # Time-based greeting
Deployment Guide (Render + Vercel)
Step 1: Push to GitHub
Open your hrms folder on desktop
Right-click → Open in Terminal (or open VS Code)
Run:
git init
git add .
git commit -m "Initial commit"
Create a new repo on github.com (name it hrms)
Run:
git remote add origin https://github.com/YOUR_USERNAME/hrms.git
git branch -M main
git push -u origin main
Step 2: Set up PostgreSQL on Render
Go to render.com → Sign up / Log in
Click New + → PostgreSQL
Fill in:
Name: hrms-db
Database: hrms
User: hrms_user
Region: pick closest to you
Plan: Free
Click Create Database
Wait for it to be ready (about 1–2 min)
Once ready, scroll down to Connection section
Copy the Internal Database URL — looks like:
postgresql://hrms_user:PASSWORD@dpg-xxxx.internal/hrms
Keep this — you'll need it in Step 3.
Step 3: Deploy Backend on Render
Click New + → Web Service
Connect your GitHub account if not done, then select the hrms repo
Fill in:
Name: hrms-api
Root Directory: backend
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Plan: Free
Scroll down to Environment Variables and add:
Key: DATABASE_URL
Value: paste the Internal Database URL from Step 2
Also add:
Key: FRONTEND_URL
Value: (leave blank for now, you'll fill this after Vercel deploy)
Click Create Web Service
Wait for build to finish (~3-5 min)
Copy your backend URL — looks like: https://hrms-api.onrender.com
The tables are created automatically when the app starts. No manual SQL needed.
Step 4: Deploy Frontend on Vercel
Go to vercel.com → Sign up with GitHub
Click Add New Project → Import your hrms repo
In project settings:
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Add Environment Variable:
Key: VITE_API_URL
Value: your Render backend URL (e.g. https://hrms-api.onrender.com)
Click Deploy
Once done, copy your Vercel URL (e.g. https://hrms-abc123.vercel.app)
Step 5: Fix CORS (Add frontend URL to backend)
Go back to Render → your hrms-api service
Go to Environment tab
Update FRONTEND_URL with your Vercel URL (e.g. https://hrms-abc123.vercel.app)
Render will auto-redeploy — wait ~2 min
Your app is now live!
Running Locally (Optional)
You need PostgreSQL installed locally for this. If you don't have it, just deploy directly as above.
Backend
cd hrms/backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Create a .env file:
echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hrms > .env

uvicorn main:app --reload
Backend runs at: http://localhost:8000
Frontend
cd hrms/frontend
npm install

# Create a .env file:
echo VITE_API_URL=http://localhost:8000 > .env

npm run dev
Frontend runs at: http://localhost:5173
API Endpoints
Method
Endpoint
Description
GET
/api/employees/
List all employees
POST
/api/employees/
Add employee
PUT
/api/employees/{id}
Update employee
DELETE
/api/employees/{id}
Delete employee
GET
/api/employees/stats
Dashboard stats
GET
/api/attendance/
List attendance (filterable)
POST
/api/attendance/
Mark attendance
PUT
/api/attendance/{id}
Edit attendance
DELETE
/api/attendance/{id}
Delete attendance
Full API docs available at: https://your-backend.onrender.com/docs
Assumptions
Single admin user, no authentication required
Attendance can only be marked once per employee per day (editing is allowed)
Free tier on Render may spin down after inactivity — first request may take ~30 seconds# HRMS
# HRMS
# HRMS

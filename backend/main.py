from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# Step 1: import Base first
from app.db.database import engine, Base

# Step 2: import all models so Base knows about them before create_all
from app.models.employee import Employee
from app.models.attendance import Attendance

# Step 3: now create tables - runs automatically on every startup
Base.metadata.create_all(bind=engine)

# Step 4: import routers after everything is set up
from app.api.routes import employees, attendance

app = FastAPI(
    title="HRMS API",
    description="Human Resource Management System API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])

@app.get("/")
def root():
    return {"message": "HRMS API is running", "status": "ok"}

@app.get("/health")
def health():
    return {"status": "healthy"}
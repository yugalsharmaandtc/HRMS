from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.core.config import settings

# Import models so SQLAlchemy registers them before create_all runs
import app.models  # noqa: F401 - this triggers models/__init__.py which imports Employee + Attendance

# Auto-create tables on startup - no manual SQL or migrations needed
Base.metadata.create_all(bind=engine)

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
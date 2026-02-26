from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.db.database import get_db
from app.schemas.attendance import AttendanceCreate, AttendanceUpdate
from app.services import attendance_service

router = APIRouter()

@router.get("/")
def list_attendance(
    employee_id: Optional[int] = Query(None),
    filter_date: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    return attendance_service.get_all_attendance(db, employee_id, filter_date)

@router.get("/summary/{employee_id}")
def get_summary(employee_id: int, db: Session = Depends(get_db)):
    return attendance_service.get_employee_attendance_summary(db, employee_id)

@router.post("/", status_code=201)
def mark_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    return attendance_service.mark_attendance(db, data)

@router.put("/{attendance_id}")
def update_attendance(attendance_id: int, data: AttendanceUpdate, db: Session = Depends(get_db)):
    return attendance_service.update_attendance(db, attendance_id, data)

@router.delete("/{attendance_id}")
def delete_attendance(attendance_id: int, db: Session = Depends(get_db)):
    return attendance_service.delete_attendance(db, attendance_id)
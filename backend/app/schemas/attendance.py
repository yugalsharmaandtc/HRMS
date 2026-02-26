from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date, datetime

VALID_STATUSES = ["Present", "Absent", "Half Day", "Late"]

class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    status: str
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return v

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v is not None and v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return v

class AttendanceResponse(AttendanceBase):
    id: int
    created_at: Optional[datetime] = None
    employee_name: Optional[str] = None
    employee_emp_id: Optional[str] = None

    class Config:
        from_attributes = True
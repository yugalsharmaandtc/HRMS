from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re

class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str
    position: Optional[str] = None
    phone: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        if v is None or v == "":
            return v
        # Strip spaces, dashes, brackets then check it's 7-15 digits
        clean = re.sub(r"[\s\-\(\)]", "", v)
        if not re.match(r"^\+?\d{7,15}$", clean):
            raise ValueError("Invalid phone number. Use format: +91XXXXXXXXXX or 9999999999")
        return v

    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, v):
        if not v.strip():
            raise ValueError("Employee ID cannot be empty")
        return v.strip()

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return v.strip()

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        if v is None or v == "":
            return v
        clean = re.sub(r"[\s\-\(\)]", "", v)
        if not re.match(r"^\+?\d{7,15}$", clean):
            raise ValueError("Invalid phone number. Use format: +91XXXXXXXXXX or 9999999999")
        return v

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
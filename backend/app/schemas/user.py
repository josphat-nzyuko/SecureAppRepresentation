from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
import re

class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str

    @field_validator('password')
    @classmethod
    def password_must_be_strong(cls, value):
        if len(value) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', value):
            raise ValueError('Password must contain an uppercase letter')
        if not re.search(r'[0-9]', value):
            raise ValueError('Password must contain a number')
        if not re.search(r'[!@#$%^&*]', value):
            raise ValueError('Password must contain a special character (!@#$%^&*)')
        return value

    @field_validator('username')
    @classmethod
    def username_must_be_safe(cls, value):
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise ValueError('Username can only contain letters, numbers and underscores')
        if len(value) < 3:
            raise ValueError('Username must be at least 3 characters')
        if len(value) > 50:
            raise ValueError('Username must be less than 50 characters')
        return value


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True
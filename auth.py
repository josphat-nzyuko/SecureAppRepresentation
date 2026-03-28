from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Creates a JWT token - think of it like a temporary ID badge
    data = information we embed in the badge (like username)
    expires_delta = how long before the badge expires
    """
    to_encode = data.copy()

    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=30)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """
    Checks if a JWT token is valid and not expired
    Returns the username if valid, None if not
    """
    try:
        # Decode and verify the token using our secret key
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except JWTError:

        return None

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    This runs on every protected route
    It checks the token and returns the logged in user
    If token is invalid - it blocks the request immediately
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    username = verify_token(token)
    if username is None:
        raise credentials_exception

    # Looking  up the user in the database
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception

    # Check if account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
    return user

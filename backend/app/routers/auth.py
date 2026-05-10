from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.security.password import hash_password, verify_password
from app.security.auth import create_access_token, get_current_user
from app.config import settings

router = APIRouter(
    prefix="/auth",       # All routes here start with /auth
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    This endpoint is called when someone wants to create an account
    It receives username, email and password
    """

    # Checking if username is already taken
    existing_user = db.query(User).filter(
        User.username == user_data.username
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Checking if email is already taken
    existing_email = db.query(User).filter(
        User.email == user_data.email
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hashing the password before saving
    hashed = hash_password(user_data.password)

    # new user object
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed
    )

    # Saving to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# Loging in endpoint
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    This endpoint is called when someone wants to login
    It receives username and password
    If correct it returns a JWT token
    """

    # Looking for the user in the database
    user = db.query(User).filter(
        User.username == form_data.username
    ).first()

    # Checking if user exists AND password is correct
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is disabled"
        )

    # Updating the  last login time
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    # Creating the JWT token with the username embedded inside
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the currently logged in users details
    Only works if you send a valid JWT token
    """
    return current_user

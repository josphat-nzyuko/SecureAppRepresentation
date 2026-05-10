from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import settings
from app.database import Base, engine
from app.routers import auth
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.middleware.logging import RequestLoggingMiddleware


app = FastAPI(
    title=settings.APP_NAME,
    description="A secure web application with protection against common vulnerabilities CSV and the FSCV",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc", 
    swagger_ui_parameters={"syntaxHighlight": False}

)

Base.metadata.create_all(bind=engine)


app.add_middleware(RequestLoggingMiddleware)


app.add_middleware(SecurityHeadersMiddleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"], 
    allow_headers=["*"],                     
)



app.include_router(auth.router)

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "status": "running",
        "message": "Server is healthy and secure"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "security_headers": "enabled",
        "cors": "enabled",
        "authentication": "JWT",
        "Task in hand": "Implementing security features and best practices to protect against common vulnerabilities such as CSV and FSCV."
    }
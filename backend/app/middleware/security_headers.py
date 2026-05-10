from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    This runs on EVERY response our server sends back
    It attaches security headers - instructions that tell
    the browser how to behave safely
    """
    async def dispatch(self, request: Request, call_next):
        # First let the request go through to the actual route
        response = await call_next(request)

    
        response.headers["X-Frame-Options"] = "DENY"

        
        response.headers["X-Content-Type-Options"] = "nosniff"

       
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )

        

       
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' cdn.jsdelivr.net; "
            "img-src 'self' data:; "
            "font-src 'self' cdn.jsdelivr.net; "
            "connect-src 'self'; "
            "frame-ancestors 'none';"
        )

        # Stops browser from sending referrer info to other sites
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

       
        response.headers["Permissions-Policy"] = (
            "camera=(), "
            "microphone=(), "
            "geolocation=()"
        )

        
        if "X-Powered-By" in response.headers:
            del response.headers["X-Powered-By"]

        return response
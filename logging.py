import logging
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Records every request that comes into our server
    This is called an audit log - very important for security
    If something bad happens we can look back and see exactly
    what requests were made and when
    """
    async def dispatch(self, request: Request, call_next):
        # time the request arrived
        start_time = time.time()

        # useful info about the request
        client_ip = request.client.host
        method = request.method        # GET, POST, PUT, DELETE
        url = request.url.path         # e.g. /auth/login
        
        # Let the request go through to the actual route
        response = await call_next(request)

        # how long it took to process
        process_time = round((time.time() - start_time) * 1000, 2)

        
        logger.info(
            f"{client_ip} | "
            f"{method} {url} | "
            f"Status: {response.status_code} | "
            f"{process_time}ms"
        )

        # Flagging  suspicious activity
        if response.status_code == 401:
            logger.warning(
                f"UNAUTHORIZED ACCESS ATTEMPT | IP: {client_ip} | Path: {url}"
            )
        if response.status_code == 429:
            logger.warning(
                f"RATE LIMIT HIT | IP: {client_ip} | Path: {url}"
            )

        return response

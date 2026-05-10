import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    debug_mode = os.getenv("DEBUG", "False").lower() == "true"
    
    uvicorn.run(
        "app.main:app",  
        host="0.0.0.0",   
        port=8000,         
        reload=debug_mode
    )
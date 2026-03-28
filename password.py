from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain_password: str) -> str:
    """
    Takes a real password like 'MyPass123!'
    Returns a scrambled version like '$2b$12$KIXSjbXy...'
    We store ONLY the scrambled version in the database
    """
    return pwd_context.hash(plain_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Takes the password the user typed at login
    and the scrambled version from the database
    Returns True if they match, False if they dont
    We never unscramble - we just scramble the new one and compare
    """
    return pwd_context.verify(plain_password, hashed_password)

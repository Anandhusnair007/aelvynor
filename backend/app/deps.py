from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, create_engine
from app.config import settings
from app.models import Admin
from app.crud import get_admin_by_username

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/admin/login")

engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})

def get_db() -> Generator:
    with Session(engine) as session:
        yield session

def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    admin = get_admin_by_username(db, username=username)
    if admin is None:
        raise credentials_exception
    return admin

from datetime import datetime, timedelta
import logging
from typing import Optional

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session, select
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .database import engine, get_session
from .models import User
from .settings import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def verify_google_id_token(token: str) -> dict:
    """
    Verifies a Google ID token and returns the decoded payload.
    Raises HTTPException if the token is invalid or cannot be verified.
    """
    if not settings.google_client_id:
        logging.error("GOOGLE_CLIENT_ID is not configured in settings.")
        raise HTTPException(status_code=500, detail="Google authentication is not configured.")
    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), settings.google_client_id)
        return idinfo
    except ValueError as e:
        logging.error(f"Google ID token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid Google ID token")



def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def get_current_active_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    logging.info(f"Attempting to get current user with token: {token[:20]}...") # Log first 20 chars of token
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            logging.warning("Token payload did not contain 'sub' (email).")
            raise credentials_exception
        logging.info(f"Token decoded, email: {email}")
    except JWTError as e:
        logging.error(f"JWTError during token decoding: {e}")
        raise credentials_exception
    except Exception as e:
        logging.error(f"Unexpected error during token decoding: {e}")
        raise credentials_exception
    user = session.exec(select(User).where(User.email == email)).first()
    if user is None:
        logging.warning(f"User with email {email} not found in database.")
        raise credentials_exception
    logging.info(f"User {user.email} (ID: {user.id}) found in database.")
    return user

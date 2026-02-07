from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from pydantic import BaseModel
from .database import get_session
from .models import User
from .auth import verify_google_id_token, create_access_token, get_password_hash, verify_password
from sqlmodel import SQLModel
from .database import engine
import logging

app = FastAPI(title="Auth Service", redirect_slashes=False)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GoogleAuthRequest(BaseModel):
    id_token: str

@app.get("/")
def health():
    return {"status": "healthy", "service": "auth-service"}

@app.post("/signup")
async def signup(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=form_data.username,
        name=form_data.username.split("@")[0],
        hashed_password=get_password_hash(form_data.password)
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": new_user}

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "profile_picture_url": user.profile_picture_url
        }
    }

@app.post("/google")
async def google_login(request: GoogleAuthRequest, session: Session = Depends(get_session)):
    idinfo = verify_google_id_token(request.id_token)
    email = idinfo.get("email")
    name = idinfo.get("name")
    picture = idinfo.get("picture")

    if not email:
        raise HTTPException(status_code=400, detail="Email not found in Google token")

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        user = User(
            email=email,
            name=name,
            profile_picture_url=picture,
            hashed_password="" 
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "profile_picture_url": user.profile_picture_url
        }
    }
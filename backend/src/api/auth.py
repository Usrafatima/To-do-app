from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from pydantic import BaseModel

from ..auth import create_access_token, get_password_hash, verify_password, verify_google_id_token, get_current_active_user
from ..database import engine
from ..models import User, UserResponse

router = APIRouter()

class GoogleLoginRequest(BaseModel):
    id_token: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    """
    Get current user.
    """
    return current_user

@router.post("/google")
def google_login(request: GoogleLoginRequest):
    id_info = verify_google_id_token(request.id_token)
    google_user_id = id_info["sub"]
    email = id_info["email"]
    name = id_info["name"]
    profile_picture = id_info["picture"]

    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if not user:
            # User does not exist, create a new one
            # For simplicity, we're not asking for a password for Google-authenticated users
            # A dummy password hash might be needed depending on your User model
            # Or you might make password optional in User model
            new_user = User(
                email=email,
                hashed_password=get_password_hash("google-sso-user-no-password"), # Dummy password for compatibility
                google_user_id=google_user_id,
                name=name,
                profile_picture_url=profile_picture
            )
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            user = new_user
        else:
            # Update existing user details if necessary
            user.google_user_id = google_user_id
            user.name = name
            user.profile_picture_url = profile_picture
            session.add(user)
            session.commit()
        access_token = create_access_token(data={"sub": user.email})
        return AuthResponse(access_token=access_token, token_type="bearer", user=user)


@router.post("/signup")
def signup(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == form_data.username)).first()
        if user:
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_password = get_password_hash(form_data.password)
        new_user = User(email=form_data.username, hashed_password=hashed_password)
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        access_token = create_access_token(data={"sub": new_user.email})
        return AuthResponse(access_token=access_token, token_type="bearer", user=new_user)


@router.post("/login", response_model=AuthResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == form_data.username)).first()
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = create_access_token(data={"sub": user.email})
        return AuthResponse(access_token=access_token, token_type="bearer", user=user)

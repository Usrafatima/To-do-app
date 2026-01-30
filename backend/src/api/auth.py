from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from pydantic import BaseModel

from ..auth import (
    create_access_token,
    get_password_hash,
    verify_password,
    verify_google_id_token,
    get_current_active_user
)
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


@router.post("/google", response_model=AuthResponse)
def google_login(request: GoogleLoginRequest):
    # Verify the Google ID Token
    id_info = verify_google_id_token(request.id_token)

    google_user_id = id_info["sub"]
    email = id_info["email"]
    name = id_info.get("name")
    profile_picture = id_info.get("picture")

    with Session(engine) as session:
        # Check if user exists by email
        user = session.exec(select(User).where(User.email == email)).first()

        # Dummy safe password for Google SSO users
        safe_password = "google-sso-user"
        safe_password = safe_password[:72]  # bcrypt safety
        hashed_password = get_password_hash(safe_password)

        if not user:
            # Create new user
            user = User(
                google_user_id=google_user_id,
                email=email,
                name=name,
                profile_picture_url=profile_picture,
                hashed_password=hashed_password
            )
            session.add(user)
            session.commit()
            session.refresh(user)
        else:
            # Update existing user Google data
            user.google_user_id = google_user_id
            if name:
                user.name = name
            if profile_picture:
                user.profile_picture_url = profile_picture

            session.add(user)
            session.commit()
            session.refresh(user)

        # Create JWT token
        access_token = create_access_token(data={"sub": user.email})

        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user=user
        )


@router.post("/signup", response_model=AuthResponse)
def signup(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        existing_user = session.exec(
            select(User).where(User.email == form_data.username)
        ).first()

        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password = get_password_hash(form_data.password)

        new_user = User(
            email=form_data.username,
            hashed_password=hashed_password
        )

        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        access_token = create_access_token(data={"sub": new_user.email})

        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user=new_user
        )


@router.post("/login", response_model=AuthResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.email == form_data.username)
        ).first()

        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(data={"sub": user.email})

        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user=user
        )

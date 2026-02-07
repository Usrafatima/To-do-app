from typing import List, Optional
from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel, Column, JSON
from sqlalchemy.sql import func


class BaseModel(SQLModel):
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False, sa_column_kwargs={"onupdate": func.now()})


class User(BaseModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    google_user_id: Optional[str] = Field(default=None, unique=True, index=True)
    name: Optional[str] = Field(default=None)
    profile_picture_url: Optional[str] = Field(default=None)

    tasks: List["Task"] = Relationship(back_populates="user")
    conversations: List["Conversation"] = Relationship(back_populates="user")


class Task(BaseModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    description: Optional[str] = None
    is_completed: bool = False
    due_date: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    recurrence: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")

    user: Optional[User] = Relationship(back_populates="tasks")


class Conversation(BaseModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    provider_thread_id: str = Field(index=True, unique=True)

    user: User = Relationship(back_populates="conversations")
    messages: List["Message"] = Relationship()


class Message(BaseModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    role: str  # "user" or "assistant"
    content: str
    provider_message_id: Optional[str] = Field(default=None)

    conversation: Conversation = Relationship(back_populates="messages")


class UserResponse(SQLModel):
    id: int
    email: str
    google_user_id: Optional[str] = None
    name: Optional[str] = None
    profile_picture_url: Optional[str] = None
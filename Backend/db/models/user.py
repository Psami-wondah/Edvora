from pydantic import BaseModel
from typing import Optional
from db.config import db

class User(BaseModel):
    username: str
    first_name: Optional[str]
    last_name: Optional[str]

    @staticmethod
    def init():
        db.users.create_index([("username", 1)], unique=True)
        

class UserSessionToken(BaseModel):
    username: str
    token: str
    session_id: int
from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    first_name: Optional[str]
    last_name: Optional[str]

    def __init__(self):
        self.username = self.username.lower()
        

class UserSessionToken(BaseModel):
    username: str
    token: str
    session_id: int
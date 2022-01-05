from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    first_name: Optional[str]
    last_name: Optional[str]

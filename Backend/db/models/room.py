from pydantic import BaseModel

class Room(BaseModel):
    room_name: str
from fastapi import APIRouter
from pydantic.main import BaseModel
from starlette import status
from starlette.responses import JSONResponse
from fastapi.param_functions import Depends
from db.models.room import Room
from db.models.user import User
from oauth2.oauth2 import get_current_user
from db.config import db
from datetime import datetime
from utils.utils import generate_short_id

room = APIRouter()
class RoomCreate(Room):
    creator: str
    short_id: str
class RoomResponse(BaseModel):
    message: str
    room: RoomCreate


@room.post('/api/v1/room/create', response_model=RoomResponse)
async def create_room(room: Room, current_user: User = Depends(get_current_user)):
    if db.rooms.find_one({"room_name": room.room_name}):
        return JSONResponse({"message": "room name already exists"}, status_code=status.HTTP_208_ALREADY_REPORTED)
    data = {
        'creator': current_user.username,
        **room.dict(),
        'short_id': str(generate_short_id())
    }
    db.rooms.insert_one(data)
    return {"message": "room created", "room": data}

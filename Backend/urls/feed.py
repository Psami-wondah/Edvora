from fastapi import APIRouter
from fastapi import WebSocket
from typing import List
from db.models.user import User
from oauth2.oauth2 import get_current_websocket_user
from fastapi import Depends, status
from db.config import db
from db.serializers.room import room_serializer
from db.serializers.message import message_serializer
from bson.objectid import ObjectId
from datetime import datetime
from utils.utils import generate_short_id

feed = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_json(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_json(message)


feed_manager = ConnectionManager()


@feed.websocket("/ws/room/{short_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    short_id: str,
    user: User = Depends(get_current_websocket_user),
):  
    room = room_serializer(db.rooms.find_one({"short_id": short_id}))
    if room is None:
        websocket.close(code=status.HTTP_404_NOT_FOUND)
    await feed_manager.connect(websocket)
    while True:
        data = await websocket.receive_json()
        if "command" in data:
            if data["command"] == "new_message":
                message_data = {
                    "author": user.username,
                    "content": data["message"],
                    "room": ObjectId(room['id']),
                    "timestamp": datetime.now(),
                    "short_id": generate_short_id()
                }
                db.messages.insert_one(message_data)
                message = message_serializer(db.messages.find_one({"short_id": message_data["short_id"]}))
                print(message)
                await feed_manager.broadcast(
                    {"message": message}
                )


        
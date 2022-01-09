from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from db.serializers.message import message_serializer
from urls.auth import auth
from urls.feed import feed
from urls.room import room
from fastapi_socketio import SocketManager
from typing import Any
from db.config import db
from utils.utils import generate_short_id
import json
from dotenv import load_dotenv
from db.models.user import User
import os
load_dotenv()


import socketio
mgr = socketio.AsyncRedisManager(os.getenv('REDIS_URL'))

sio: Any = socketio.AsyncServer(async_mode="asgi", client_manager=mgr, cors_allowed_origins="*")
socket_app = socketio.ASGIApp(sio)


app = FastAPI(
    title="Edvora",
    description="Edvora feed",
    version="1.0.0",)



origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "https://edvora-pearl.vercel.app",
    "http://edvora-pearl.vercel.app",
    "http://edvora-pearl.vercel.app/",
    "https://edvora-pearl.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth)
app.include_router(feed)
app.include_router(room)
app.mount("/", socket_app)  # Here we mount socket app to main fastapi app



@sio.on("connect")
async def connect(sid, env):
    print("SocketIO connect")
    sio.enter_room(sid, "feed")
    await sio.emit("connect", f"Connected as {sid}")


@sio.on('mess')
async def print_message(sid, data):
    print("Socket ID", sid)
    data = json.loads(data)
    message_data = {
                        "author": data["username"],
                        "message": data["message"],
                        "timestamp": datetime.now(tz=timezone.utc),
                        "short_id": generate_short_id()
                    }
    db.messages.insert_one(message_data)
    message = message_serializer(db.messages.find_one({"short_id": message_data["short_id"]}))
    await sio.emit("new_message", message, room="feed")

@sio.on("disconnect")
async def disconnect(sid):
    print("SocketIO disconnect")

@sio.on('left')
async def left_room(sid, data):
    sio.leave_room(sid, "feed") 
    await sio.emit("user_left", f'{data} left', room="feed")
    print(f'{sid} Left')

@sio.on("joined")
async def joined(sid, data):
    await sio.emit("user_joined", f'{data} connected', room="feed")
    print(f'{data} connected')

  
@app.on_event("startup")
async def startup():
    User.init()




from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from urls.auth import auth
from urls.feed import feed
from urls.room import room

app = FastAPI(
    title="Edvora",
    description="Edvora feed",
    version="1.0.0",)
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
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


from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()

conn = MongoClient(str(os.getenv("MONGO_URI")))

db = conn.edvora
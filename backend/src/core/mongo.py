from pymongo import MongoClient
from src.core.config import MONGO_URI, MONGO_DB

client = MongoClient(MONGO_URI)

mongo_db = client[MONGO_DB]

chat_collection = mongo_db["chat_messages"]

chat_collection.create_index("user_id")
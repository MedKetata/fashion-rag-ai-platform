from datetime import datetime,timezone
from src.core.mongo import chat_collection


def save_message(user_id, role, content):

    chat_collection.insert_one({
        "user_id": user_id,
        "role": role,
        "content": content,
        "timestamp": datetime.now(timezone.utc)
    })


def get_user_history(user_id):

    messages = chat_collection.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("timestamp", 1)

    return list(messages)

from datetime import datetime

def message_serializer(a) -> dict:
    return{
        "id": str(a["_id"]),
        "author": a["author"],
        "message": a["message"],
        "timestamp": (a["timestamp"]).strftime("%a. %I:%M %p"),
        "short_id": a["short_id"]
    }

def message_list_serializer(a) -> list:
    return [message_serializer(i) for i in a ]
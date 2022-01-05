def message_serializer(a) -> dict:
    return{
        "id": str(a["_id"]),
        "author": a["author"],
        "content": a["content"],
        "room": str(a['room']),
        "media_url": a["media_url"],
        "timestamp": str(a["timestamp"]),
        "short_id": a["short_id"]
    }
def room_serializer(a) -> dict:
    return {**{'id':str(a[i]) for i in a if i == '_id'}, **{i:a[i] for i in a if i != '_id' }}
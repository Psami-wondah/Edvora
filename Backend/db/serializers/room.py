def room_serializer(a) -> dict:
    return {**{'id':str(a[i]) for i in a if i == '_id'}, **{i:a[i] for i in a if i != '_id' }}

def serialize_list(a) -> list:
    return [room_serializer(i) for i in a ]
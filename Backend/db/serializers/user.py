def auth_serializer(a) -> dict:
    return {**{'id':str(a[i]) for i in a if i == '_id'}, **{i:a[i] for i in a if i != '_id' and i != 'last_login'}, **{'last_login':str(a[i]) for i in a if i == 'last_login'}}

def user_serializer(a) -> dict:
    return {**{'id':str(a[i]) for i in a if i == '_id'}, **{i:a[i] for i in a if i != '_id' and i != 'hashed_password'}}


def token_serializer(a) -> dict:
    return{
        "session_id": a["session_id"]
    }
def token_list_serializer(a) -> list:
    return [token_serializer(i) for i in a]

    
def auth_serializer(a) -> dict:
    return {**{'id':str(a[i]) for i in a if i == '_id'}, **{i:a[i] for i in a if i != '_id' and i != 'last_login'}, **{'last_login':str(a[i]) for i in a if i == 'last_login'}}

def user_serializer(a) -> dict:
    return {**{'id':str(a[i]) for i in a if i == '_id'}, **{i:a[i] for i in a if i != '_id' and i != 'hashed_password'}}
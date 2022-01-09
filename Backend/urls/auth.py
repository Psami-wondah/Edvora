from fastapi import APIRouter
from db.serializers.user import token_list_serializer, user_serializer
from db.serializers.room import serialize_list
from oauth2.oauth2 import *
from fastapi.responses import JSONResponse
from db.config import db
from db.models.user import UserSessionToken
from pymongo.errors import DuplicateKeyError


auth = APIRouter()

class UserReg(User):
    password: str

class RegRes(BaseModel):
    message: str
    user: User

class UserLogin(BaseModel):
    username: str
    password: str


        


class LoginRes(Token):
    user: User
    session_id: int





@auth.post("/token", response_model=Token)
async def login_for_access_token(data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(db, data.username, data.password)
    if not user:
        return JSONResponse(
            {"message":"Incorrect username or password"},
            status_code=status.HTTP_401_UNAUTHORIZED,
            
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    sessions = serialize_list(db.tokens.find({"username": user.username}))
    if len(sessions) > 0:
        session_no = sessions[-1]["session_id"]
    else:
        session_no = 0

    db.tokens.insert_one({   
        "username": user.username,
        "token" : access_token,
        "session_id": session_no+1
    })
    
    return {"access_token": access_token, "token_type": "bearer", "expires": f"{ACCESS_TOKEN_EXPIRE_MINUTES}"}


@auth.post('/api/v1/auth/register', status_code=status.HTTP_201_CREATED, response_model=RegRes)
async def create_user(reg: UserReg):
    data = {
        "username": reg.username,
        "first_name": reg.first_name,
        'last_name': reg.last_name,
        "hashed_password": get_password_hash(reg.password),
        "created_at": datetime.now()
    }
    try:
        db.users.insert_one(data)
    except DuplicateKeyError:
        return JSONResponse({'message': 'username already exists'}, status_code=status.HTTP_400_BAD_REQUEST)


    
    return {'message': 'Registration succesful, Kindly Login', 'user': user_serializer(db.users.find_one({'username': reg.username}))}

@auth.post("/api/v1/auth/login", response_model=LoginRes)
async def login_for_access_token(data: UserLogin):
    user = authenticate_user(db, data.username, data.password)
    if not user:
        return JSONResponse(
            {"message":"Incorrect username or password"},
            status_code=status.HTTP_401_UNAUTHORIZED,
            
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    sessions = serialize_list(db.tokens.find({"username": user.username}))
    if len(sessions) > 0:
        session_no = sessions[-1]["session_id"]
    else:
        session_no = 0
    insert = {   
        "username": user.username,
        "token" : access_token,
        "session_id": session_no+1
    }

    db.tokens.insert_one(insert)
    user_details: User = user
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_details, "session_id": insert["session_id"],"expires": f"{ACCESS_TOKEN_EXPIRE_MINUTES}"}


@auth.get("/api/v1/get-sessions")
async def get_sessions(user: User = Depends(get_current_user)):
    return token_list_serializer(db.tokens.find({"username": user.username}))



@auth.delete("/api/v1/end-session/{id}")
async def end_session(id: int, user: User = Depends(get_current_user)):
    db.tokens.find_one_and_delete({"session_id": id, "username": user.username})
    return JSONResponse({"message": "session ended"}, status_code=status.HTTP_200_OK)


from fastapi import APIRouter
from db.serializers.user import user_serializer
from db.serializers.room import serialize_list
from oauth2.oauth2 import *
from fastapi.responses import JSONResponse
from db.config import db
from db.models.user import UserSessionToken


auth = APIRouter()

class UserReg(User):
    password: str

class RegRes(BaseModel):
    message: str
    user: User

class UserLogin(BaseModel):
    username: str
    password: str





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
    if db.users.find_one({'username':reg.username}): 
        return JSONResponse({'message': 'username already exists'}, status_code=status.HTTP_400_BAD_REQUEST)
    data = {
        "username": reg.username,
        "first_name": reg.first_name,
        'last_name': reg.last_name,
        "hashed_password": get_password_hash(reg.password),
        "created_at": datetime.now(),
        "last_login": datetime.now()
    }
    
    db.users.insert_one(data)
    
    return {'message': 'Registration succesful, Kindly Login', 'user': user_serializer(db.users.find_one({'username': reg.username}))}

@auth.post("/api/v1/auth/login", response_model=Token)
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

    db.tokens.insert_one({   
        "username": user.username,
        "token" : access_token,
        "session_id": session_no+1
    })
    return {"access_token": access_token, "token_type": "bearer", "expires": f"{ACCESS_TOKEN_EXPIRE_MINUTES}"}
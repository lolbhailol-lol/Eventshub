"""User authentication routes."""

from fastapi import APIRouter, HTTPException, status

from .. import auth, schemas

router = APIRouter(tags=["auth"])
users_by_email = {}
next_user_id = 1


@router.post("/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: schemas.SignupRequest):
    global next_user_id
    if payload.email in users_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user_record = {
        "id": next_user_id,
        "name": payload.name,
        "email": payload.email,
        "password": auth.hash_password(payload.password),
    }
    users_by_email[payload.email] = user_record
    next_user_id += 1
    return schemas.UserResponse(
        id=user_record["id"],
        name=user_record["name"],
        email=user_record["email"],
    )


@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest):
    user = users_by_email.get(payload.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not auth.verify_password(payload.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = auth.create_access_token(subject=user["email"])
    return schemas.TokenResponse(access_token=token)


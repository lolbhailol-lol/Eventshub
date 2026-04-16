"""FastAPI application entrypoint."""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models
from .routes.user import router as user_router

app = FastAPI()
cors_origins = os.getenv("CORS_ALLOW_ORIGINS", "*")
allow_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins or ["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_router, prefix="/auth")


@app.on_event("startup")
def on_startup() -> None:
    # Importing models ensures SQLAlchemy metadata is populated.
    models  # no-op reference to satisfy linters about import usage
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Event Discovery Platform backend is running."}


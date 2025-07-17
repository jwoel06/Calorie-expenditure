from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.ml_service import MLService
from schemas.requests import *
import logging
import os


#FastAPI
app = FastAPI(
    title="Calorie Predictor API",
    description="API to calculate calories burnt during workouts with less inputs needed",
    version="1.0.0"
)

#CORS Middleware
app.add_middleware(
    CORS
)
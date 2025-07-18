from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.ml_service import MLService
from schemas.requests import *
from schemas.responses import *
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#FastAPI
app = FastAPI(
    title="Calorie Predictor API",
    description="API to calculate calories burnt during workouts with less inputs needed",
    version="1.0.0",
)

#CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:3001"], #change later for future production
    allow_creditials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ml_service = MLService()

@app.on_event('startup')
async def startup_event():
    if os.path.exists("calorie_model.h5") and os.path.exists("scalers.pkl"):
        try:
            ml_service.load_existing_model()
        except Exception as e:
            logger.warning(f'Model failed to load on Startup', e)

# API endpoints 
# GET for http handling
@app.get("/", response_model= HealthCheckResponse)
async def health_check():
    return ml_service.get_health_status()

# POST for prediciton
@app.post('/calculate', response_model=CaloriePredictonResponse)
async def predict_calories(request: CaloriePredictonRequest):
    try:
        return ml_service.make_calorie_prediction()
    except Exception as e:
        raise HTTPException(status_code= 500, description=f'Prediction failed: {e}')




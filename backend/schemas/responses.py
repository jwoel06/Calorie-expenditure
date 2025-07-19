from pydantic import BaseModel, Field
from typing import Dict, Optional


class CaloriePredictionResponse(BaseModel):
    predicted_calories: float
    input_features: Dict
    model_info: Dict


class TrainingResponse(BaseModel):
    message: str
    epochs: int
    test_mae: float

#Status of model
class HealthCheckResponse(BaseModel):
    status: str
    model_loaded: bool

class ErrorResponse(BaseModel):
    error: str
    detail: str
    timeStamp: Optional[str] = None

from pydantic import BaseModel, Field
from typing import Dict


class CaloriePredictorData(BaseModel):
    Sex: int = Field(..., description='Gender: 1 for male, 0 = female')
    Duration: float = Field(..., ge=1, description='Duration of workout is measured in minutes')
    Temperature: float = Field(..., ge=35, description='Temperature measured in degress celsius, converted on front-end via intensity')
    Heart_rate: int = Field(..., ge=45, le=220, description='BPM')

class CaloriePredictorResponse(BaseModel):
    predicted_calories: float
    input_features: Dict
    model_info: Dict

# Model Retraining based of user inputted data via option to input their own caloric expenditure
class TrainingRequest(BaseModel):
    csv_file_path: str = Field(...)

class TrainingResponse(BaseModel):
    message: str
    epochs: int
    test_mae: float

#Status of model
class HealthResponseModel(BaseModel):
    status: str
    model_loaded: bool
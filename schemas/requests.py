from pydantic import Basemodel, Field, Validator


class CaloriePredictonRequest(BaseModel):
    Sex: int = Field(..., description='Gender: 1 for male, 0 = female')
    Duration: float = Field(..., ge=1, description='Duration of workout is measured in minutes')
    Temperature: float = Field(..., ge=35, description='Temperature measured in degress celsius, converted on front-end via intensity')
    Heart_rate: int = Field(..., ge=45, le=220, description='BPM')

# Model Retraining based of user inputted data via option to input their own caloric expenditure
class TrainingRequest(BaseModel):
    csv_file_path: str = Field(...)




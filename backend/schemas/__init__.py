
from .requests import (
    CaloriePredictionRequest,
    TrainingRequest
)

from .responses import (
    CaloriePredictionResponse,
    TrainingResponse,
    HealthCheckResponse,
    ErrorResponse
)

__all__ = {
    #Requests
    CaloriePredictionRequest,
    TrainingRequest,
    #Responses
    CaloriePredictionResponse,
    TrainingResponse,
    HealthCheckResponse,
    ErrorResponse
}
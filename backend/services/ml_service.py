from model.calorie_predictor import CaloriePredictor
from schemas.requests import *
from schemas.responses import *
import logging

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        self.predictor = CaloriePredictor()
    
    def get_health_status(self) -> HealthCheckResponse:
        return HealthCheckResponse(
            status='healthy',
            model_loaded = self.predictor.model_loaded,
            feature_columns = self.predictor.feature_columns
        )
    
    def make_calorie_prediction(self, request: CaloriePredictionRequest) -> CaloriePredictionResponse:
        try:
            # pydantic to dictionary for processing
            input_features = request.model_dump()

            predicted_calories = self.predictor.predict_calories(input_features)

            return CaloriePredictionResponse(
                predicted_calories = round(predicted_calories, 1),
                input_features = input_features,
                model_info = {
                    'feature_columns': self.predictor.feature_columns,
                    'test_mae': self.predictor.last_training_mae 
                }

            )
        except Exception as e:
            logger.error(f"Prediction error", e)
            raise
    
    def train_model(self, request: TrainingRequest) -> TrainingResponse:
        try:
            df = self.predictor.initilaize_dataframe(request.csv_file_path)

            result = self.predictor.train(df)

            self.predictor.save_model()

            return TrainingResponse(
                message = "Model has been trained successfully",
                test_mae=result["test_mae"],
                epochs=result['epochs']
            )
            
        except Exception as e:
            logger.error(f"Prediction error", e)
            raise

    def load_existing_model(self):
        try:
            self.predictor.load_model(
                model_path="model/calorie_model.h5", 
                scaler_path="model/scalers.pkl"
            )
            return {
                'message': "Model has loaded successfully"
            }
        except Exception as e:
            logger.error(f'Loading model Failed', e)
            raise



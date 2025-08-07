import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
from typing import Dict, List, Union, Optional
import os

class CaloriePredictorExecutor:
    def __init__(self, model_path: str="backend/model/calorie_model.h5", scaler_path: str="backend/model/scalers.pkl"):
        """
        Constructor for calorie predictor class

        Args:
        model_path: Path to our h5 file
        scaler_path: Path to the pkl file
        """
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.model = None
        self.male_scaler = None
        self.female_scaler = None
        self.feature_columns = None
        self.is_loaded = False
    
    def load_model(self) -> bool:
        """
        Loads model and its scalers

        Returns:
            Bool: True if successful and false if filenotfound or smth else
        """
        try:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Model path not found for {self.model_path}")
            if not os.path.exists(self.scaler_path):
                raise FileNotFoundError(f"Scaler path not found for {self.scaler_path}")
            #load model
            self.model = tf.keras.models.load_model(self.model_path)
            
            #Load Scalars for future noramlization
            print("Loading Scaler Path ....")
            artifacts = joblib.load(self.scaler_path)
            self.male_scaler = artifacts['male_scaler']
            self.female_scaler = artifacts['female_scaler']
            self.feature_columns = artifacts['feature_columns']

            self.is_loaded = True
            print("Model & Scalers have been successfully loaded")
            
            return True
        except Exception as e:
            print(f"Failed to load {e}")
            return False

    def _validate_input(self, input_data: Dict) -> Dict:
        """
        Handle necessary changes and validate user input

        Args:
        Input_data: Takes in input data from user

        Returns:
        A Dictionary with cleaned data
        """
        if not self.is_loaded:
            raise ValueError("Model has not been loaded")
        
        # Initalize the data

        cleaned_data = input_data.copy()

        if 'Sex' in cleaned_data:
            sex_value = str(cleaned_data['Sex']).lower().strip()

            if sex_value in ['male', 'm', '1']:
                cleaned_data['Sex'] = 1
            elif sex_value in ['female', 'f', '0']:
                cleaned_data['Sex'] = 0
            else:
                raise ValueError('Improper sex value')
        
        for feature in self.feature_columns:
            try:
                cleaned_data[feature] = float(cleaned_data[feature])
            except (ValueError, TypeError):
                raise ValueError(f"The feature has a invalid value {cleaned_data[feature]}")
            
        return cleaned_data
    
    def predict_single(self, user_data: Dict) -> float:
        """
        Predicts the caloric expenditure for a single entry

        Args:
            user_data: User inputted data - dictionary
                ex: {
                'Sex': 'male',
                'Duration': 30,
                'Heart_Rate': 150,
                'Body_Temp': 40
                }
        Returns:
        
            Float: Estimation of Caloric expenditure
        """

        cleaned_data = self._validate_input(user_data)

        input_df = pd.DataFrame([cleaned_data])
        #Reshape to array
        input_array = input_df[self.feature_columns].values.astype(float)

        #Get prediction
        prediction_normalized = self.model.predict(input_array, verbose=0)

        sex = input_array[0,0]

        #Undo noramlization
        if sex == 1:
            prediction_sqrt = self.male_scaler.inverse_transform(prediction_normalized)
        else:
            prediction_sqrt = self.female_scaler.inverse_transform(prediction_normalized)

        prediction_calories = prediction_sqrt ** 2

        return float(prediction_calories[0,0])







    
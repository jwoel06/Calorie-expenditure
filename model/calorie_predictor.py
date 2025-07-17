import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
import joblib
import copy
import logging
from typing import Dict, List, Optional

class CaloriePredictor:
    def __init__(self):
        self.male_scaler = StandardScaler()
        self.female_scaler = StandardScaler()
        self.model = None
        self.feature_columns = None
        self.model_loaded = False
        self.last_training_mae = None
    
    def initilaize_dataframe(csv):
        df = pd.read_csv(csv)
        return df

    def preprocess_data(self, df):
        df_clean = df.copy()
        
        # Drop unnecessary columns
        columns_to_drop = ['id', 'Body_Temp','Age', 'Height', 'Weight']
        df_clean.drop(columns_to_drop, axis=1, inplace=True, errors='ignore')
        
        if 'Sex' in df_clean.columns:
            # Convert to string first to handle any mixed types
            df_clean['Sex'] = df_clean['Sex'].astype(str).str.lower().str.strip()
            
            # Map values
            df_clean['Sex'] = df_clean['Sex'].map({'male': 1, 'female': 0, 'm': 1, 'f': 0})
            
            # Check for any unmapped values
            if df_clean['Sex'].isnull().any():
                print("Warning: Some Sex values couldn't be mapped:")
                print(df_clean[df_clean['Sex'].isnull()])
                # Fill with most common value or drop
                df_clean['Sex'].fillna(df_clean['Sex'].mode()[0], inplace=True)
        
        # Convert all columns to numeric, coercing errors to NaN
        numeric_columns = []
        for col in df_clean.columns:
            if col != 'Sex':  # Sex is already handled
                df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')
                numeric_columns.append(col)
        
        return df_clean
    
    def apply_transformations(self, df):
        """Apply scaling and normalization transformations"""
        df_transformed = df.copy()
        
        # Separate by sex
        male_mask = df_transformed['Sex'] == 1
        female_mask = df_transformed['Sex'] == 0
        
        # Apply square root normalization to calories
        df_transformed.loc[male_mask, 'Calories'] = np.sqrt(df_transformed.loc[male_mask, 'Calories'])
        df_transformed.loc[female_mask, 'Calories'] = np.sqrt(df_transformed.loc[female_mask, 'Calories'])
        
        # Fit and transform calories by gender
        if male_mask.any():
            df_transformed.loc[male_mask, 'Calories'] = self.male_scaler.fit_transform(
                df_transformed.loc[male_mask, ['Calories']]
            ).flatten()
            
        if female_mask.any():
            df_transformed.loc[female_mask, 'Calories'] = self.female_scaler.fit_transform(
                df_transformed.loc[female_mask, ['Calories']]
            ).flatten()
        
        return df_transformed
    
    def prepare_data(self, df, target_column='Calories'):
        """Split features and target, with proper reshaping"""
        feature_columns = [c for c in df.columns if c != target_column]
        self.feature_columns = feature_columns
        
        X = df[feature_columns].values
        y = df[target_column].values.reshape(-1, 1)
        
        return X, y
    
    def train_test_split(self, df, train_ratio=0.6, val_ratio=0.2):
        """Split dataset into train, validation, and test sets"""
        df_shuffled = df.sample(frac=1, random_state=42).reset_index(drop=True)
        
        n = len(df_shuffled)
        train_end = int(n * train_ratio)
        val_end = int(n * (train_ratio + val_ratio))
        
        train_df = df_shuffled[:train_end]
        val_df = df_shuffled[train_end:val_end]
        test_df = df_shuffled[val_end:]
        
        return train_df, val_df, test_df
    
    def build_model(self, input_shape):
        """Build the neural network model"""
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(128, activation='relu', input_shape=(input_shape,)),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(1)
        ])
        
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='mean_squared_error',
            metrics=['mae']
        )
        
        return model
    
    def train(self, df):
        """Complete training pipeline"""
        print("Preprocessing data...")
        df_clean = self.preprocess_data(df)
        df_transformed = self.apply_transformations(df_clean)
        
        print("Splitting data...")
        train_df, val_df, test_df = self.train_test_split(df_transformed)
        
        # Prepare datasets
        X_train, y_train = self.prepare_data(train_df)
        X_val, y_val = self.prepare_data(val_df)
        X_test, y_test = self.prepare_data(test_df)
        
        print(f"Training set: {X_train.shape[0]} samples")
        print(f"Validation set: {X_val.shape[0]} samples")
        print(f"Test set: {X_test.shape[0]} samples")
        
        # Build model
        self.model = self.build_model(X_train.shape[1])
        
        # Training callbacks
        early_stopping = tf.keras.callbacks.EarlyStopping(
            monitor='val_mae',
            patience=5,
            restore_best_weights=True
        )
        
        # Train model
        print("Training model...")
        history = self.model.fit(
            X_train, y_train,
            epochs=50,
            batch_size=64,
            validation_data=(X_val, y_val),
            callbacks=[early_stopping],
            verbose=1
        )
        
        # Evaluate on test set
        test_loss, test_mae = self.model.evaluate(X_test, y_test, verbose=0)
        self.last_trainnig_mae = test_mae
        self.model_loaded = True
        print(f"Test MAE: {test_mae:.3f}")
        
        return history
    
    def predict_calories(self, input_features):
        """
        Predict calories and convert back to original scale
        input_features: dict with keys matching feature columns
        """
        if self.model is None:
            raise ValueError("Model not trained yet!")
        
        # Convert input to DataFrame for consistency
        if isinstance(input_features, dict):
            input_df = pd.DataFrame([input_features])
        else:
            input_df = pd.DataFrame(input_features, columns=self.feature_columns)
        
        # Ensure correct column order
        input_array = input_df[self.feature_columns].values
        
        # Get normalized prediction
        prediction_normalized = self.model.predict(input_array, verbose=0)
        
        # Convert back to original scale
        sex = input_array[0, 0]  # Assuming Sex is first feature
        
        if sex == 1:  # Male
            # Undo StandardScaler
            prediction_sqrt = self.male_scaler.inverse_transform(prediction_normalized)
            # Undo square root
            prediction_calories = prediction_sqrt ** 2
        else:  # Female
            # Undo StandardScaler  
            prediction_sqrt = self.female_scaler.inverse_transform(prediction_normalized)
            # Undo square root
            prediction_calories = prediction_sqrt ** 2
        
        return float(prediction_calories[0, 0])
    
    def save_model(self, model_path="calorie_model", scaler_path="scalers.pkl"):
        """Save the trained model and scalers"""
        if self.model is None:
            raise ValueError("No model to save!")
        
        # Save TensorFlow model
        self.model.save(f"{model_path}.h5")
        
        # Save scalers and feature columns
        model_artifacts = {
            'male_scaler': self.male_scaler,
            'female_scaler': self.female_scaler,
            'feature_columns': self.feature_columns
        }
        joblib.dump(model_artifacts, scaler_path)
        
        print(f"Model saved to {model_path}.h5")
        print(f"Scalers saved to {scaler_path}")
    
    def load_model(self, model_path="calorie_model.h5", scaler_path="scalers.pkl"):
        """Load a trained model and scalers"""
        # Load TensorFlow model
        self.model = tf.keras.models.load_model(model_path)
        
        # Load scalers and feature columns
        artifacts = joblib.load(scaler_path)
        self.male_scaler = artifacts['male_scaler']
        self.female_scaler = artifacts['female_scaler']
        self.feature_columns = artifacts['feature_columns']
        
        print("Model and scalers loaded successfully")


# Usage example:
if __name__ == "__main__":
    # Initialize predictor
    predictor = CaloriePredictor()
    
    # Load your data
    df = pd.read_csv('model/train_calories.csv')
    
    # Train the model
    history = predictor.train(df)
    
    # Save the model
    predictor.save_model()

    test_cases = [
        {
            "name": "Male - Moderate Workout",
            "input": {'Sex': 1, 'Duration': 30, 'Heart_Rate': 140},
        },
        {
            "name": "Male - Intense Workout", 
            "input": {'Sex': 1, 'Duration': 45, 'Heart_Rate': 170},
        },
        {
            "name": "Female - Light Workout",
            "input": {'Sex': 0, 'Duration': 20, 'Heart_Rate': 120},
        },
        {
            "name": "Female - Moderate Workout",
            "input": {'Sex': 0, 'Duration': 35, 'Heart_Rate': 150},
        },
        {
            "name": "Male - Long Cardio",
            "input": {'Sex': 1, 'Duration': 60, 'Heart_Rate': 130},
        }
    ]
    
    for test in test_cases:
        try:
            prediction = predictor.predict_calories(test["input"])
            print(f"\n {test['name']}:")
            print(f"   Input: {test['input']}")
            print(f"   Predicted Calories: {prediction:.1f}")
        except Exception as e:
            print(f"Error with {test['name']}: {e}")
    
    print(f"\n Training completed! Model expects features: {predictor.feature_columns}")
    print(" Model files saved: calorie_model.h5 and scalers.pkl")
    print(" Ready for production use!")
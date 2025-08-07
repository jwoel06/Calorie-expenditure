import React from 'react';
import {useState} from 'react';
import './Calculate.css';

function Calculate() {
  const [formData, setFormData] = useState({
    sex:'',
    duration:'',
    heart_rate:'',
    intensity: '', //converted to temperature
  })

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    
    });
  };

  const convertIntesityToTemperature = (intensity) => {
    const intensityMap = {
      'low': 36.0,
      'moderate': 37.5,
      'high': 39.0,
      'very_high': 40.5
    };
    return intensityMap[intensity];
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      Sex: formData.sex === 'male' ? 1 : 0, //1 is male 0 is female
      Duration: parseFloat(formData.duration),
      Heart_Rate: parseInt(formData.heart_rate),
      Body_Temp: convertIntesityToTemperature(formData.intensity),
    };

  try {
    const response = await fetch('http://localhost:8000/api/calculate-calories', { //fast api endpoint
      method:'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      const data = await response.json();
      setResult(data);
      console.log('Successful Calculation');
    }
    else {
      const errorData = await response.json();
      setError(errorData.message || 'Error in Calculating Calories');
    }
  }
    catch (error) {
      setError('Failure to connect with server');
      console.error('Network Error: ', error);
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <main>
      <div className="calculator-container">
        <h1 className="main-title">Estimate Your Calorie Expenditure!</h1>
        <h3 className="subtitle">How it works...</h3>
        <p className="description">Input your Sex, Age, Duration of Workout (Minutes), Average Heart Rate (BPM), and Workout Intensity</p>
        
        <div className="form-container">
          <div className="input-group">
            <label htmlFor="sex" className="input-label">Sex</label>
            <select 
              id="sex" 
              name="sex" 
              value={formData.sex}
              onChange={handleChange}
              required
              className="input-field select-field"
            >
              <option value="">Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="duration" className="input-label">Length Of Workout (minutes)</label>
            <input 
              type="number" 
              id="duration" 
              name="duration" 
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
              step="1"
              className="input-field"
              placeholder="Enter workout duration"
            />
          </div>
  
          <div className="input-group">
            <label htmlFor="heart_rate" className="input-label">Heart Rate (BPM)</label>
            <input 
              type="number" 
              id="heart_rate" 
              name="heart_rate" 
              value={formData.heart_rate}
              onChange={handleChange}
              required
              min="30"
              max="250"
              className="input-field"
              placeholder="Enter average heart rate"
            />
          </div>
  
          <div className="input-group">
            <label htmlFor="intensity" className="input-label">Intensity</label>
            <select 
              id="intensity" 
              name="intensity" 
              value={formData.intensity}
              onChange={handleChange}
              required
              className="input-field select-field"
            >
              <option value="">Select Intensity</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="very_high">Very High</option>
            </select>
          </div>
  
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Calculating...' : 'Calculate Calories'}
          </button>
        </div>
  
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
  
        {result && (
          <div className="result-message">
            <h3 className="result-title">Calculation Result:</h3>
            <p className="result-text">
              Estimated Calories Burned: <span className="result-value">{result.predicted_calories || result}</span>
            </p>
          </div>
        )}
      </div>
    </main>
    );
  }
  
export default Calculate;
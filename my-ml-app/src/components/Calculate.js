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
    return intensityMap[intensity] || 36.0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      Sex: formData.sex === 'male' ? 1 : 0, //1 is male 0 is female
      Duration: parseFloat(formData.duration),
      Temperature: convertIntesityToTemperature(formData.intensity),
      Heart_rate: parseInt(formData.heart_rate)
    };

  try {
    const response = await fetch('/api/calculate-calories', { //fast api endpoint
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
    <div>
      <h1>Estimate Your Calorie Expenditure!</h1>
      <h3>How it works...</h3>
      <p>Input your Sex, Age, Duration of Workout (Minutes), Average Heart Reate (BPM), and Workout Intensity</p>
      <form>
        <label htmlFor="sex">Sex</label><br />
        <input type="text" id="sex" name="sex" /><br />
        <label htmlFor="age">Age</label><br />
        <input type="text" id="age" name="age" /><br />
        <label htmlFor="tduration">Length Of Workout</label><br />
        <input type="text" id="tduration" name="tduration" /><br />
        <label htmlFor="hrate">Heart Rate (BPM)</label><br />
        <input type="text" id="hrate" name="hrate" /><br />
        <label htmlFor="hrate">Intensity</label><br />
        <input type="text" id="intensity" name="intensity" /><br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Calculate;
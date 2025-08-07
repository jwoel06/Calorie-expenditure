import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, Target, TrendingUp, Dumbbell, Users, User } from 'lucide-react';
import './Survey.css';
import { supabase } from '../lib/supabase'; 


const Survey = () => {
    const[currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const[userId, setUserId] = useState(null);
    const [animateStep, setAnimateStep] = useState(true)
    const [surveyData, setSurveyData] = useState({
        fitnessGoal:'',
        experienceLevel:'',
        workoutStyle:'',
        coachingStyle:'',
        name:'',
    });

    const totalSteps = 5; 

    useEffect(() => {
        const initializeUser = async () => {
          const {data : {user}} = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            }
        };
        
        initializeUser();
      }, []);
      // Animation on step change
    useEffect(() => {
      setAnimateStep(false);
      setTimeout(() => setAnimateStep(true), 50);
    }, [currentStep]);
    const updateSurveyData = (field, value) => {
        setSurveyData(prev =>({
            ...prev,
            [field] : value
        }));  
    };
    const handleNext = () => {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    };

    const handleBack = () => {
      if (currentStep > 1) {
        setCurrentStep(prev => prev - 1);
      }
    };

    const isStepValid = () => {
      switch (currentStep) {
        case 1: return surveyData.name.length > 1;
        case 2: return surveyData.fitnessGoal !== '';
        case 3: return surveyData.experienceLevel !== '';
        case 4: return surveyData.workoutStyle !== '';
        case 5: return surveyData.coachingStyle !== '';
        default: return false
      }
    }


    const saveSurveyResponse = async () => { 
        setLoading(true);
        setError(null);

        try {
          const { data: error} = await supabase
            .from('user_surveys')
            .insert({
              user_id: userId,
              ...surveyData,
              created_at: new Date().toISOString()
            })
        } catch (error) {
          setError('Error occured saving survey response', error)
        } finally {
            setLoading(false);
        }
      
    }
 const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={`step-content ${animateStep ? 'fade-in' : ''}`}>
            <div className="step-icon">
              <User size={48} />
            </div>
            <h2 className="step-title">What's your name?</h2>
            <p className="step-subtitle">Let's start with getting to know you</p>
            <input
              type="text"
              className="survey-input"
              placeholder="Enter your name"
              value={surveyData.name}
              onChange={(e) => updateSurveyData('name', e.target.value)}
              autoFocus
            />
          </div>
        );

      case 2:
        return (
          <div className={`step-content ${animateStep ? 'fade-in' : ''}`}>
            <div className="step-icon">
              <Target size={48} />
            </div>
            <h2 className="step-title">What's your primary fitness goal?</h2>
            <p className="step-subtitle">This helps us match you with the right coach</p>
            <div className="option-grid">
              {[
                { value: 'weight_loss', label: 'Weight Loss', desc: 'Burn fat and slim down' },
                { value: 'muscle_gain', label: 'Muscle Gain', desc: 'Build strength and size' },
                { value: 'endurance', label: 'Endurance', desc: 'Improve stamina and cardio' },
                { value: 'flexibility', label: 'Flexibility', desc: 'Enhance mobility and balance' },
                { value: 'general_fitness', label: 'General Fitness', desc: 'Overall health and wellness' },
                { value: 'sports_performance', label: 'Sports Performance', desc: 'Athletic training' }
              ].map(option => (
                <div
                  key={option.value}
                  className={`option-card ${surveyData.fitnessGoal === option.value ? 'selected' : ''}`}
                  onClick={() => updateSurveyData('fitnessGoal', option.value)}
                >
                  <div className="option-check">
                    <Check size={16} />
                  </div>
                  <h3>{option.label}</h3>
                  <p>{option.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className={`step-content ${animateStep ? 'fade-in' : ''}`}>
            <div className="step-icon">
              <TrendingUp size={48} />
            </div>
            <h2 className="step-title">What's your experience level?</h2>
            <p className="step-subtitle">We'll tailor the coaching to your current fitness level</p>
            <div className="option-list">
              {[
                { value: 'beginner', label: 'Beginner', desc: 'New to fitness or returning after a break' },
                { value: 'intermediate', label: 'Intermediate', desc: '1-3 years of consistent training' },
                { value: 'advanced', label: 'Advanced', desc: '3+ years of dedicated training' },
                { value: 'athlete', label: 'Athlete', desc: 'Competitive or professional level' }
              ].map(option => (
                <div
                  key={option.value}
                  className={`option-row ${surveyData.experienceLevel === option.value ? 'selected' : ''}`}
                  onClick={() => updateSurveyData('experienceLevel', option.value)}
                >
                  <div className="option-radio">
                    <div className="radio-inner"></div>
                  </div>
                  <div className="option-content">
                    <h3>{option.label}</h3>
                    <p>{option.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className={`step-content ${animateStep ? 'fade-in' : ''}`}>
            <div className="step-icon">
              <Dumbbell size={48} />
            </div>
            <h2 className="step-title">What's your preferred workout style?</h2>
            <p className="step-subtitle">Choose the training method that excites you most</p>
            <div className="option-grid">
              {[
                { value: 'strength_training', label: 'Strength Training', desc: 'Weights and resistance' },
                { value: 'hiit', label: 'HIIT', desc: 'High intensity intervals' },
                { value: 'yoga', label: 'Yoga', desc: 'Flexibility and mindfulness' },
                { value: 'crossfit', label: 'CrossFit', desc: 'Functional fitness' },
                { value: 'bodyweight', label: 'Bodyweight', desc: 'No equipment needed' },
                { value: 'mixed', label: 'Mixed Training', desc: 'Variety of styles' }
              ].map(option => (
                <div
                  key={option.value}
                  className={`option-card ${surveyData.workoutStyle === option.value ? 'selected' : ''}`}
                  onClick={() => updateSurveyData('workoutStyle', option.value)}
                >
                  <div className="option-check">
                    <Check size={16} />
                  </div>
                  <h3>{option.label}</h3>
                  <p>{option.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className={`step-content ${animateStep ? 'fade-in' : ''}`}>
            <div className="step-icon">
              <Users size={48} />
            </div>
            <h2 className="step-title">What coaching style do you prefer?</h2>
            <p className="step-subtitle">How do you like to be motivated?</p>
            <div className="option-list">
              {[
                { value: 'motivational', label: 'Motivational', desc: 'High energy, encouraging, and positive reinforcement' },
                { value: 'technical', label: 'Technical', desc: 'Focus on form, technique, and detailed instruction' },
                { value: 'tough_love', label: 'Tough Love', desc: 'Direct, challenging, and results-driven' },
                { value: 'supportive', label: 'Supportive', desc: 'Patient, understanding, and gradual progression' }
              ].map(option => (
                <div
                  key={option.value}
                  className={`option-row ${surveyData.coachingStyle === option.value ? 'selected' : ''}`}
                  onClick={() => updateSurveyData('coachingStyle', option.value)}
                >
                  <div className="option-radio">
                    <div className="radio-inner"></div>
                  </div>
                  <div className="option-content">
                    <h3>{option.label}</h3>
                    <p>{option.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="survey-container">
      <div className="survey-wrapper">
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="progress-steps">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`progress-step ${i + 1 <= currentStep ? 'active' : ''} ${i + 1 === currentStep ? 'current' : ''}`}
              >
                {i + 1 < currentStep ? <Check size={12} /> : i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Survey Content */}
        <div className="survey-content">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="survey-navigation">
          {currentStep > 1 && (
            <button
              className="nav-button nav-button-back"
              onClick={handleBack}
            >
              <ArrowLeft size={20} />
              Back
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              className={`nav-button nav-button-next ${!isStepValid() ? 'disabled' : ''}`}
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Continue
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              className={`nav-button nav-button-submit ${!isStepValid() || loading ? 'disabled' : ''}`}
              onClick={saveSurveyResponse}
              disabled={!isStepValid() || loading}
            >
              {loading ? 'Finding your coaches...' : 'Find My Coaches'}
              {!loading && <ArrowRight size={20} />}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
  

export default Survey
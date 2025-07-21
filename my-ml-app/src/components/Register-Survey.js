import React from 'react'

const RegisterSurvey = () => {
    const[currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const[userId, setUserId] = useState(null);
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
    const updateSurveyData = (field, value) => {
        setSurveyData(prev =>({
            ...prev,
            [field] : value
        }));  
    };
    const saveSurveyResponse = async () => {
        setLoading(true);
        setError(null);


        
    }
  return (

}

export default Register-Survey
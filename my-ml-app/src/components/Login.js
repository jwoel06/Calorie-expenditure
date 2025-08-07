import React from 'react'
import './Login.css'
import {useState, useEffect} from "react";
import {useAuth} from "../hooks/useAuth";
import {supabase} from "../lib/supabase";
import {useNavigation} from 'react-router-dom';

const Login = () => {  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth()
  const navigate = useNavigation();

  const handleClick = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);

    try {
      await login(email, password, rememberMe);

    } catch (err) {
      setError(err.message || 'Login Failed. Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className='welcome-container'>
        <h1 className='welcome-title'>Go Sally!</h1>
        <p className='welcome-content'>Find Out What You Are Capable Of</p>
      </div>
      
      <div className='login-container'>
        <h1 className='login-title'>Sign In</h1>
        
        <div id="login-items" className="login-items">
          <form onSubmit={handleClick}>
            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}
            
            <div className="form-field">
              <label htmlFor='email'>Email</label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter Email"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-field">
              <label htmlFor='password'>Password</label>
              <input 
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={loading}
              />
            </div>
            
            <div className="remember-me">
              <input 
                type="checkbox"
                id='rememberMe'
                checked={rememberMe} 
                onChange={e => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor='rememberMe'>Remember Me</label>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !email || !password}
              className={loading ? 'loading' : ''}
            >
              {loading ? 'Signing In...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
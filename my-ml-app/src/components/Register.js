import React from 'react'
import './Register.css'
import {useState, useEffect} from "react";
import {useAuth} from "../hooks/useAuth";
import {supabase} from "../lib/supabase";
const Register = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const { register } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords are not the same');
      setLoading(false);
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to terms and service');
      setLoading(false);
      return;
    }

    try {
      const {data, error} = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setSuccess('Registration successful! Please check your email to confirm your account.');
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAgreeTerms(false);
      }
      else {
        setSuccess('')
      }
    } catch (err) {
      setError(err.message || 'Failed to Register');
    }
    finally {
      setLoading(false);
    }
  }
  
  return (
    <main>
      <div className='welcome-container'>
        <h1 className='welcome-title'>Go Sally!</h1>
        <p className='welcome-content'>You made the Right Choice</p>
      </div>
      <div className='login-container'>
        <h1 className='login-title'>Register</h1>
        <div id="login-items" className="login-items">
          <form onSubmit ={handleSignUp}>
            {error && <div classname="error-message" style = {{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {success && <div classname="success-message" style = {{color: 'green', marginBottom: '10px'}}>{success}</div>}
            
            <label htmlFor='email'>Email</label>
            <input 
              type="email" 
              name="email" 
              id='email' 
              placeholder="Enter Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor='password1'>Enter a Password</label>
            <input 
              type="password" 
              name="password1" 
              placeholder="Password"
              id="password1" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <label htmlFor='password2'>Re-enter Password</label>
            <input 
              type="password" 
              name="password2" 
              placeholder="Re-enter Password" 
              id='password2'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
              <div className="agree-terms">
                <input 
                  type="checkbox" 
                  name="agreeTerms" 
                  id= "agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
                <label htmlFor='agreeTerms'>Agree to terms and Service</label>
              </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Register
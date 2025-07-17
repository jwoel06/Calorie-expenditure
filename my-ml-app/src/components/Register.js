import React from 'react'
import './Register.css'
import {useState, useEffect} from "react";
import {useAuth} from "../hooks/useAuth";
import {supabase} from "../lib/supabase";
const Register = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const handleSignUp = async (e) => {
    e.preventdefault();
    setLoading(true);
    try {
      const {data, error} = await supabase.auth.signUp({
        email,
        password,
      });
      setError(error.message);
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
          <form>
            <label htmlFor='email'>Email</label>
            <input type="email" name="email" id='email' placeholder="Enter Email" />
            <label htmlFor='password1'>Enter a Password</label>
            <input type="password" name="password1" placeholder="Password" />
            <label htmlFor='password2'>Re-enter Password</label>
            <input type="password" name="password" placeholder="Re-enter Password" />
              <div className="remember-me">
                <input type="checkbox" name="rememberMe" id= "rememberMe"/>
                <label for='rememberMe'>Agree to terms and Service</label>
              </div>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Register
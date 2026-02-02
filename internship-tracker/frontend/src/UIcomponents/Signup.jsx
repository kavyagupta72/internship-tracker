import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending data to your backend
      const res = await axios.post('https://internship-tracker-z3x4.onrender.com/auth/signup', formData);
      
      // Store the token and go to dashboard
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required
          onChange={e => setFormData({...formData, username: e.target.value})} />
        <input type="email" placeholder="Email" required
          onChange={e => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" required
          onChange={e => setFormData({...formData, password: e.target.value})} />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Signup;
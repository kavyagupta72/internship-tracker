import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback('');

    try {
      // Sending data to your backend
      const res = await apiClient.post('/auth/signup', formData);
      
      // Store the token and go to dashboard
      localStorage.setItem('token', res.data.token);
      setFeedback('Signup successful. Redirecting...');
      navigate('/dashboard');
    } catch (err) {
      const body = err.response?.data;
      const fromApi =
        typeof body === "string"
          ? body
          : body?.error || body?.message;
      const errorMessage =
        fromApi ||
        (err.code === "ECONNABORTED"
          ? "Request timed out. Check that the API server is reachable."
          : err.message) ||
        "Signup failed. Please try again.";
      setFeedback(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      {feedback && <p>{feedback}</p>}
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Signup;
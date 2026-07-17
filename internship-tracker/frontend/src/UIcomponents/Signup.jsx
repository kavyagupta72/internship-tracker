import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient, API_BASE_URL } from '../api';

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
          : [body?.error, body?.hint, body?.message].filter(Boolean).join(" — ") ||
            body?.detail;
      const noResponse = !err.response;
      const isUnreachable =
        noResponse &&
        (err.code === "ERR_NETWORK" ||
          err.message === "Network Error" ||
          err.code === "ECONNREFUSED");
      const errorMessage =
        fromApi ||
        (isUnreachable
          ? `Cannot reach the API at ${API_BASE_URL}. Start the backend (cd backend && npm start) and fix DATABASE_URL if the server exits on startup.`
          : err.code === "ECONNABORTED"
            ? "Request timed out. If the API is on Render free tier, the first request after idle can take 1–2 minutes — try again. Otherwise check VITE_API_BASE_URL and that the service is running."
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
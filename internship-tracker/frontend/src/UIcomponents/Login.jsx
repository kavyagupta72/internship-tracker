import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback('');

    try {
      const res = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setFeedback('Login successful. Redirecting...');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      const body = err.response?.data;
      const errorMessage =
        (typeof body === "string" ? body : body?.error || body?.message) ||
        err.message ||
        "Invalid credentials";
      setFeedback(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif', 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        backgroundColor: '#ffffff', 
        borderRadius: '16px', 
        border: '1px solid #e2e8f0', 
        padding: '40px 36px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)'
      }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '20px', height: '32px', backgroundColor: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>I</div>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', letterSpacing: '-0.025em' }}>InternTracker</span>
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Welcome back</h2>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0 }}>Please enter your details to sign in</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email address</label>
            <input 
              type="email" 
              placeholder="abc@xyz.com" 
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                backgroundColor: '#fff',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Password</label>
            <input 
              type="password" 
              placeholder="" 
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                backgroundColor: '#fff',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{
              marginTop: '8px',
              width: '100%',
              backgroundColor: isSubmitting ? '#93c5fd' : '#2563eb',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Feedback Banner */}
        {feedback && (
          <div style={{ 
            marginTop: '20px', 
            padding: '12px 14px', 
            borderRadius: '8px', 
            fontSize: '0.875rem',
            backgroundColor: feedback.includes('successful') ? '#f0fdf4' : '#fef2f2',
            color: feedback.includes('successful') ? '#166534' : '#991b1b',
            border: `1px solid ${feedback.includes('successful') ? '#bbf7d0' : '#fecaca'}`,
            lineHeight: '1.4'
          }}>
            {feedback}
          </div>
        )}

        {/* Footer Link */}
        <p style={{ textAlign: 'center', marginTop: '28px', color: '#6b7280', fontSize: '0.9rem', marginBottom: 0 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
            Sign up here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
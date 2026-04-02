import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const body = err.response?.data;
      const errorMessage =
        (typeof body === "string" ? body : body?.error || body?.message) ||
        err.message ||
        "Invalid credentials";
      alert(errorMessage);
    }
  };
  useEffect(() => {
  if (localStorage.getItem('token')) {
    navigate('/dashboard');
  }
}, []);

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" required
          onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required
          onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </div>
  );
};

export default Login;
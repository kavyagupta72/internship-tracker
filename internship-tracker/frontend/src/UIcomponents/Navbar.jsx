import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the "ID Card"
    navigate('/'); // Redirect to login
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#2c3e50', // Professional Dark Blue
      color: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
         InternTracker
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ fontSize: '0.9rem', color: '#bdc3c7' }}>Welcome back!</span>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: '#e74c3c', // Red
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: '0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
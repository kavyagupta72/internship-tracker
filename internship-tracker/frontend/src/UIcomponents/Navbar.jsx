import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggler from './ThemeToggler';
import Profile from './Profile';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the "ID Card"
    navigate('/'); // Redirect to login
  };

  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #ccc' }}>
      <h1>Internship Tracker</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
        {/* Universal Theme Changer */}
        <ThemeToggler />

        {/* Clickable Profile Avatar Icon */}
        <div 
          onClick={() => setShowDropdown(!showDropdown)} 
          style={{ cursor: 'pointer', fontSize: '24px', userSelect: 'none' }}
          title="Account Menu"
        >
          👤
        </div>

        {/* Dropdown Card */}
        {showDropdown && (
          <div className="dropdown-menu" style={{
            position: 'absolute',
            top: '40px',
            right: '0px',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: '280px'
          }}>
            {/* Renders the profile summary, email view, and password change options directly here */}
            <Profile />
            
            <hr style={{ margin: '15px 0', borderColor: '#eee' }} />
            
            <button 
              onClick={handleLogout} 
              style={{
                width: '100%',
                padding: '8px',
                background: '#ff4d4d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
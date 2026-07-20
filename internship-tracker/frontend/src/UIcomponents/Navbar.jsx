import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggler from './ThemeToggler';
import Profile from './Profile';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '14px 24px', 
      backgroundColor: 'var(--bg-nav, #161b22)',
      borderBottom: '1px solid var(--border-color, #2d2d2d)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo */}
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          color: 'var(--text-main, #ffffff)',
          letterSpacing: '-0.3px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ paddingBottom: '2px' }}>Internship Tracker</span>
        </h1>
      </Link>
      
      {/* Right Controls */}
      <div 
        ref={dropdownRef}
        style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}
      >
        {/* Universal Theme Changer */}
        <ThemeToggler />

        {/* Clickable Profile Avatar Icon */}
        <button 
          onClick={() => setShowDropdown(!showDropdown)} 
          style={{ 
            cursor: 'pointer', 
            background: 'none',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            backgroundColor: showDropdown ? 'var(--border-color, #2d2d2d)' : 'transparent',
            transition: 'background-color 0.2s',
            outline: 'none'
          }}
          title="Account Menu"
        >
          <svg 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={showDropdown ? 'var(--text-main, #ffffff)' : 'var(--text-muted, #888888)'} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ transition: 'stroke 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.setAttribute('stroke', 'var(--text-main, #ffffff)')}
            onMouseLeave={(e) => !showDropdown && e.currentTarget.setAttribute('stroke', 'var(--text-muted, #888888)')}
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>

        {/* Dropdown Card */}
        {showDropdown && (
          <div className="dropdown-menu" style={{
            position: 'absolute',
            top: '48px',
            right: '0px',
            background: 'var(--bg-card, #1e1e1e)',
            color: 'var(--text-main, #e0e0e0)',
            border: '1px solid var(--border-color, #2d2d2d)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.3)',
            zIndex: 1000,
            minWidth: '290px',
            boxSizing: 'border-box'
          }}>
            {/* Profile summary content */}
            <Profile />
            
            <hr style={{ margin: '16px 0', borderColor: 'var(--border-color, #2d2d2d)', borderStyle: 'solid', borderWidth: '1px 0 0 0' }} />
            
            {/* Logout Action */}
            <button 
              onClick={handleLogout} 
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'transparent',
                color: '#f85149',
                border: '1px solid rgba(248, 81, 73, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(248, 81, 73, 0.1)';
                e.currentTarget.style.borderColor = '#f85149';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(248, 81, 73, 0.3)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
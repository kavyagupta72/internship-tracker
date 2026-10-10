import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif', color: '#111827', backgroundColor: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '24px 60px', 
        alignItems: 'center',
        borderBottom: '1px solid #f3f4f6',
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', backgroundColor: '#2563eb', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>I</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>InternTracker</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/login" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500', fontSize: '0.95rem' }}>Login</Link>
          <Link to="/signup" style={{ 
            textDecoration: 'none', 
            backgroundColor: '#111827', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '0.95rem',
            transition: 'background-color 0.2s'
          }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ 
        textAlign: 'center', 
        padding: '20px 20px 80px 20px', 
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        
        <h1 style={{ fontSize: '3.75rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.03em' }}>
          Stop losing track of your internship applications.
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: '#4b5563', maxWidth: '640px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          The all-in-one platform built for students to manage timelines, track application statuses, store recruiter notes, and land interviews with confidence.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/signup" style={{ 
            fontSize: '1rem',
            backgroundColor: '#2563eb', 
            color: 'white', 
            padding: '14px 32px', 
            borderRadius: '8px', 
            textDecoration: 'none',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            display: 'inline-block'
          }}>
            Get Started for Free
          </Link>
          <Link to="/login" style={{ 
            fontSize: '1rem',
            backgroundColor: '#ffffff', 
            color: '#374151', 
            padding: '14px 32px', 
            borderRadius: '8px', 
            textDecoration: 'none',
            fontWeight: '600',
            border: '1px solid #d1d5db',
            display: 'inline-block'
          }}>
            Sign In
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 120px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '12px' }}>Everything you need to stay organized</h2>
          <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>Ditch messy spreadsheets and scattered email threads.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <FeatureCard 
            icon={<PipelineIcon />} 
            title="Visual Pipeline" 
            desc="Manage your status updates from Applied to Interview and Offer with an intuitive workflow." 
          />
          <FeatureCard 
            icon={<SecurityIcon />} 
            title="Secure Data" 
            desc="Your profile, resume links, and application details are stored securely." 
          />
          <FeatureCard 
            icon={<NotesIcon />} 
            title="Personalized Notes" 
            desc="Store technical interview questions, recruiter feedback, and company research all in one central card." 
          />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #f3f4f6', padding: '40px 60px', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
        <p>&copy; {new Date().getFullYear()} InternTracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Reusable Feature Card Component with Clean SVG Icons
const FeatureCard = ({ icon, title, desc }) => (
  <div style={{ 
    padding: '36px 30px', 
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb', 
    borderRadius: '12px', 
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  }}>
    <div style={{ width: '44px', height: '44px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px', color: '#111827' }}>{title}</h3>
    <p style={{ color: '#4b5563', lineHeight: '1.5', fontSize: '0.95rem', margin: 0 }}>{desc}</p>
  </div>
);

//SVG Icons
const PipelineIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="9" rx="1"></rect>
    <rect x="14" y="3" width="7" height="5" rx="1"></rect>
    <rect x="14" y="12" width="7" height="9" rx="1"></rect>
    <rect x="3" y="16" width="7" height="5" rx="1"></rect>
  </svg>
);

const SecurityIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const NotesIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export default Home;
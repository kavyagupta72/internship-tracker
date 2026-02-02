import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      {/* Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '20px 50px', 
        alignItems: 'center',
        borderBottom: '1px solid #eee' 
      }}>
        <h2 style={{ color: '#007bff', margin: 0 }}>🚀 InternTracker</h2>
        <div>
          <Link to="/login" style={{ marginRight: '20px', textDecoration: 'none', color: '#555', fontWeight: 'bold' }}>Login</Link>
          <Link to="/signup" style={{ 
            textDecoration: 'none', 
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '5px',
            fontWeight: 'bold'
          }}>Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ 
        textAlign: 'center', 
        padding: '100px 20px', 
        backgroundColor: '#f8f9fa' 
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Stop Losing Track of Applications.</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto 30px' }}>
          The all-in-one platform for students to manage, track, and ace their internship search. 
          Keep notes, update statuses, and stay organized.
        </p>
        <Link to="/signup" style={{ 
          fontSize: '1.1rem',
          backgroundColor: '#28a745', 
          color: 'white', 
          padding: '15px 40px', 
          borderRadius: '30px', 
          textDecoration: 'none',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
        }}>
          Get Started for Free
        </Link>
      </header>

      {/* Features Section */}
      <section style={{ padding: '80px 50px', display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        <FeatureCard icon="📊" title="Visual Pipeline" desc="See your application status at a glance with our intuitive dashboard." />
        <FeatureCard icon="🔐" title="Secure Data" desc="Your application details are encrypted and stored securely." />
        <FeatureCard icon="📝" title="Personal Notes" desc="Keep track of interview questions and recruiter feedback." />
      </section>
    </div>
  );
};

// Simple reusable component for features
const FeatureCard = ({ icon, title, desc }) => (
  <div style={{ 
    width: '250px', 
    padding: '30px', 
    border: '1px solid #eee', 
    borderRadius: '15px', 
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.02)' 
  }}>
    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{icon}</div>
    <h3>{title}</h3>
    <p style={{ color: '#777' }}>{desc}</p>
  </div>
);

export default Home;
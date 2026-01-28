import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './UIcomponents/Login';
import Signup from './UIcomponents/Signup';
import Dashboard from './UIcomponents/Dashboard';
import ProtectedRoute from './UIcomponents/ProtectedRoute';
import ApplicationDetails from './UIcomponents/ApplicationDetails';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Route: Only accessible if logged in */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/application/:id" 
            element={
              <ProtectedRoute>
                <ApplicationDetails />
              </ProtectedRoute>
            } 
          />

          {/* Redirect any unknown path or the root path to Login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the token exists in the browser's "notebook"
  const token = localStorage.getItem('token');

  // If there is no token, redirect the user to the Login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If the token exists, allow them to see the page (children)
  return children;
};

export default ProtectedRoute;
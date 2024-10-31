import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const roleId = localStorage.getItem('roleId'); // Retrieve role from localStorage

  // Check if the user's role is included in allowedRoles
  return allowedRoles.includes(roleId) ? children : <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;

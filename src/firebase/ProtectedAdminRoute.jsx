import React from 'react';
import { Navigate } from 'react-router-dom';
import useAdmin from './useAdmin';

const ProtectedAdminRoute = ({ component: Component }) => {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  // If user is an admin, render the component, otherwise redirect to login
  return isAdmin ? <Component /> : <Navigate to="/login" replace />;
};

export default ProtectedAdminRoute;
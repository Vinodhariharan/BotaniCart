import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/joy';
import useUser from './useUser';

const ProtectedUserRoute = ({ component: Component }) => {
  const { isUser, userData, loading } = useUser();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size="lg" color="primary" />
      </Box>
    ); // Show loading indicator
  }

  // If user is a customer, render the component, otherwise redirect to login
  return isUser ? <Component userData={userData} /> : <Navigate to="/login" replace />;
};

export default ProtectedUserRoute;
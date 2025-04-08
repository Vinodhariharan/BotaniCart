import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingPage = ({ timeout = 1000, children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Start a timer to show content after the timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, timeout);
    
    // Clean up timer on unmount
    return () => clearTimeout(timer);
  }, [timeout]);
  
  if (!isLoading) {
    return children;
  }
  
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress 
          size={100} 
          thickness={4} 
          sx={{ 
            color: '#0A4938',
            animationDuration: '1.5s'
          }} 
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box 
            component="img"
            src="/logo.png" 
            alt="Logo"
            sx={{ 
              width: 50, 
              height: 50,
              animation: 'pulse 1.5s infinite ease-in-out'
            }}
          />
        </Box>
      </Box>
      <Typography 
        variant="h6" 
        component="div" 
        sx={{ 
          mt: 3, 
          color: '#0A4938',
          fontWeight: 'bold'
        }}
      >
        Loading...
      </Typography>
      <Box 
        sx={{ 
          mt: 2,
          width: 200,
          height: 5,
          backgroundColor: '#e0e0e0',
          borderRadius: 5,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '40%',
            height: '100%',
            backgroundColor: '#0A4938',
            borderRadius: 5,
            animation: 'loadingBar 1.5s infinite ease-in-out'
          }
        }}
      />
      
      <style>
        {`
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        
        @keyframes loadingBar {
          0% { left: -40%; }
          100% { left: 100%; }
        }
        `}
      </style>
    </Box>
  );
};

export default LoadingPage;
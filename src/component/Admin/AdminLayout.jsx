import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Typography, CircularProgress } from '@mui/joy';
import { signOut } from 'firebase/auth';
import { auth } from '../../auth'; // Adjust the path as needed
import Sidebar from './AdminSidebar';

// Theme colors for plant e-commerce
const themeColors = {
  primary: {
    main: '#2e7d32', // Forest green
    light: '#60ad5e',
    dark: '#005005',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#66bb6a', // Light green
    light: '#98ee99',
    dark: '#338a3e',
    contrastText: '#000000'
  },
  background: {
    default: '#f1f8e9', // Very light green tint
    paper: '#ffffff'
  }
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    setLoading(true); // Start loading
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'Window' }}>
      <CssBaseline />
      
      <Sidebar 
        open={sidebarOpen} 
        onToggle={handleDrawerToggle} 
        onLogout={handleLogout} 
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: 'margin 0.2s ease',
          background: 'linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%)',

          ml: 0,
          width: { sm: `calc(100% - ${sidebarOpen ? 240 : 72}px)` },
          overflow: 'auto',
          position: 'relative' // To center loading indicator
        }}
      >
        {loading ? (
          // Show Circular Progress when loading
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress size="lg" color="primary" />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 4, mt: 1 }}>
              <Typography level="h4" sx={{ color: '#000', fontWeight: 'bold' }}>
                Admin Center
              </Typography>
              <Typography level="body-md" sx={{ color: '#000' }}>
                Manage your plant e-commerce platform
              </Typography>
            </Box>
            
            <Box sx={{ 
              color: '#333',
              borderRadius: 'lg', 
              p: 3, 
              boxShadow: 'sm',
              border: '1px solid',
              borderColor: themeColors.primary.light + '30'
            }}>
              <Outlet />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminLayout;

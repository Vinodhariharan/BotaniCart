import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Sheet,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  IconButton,
  CircularProgress,
  ListDivider,
  CssBaseline,
  Snackbar,
} from '@mui/joy';
import {
  Person as ProfileIcon,
  ShoppingBag as OrdersIcon,
  Payment as BillingIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  House,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../auth'; // Adjust the path based on your project structure
import { useMediaQuery } from '@mui/material';

const ProfileLayout = ({ userData }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Automatically collapse sidebar on mobile
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const expandedWidth = 240;
  const collapsedWidth = 72;
  const mobileWidth = isMobile ? 0 : collapsedWidth;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        setLoading(false);
      } else {
        // Redirect to login if not authenticated
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Show success message temporarily
  const showSuccessMessage = (message) => {
    setSuccess(message);
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

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
      setError('Failed to sign out. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const menuItems = [
    { text: 'Profile', icon: <ProfileIcon />, path: '/account/profile' },
    { text: 'Orders', icon: <OrdersIcon />, path: '/account/orders' },
    { text: 'Billing Info', icon: <BillingIcon />, path: '/account/billing' },
    { text: 'Account Settings', icon: <SettingsIcon />, path: '/account/settings' },
  ];

  // If still loading initial auth
  if (loading && !user) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size="lg" color="primary" />
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'Window', flexDirection: isMobile ? 'column' : 'row' }}>
      <CssBaseline />

      {/* Mobile Header with menu toggle */}
      {isMobile && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2, 
          borderBottom: '1px solid #ccc',
          position: 'sticky',
          top: 0,
          // zIndex: 1100,
          bgcolor: '#fff'
        }}>
          <Typography level="h4" sx={{ fontWeight: 'bold' }}>
            {userData.firstName + " " + userData.lastName}
          </Typography>
          <IconButton onClick={handleDrawerToggle} size="md" variant="outlined" color="neutral">
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* Sidebar - Full height on desktop, drawer on mobile */}
      <Sheet
        sx={{
          display: sidebarOpen || !isMobile ? 'flex' : 'none',
          height: isMobile ? 'calc(100vh - 64px)' : '100vh',
          position: 'sticky',
          top: isMobile ? '64px' : 0,
          width: sidebarOpen ? expandedWidth : collapsedWidth,
          transition: 'width 0.2s ease',
          color: '#333',
          borderRight: '1px solid #ccc',
          zIndex: 1000,
          overflow: 'hidden',
          ...(isMobile && {
            position: 'fixed',
            width: expandedWidth,
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
          })
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: expandedWidth }}>
          {/* Desktop Header */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                justifyContent: sidebarOpen ? 'space-between' : 'center',
                bgcolor: '#fff',
              }}
            >
              {sidebarOpen ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box>
                      <Typography level="h3" sx={{ fontWeight: 'bold' }}>
                        {userData.firstName + " " + userData.lastName}
                      </Typography>
                      <Typography level="body-sm" sx={{ color: '#000' }}>
                        My Account Page
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton onClick={handleDrawerToggle} size="sm" variant="plain" color="neutral">
                    <ChevronLeftIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton onClick={handleDrawerToggle} size="sm" variant="plain" color="neutral">
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          )}

          {/* Mobile sidebar close button */}
          {isMobile && sidebarOpen && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
              <IconButton onClick={handleDrawerToggle} size="sm" variant="plain" color="neutral">
                <ChevronLeftIcon />
              </IconButton>
            </Box>
          )}

          <ListDivider />

          <List
            size="sm"
            sx={{
              '--ListItem-radius': '8px',
              '--List-gap': '4px',
              mt: 2,
              px: 2,
            }}
          >
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={isActive}
                    onClick={isMobile ? handleDrawerToggle : undefined}
                    sx={{
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      px: sidebarOpen ? 2 : 0,
                      '&.Mui-selected': {
                        bgcolor: '#e0f7fa',
                        color: '#000',
                        '&:hover': {
                          bgcolor: '#c8e6c9',
                        },
                      },
                      '&:hover': {
                        bgcolor: '#e0f7fa50',
                      },
                    }}
                  >
                    <ListItemDecorator
                      sx={{
                        color: isActive ? 'inherit' : '#2e7d32',
                        minWidth: sidebarOpen ? 'auto' : '100%',
                        justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemDecorator>
                    {sidebarOpen && <ListItemContent>{item.text}</ListItemContent>}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Box sx={{ mt: 'auto', px: 2 }}>
            <ListDivider sx={{ my: 2 }} />
            <ListItem>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  '&:hover': {
                    bgcolor: '#333',
                  },
                  mb:2
                }}
              >
                <ListItemDecorator
                  sx={{
                    minWidth: sidebarOpen ? 'auto' : '100%',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    color: '#333',
                  }}
                >
                  <LogoutIcon />
                </ListItemDecorator>
                {sidebarOpen && <ListItemContent>Logout</ListItemContent>}
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                component={Link}
                to="/"
                sx={{
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  '&:hover': {
                    bgcolor: '#c8e6c930',
                  },
                }}
              >
                <ListItemDecorator
                  sx={{
                    minWidth: sidebarOpen ? 'auto' : '100%',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    color: '#005005',
                  }}
                >
                  <House />
                </ListItemDecorator>
                {sidebarOpen && <ListItemContent>Website</ListItemContent>}
              </ListItemButton>
            </ListItem>
          </Box>
        </Box> 
      </Sheet>

      {/* Overlay to close sidebar on mobile */}
      {isMobile && sidebarOpen && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.4)', 
            zIndex: 999 
          }} 
          onClick={handleDrawerToggle} 
        />
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          transition: 'margin 0.2s ease',
          ml: 0,
          width: { 
            xs: '100%', 
            sm: `calc(100% - ${sidebarOpen && !isMobile ? expandedWidth : isMobile ? 0 : collapsedWidth}px)` 
          },
          overflow: 'auto',
          position: 'relative',
          mt: isMobile ? 0 : 0
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress size="lg" color="primary" />
          </Box>
        ) : (
          <>
            <Snackbar
              open={!!error}
              autoHideDuration={3000}
              onClose={() => setError(null)}
              color="danger" 
              variant="soft"
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              {error}
            </Snackbar>

            <Snackbar
              open={!!success}
              autoHideDuration={3000}
              onClose={() => setSuccess(null)}
              color="success"
              variant="soft"
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              {success}
            </Snackbar>
            
            <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
              <Outlet context={{ user, userData, showSuccessMessage, setError }} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ProfileLayout;
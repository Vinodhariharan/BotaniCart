import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Sheet,
  Typography,
  Button,
  Container,
  Dropdown,
  MenuButton,
  Box,
  Drawer,
  Menu,
  MenuItem,
  Divider,
  IconButton,
} from '@mui/joy';
import Toolbar from '@mui/material/Toolbar';
import LoginIcon from '@mui/icons-material/Login';
import { 
  PersonPinCircleRounded, 
  Menu as MenuIcon, 
  KeyboardArrowDown, 
  Person, 
  ShoppingBag, 
  Payment, 
  Settings, 
  Logout, 
  AdminPanelSettings,
  Home,
  Info,
  LocalFlorist
} from '@mui/icons-material';
import '../../assets/css/Navbar.css';
import CartDrawer from './CartDrawer';
import { logoutUser } from '../../auth';
import MegaMenu from '../Home/MegaMenu';
import ProductSearch from '../Search/ProductSearch';
import useAdmin from '../../AuthProtectedRoute/useAdmin';

const Navbar = ({ isLoggedIn, setLoggedIn }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const {isAdmin} = useAdmin();

  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close drawer if screen size changes to desktop
      if (window.innerWidth >= 900 && drawerOpen) {
        setDrawerOpen(false);
      }
    };

    // Track scrolling for potential navbar style changes
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [drawerOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log('User signed out');
      setLoggedIn(false); // Update login state
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // You could add a toast notification here
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(prevState => !prevState);
  };

  return (
    <Sheet
      component="header"
      position="fixed"
      className="navbar"
      sx={{
        backgroundColor: 'white',
        width: '100%',
        zIndex: 1000,
        boxShadow: scrolled ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <Container sx={{ px: { xs: 1, sm: 2 } }}>
        <Toolbar className="toolbar" sx={{ 
          minHeight: { xs: '56px', sm: '64px' }, 
          padding: { xs: '0 4px', sm: '0 16px' },
          justifyContent: 'space-between'
        }}>
          {/* Left section: Menu button and Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Mobile menu button */}
            <IconButton
              variant="plain"
              color="neutral"
              onClick={handleDrawerToggle}
              aria-label="Open menu"
              sx={{
                display: { xs: 'flex', md: 'none' },
                mr: 0.5
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo - Smaller on mobile */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src='/Untitled.png'
                width={windowWidth < 600 ? '25px' : '30px'}
                alt="BotaniCart Logo"
                style={{ margin: '5px', marginBottom: '10px' }}
              />
              <Typography
                variant="plain"
                level={windowWidth < 600 ? 'h3' : 'h1'}
                component="div"
                fontFamily="League Spartan, sans-serif"
                sx={{ 
                  color: '#333',
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  whiteSpace: 'nowrap'
                }}
              >
                <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>
                  BotaniCart
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* Desktop Search (hidden on mobile - moved below toolbar) */}
          <Box sx={{
            display: { xs: 'none', md: 'block' },
            flexGrow: 1,
            mx: 4,
            width: { md: '40%', lg: '50%' },
            maxWidth: '600px'
          }}>
            <ProductSearch />
          </Box>

          {/* Right Section: Navigation Links & Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Desktop Navigation Links */}
            <Box
              className="nav-links"
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center'
              }}
            >
              <Button
                color="neutral"
                variant="plain"
                sx={{
                  fontFamily: 'League Spartan, sans-serif',
                  color: '#555',
                  px: { md: 1, lg: 2 }
                }}
                component={Link}
                to="/"
                className="nav-link"
              >
                Home
              </Button>
              <Button
                color="neutral"
                variant="plain"
                sx={{
                  fontFamily: 'League Spartan, sans-serif',
                  color: '#555',
                  px: { md: 1, lg: 2 }
                }}
                component={Link}
                to="/about"
                className="nav-link"
              >
                About
              </Button>
              <Button
                color="neutral"
                variant="plain"
                sx={{
                  fontFamily: 'League Spartan, sans-serif',
                  color: '#136c13',
                  px: { md: 1, lg: 2 }
                }}
                component={Link}
                to="/care-guides"
                className="nav-link"
              >
                PlantCare
              </Button>
            </Box>

            {/* Profile Menu - More compact on smaller screens */}
            {isLoggedIn ? (
              <Dropdown>
                <MenuButton
                  variant="plain"
                  color="neutral"
                  endDecorator={<KeyboardArrowDown />}
                  sx={{
                    fontFamily: 'League Spartan, sans-serif',
                    borderRadius: '20px',
                    margin: { xs: '4px', sm: '10px' },
                    color: '#1976d2',
                    borderColor: '#999',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    px: { xs: 1.5, sm: 2 },
                    '&:hover': {
                      borderColor: '#777',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  {windowWidth < 480 ? <Person /> : 'Account'}
                </MenuButton>
                <Menu
                  sx={{
                    minWidth: '180px',
                    fontFamily: 'League Spartan, sans-serif',
                  }}
                >
                  {(isAdmin && <MenuItem
                    component={Link}
                    to="/admin"
                    sx={{
                      color: '#555',
                      gap: 1.5
                    }}
                  >
                    <AdminPanelSettings fontSize="small" />
                    Admin Page
                  </MenuItem>)}
                  <MenuItem
                    component={Link}
                    to="/account/profile"
                    sx={{
                      color: '#555',
                      gap: 1.5
                    }}
                  >
                    <Person fontSize="small" />
                    My Profile
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/account/orders"
                    sx={{
                      color: '#555',
                      gap: 1.5
                    }}
                  >
                    <ShoppingBag fontSize="small" />
                    My Orders
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/account/billing"
                    sx={{
                      color: '#555',
                      gap: 1.5
                    }}
                  >
                    <Payment fontSize="small" />
                    Billing Info
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/account/settings"
                    sx={{
                      color: '#555',
                      gap: 1.5
                    }}
                  >
                    <Settings fontSize="small" />
                    Account Settings
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: '#555',
                      gap: 1.5
                    }}
                  >
                    <Logout fontSize="small" />
                    Logout
                  </MenuItem>
                </Menu>
              </Dropdown>
            ) : (
              <Button
                color="neutral"
                variant="soft"
                startDecorator={windowWidth > 480 ? <LoginIcon /> : null}
                sx={{
                  fontFamily: 'League Spartan, sans-serif',
                  borderRadius: '20px',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  px: { xs: 1.5, sm: 2 },
                  mr:1,
                  minWidth: { xs: 'auto', sm: '80px' },
                }}
                component={Link}
                to="/login"
              >
                {windowWidth > 480 ? 'Login' : <LoginIcon />}
              </Button>
            )}

            {/* Cart Drawer - Keep visible but more compact */}
            <CartDrawer />
          </Box>
        </Toolbar>

        {/* Mobile Search - Moved outside toolbar for better space usage */}
        <Box sx={{
          display: { xs: 'block', md: 'none' },
          px: { xs: 1, sm: 2 },
          pb: 2,
          pt: 1
        }}>
          <ProductSearch />
        </Box>
      </Container>

      {/* Mobile Navigation Drawer - Enhanced with icons */}
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        anchor="left"
        size="sm"
        sx={{ display: { md: 'none' } }}
      >
        <Box
          sx={{
            width: { xs: 250, sm: 280 },
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            borderBottom: '1px solid #eee',
            pb: 2
          }}>
            <img
              src='/Untitled.png'
              width='25px'
              alt="BotaniCart Logo"
              style={{ marginRight: '8px' }}
            />
            <Typography
              level="h4"
              sx={{ fontFamily: 'League Spartan, sans-serif', color: '#333' }}
            >
              BotaniCart
            </Typography>
          </Box>

          <Box component="nav" sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              component={Link}
              to="/"
              variant="plain"
              color="neutral"
              fullWidth
              startDecorator={<Home />}
              sx={{
                justifyContent: 'flex-start',
                fontFamily: 'League Spartan, sans-serif',
                color: '#555',
                fontWeight: 'normal',
                fontSize: '1rem'
              }}
              onClick={handleDrawerToggle}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/about"
              variant="plain"
              color="neutral"
              fullWidth
              startDecorator={<Info />}
              sx={{
                justifyContent: 'flex-start',
                fontFamily: 'League Spartan, sans-serif',
                color: '#555',
                fontWeight: 'normal',
                fontSize: '1rem'
              }}
              onClick={handleDrawerToggle}
            >
              About
            </Button>
            <Button
              component={Link}
              to="/care-guides"
              variant="plain"
              color="neutral"
              fullWidth
              startDecorator={<LocalFlorist />}
              sx={{
                justifyContent: 'flex-start',
                fontFamily: 'League Spartan, sans-serif',
                color: '#136c13',
                fontWeight: 'normal',
                fontSize: '1rem'
              }}
              onClick={handleDrawerToggle}
            >
              PlantCare
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Account Section in Drawer for Quick Access */}
          {isLoggedIn ? (
            <Box sx={{ mb: 2 }}>
              <Typography level="body-sm" sx={{ mb: 1, color: '#777' }}>
                Account
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {isAdmin && (
                  <Button
                    component={Link}
                    to="/admin"
                    variant="plain"
                    color="neutral"
                    fullWidth
                    startDecorator={<AdminPanelSettings />}
                    sx={{
                      justifyContent: 'flex-start',
                      fontFamily: 'League Spartan, sans-serif',
                    }}
                    onClick={handleDrawerToggle}
                  >
                    Admin Page
                  </Button>
                )}
                <Button
                  component={Link}
                  to="/account/profile"
                  variant="plain"
                  color="neutral"
                  fullWidth
                  startDecorator={<Person />}
                  sx={{
                    justifyContent: 'flex-start',
                    fontFamily: 'League Spartan, sans-serif',
                  }}
                  onClick={handleDrawerToggle}
                >
                  My Profile
                </Button>
                <Button
                  component={Link}
                  to="/account/orders"
                  variant="plain"
                  color="neutral"
                  fullWidth
                  startDecorator={<ShoppingBag />}
                  sx={{
                    justifyContent: 'flex-start',
                    fontFamily: 'League Spartan, sans-serif',
                  }}
                  onClick={handleDrawerToggle}
                >
                  My Orders
                </Button>
                <Button
                  onClick={() => {
                    handleLogout();
                    handleDrawerToggle();
                  }}
                  variant="plain"
                  color="neutral"
                  fullWidth
                  startDecorator={<Logout />}
                  sx={{
                    justifyContent: 'flex-start',
                    fontFamily: 'League Spartan, sans-serif',
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="soft"
              color="neutral"
              fullWidth
              startDecorator={<LoginIcon />}
              sx={{
                justifyContent: 'center',
                fontFamily: 'League Spartan, sans-serif',
                mt: 1
              }}
              onClick={handleDrawerToggle}
            >
              Login to Account
            </Button>
          )}
        </Box>
      </Drawer>
      <Divider />
    </Sheet>
  );
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  setLoggedIn: PropTypes.func.isRequired
};

export default Navbar;
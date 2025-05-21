import React, { useState } from 'react';
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
} from '@mui/joy';
import Toolbar from '@mui/material/Toolbar';
import LoginIcon from '@mui/icons-material/Login';
import { PersonPinCircleRounded, Menu as MenuIcon, KeyboardArrowDown, Person, ShoppingBag, Payment, Settings, Logout, AdminPanelSettings } from '@mui/icons-material';
import '../../assets/css/Navbar.css';
import CartDrawer from './CartDrawer';
import { logoutUser } from '../../auth';
import MegaMenu from '../Home/MegaMenu';
import ProductSearch from '../Search/ProductSearch';
import useAdmin from '../../AuthProtectedRoute/useAdmin';

const Navbar = ({ isLoggedIn, setLoggedIn }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const {isAdmin}= useAdmin();

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
      }}
    >
      <Container>
        <Toolbar className="toolbar">
          {/* Mobile menu button */}
          <Button
            variant="plain"
            color="neutral"
            onClick={handleDrawerToggle}
            aria-label="Open menu"
            sx={{
              display: { xs: 'flex', md: 'none' },
              mr: 1
            }}
          >
            <MenuIcon />
          </Button>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src='/Untitled.png'
              width='30px'
              alt="BotaniCart Logo"
              style={{ margin: '5px', marginBottom: '10px' }}
            />
            <Typography
              variant="plain"
              level='h1'
              component="div"
              fontFamily="League Spartan, sans-serif"
              sx={{ color: '#333' }}
            >
              <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>
                BotaniCart
              </Link>
            </Typography>
          </Box>

          {/* Desktop Search */}
          <Box sx={{
            display: { xs: 'none', md: 'block' },
            flexGrow: 1,
            mx: 4
          }}>
            <ProductSearch />
          </Box>

          {/* Navigation Links */}
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
              }}
              component={Link}
              to="/care-guides"
              className="nav-link"
            >
              Plant Care
            </Button>
          </Box>

          {/* Profile Menu - Updated Format */}
          {isLoggedIn ? (
            <Dropdown>
              <MenuButton
                variant="plain"
                color="neutral"
                endDecorator={<KeyboardArrowDown />}
                sx={{
                  fontFamily: 'League Spartan, sans-serif',
                  borderRadius: '20px',
                  margin: '10px',
                  color: '#1976d2',
                  borderColor: '#999',
                  '&:hover': {
                    borderColor: '#777',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                Account
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
              startDecorator={<LoginIcon />}
              sx={{
                fontFamily: 'League Spartan, sans-serif',
                borderRadius: '20px',
              }}
              component={Link}
              to="/login"
            >
              Login
            </Button>
          )}

          {/* Cart Drawer */}
          <CartDrawer />
        </Toolbar>

        {/* Mobile Search */}
        <Box sx={{
          display: { xs: 'block', md: 'none' },
          px: 2,
          pb: 2
        }}>
          <ProductSearch />
        </Box>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        anchor="left"
        size="sm"
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box
          sx={{
            width: 250,
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <Typography
            level="h4"
            sx={{ mb: 2, fontFamily: 'League Spartan, sans-serif', color: '#333' }}
          >
            BotaniCart
          </Typography>

          <Box component="nav" sx={{ mb: 3 }}>
            <Button
              component={Link}
              to="/"
              variant="plain"
              color="neutral"
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                fontFamily: 'League Spartan, sans-serif',
                color: '#555',
                mb: 1
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
              sx={{
                justifyContent: 'flex-start',
                fontFamily: 'League Spartan, sans-serif',
                color: '#555',
                mb: 1
              }}
              onClick={handleDrawerToggle}
            >
              About
            </Button>
          </Box>

          <Typography level="body2" sx={{ mb: 1 }}>Categories</Typography>
          <MegaMenu onSelect={handleDrawerToggle} />
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
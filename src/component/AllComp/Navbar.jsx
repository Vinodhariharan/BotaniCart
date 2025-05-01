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
  Select,
  Option,
  Divider,
} from '@mui/joy';
import Toolbar from '@mui/material/Toolbar';
import LoginIcon from '@mui/icons-material/Login';
import { PersonPinCircleRounded, Menu as MenuIcon, KeyboardArrowDown } from '@mui/icons-material';
import '../../assets/css/Navbar.css';
import CartDrawer from './CartDrawer';
import { logoutUser } from '../../auth';
import MegaMenu from '../Home/MegaMenu';
import ProductSearch from '../Search/ProductSearch';

const Navbar = ({ isLoggedIn, setLoggedIn }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
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
              sx={{ color: '#136c13' }}
            >
              <Link to="/" style={{ color: '#136c13', textDecoration: 'none' }}>
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
                color: '#136c13',
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
                color: '#136c13',
              }}
              component={Link}
              to="/about"
              className="nav-link"
            >
              About
            </Button>
          </Box>
          
          {isLoggedIn ? (
        <Select
          placeholder="Profile"
          indicator={<KeyboardArrowDown />}
          sx={{
            width: 120,
            fontFamily: 'League Spartan, sans-serif',
            borderRadius: '20px',
            margin: '10px',
          }}
        >
          <Option component={Link} to="/profile" sx={{ color: '#136c13' }}>
                  Profile
                </Option>
                <Option component={Link} to="/settings" sx={{ color: '#136c13' }}>
                  Settings
                </Option>
                <Option onClick={handleLogout} sx={{ color: '#136c13' }}>
                  Logout
                </Option>
        </Select>
      ) : (
        <Button
          color="primary"
          sx={{
            fontFamily: 'League Spartan, sans-serif',
            borderRadius: '20px',
            margin: '10px',
            color: '#fff',
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
            sx={{ mb: 2, fontFamily: 'League Spartan, sans-serif' }}
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
                color: '#136c13',
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
                color: '#136c13',
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
      <Divider/>
    </Sheet>
  );
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  setLoggedIn: PropTypes.func.isRequired
};

export default Navbar;
  import React, { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import {
    Sheet,
    Typography,
    Button,
    Container,
    Avatar,
    Menu,
    MenuItem,
    Dropdown,
    MenuButton,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
  } from '@mui/joy';
  import Toolbar from '@mui/material/Toolbar';
  import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
  import MenuIcon from '@mui/icons-material/Menu';
  import '../../assets/css/Navbar.css';
  import CartDrawer from './CartDrawer';
  import LoginIcon from '@mui/icons-material/Login';
  import { PersonPinCircleRounded } from '@mui/icons-material';
  import { logoutUser } from '../../auth';
  import MegaMenu from '../Home/MegaMenu';

  const Navbar = ({ isLoggedIn, setLoggedIn }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [dropdownOpen, setdropdownOpen] = useState(false);
    const navigate = useNavigate();
    const handleLogout = async () => {
      try {
        await logoutUser(); // Call your logoutUser function
        console.log('User signed out');
        navigate('/login'); // Redirect after successful logout
      } catch (error) {
        console.error('Logout error:', error);
        // Handle the error appropriately (e.g., display an error message)
      }
    };

    const handleDrawerToggle = () => {
      setDrawerOpen(!drawerOpen);
    };

    return (
      <Sheet
        position="fixed"
        className="navbar"
        sx={{ backgroundColor: 'white', width: '100%' }}
      >
        <Container>
          <Toolbar className="toolbar">
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="plain"
              level='h1'
              component="div"
              fontFamily="League Spartan;"
              sx={{ color: '#136c13' }}
            >
              <Link to="/" style={{ color: '#136c13', textDecoration: 'none' }}>
                <div>BotaniCart</div>
              </Link>
            </Typography>
            <div className="spacer" />
            <div className="nav-links" sx={{ fontFamily: 'League Spartan, sans-serif' }}>
              <Button
                color="inherit"
                sx={{ fontFamily: 'League Spartan, sans-serif', color: '#136c13' }}
                component={Link}
                to="/"
                className="nav-link"
              >
                Home
              </Button>
              <Button
                color="inherit"
                sx={{ fontFamily: 'League Spartan, sans-serif', color: '#136c13' }}
                component={Link}
                to="/about"
                className="nav-link"
              >
                About
              </Button>
              {isLoggedIn ? (
          <Dropdown
            open={dropdownOpen} // Use the state to control the dropdown
            onOpenChange={(newOpen) => setdropdownOpen(newOpen)} // Update state on open/close
          >
            <MenuButton
              component={Link}
              sx={{
                borderRadius: '20px',
                mr: 1,
                fontFamily: 'League Spartan, sans-serif',
                color: '#136c13',
              }}
              variant="soft"
              color="neutral"
              endDecorator={<PersonPinCircleRounded />}
            >
              Profile
            </MenuButton>
            <Menu placement="bottom-end" sx={{ minWidth: 120 }}>
              <MenuItem component={Link} to="/profile" sx={{ color: '#136c13' }}>
                Profile
              </MenuItem>
              <MenuItem component={Link} to="/settings" sx={{ color: '#136c13' }}>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: '#136c13' }}>
                Logout
              </MenuItem>
            </Menu>
          </Dropdown>
        ) : (
          <Button
            endDecorator={<LoginIcon />}
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
            </div>
            <CartDrawer />
          </Toolbar>
        </Container>
        <Drawer
          open={drawerOpen}
          onClose={handleDrawerToggle}
          anchor="left"
          size="sm"
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <Box sx={{ width: 250, p: 2 }}>
            <MegaMenu />
          </Box>
        </Drawer>
      </Sheet>
    );
  };

  export default Navbar;
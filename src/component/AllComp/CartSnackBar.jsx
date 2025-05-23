
import React from 'react';
import Snackbar from '@mui/joy/Snackbar';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import { useTheme } from '@mui/joy/styles';

// Import icons (assuming these are from @mui/icons-material)
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import LeafIcon from '@mui/icons-material/Spa'; // Using Spa as a leaf equivalent
import LoginIcon from '@mui/icons-material/Login';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

const CartSnackbar = ({ open, message, onClose, severity = "success" }) => {
  const theme = useTheme();
  const isSignInMessage = message && message.toLowerCase().includes('sign in');

  // Get the appropriate icon based on severity
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <PlaylistAddCheckCircleRoundedIcon />;
      case 'error':
        return <ErrorOutlineRoundedIcon />;
      case 'warning':
        return <WarningAmberRoundedIcon />;
      case 'info':
        return <InfoOutlinedIcon />;
      default:
        return <PlaylistAddCheckCircleRoundedIcon />;
    }
  };

  // For standard messages with decorators
  if (!isSignInMessage) {
    return (
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={onClose}
        color={severity}
        variant="soft"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        startDecorator={getIcon()}
        endDecorator={
          <Button
            onClick={onClose}
            size="sm"
            variant="soft"
            color={severity}
          >
            Dismiss
          </Button>
        }
      >
        {message}
      </Snackbar>
    );
  }

  // For sign in messages - custom styled snackbar
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      color="success"
      variant="soft"
      size="md"
      sx={{
        maxWidth: '320px',
        // background: `linear-gradient(45deg, ${theme.palette.success[800]} 30%, ${theme.palette.success[600]} 90%)`,
        borderRadius: 'md',
        boxShadow: 'md',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ mr: 2 }}>
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              p: 1,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="/Untitled.png" width='50px' />
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            level="title-sm"
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* <span>Plant Lover</span> */}
            <Box
              component="span"
              sx={{
                height: '4px',
                width: '4px',
                bgcolor: 'white',
                borderRadius: '50%',
                mx: 1,
              }}
            />
            {/* <Typography level="title-sm" sx={{ color: 'success.100' }}>
              Bloombox
            </Typography> */}
          </Typography>
          <Typography level="body-md" textAlign={'left'} fontFamily='League Spartan' fontWeight='700' sx={{ color: 'black'}}>
            {message}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              size="sm"
              variant="solid"
              color="success"
              sx={{
                bgcolor: 'white',
                color: 'success.700',
                '&:hover': { bgcolor: 'success.50' },
                fontSize: 'xs',
                borderRadius: 'xl',
              }}
              startDecorator={<LoginIcon fontSize="inherit" />}
              onClick={onClose}
              component={Link}
              to='/login'
            >
              Sign In
            </Button>
            <Button
              size="sm"
              variant="outlined"
              color="success"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                // color: 'white',
                fontSize: 'xs',
                borderRadius: 'xl',
              }}
              endDecorator={<ArrowForwardIcon fontSize="inherit" />}
              onClick={onClose}
            >
              Maybe Later
            </Button>
          </Stack>
        </Box>
      </Box>
    </Snackbar>
  );
};

export default CartSnackbar;
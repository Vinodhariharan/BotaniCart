// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FCF8E8', // Material-UI primary color
    },
    secondary: {
      main: '#0A4938', // Material-UI secondary color
    },
    background: {
        default: '#f5f5f5', // Default background color
        paper: '#fff', // Background color for paper elements (e.g., cards)
      },
      text: {
        primary: '#333', // Primary text color
        secondary: '#666', // Secondary text color
      },
      error: {
        main: '#f44336', // Main color for error elements
        contrastText: '#fff', // Text color on error background
      },
      success: {
        main: '#4caf50', // Main color for success elements
        contrastText: '#fff', // Text color on success background
      },
  },
  typography: {
    fontFamily: 'League Spartan, sans-serif',
    fontSize: 16, 
  },
  // Add more customizations as needed
});

export default theme;

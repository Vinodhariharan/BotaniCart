import React, { createContext, useContext, useState, useEffect } from 'react';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

// Create theme context
const ThemeContext = createContext();

// Custom theme colors for BotaniCart
const botanicartColors = {
  // Light theme colors
  light: {
    primary: {
      50: '#e8f5e9',
      100: '#c8e6c9',
      200: '#a5d6a7',
      300: '#81c784',
      400: '#66bb6a',
      500: '#4caf50', // Primary main
      600: '#43a047',
      700: '#388e3c',
      800: '#2e7d32',
      900: '#1b5e20',
    },
    secondary: {
      50: '#f1f8e9',
      100: '#dcedc8',
      200: '#c5e1a5',
      300: '#aed581',
      400: '#9ccc65',
      500: '#8bc34a', // Secondary main
      600: '#7cb342',
      700: '#689f38',
      800: '#558b2f',
      900: '#33691e',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    success: {
      50: '#e8f5e9',
      100: '#c8e6c9',
      200: '#a5d6a7',
      300: '#81c784',
      400: '#66bb6a',
      500: '#4caf50',
      600: '#43a047',
      700: '#388e3c',
      800: '#2e7d32',
      900: '#1b5e20',
    },
  },
  // Dark theme colors
  dark: {
    primary: {
      50: '#1b5e20',
      100: '#2e7d32',
      200: '#388e3c',
      300: '#43a047',
      400: '#4caf50',
      500: '#66bb6a', // Primary main for dark mode
      600: '#81c784',
      700: '#a5d6a7',
      800: '#c8e6c9',
      900: '#e8f5e9',
    },
    secondary: {
      50: '#33691e',
      100: '#558b2f',
      200: '#689f38',
      300: '#7cb342',
      400: '#8bc34a',
      500: '#9ccc65', // Secondary main for dark mode
      600: '#aed581',
      700: '#c5e1a5',
      800: '#dcedc8',
      900: '#f1f8e9',
    },
    neutral: {
      50: '#212121',
      100: '#424242',
      200: '#616161',
      300: '#757575',
      400: '#9e9e9e',
      500: '#bdbdbd',
      600: '#e0e0e0',
      700: '#eeeeee',
      800: '#f5f5f5',
      900: '#fafafa',
    },
    success: {
      50: '#1b5e20',
      100: '#2e7d32',
      200: '#388e3c',
      300: '#43a047',
      400: '#4caf50',
      500: '#66bb6a',
      600: '#81c784',
      700: '#a5d6a7',
      800: '#c8e6c9',
      900: '#e8f5e9',
    },
  }
};

// Create light theme with BotaniCart colors
const lightTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          ...botanicartColors.light.primary,
          solidBg: botanicartColors.light.primary[500],
          solidHoverBg: botanicartColors.light.primary[600],
          solidActiveBg: botanicartColors.light.primary[700],
        },
        secondary: {
          ...botanicartColors.light.secondary,
          solidBg: botanicartColors.light.secondary[500],
          solidHoverBg: botanicartColors.light.secondary[600],
          solidActiveBg: botanicartColors.light.secondary[700],
        },
        neutral: botanicartColors.light.neutral,
        success: botanicartColors.light.success,
        background: {
          body: '#f9fbf6', // Light green tinted background
          surface: '#ffffff',
          popup: '#ffffff',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          ...botanicartColors.dark.primary,
          solidBg: botanicartColors.dark.primary[500],
          solidHoverBg: botanicartColors.dark.primary[400],
          solidActiveBg: botanicartColors.dark.primary[300],
        },
        secondary: {
          ...botanicartColors.dark.secondary,
          solidBg: botanicartColors.dark.secondary[500],
          solidHoverBg: botanicartColors.dark.secondary[400],
          solidActiveBg: botanicartColors.dark.secondary[300],
        },
        neutral: botanicartColors.dark.neutral,
        success: botanicartColors.dark.success,
        background: {
          body: '#121212', // Dark background
          surface: '#1e1e1e',
          popup: '#252525',
        },
      },
    },
  },
  typography: {
    // Add this function that Material UI components expect
    pxToRem: (size) => `${size / 16}rem`,
  },
  fontFamily: {
    body: "'Nunito', sans-serif",
    display: "'Nunito', sans-serif",
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '8px',
          fontWeight: 600,
        }),
      },
    },
    JoyCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '12px',
          boxShadow: theme.vars.shadow.sm,
        }),
      },
    },
  },
});

export const ThemeProvider = ({ children }) => {
  // Get preferred color scheme from localStorage or system preference
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('botanicartThemeMode');
    if (savedMode) {
      return savedMode;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [mode, setMode] = useState(getInitialMode);

  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('botanicartThemeMode', mode);
  }, [mode]);

  // Function to toggle theme
  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <CssVarsProvider theme={lightTheme} defaultMode={mode}>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

export default ThemeProvider;
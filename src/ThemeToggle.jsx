import React from 'react';
import IconButton from '@mui/joy/IconButton';
import { useThemeContext } from './ThemeProvider';
import { useColorScheme } from '@mui/joy/styles';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import Tooltip from '@mui/joy/Tooltip';

const ThemeToggle = ({ sx = {} }) => {
  const { toggleTheme } = useThemeContext();
  const { mode } = useColorScheme();

  return (
    <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'} placement="bottom">
      <IconButton
        variant="outlined"
        color="neutral"
        onClick={toggleTheme}
        sx={{
          borderRadius: '50%',
          ...sx
        }}
      >
        {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
import React, { createContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

export const SnackbarContext = createContext();

const SnackbarProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // success | error | info | warning
  const [open, setOpen] = useState(false);

  const showSnackbar = useCallback((msg, type = 'success') => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  }, []);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setMessage('');
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;

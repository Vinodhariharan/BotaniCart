import { useContext } from 'react';
import { SnackbarContext } from './SnackbarProvider';

export const useGlobalSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useGlobalSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

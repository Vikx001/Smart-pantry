// src/theme/index.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#388e3c' },
    secondary: { main: '#d32f2f' },
    background: {
      default: '#f4f4f4',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif'
  }
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#388e3c' },
    secondary: { main: '#d32f2f' }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif'
  }
});

// src/theme/pastelTheme.js
import { createTheme } from '@mui/material/styles';

// More vibrant pastel palette
const primaryMain = '#B5EAD7'; // minty pastel green
const secondaryMain = '#FAD2E1'; // soft pastel pink

export const pastelTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: primaryMain },
    secondary: { main: secondaryMain },
    // optional expansions:
    tertiary: { main: '#E2F0CB' },
    quaternary: { main: '#C7CEEA' },

    background: {
      default: '#FFFDFC', // A near-white pastel tone
      paper: '#FFFFFF'
    },
    text: {
      primary: '#333333',
      secondary: '#555555'
    }
  },
  typography: {
    fontFamily: `'Poppins', sans-serif`,
    h4: {
      fontWeight: 700,
      letterSpacing: '0.6px'
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0.4px'
    },
    button: {
      textTransform: 'none'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          fontWeight: 500,
          // Subtle gradient background for buttons (optional)
          background: `linear-gradient(135deg, ${primaryMain} 0%, ${secondaryMain} 100%)`,
          color: '#333333',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            // Keep the gradient but darken slightly or shift
            background: `linear-gradient(135deg, ${primaryMain} 0%, ${secondaryMain} 100%)`,
            filter: 'brightness(0.95)'
          }
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          paddingTop: '2rem',
          paddingBottom: '2rem',
          // Optional subtle gradient for Container background
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(4px)' // a glassy effect if desired
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '48px'
        },
        indicator: {
          backgroundColor: primaryMain
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          minWidth: '100px',
          letterSpacing: '0.3px'
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#333',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(2px)'
        },
        arrow: {
          color: 'rgba(255, 255, 255, 0.9)'
        }
      }
    }
  }
});

// A more interesting background with pastel color stops
export const PastelBackgroundStyle = {
  minHeight: '100vh',
  background: `
    radial-gradient(circle at 20% 20%, #fbcce7 0%, rgba(255,255,255,0) 40%), 
    radial-gradient(circle at 80% 30%, #cce3f2 0%, rgba(255,255,255,0) 40%), 
    radial-gradient(circle at 50% 80%, #e2f0cb 0%, rgba(255,255,255,0) 40%), 
    #FFFDFC
  `
};

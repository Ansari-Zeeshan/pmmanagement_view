import { createTheme } from '@mui/material';

export const emaarTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#eff6ff',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1e3a8a',
      light: '#3b82f6',
      dark: '#0f172a',
      contrastText: '#ffffff',
    },
    success: {
      main: '#16a34a',
      light: '#f0fdf4',
      dark: '#15803d',
    },
    warning: {
      main: '#d97706',
      light: '#fffbeb',
      dark: '#b45309',
    },
    error: {
      main: '#dc2626',
      light: '#fef2f2',
      dark: '#b91c1c',
    },
    info: {
      main: '#0284c7',
      light: '#f0fdf4',
      dark: '#0369a1',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: [
      "'Heebo'",
      'sans-serif',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
    ].join(','),
    h1: { fontWeight: 700, fontSize: '2rem' },
    h2: { fontWeight: 700, fontSize: '1.5rem' },
    h3: { fontWeight: 700, fontSize: '1.25rem' },
    h4: { fontWeight: 600, fontSize: '1.1rem' },
    h5: { fontWeight: 600, fontSize: '1rem' },
    h6: { fontWeight: 600, fontSize: '0.9375rem' },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' },
    body1: { fontSize: '0.9375rem', color: '#0f172a' },
    body2: { fontSize: '0.84rem', color: '#64748b' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '12px !important',
          fontWeight: '400 !important',
        },
        select: {
          fontSize: '12px !important',
          fontWeight: '400 !important',
        },
        icon: {
          fontSize: '20px !important',
          color: '#64748b',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '12px !important',
          fontWeight: '400 !important',
          minHeight: '32px',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15)',
        },
        list: {
          padding: '4px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '12px !important',
          fontWeight: '400 !important',
        },
        input: {
          fontSize: '12px !important',
          fontWeight: '400 !important',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '12px !important',
          fontWeight: '400 !important',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563eb',
          },
        },
        input: {
          fontSize: '12px !important',
          fontWeight: '400 !important',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '12px !important',
          border: '1px solid #e2e8f0',
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: 8,
          fontSize: '12px !important',
          fontWeight: 500,
          padding: '8px 12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '13px !important',
          fontWeight: 500,
          marginTop: '4px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: '13px !important',
        },
        message: {
          fontSize: '13px !important',
          fontWeight: 500,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          overflowY: 'auto !important',
          minHeight: '100%',
        },
        body: {
          overflowY: 'auto !important',
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
        },
        '#root': {
          minHeight: '100vh',
          overflowY: 'auto !important',
        },
        '.manage_view': {
          overflow: 'visible !important',
          overflowY: 'auto !important',
          minHeight: '100vh',
        },
        'select, option, input, textarea, .MuiInputBase-input, .MuiOutlinedInput-input, .MuiSelect-select, .MuiMenuItem-root, .MuiMenu-list, .dropdown-menu, .dropdown-item, .form-select, .select-box, .dropdown-select, .dropdown-option, .MuiInputBase-root, .MuiOutlinedInput-root, .MuiNativeSelect-select': {
          fontFamily: "'Heebo', sans-serif !important",
          fontSize: '12px !important',
          fontWeight: '400 !important',
        },
        '.MuiFormHelperText-root, .MuiAlert-message, .invalid-feedback, .error-text, .text-danger': {
          fontSize: '13px !important',
        },
        '.css-hwik7p-MuiTypography-root': {
          fontSize: '2rem !important',
        },
        '.css-6kmp60-MuiTypography-root': {
          fontSize: '1.2rem !important',
        },
        '.css-1fkd7on': {
          gap: '1rem !important',
        },
        '.css-otyf9a-MuiTypography-root': {
          fontSize: '14px !important',
        },
        '.css-oclf15-MuiSvgIcon-root': {
          fontSize: '16px !important',
        },
        '.css-120dh41-MuiSvgIcon-root': {
          fontSize: '18px !important',
        },
        'input[type="date"]::-webkit-calendar-picker-indicator': {
          display: 'none !important',
          '-webkit-appearance': 'none !important',
        },
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: '#f1f5f9',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#94a3b8',
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: '#64748b',
        },
      },
    },
  },
});

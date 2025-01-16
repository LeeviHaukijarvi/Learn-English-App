import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#000000'
        },
        secondary: {
            main: '#38b38e',
        },

    },

    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
            fontSize: '3rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '1rem',
            fontWeight: 500,
        }

    },

    components: {
        MuiButton: {
            defaultProps: {
                variant: 'contained',
                color: 'secondary',
                size: 'medium',
            },
            styleOverrides: {
                root: {
                    color: 'black',
                },
            },
        },

    },
});

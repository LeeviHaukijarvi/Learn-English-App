import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#00000'
        },
        secondary: {
            main: '#38b38e',
        },
    },

    typography: {
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

    },

    components: {
        MuiButton: {
            defaultProps: {
                variant: 'contained', // Set the default variant for all buttons
                color: 'secondary', // Set the default color for all buttons
                size: 'medium',
            },
            styleOverrides: {
                root: {
                    color: 'black', // Set the default text color for all buttons
                },
            },
        },
    },
});

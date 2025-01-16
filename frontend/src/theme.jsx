import { createTheme } from '@mui/material';

/**
 * Creates a custom theme for the application using Material-UI's `createTheme` function.
 *
 * The theme includes:
 * - A palette with primary and secondary colors.
 * - Typography settings for various heading levels.
 * - Component overrides for Material-UI's Button component.
 *
 * Palette:
 * - Primary color: Black (#000000)
 * - Secondary color: Green (#38b38e)
 *
 * @returns {object} The custom theme object.
 */
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

import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';

/**
 * Initializes the root of the React application by creating a root container.
 * The App component is wrapped in a ThemeProvider to add the custom theme
 * found in theme.jsx.
 */
const root = createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>

);
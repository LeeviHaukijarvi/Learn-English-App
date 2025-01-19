/**
 * The main App component that sets up the application.
 * It includes the Router for navigation, AuthProvider for authentication context,
 * and AppRoutes for defining the application's routes.
 *
 * @component
 * @returns {JSX.Element} The rendered App component.
 */
import { BrowserRouter as Router} from 'react-router-dom';
import { Container } from '@mui/material';
import AuthProvider from './AuthProvider';
import { AppRoutes } from './routes/AppRoutes';

function App() {
    return (
        <Container>
            <div className="App">
                <Router>
                    <AuthProvider>
                        <AppRoutes />
                    </AuthProvider>
                </Router>
            </div>
        </Container>
    );
}


export default App;
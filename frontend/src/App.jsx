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
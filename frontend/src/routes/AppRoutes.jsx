import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Root from './Root';
import Learn from '../Learn';
import Login from '../Login';
import ParentControl from '../ParentControl';
import PrivateRoute from './privateRoute';
import Register from '../Register';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Root />}>
                <Route index element={<Learn />} />
                <Route path="login" element={<Login />} />
                <Route path="parent-control" element={<PrivateRoute />}>
                    <Route index element={<ParentControl />} />
                </Route>
                <Route path="learn" element={<Learn />} />
                <Route path="*" element={<h1>404 error: Not Found</h1>} />
                <Route path="register" element={<Register />} />
            </Route>
        </Routes>
    );
};


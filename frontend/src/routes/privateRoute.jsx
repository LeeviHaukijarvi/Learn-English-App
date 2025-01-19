/**
 * PrivateRoute component that restricts access to routes based on authentication.
 *
 * This component checks if the user is authenticated by verifying the presence of a token.
 * If the token is not present, it redirects the user to the login page.
 * If the token is present, it renders the child components using the Outlet component.
 *
 * @component
 * @returns {JSX.Element} - The rendered component.
 */
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const PrivateRoute = () => {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login" />;
    return <Outlet />;
};

export default PrivateRoute;
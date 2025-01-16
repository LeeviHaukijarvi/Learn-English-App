/**
 * AuthContext provides authentication state and actions.
 * @typedef {Object} AuthContext
 * @property {string} token - The authentication token.
 * @property {Object|null} user - The authenticated user object.
 * @property {Function} loginAction - Function to log in a user.
 * @property {Function} logOut - Function to log out the user.
 */

import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook to use the AuthContext.
 * @returns {AuthContext} The authentication context.
 */

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};
/**
 * AuthProvider component that provides authentication state and actions to its children.
 * If the user is authenticated, it sets the user and token in the context.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The AuthProvider component.
 */
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();
    const loginAction = async (data) => {
        try {
            const response = await fetch("/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const res = await response.json();

            if (res.token) {
                setUser(res.user);
                setToken(res.token);
                localStorage.setItem("site", res.token);
                navigate("/parent-control");
                return;
            }

            throw new Error("User does not exist");

        } catch (err) {
            alert(err.message);
            console.error(err);
        }
    };
    /**
     * @function logOut
     * Removes the token from the local storage and navigates to the login page.
     */
    const logOut = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("site");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};



export default AuthProvider;
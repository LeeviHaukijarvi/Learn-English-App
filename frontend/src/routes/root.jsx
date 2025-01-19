/**
 * Root component that handles the main navigation and routing for the application.
 *
 * This component uses the `useAuth` hook to determine if the user is authenticated.
 * If the user is authenticated, it displays navigation links for "Learn" and "Parent Control",
 * along with a "Log out" button. If the user is not authenticated, it displays navigation links
 * for "Learn", "Login", and "Register".
 *
 *
 * @returns {JSX.Element} The rendered Root component.
 */
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import "../stylesheets/Root.css";
import Button from "@mui/material/Button";

export default function Root() {
    const auth = useAuth();

    if (auth.token) {
        return (
            <>
                <div id="Router">
                    <nav>
                        <ul>
                            <li>
                                <Link to={`/learn`}>Learn</Link>
                            </li>
                            <li>
                                <Link to={`/parent-control`}>Parent Control</Link>
                            </li>
                        </ul>
                        <Button
                            sx={{ ml: 2 }}
                            color="secondary"
                            variant="outlined"
                            onClick={auth.logOut}>Log out
                        </Button>
                    </nav>
                </div>
                <div id="detail">
                    <Outlet />
                </div>
            </>
        );
    }

    return (
        <>
            <div id="Router">
                <nav>
                    <ul>
                        <li>
                            <Link to={`/learn`}>Learn</Link>
                        </li>
                        <li>
                            <Link to={`/login`}>Login</Link>
                        </li>
                        <li>
                            <Link to={`/register`}>Register</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div id="detail">
                <Outlet />
            </div>
        </>
    );
}

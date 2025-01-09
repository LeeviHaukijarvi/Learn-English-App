import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider";

export default function Root() {
    const auth = useAuth();

    if (auth.token) {
        return (
            <>
                <div id="Router">
                    <nav>
                        <ul>
                            <li>
                                <Link to={`/parent-control`}>Parent Control</Link>
                            </li>
                            <li>
                                <Link to={`/learn`}>Learn</Link>
                            </li>
                            <li>
                                <button
                                    onClick={auth.logOut}>Logout
                                </button>
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

import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Root() {
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
                    </ul>
                </nav>
            </div>
            <div id="detail">
                <Outlet />
            </div>
        </>
    );
}

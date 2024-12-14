import { Outlet } from "react-router-dom";

export default function Root() {
    return (
        <>
            <div id="Router">
                <nav>
                    <ul>
                        <li>
                            <a href={`/parent-control`}>Parent Controls</a>
                        </li>
                        <li>
                            <a href={`/Learn`}>Learn</a>
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

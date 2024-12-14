import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Root from "./routes/root";
import Learn from "./Learn";
import ParentControl from "./ParentControl";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Learn />,
      },
      {
        path: "/Learn",
        element: <Learn />,
      },
      {
        path: "parent-control",
        element: <ParentControl />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

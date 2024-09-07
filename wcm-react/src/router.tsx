import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import Cloth from "./pages/Cloth/Cloth";
import Color from "./pages/Color/Color";
import Users from "./pages/Users/Users";
import Contact from "./pages/Contact/Contact";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/user",
                element: <Users />,
            },
            {
                path: "/cloth",
                element: <Cloth />,
            },
            {
                path: "/color",
                element: <Color />,
            },
            {
                path:"/contact",
                element:<Contact />
            }
        ],
    },
]);

export default router;

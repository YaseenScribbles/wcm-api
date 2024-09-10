import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import Cloth from "./pages/Cloth/Cloth";
import Color from "./pages/Color/Color";
import Users from "./pages/Users/Users";
import Contact from "./pages/Contact/Contact";
import Receipt from "./pages/Receipt/Receipt";
import Sale from "./pages/Sales/Sale";
import Stock from "./pages/Stock/Stock";

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
            },
            {
                path:"/receipt",
                element:<Receipt />
            },
            {
                path:"/sale",
                element: <Sale />
            },
            {
                path:"/stock",
                element: <Stock />
            }
        ],
    },
]);

export default router;

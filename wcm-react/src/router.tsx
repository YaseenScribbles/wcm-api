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
import SaleInvoice from "./pages/Sales/SaleInvoice";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import FourNotThree from "./pages/Error/403";

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
                path: "/dashboard",
                element: (
                    <PrivateRoute menu="DASHBOARD" element={<Dashboard />} />
                ),
            },
            {
                path: "/user",
                element: <PrivateRoute menu="USER" element={<Users />} />,
            },
            {
                path: "/cloth",
                element: <PrivateRoute menu="CLOTH" element={<Cloth />} />,
            },
            {
                path: "/color",
                element: <PrivateRoute menu="COLOR" element={<Color />} />,
            },
            {
                path: "/contact",
                element: <PrivateRoute menu="CONTACT" element={<Contact />} />,
            },
            {
                path: "/receipt",
                element: <PrivateRoute menu="RECEIPT" element={<Receipt />} />,
            },
            {
                path: "/sale",
                element: <PrivateRoute menu="SALE" element={<Sale />} />,
            },
            {
                path: "/stock",
                element: <PrivateRoute menu="STOCK" element={<Stock />} />,
            },
            {
                path: "/403",
                element: <FourNotThree />,
            },
        ],
    },
    {
        path: "/sale/:id",
        element: <SaleInvoice />,
    },
]);

export default router;

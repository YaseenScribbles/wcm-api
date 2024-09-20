import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { API_URL } from "../assets/common";
import { useNotification } from "../contexts/NotificationContext";

type PrivateRouteProps = {
    element: ReactNode;
    menu: string;
};

type Menu = {
    id: number;
    name: string;
};

// A function that takes a role and returns a component
const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, menu }) => {
    const [loading, setLoading] = useState(true); // Loading state
    const { user, menus, setMenus } = useUserContext();
    const { addNotification } = useNotification();

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const { data } = await axios.get(`${API_URL}menus/${user!.id}`);
                const menus = data.user_menus.map((menu: Menu) =>
                    menu.name.toUpperCase()
                );
                setMenus(menus);
            } catch (error: any) {
                const {
                    response: {
                        data: { message },
                    },
                } = error;
                addNotification({
                    message,
                    type: "failure",
                });
            } finally {
                setLoading(false);
            }
        };
        if (menus.length > 0) return;
        fetchMenus();
    }, []);

    if (loading && menus.length === 0)
        return (
            <div
                style={{ height: `calc(100dvh - 58px)`, width: "100dvw" }}
                className="d-flex justify-content-center align-items-center"
            >
                <box-icon name="loader" animation="spin" size="lg"></box-icon>
            </div>
        );

    // Check if the user's role is in the allowed roles for this route
    return menus.includes(menu.toUpperCase()) ? (
        element
    ) : (
        <Navigate to="/405" />
    );
};

export default PrivateRoute;

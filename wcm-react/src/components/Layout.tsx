import { ToastContainer, Toast } from "react-bootstrap";
import MyNavbar from "./MyNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import { useUserContext } from "../contexts/UserContext";
import { useEffect } from "react";

const Layout = () => {
    const { notifications } = useNotification();
    const { user } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);

    return (
        <>
            <MyNavbar />
            <div
                aria-live="polite"
                aria-atomic="true"
                className="bg-dark position-relative"
            >
                <ToastContainer
                    className="p-3"
                    position={"top-end"}
                    style={{ zIndex: 1 }}
                >
                    {notifications.length > 0 &&
                        notifications.map((notification, index) => {
                            return (
                                <Toast key={index} bg={"dark"}>
                                    <Toast.Header closeButton={false}>
                                        <strong className="me-auto">WCM</strong>
                                    </Toast.Header>
                                    <Toast.Body>
                                        <span className="text-light">
                                            {notification.message.toUpperCase()}
                                        </span>
                                    </Toast.Body>
                                </Toast>
                            );
                        })}
                </ToastContainer>
            </div>
            <Outlet />
        </>
    );
};

export default Layout;

import { ToastContainer, Toast } from "react-bootstrap";
import MyNavbar from "./MyNavbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import { useUserContext } from "../contexts/UserContext";
import { useEffect } from "react";

const Layout = () => {
    const { notifications } = useNotification();
    const { user } = useUserContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            if (location.pathname === "/") {
                navigate("/dashboard");
            }
        }
    }, [user]);

    // if (loading) {
    //     return (
    //         <div
    //             style={{ height: "100dvh", width: "100dvw" }}
    //             className="d-flex justify-content-center align-items-center"
    //         >
    //             <box-icon name="loader" animation="spin" size="lg"></box-icon>
    //         </div>
    //     );
    // }

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
                    style={{ zIndex: 3000 }}
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

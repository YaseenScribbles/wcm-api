import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import wcm_bg from "../../assets/wcm_background.png";
import axios from "axios";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";

type User = {
    email: string;
    password: string;
};

type Menu = {
    name: string;
    edit: string;
    delete: string;
};

const Login = () => {
    const { user, setUser, setMenus } = useUserContext();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<User>({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const { addNotification, notifications } = useNotification();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);

    const login = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}login`, userInfo, {
                headers: {
                    Accept: "application/json",
                },
            });
            const { message, user, user_menus } = response.data;
            setUser({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            });

            const menus = user_menus.map((menu: Menu) => ({
                name: menu.name,
                edit: menu.edit == "1" ? true : false,
                delete: menu.delete == "1" ? true : false,
            }));
            setMenus(menus);

            addNotification({
                message,
                type: "success",
            });
            navigate("/dashboard");
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

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                height: "100dvh",
                width: "100dvw",
                backgroundImage: `url(${wcm_bg})`,
                backgroundPosition: "center",
                backgroundColor: "#140317",
            }}
        >
            <div
                className="glass-card d-flex flex-column justify-content-center align-items-center p-xl-4 p-xxl-5 rounded"
                style={{ width: "20dvw", height: "50dvh" }}
            >
                <div className="loader w-100 text-end" style={{ height: 25 }}>
                    {loading && (
                        <i
                            // color="white"
                            // name="loader"
                            // animation="spin"
                            className="bx bx-loader bx-spin fs-4 text-white"
                        ></i>
                    )}
                </div>
                <div className="app-title mb-3 text-light">W C M</div>
                <div className="login-form w-100 mt-xl-5">
                    <Form.Control
                        className="mb-3"
                        type="email"
                        value={userInfo.email}
                        placeholder="Email"
                        onChange={(e) =>
                            setUserInfo((p) => ({
                                ...p,
                                email: e.target.value,
                            }))
                        }
                        required
                    />
                    <Form.Control
                        className="mb-3"
                        type="password"
                        placeholder="Password"
                        value={userInfo.password}
                        onChange={(e) =>
                            setUserInfo((p) => ({
                                ...p,
                                password: e.target.value,
                            }))
                        }
                        required
                    />
                    <Button
                        variant="secondary"
                        className="w-100 mb-2"
                        onClick={login}
                        disabled={loading}
                    >
                        Log In
                    </Button>
                    <p
                        className="error-msg text-center text-warning w-100 nowrap"
                        style={{ height: 20 }}
                        role="alert"
                    >
                        {`${notifications.length > 0 ? notifications[0].message.toUpperCase() : ""}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

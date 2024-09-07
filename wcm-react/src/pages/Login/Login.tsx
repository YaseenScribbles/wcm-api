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

const Login = () => {
    const { user, setUser } = useUserContext();
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
            const { message, user } = response.data;
            setUser({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            });
            addNotification({
                message,
                type: "success",
            });
            navigate("/");
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
                className="glass-card d-flex flex-column justify-content-center align-items-center p-4 rounded"
                style={{ width: "20%", height: "45%" }}
            >
                {loading && (
                    <div className="loader w-100 text-end">
                        <box-icon
                            color="white"
                            name="loader"
                            animation="spin"
                        ></box-icon>
                    </div>
                )}
                <div className="app-title mb-3 text-light">W C M</div>
                <div className="login-form w-75 mt-5">
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
                    <Button variant="dark" className="w-100 mb-3" onClick={login}>
                        Log In
                    </Button>
                    {notifications.length > 0 && (
                        <p className="error-msg text-light w-100 nowrap" role="alert">
                            {notifications[0].message.toUpperCase()}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;

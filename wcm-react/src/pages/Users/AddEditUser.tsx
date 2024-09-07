import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormLabel, Modal, Form, Button, FormSelect } from "react-bootstrap";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";
import { useUserContext } from "../../contexts/UserContext";

type AddEditUserProps = {
    show: boolean;
    edit: boolean;
    onClose: () => void;
    editId?: number;
    onSave: () => void;
};

type User = {
    name: string;
    email: string;
    role: string;
    active: boolean;
    user_id: number;
    password?: string;
    password_confirmation?: string;
};

const AddEditUser: React.FC<AddEditUserProps> = ({
    edit,
    onClose,
    onSave,
    show,
    editId,
}) => {
    const { user: admin } = useUserContext();
    const [user, setUser] = useState<User>({
        name: "",
        email: "",
        role: "",
        active: true,
        user_id: admin!.id,
    });
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();

    const addUser = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${API_URL}user`, user, {
                headers: {
                    Accept: "application/json",
                },
            });
            setUser({
                name: "",
                email: "",
                role: "",
                active: true,
                user_id: admin!.id,
            });
            addNotification({
                message: data.message,
                type: "success",
            });
            onSave();
            onClose();
        } catch (error: any) {
            const {
                response: {
                    data: { message },
                },
            } = error;
            addNotification({
                message: message,
                type: "failure",
            });
        } finally {
            setLoading(false);
        }
    };

    const getUser = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}user/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { user } = response.data;
            setUser({
                name: user.name,
                email: user.email,
                role: user.role,
                active: user.active == 1 ? true : false,
                user_id: admin!.id,
            });
            // setUser()
        } catch (error: any) {
            const {
                response: {
                    data: { message },
                },
            } = error;
            addNotification({
                message: message,
                type: "failure",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async () => {
        try {
            setLoading(true);
            const resp = await axios.post(
                `${API_URL}user/${editId}?_method=PUT`,
                user,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const { message } = resp.data;

            setUser({
                name: "",
                email: "",
                role: "",
                active: true,
                user_id: admin!.id,
            });

            addNotification({
                message: message,
                type: "success",
            });

            onSave();
            onClose();
        } catch (error: any) {
            const {
                response: {
                    data: { message },
                },
            } = error;
            addNotification({
                message: message,
                type: "failure",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (edit) {
            getUser(editId!);
        }
    }, [edit]);

    return (
        <Modal
            show={show}
            keyboard={false}
            backdrop="static"
            onHide={() => {
                setUser({
                    name: "",
                    email: "",
                    role: "",
                    active: true,
                    user_id: admin!.id,
                });
                onClose();
            }}
            centered
            size="sm"
        >
            <Modal.Header closeButton>
                <div className="h5">{edit ? "Edit User" : "Add User"}</div>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-2">
                    <FormLabel>Name</FormLabel>
                    <Form.Control
                        name="name"
                        value={user.name.toUpperCase()}
                        onChange={(e) =>
                            setUser((p) => ({
                                ...p,
                                name: e.target.value.toUpperCase(),
                            }))
                        }
                        autoFocus
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <FormLabel>Email</FormLabel>
                    <Form.Control
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={(e) =>
                            setUser((p) => ({
                                ...p,
                                email: e.target.value,
                            }))
                        }
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <FormLabel>Role</FormLabel>
                    <FormSelect
                        value={user.role}
                        onChange={(e) =>
                            setUser((p) => ({ ...p, role: e.target.value }))
                        }
                    >
                        <option value={"admin"}>ADMIN</option>
                        <option value={"user"}>USER</option>
                    </FormSelect>
                </Form.Group>
                {edit && <hr className="mb-2" />}
                <Form.Group className="mb-2">
                    <FormLabel>{edit ? "Password (Optional)" : "Password"}</FormLabel>
                    <Form.Control
                        name="password"
                        type="password"
                        value={user.password}
                        onChange={(e) =>
                            setUser((p) => ({
                                ...p,
                                password: e.target.value,
                            }))
                        }
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <FormLabel>Password Confirmation</FormLabel>
                    <Form.Control
                        name="password_confirmation"
                        type="password"
                        value={user.password_confirmation}
                        onChange={(e) =>
                            setUser((p) => ({
                                ...p,
                                password_confirmation: e.target.value,
                            }))
                        }
                    />
                </Form.Group>
                {edit && (
                    <Form.Group className="mb-2">
                        <Form.Check
                            type="switch"
                            id="active-switch"
                            label="Active"
                            checked={user.active}
                            onChange={(e) =>
                                setUser((p) => ({
                                    ...p,
                                    active: e.target.checked,
                                }))
                            }
                        />
                    </Form.Group>
                )}
            </Modal.Body>
            <Modal.Footer>
                {loading ? (
                    <box-icon name="loader-alt" animation="spin"></box-icon>
                ) : (
                    <Button
                        onClick={edit ? updateUser : addUser}
                        variant="dark"
                    >
                        {edit ? "UPDATE" : "ADD"}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default AddEditUser;

import React, { useEffect, useState } from "react";
import { useNotification } from "../../contexts/NotificationContext";
import axios from "axios";
import { API_URL } from "../../assets/common";
import { Modal, FormLabel, Button, Form } from "react-bootstrap";
import { useUserContext } from "../../contexts/UserContext";

type AddEditColorProps = {
    show: boolean;
    edit: boolean;
    onClose: () => void;
    editId?: number;
    onSave: () => void;
};

type Color = {
    name: string;
    active: boolean;
    user_id: number;
};

const AddEditColor: React.FC<AddEditColorProps> = ({
    edit,
    onClose,
    onSave,
    show,
    editId,
}) => {
    const { user } = useUserContext();
    const [color, setColor] = useState<Color>({
        name: "",
        active: true,
        user_id: user!.id,
    });
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();

    const addColor = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${API_URL}color`, color, {
                headers: {
                    Accept: "application/json",
                },
            });
            setColor({
                name: "",
                active: true,
                user_id: user!.id,
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

    const getColor = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}color/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { color } = response.data;
            setColor({
                name: color.name,
                active: color.active == 1 ? true : false,
                user_id: user!.id,
            });
            // setColor()
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

    const updateColor = async () => {
        try {
            setLoading(true);
            const resp = await axios.post(
                `${API_URL}color/${editId}?_method=PUT`,
                color,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const { message } = resp.data;

            setColor({
                name: "",
                active: true,
                user_id: user!.id,
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
            getColor(editId!);
        }
    }, [edit]);

    return (
        <Modal
            show={show}
            keyboard={false}
            backdrop="static"
            onHide={() => {
                setColor({
                    name: "",
                    active: true,
                    user_id: user!.id,
                });
                onClose();
            }}
            centered
        >
            <Modal.Header closeButton>
                <div className="h5">{edit ? "Edit Color" : "Add Color"}</div>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <FormLabel>Name</FormLabel>
                    <Form.Control
                        name="name"
                        value={color.name}
                        onChange={(e) =>
                            setColor((p) => ({
                                ...p,
                                name: e.target.value.toUpperCase(),
                            }))
                        }
                        autoFocus
                    />
                </Form.Group>
                {edit && (
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="active-switch"
                            label="Active"
                            checked={color.active}
                            onChange={(e) =>
                                setColor((p) => ({
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
                    <i
                    // name="loader-alt"
                    // animation="spin"
                    className="bx bx-loader-alt bx-spin fs-4"
                    ></i>
                ) : (
                    <Button
                        onClick={edit ? updateColor : addColor}
                        variant="dark"
                    >
                        {edit ? "UPDATE" : "ADD"}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default AddEditColor;

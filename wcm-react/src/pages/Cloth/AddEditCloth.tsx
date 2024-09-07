import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormLabel, Modal, Form, Button } from "react-bootstrap";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";
import { useUserContext } from "../../contexts/UserContext";

type AddEditClothProps = {
    show: boolean;
    edit: boolean;
    onClose: () => void;
    editId?: number;
    onSave: () => void;
};

type Cloth = {
    name: string;
    active: boolean;
    user_id: number;
};

const AddEditCloth: React.FC<AddEditClothProps> = ({
    edit,
    show,
    onClose,
    editId,
    onSave,
}) => {
    const { user } = useUserContext()
    const [cloth, setCloth] = useState<Cloth>({
        name: "",
        active: true,
        user_id: user!.id,
    });
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();

    const addCloth = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${API_URL}cloth`, cloth, {
                headers: {
                    Accept: "application/json",
                },
            });
            setCloth({
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

    const getCloth = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}cloth/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { cloth } = response.data;
            setCloth({
                name: cloth.name,
                active: cloth.active == 1 ? true : false,
                user_id: user!.id,
            });
            // setCloth()
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

    const updateCloth = async () => {
        try {
            setLoading(true);
            const resp = await axios.post(
                `${API_URL}cloth/${editId}?_method=PUT`,
                cloth,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const { message } = resp.data;

            setCloth({
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
            getCloth(editId!);
        }
    }, [edit]);

    return (
        <Modal
            show={show}
            keyboard={false}
            backdrop="static"
            onHide={() => {
                setCloth({
                    name: "",
                    active: true,
                    user_id: user!.id,
                });
                onClose();
            }}
            centered
        >
            <Modal.Header closeButton>
                <div className="h5">{edit ? "Edit Cloth" : "Add Cloth"}</div>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <FormLabel>Name</FormLabel>
                    <Form.Control
                        name="name"
                        value={cloth.name}
                        onChange={(e) =>
                            setCloth((p) => ({
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
                            checked={cloth.active}
                            onChange={(e) =>
                                setCloth((p) => ({
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
                        onClick={edit ? updateCloth : addCloth}
                        variant="dark"
                    >
                        {edit ? "UPDATE" : "ADD"}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default AddEditCloth;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormLabel, Modal, Form, Button } from "react-bootstrap";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";
import { useUserContext } from "../../contexts/UserContext";

type AddEditContactProps = {
    show: boolean;
    edit: boolean;
    onClose: () => void;
    editId?: number;
    onSave: () => void;
};

type Contact = {
    name: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
    gst: string;
    active: boolean;
    user_id: number;
};

const AddEditContact: React.FC<AddEditContactProps> = ({
    edit,
    show,
    onClose,
    editId,
    onSave,
}) => {
    const { user } = useUserContext();
    const [contact, setContact] = useState<Contact>({
        name: "",
        address: "",
        city: "",
        pincode: "",
        phone: "",
        gst: "",
        active: true,
        user_id: user!.id,
    });
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();

    const isValid = () => {
        let isValid = true;
        if (!contact.name) {
            addNotification({
                message: "Name field is required",
                type: "failure",
            });
            isValid = false;
        }
        if (contact.gst) {
            const pattern =
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
            if (!pattern.test(contact.gst)) {
                addNotification({
                    message: "Please enter valid GST",
                    type: "failure",
                });
                isValid = false;
            }
        }
        return isValid;
    };

    const addContact = async () => {
        if (!isValid()) return;

        try {
            setLoading(true);
            const { data } = await axios.post(`${API_URL}contact`, contact, {
                headers: {
                    Accept: "application/json",
                },
            });
            setContact({
                name: "",
                address: "",
                city: "",
                pincode: "",
                phone: "",
                gst: "",
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

    const getContact = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}contact/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { contact } = response.data;
            setContact({
                name: contact.name,
                address: contact.address,
                city: contact.city,
                pincode: contact.pincode,
                phone: contact.phone,
                gst: contact.gst,
                active: contact.active == 1 ? true : false,
                user_id: user!.id,
            });
            // setContact()
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

    const updateContact = async () => {
        if (!isValid()) return;
        try {
            setLoading(true);
            const resp = await axios.post(
                `${API_URL}contact/${editId}?_method=PUT`,
                contact,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const { message } = resp.data;

            setContact({
                name: "",
                address: "",
                city: "",
                pincode: "",
                phone: "",
                gst: "",
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
            getContact(editId!);
        }
    }, [edit]);

    return (
        <Modal
            show={show}
            keyboard={false}
            backdrop="static"
            onHide={() => {
                setContact({
                    name: "",
                    address: "",
                    city: "",
                    pincode: "",
                    phone: "",
                    gst: "",
                    active: true,
                    user_id: user!.id,
                });
                onClose();
            }}
            centered
            scrollable
        >
            <Modal.Header closeButton>
                <div className="h5">
                    {edit ? "Edit Contact" : "Add Contact"}
                </div>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-2">
                    <FormLabel>Name</FormLabel>
                    <Form.Control
                        name="name"
                        value={contact.name}
                        onChange={(e) =>
                            setContact((p) => ({
                                ...p,
                                name: e.target.value.toUpperCase(),
                            }))
                        }
                        autoFocus
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <FormLabel>Address</FormLabel>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        value={contact.address}
                        onChange={(e) =>
                            setContact((p) => ({
                                ...p,
                                address: e.target.value.toUpperCase(),
                            }))
                        }
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <FormLabel>City</FormLabel>
                    <Form.Control
                        name="city"
                        value={contact.city}
                        onChange={(e) =>
                            setContact((p) => ({
                                ...p,
                                city: e.target.value.toUpperCase(),
                            }))
                        }
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <FormLabel>Pincode</FormLabel>
                    <Form.Control
                        name="pincode"
                        value={contact.pincode}
                        onChange={(e) =>
                            setContact((p) => ({
                                ...p,
                                pincode: e.target.value.toUpperCase(),
                            }))
                        }
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <FormLabel>Phone</FormLabel>
                    <Form.Control
                        name="phone"
                        value={contact.phone}
                        onChange={(e) =>
                            setContact((p) => ({
                                ...p,
                                phone: e.target.value.toUpperCase(),
                            }))
                        }
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <FormLabel>Gst</FormLabel>
                    <Form.Control
                        name="gst"
                        value={contact.gst}
                        onChange={(e) =>
                            setContact((p) => ({
                                ...p,
                                gst: e.target.value.toUpperCase(),
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
                            checked={contact.active}
                            onChange={(e) =>
                                setContact((p) => ({
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
                        onClick={edit ? updateContact : addContact}
                        variant="dark"
                    >
                        {edit ? "UPDATE" : "ADD"}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default AddEditContact;

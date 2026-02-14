import axios from "axios";
import { useReducer, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";

type UserRightProps = {
    show: boolean;
    userId: number;
    onHide: () => void;
};

type Right = {
    id: number;
    name: string;
    edit: boolean;
    delete: boolean;
};

type ApiRight = {
    id: number;
    name: string;
    edit: string;
    delete: string;
};

type Action =
    | { type: "LOAD RIGHTS"; payload: Right[] }
    | { type: "UPDATE_EDIT"; payload: { index: number } }
    | { type: "UPDATE_DELETE"; payload: { index: number } };

type State = {
    rights: Right[];
};

const initialState: State = {
    rights: [],
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "LOAD RIGHTS":
            return {
                ...state,
                rights: action.payload,
            };
        case "UPDATE_EDIT":
            return {
                ...state,
                rights: state.rights.map((i, index) => {
                    if (index === action.payload.index) {
                        return {
                            ...i,
                            edit: !i.edit, // Toggle the edit property
                        };
                    }
                    return i; // Return the original item if index doesn't match
                }),
            };
        case "UPDATE_DELETE":
            return {
                ...state,
                rights: state.rights.map((i, index) => {
                    if (index === action.payload.index) {
                        return {
                            ...i,
                            delete: !i.delete, // Toggle the edit property
                        };
                    }
                    return i; // Return the original item if index doesn't match
                }),
            };
        default:
            return state;
    }
};

const UserRights: React.FC<UserRightProps> = ({ userId, onHide, show }) => {
    const [state, updateState] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();

    const getRights = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `${API_URL}user-rights/${userId}`,
                { headers: { Accept: "application/json" } }
            );
            const { rights } = response.data;
            let transformedRights: Right[] = [];

            if (rights.length > 0) {
                transformedRights = rights.map((right: ApiRight) => ({
                    id: right.id,
                    name: right.name,
                    edit: right.edit == "1" ? true : false,
                    delete: right.delete == "1" ? true : false,
                }));
            }
            updateState({
                type: "LOAD RIGHTS",
                payload: transformedRights,
            });
        } catch (error: any) {
            addNotification({
                message: error.response?.data?.message || "Error fetching data",
                type: "failure",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateRights = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}user-rights`,
                {
                    user_id: userId,
                    rights: state.rights.map((i) => ({
                        menu_id: +i.id,
                        edit: i.edit,
                        delete: i.delete,
                    })),
                },
                { headers: { Accept: "application/json" } }
            );
            const { message } = response.data;
            addNotification({
                message,
                type: "success",
            });
            onHide();
        } catch (error: any) {
            addNotification({
                message: error.response?.data?.message || "Error fetching data",
                type: "failure",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            size="lg"
            backdrop="static"
            centered
            keyboard={false}
            onHide={onHide}
            onShow={getRights}
            scrollable
            show={show}
        >
            <Modal.Header closeButton>
                <Modal.Title>User Rights</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table variant="dark">
                    <thead>
                        <tr>
                            <th>Menu</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="text-center">
                                    <i
                                        // color="white"
                                        // name="loader-alt"
                                        // animation="spin"
                                        className="bx bx-loader-alt bx-spin fs-4 text-white"
                                    ></i>
                                </td>
                            </tr>
                        ) : (
                            state.rights.length > 0 &&
                            state.rights.map((right, index) => (
                                <tr key={index}>
                                    <td>{right.name}</td>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            checked={right.edit}
                                            onChange={() =>
                                                updateState({
                                                    type: "UPDATE_EDIT",
                                                    payload: { index: index },
                                                })
                                            }
                                        ></Form.Check>
                                    </td>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            checked={right.delete}
                                            onChange={() =>
                                                updateState({
                                                    type: "UPDATE_DELETE",
                                                    payload: { index: index },
                                                })
                                            }
                                        ></Form.Check>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    disabled={loading}
                    onClick={updateRights}
                    variant="dark"
                >
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserRights;

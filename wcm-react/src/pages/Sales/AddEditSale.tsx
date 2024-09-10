import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import {
    FormLabel,
    Modal,
    Form,
    Button,
    Row,
    Col,
    Table,
} from "react-bootstrap";
import { API_URL } from "../../assets/common";
import { useUserContext } from "../../contexts/UserContext";
import { AppDispatch, useTypedSelector } from "../../Redux Store/Store";
import { useDispatch } from "react-redux";
import { getContacts } from "../../Redux Store/Slices/ContactSlice";
import { getColors } from "../../Redux Store/Slices/ColorSlice";
import { getCloths } from "../../Redux Store/Slices/ClothSlice";
import { useNotification } from "../../contexts/NotificationContext";
import ReactSelect from "react-select";

type AddEditSaleProps = {
    show: boolean;
    edit: boolean;
    onClose: () => void;
    editId?: number;
    onSave: () => void;
};

type Sale = {
    ref_no: string;
    ref_date: string;
    contact_id: number | null;
    remarks: string;
    user_id: number;
};

type SaleItem = {
    cloth_id: number | null;
    color_id: number | null;
    weight: string;
};

type State = {
    items: SaleItem[];
};

const initialState: State = {
    items: [],
};

type Action =
    | { type: "ADD_ITEM"; payload: SaleItem }
    | {
          type: "UPDATE_ITEM";
          payload: {
              index: number;
              cloth_id: number | null;
              color_id: number | null;
              weight: string;
          };
      }
    | { type: "REMOVE_ITEM"; payload: { index: number } }
    | { type: "CLEAR" }
    | { type: "REMOVE_EMPTY_ROWS" };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_ITEM":
            return {
                ...state,
                items: [...state.items, action.payload],
            };
        case "UPDATE_ITEM":
            return {
                ...state,
                items: state.items.map((item, index) =>
                    index === action.payload.index
                        ? { ...item, ...action.payload }
                        : item
                ),
            };
        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter(
                    (_, index) => index !== action.payload.index
                ),
            };
        case "CLEAR":
            return {
                ...state,
                items: [],
            };
        case "REMOVE_EMPTY_ROWS":
            return {
                ...state,
                items: state.items.filter((item) => item.cloth_id !== null),
            };
        default:
            return state;
    }
};

const AddEditSales: React.FC<AddEditSaleProps> = ({
    edit,
    show,
    onClose,
    editId,
    onSave,
}) => {
    const { user } = useUserContext();
    const [sale, setSale] = useState<Sale>({
        ref_no: "",
        ref_date: new Date().toISOString().slice(0, 10),
        contact_id: null,
        remarks: "",
        user_id: user!.id,
    });
    const [state, updateState] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();
    const dispatch: AppDispatch = useDispatch();
    const { contacts } = useTypedSelector((s) => s.contacts);
    const { cloths } = useTypedSelector((s) => s.cloths);
    const { colors } = useTypedSelector((s) => s.colors);

    const isValid = () => {
        let isValid = true;
        if (!sale.ref_no) {
            addNotification({
                message: "Ref. no is required",
                type: "failure",
            });
            isValid = false;
        }
        if (!sale.ref_date) {
            addNotification({
                message: "Please select valid ref. date",
                type: "failure",
            });
            isValid = false;
        }
        if (!sale.contact_id) {
            addNotification({
                message: "Please select valid contact",
                type: "failure",
            });
            isValid = false;
        }
        if (state.items.length === 0) {
            addNotification({
                message: "Please add entries",
                type: "failure",
            });
            isValid = false;
        }

        return isValid;
    };

    const addSale = async () => {
        updateState({ type: "REMOVE_EMPTY_ROWS" });
        if (!isValid()) return;
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${API_URL}sale`,
                {
                    ...sale,
                    sale_items: state.items.filter(
                        (item) => item.cloth_id !== null
                    ),
                },
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );
            setSale({
                ref_no: "",
                ref_date: new Date().toISOString().slice(0, 10),
                contact_id: null,
                remarks: "",
                user_id: user!.id,
            });
            updateState({ type: "CLEAR" });
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

    const getSale = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}sale/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { sale } = response.data;
            setSale({
                ref_no: sale.ref_no,
                ref_date: sale.ref_date,
                contact_id: sale.contact_id,
                remarks: sale.remarks,
                user_id: user!.id,
            });
            const { sale_items } = sale;
            sale_items.forEach((item: SaleItem) => {
                updateState({
                    type: "ADD_ITEM",
                    payload: {
                        cloth_id: item.cloth_id,
                        color_id: item.color_id,
                        weight: item.weight,
                    },
                });
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

    const updateSale = async () => {
        updateState({ type: "REMOVE_EMPTY_ROWS" });
        if (!isValid()) return;
        try {
            setLoading(true);
            const resp = await axios.post(
                `${API_URL}sale/${editId}?_method=PUT`,
                {
                    ...sale,
                    sale_items: state.items.filter(
                        (item) => item.cloth_id !== null
                    ),
                },
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const { message } = resp.data;

            setSale({
                ref_no: "",
                ref_date: new Date().toISOString().slice(0, 10),
                contact_id: null,
                remarks: "",
                user_id: user!.id,
            });
            updateState({ type: "CLEAR" });
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

    const getOptions = async () => {
        try {
            setLoading(true);
            await dispatch(getContacts());
            await dispatch(getColors());
            await dispatch(getCloths());
        } catch (error: any) {
            addNotification({
                message: error,
                type: "failure",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (edit) {
            getSale(editId!);
        }
    }, [edit]);

    useEffect(() => {
        getOptions();
    }, []);

    return (
        <Modal
            show={show}
            keyboard={false}
            backdrop="static"
            onHide={() => {
                setSale({
                    ref_no: "",
                    ref_date: new Date().toISOString().slice(0, 10),
                    contact_id: null,
                    remarks: "",
                    user_id: user!.id,
                });
                updateState({ type: "CLEAR" });
                onClose();
            }}
            centered
            scrollable
            size="xl"
            contentClassName="custom-modal"
        >
            <Modal.Header closeButton>
                <div className="h5">
                    {edit ? "Edit Sale" : "Add Sale"}
                </div>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={2}>
                        <Form.Group>
                            <FormLabel>Ref. No</FormLabel>
                            <Form.Control
                                name="ref_no"
                                value={sale.ref_no}
                                onChange={(e) =>
                                    setSale((p) => ({
                                        ...p,
                                        ref_no: e.target.value.toUpperCase(),
                                    }))
                                }
                                autoFocus
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group>
                            <Form.Label>Ref. Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="ref_date"
                                value={sale.ref_date}
                                onChange={(e) =>
                                    setSale((p) => ({
                                        ...p,
                                        ref_date: e.target.value,
                                    }))
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form.Group>
                            <Form.Label>Contacts</Form.Label>
                            <ReactSelect
                                value={contacts
                                    .filter(
                                        (contact) =>
                                            contact.id == sale.contact_id
                                    )
                                    .map((contact) => ({
                                        label: contact.name.toUpperCase(),
                                        value: contact.id,
                                    }))}
                                options={contacts.map((contact) => ({
                                    label: contact.name.toUpperCase(),
                                    value: contact.id,
                                }))}
                                onChange={(e) =>
                                    setSale((p) => ({
                                        ...p,
                                        contact_id: e!.value,
                                    }))
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <Form.Group>
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control
                                name="remarks"
                                value={sale.remarks}
                                onChange={(e) =>
                                    setSale((p) => ({
                                        ...p,
                                        remarks: e.target.value.toUpperCase(),
                                    }))
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={1}>
                        <div className="d-flex align-items-end h-100 w-100">
                            <Button
                                className="w-100"
                                variant="dark"
                                onClick={() => {
                                    updateState({
                                        type: "ADD_ITEM",
                                        payload: {
                                            cloth_id: null,
                                            color_id: null,
                                            weight: "",
                                        },
                                    });
                                }}
                            >
                                <div className="d-flex justify-content-center align-items-center">
                                    <box-icon
                                        name="plus"
                                        color="white"
                                    ></box-icon>
                                </div>
                            </Button>
                        </div>
                    </Col>
                </Row>
                <hr />
                <Table hover bordered size="sm">
                    <thead>
                        <tr>
                            <th className="text-center">#</th>
                            <th>CLOTH</th>
                            <th>COLOR</th>
                            <th>WEIGHT</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.items.map((item: SaleItem, index) => (
                            <tr key={index}>
                                <td style={{ verticalAlign: "middle" }}>
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                        {index + 1}
                                    </div>
                                </td>
                                <td className="cloth-input">
                                    <div>
                                        <ReactSelect
                                            value={cloths
                                                .filter(
                                                    (cloth) =>
                                                        cloth.id ==
                                                        item.cloth_id
                                                )
                                                .map((cloth) => ({
                                                    label: cloth.name.toUpperCase(),
                                                    value: cloth.id,
                                                }))}
                                            options={cloths.map((cloth) => ({
                                                label: cloth.name.toUpperCase(),
                                                value: cloth.id,
                                            }))}
                                            onChange={(e) => {
                                                updateState({
                                                    type: "UPDATE_ITEM",
                                                    payload: {
                                                        ...item,
                                                        cloth_id: +e!.value,
                                                        index: index,
                                                    },
                                                });
                                            }}
                                        />
                                    </div>
                                </td>
                                <td className="color-input">
                                    <div>
                                        <ReactSelect
                                            value={colors
                                                .filter(
                                                    (color) =>
                                                        color.id ==
                                                        item.color_id
                                                )
                                                .map((color) => ({
                                                    label: color.name.toUpperCase(),
                                                    value: color.id,
                                                }))}
                                            isDisabled={item.cloth_id === null}
                                            options={colors.map((color) => ({
                                                label: color.name.toUpperCase(),
                                                value: color.id,
                                            }))}
                                            onChange={(e) => {
                                                updateState({
                                                    type: "UPDATE_ITEM",
                                                    payload: {
                                                        ...item,
                                                        color_id: +e!.value,
                                                        index: index,
                                                    },
                                                });
                                            }}
                                        />
                                    </div>
                                </td>
                                <td className="weight-input">
                                    <div>
                                        <Form.Control
                                            disabled={item.cloth_id === null}
                                            onChange={(e) => {
                                                updateState({
                                                    type: "UPDATE_ITEM",
                                                    payload: {
                                                        ...item,
                                                        weight: e.target.value,
                                                        index,
                                                    },
                                                });
                                            }}
                                            value={item.weight}
                                        />
                                    </div>
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                    <div className="d-flex align-items-center gap-1">
                                        <Button
                                            variant="dark"
                                            className="d-flex"
                                            onClick={() => {
                                                updateState({
                                                    type: "ADD_ITEM",
                                                    payload: {
                                                        cloth_id: null,
                                                        color_id: null,
                                                        weight: "",
                                                    },
                                                });
                                            }}
                                        >
                                            <box-icon
                                                name="plus"
                                                color="white"
                                            ></box-icon>
                                        </Button>
                                        <Button
                                            variant="dark"
                                            className="d-flex"
                                            onClick={() => {
                                                updateState({
                                                    type: "REMOVE_ITEM",
                                                    payload: {
                                                        index: index,
                                                    },
                                                });
                                            }}
                                        >
                                            <box-icon
                                                name="minus"
                                                color="white"
                                            ></box-icon>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <span className="me-auto">
                    Total Weight : &nbsp;
                    {state.items
                        .reduce((acc, item) => +item.weight + acc, 0)
                        .toFixed(2)}
                </span>
                {loading ? (
                    <box-icon name="loader-alt" animation="spin"></box-icon>
                ) : (
                    <Button
                        onClick={edit ? updateSale : addSale}
                        variant="dark"
                    >
                        {edit ? "UPDATE" : "SAVE"}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default AddEditSales;

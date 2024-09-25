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
import { getCloths } from "../../Redux Store/Slices/ClothSlice";
import { useNotification } from "../../contexts/NotificationContext";
import ReactSelect from "react-select";
import AsyncCreateSelect from "react-select/async-creatable";
import Color from "../Color/Color";
import { getColors } from "../../Redux Store/Slices/ColorSlice";

type AddEditReceiptProps = {
    show: boolean;
    edit: boolean;
    onClose: () => void;
    editId?: number;
    onSave: () => void;
};

type Receipt = {
    ref_no: string;
    ref_date: string;
    contact_id: number | null;
    remarks: string;
    user_id: number;
};

type ReceiptItem = {
    cloth_id: number | null;
    color_id: number | null;
    weight: string;
};

type State = {
    items: ReceiptItem[];
};

const initialState: State = {
    items: [],
};

type Action =
    | { type: "ADD_ITEM"; payload: ReceiptItem }
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

const AddEditReceipt: React.FC<AddEditReceiptProps> = ({
    edit,
    show,
    onClose,
    editId,
    onSave,
}) => {
    const { user } = useUserContext();
    const [receipt, setReceipt] = useState<Receipt>({
        ref_no: "",
        ref_date: new Date().toISOString().slice(0, 10),
        contact_id: null,
        remarks: "",
        user_id: user!.id,
    });
    // const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
    const [state, updateState] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();
    const dispatch: AppDispatch = useDispatch();
    const { contacts } = useTypedSelector((s) => s.contacts);
    const { cloths } = useTypedSelector((s) => s.cloths);
    const { colors } = useTypedSelector((s) => s.colors);

    const isValid = () => {
        let isValid = true;
        if (!receipt.ref_no) {
            addNotification({
                message: "Ref. no is required",
                type: "failure",
            });
            isValid = false;
        }
        if (!receipt.ref_date) {
            addNotification({
                message: "Please select valid ref. date",
                type: "failure",
            });
            isValid = false;
        }
        if (!receipt.contact_id) {
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

    const addReceipt = async () => {
        updateState({ type: "REMOVE_EMPTY_ROWS" });
        if (!isValid()) return;
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${API_URL}receipt`,
                {
                    ...receipt,
                    receipt_items: state.items.filter(
                        (item) =>
                            item.cloth_id !== null &&
                            item.color_id !== null &&
                            item.weight !== ""
                    ),
                },
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );
            setReceipt({
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
            const message = `No : ${data.id}, Date : ${new Date(
                data.date
            ).toLocaleDateString()}`;
            addNotification({
                message,
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

    const getReceipt = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}receipt/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { receipt } = response.data;
            setReceipt({
                ref_no: receipt.ref_no,
                ref_date: receipt.ref_date,
                contact_id: receipt.contact_id,
                remarks: receipt.remarks,
                user_id: user!.id,
            });
            const { receipt_items } = receipt;
            receipt_items.forEach((item: ReceiptItem) => {
                updateState({
                    type: "ADD_ITEM",
                    payload: {
                        cloth_id: item.cloth_id,
                        color_id: item.color_id,
                        weight: (+item.weight).toFixed(2),
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

    const updateReceipt = async () => {
        updateState({ type: "REMOVE_EMPTY_ROWS" });
        if (!isValid()) return;
        try {
            setLoading(true);
            const resp = await axios.post(
                `${API_URL}receipt/${editId}?_method=PUT`,
                {
                    ...receipt,
                    receipt_items: state.items.filter(
                        (item) =>
                            item.cloth_id !== null &&
                            item.color_id !== null &&
                            item.weight !== ""
                    ),
                },
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const { message } = resp.data;

            setReceipt({
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
            await dispatch(getCloths());
            await dispatch(getColors());
        } catch (error: any) {
            addNotification({
                message: error,
                type: "failure",
            });
        } finally {
            setLoading(false);
        }
    };

    const loadColors = async (input: string) => {
        const resp = await axios.get(
            `${API_URL}color?all=true&filter=${input}`,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );
        const { colors } = resp.data;
        return colors.map((item: Color) => ({
            label: item.name.toUpperCase(),
            value: item.id,
        }));
    };

    const addNewColor = async (input: string) => {
        try {
            const resp = await axios.post(
                `${API_URL}color`,
                { name: input, user_id: user!.id },
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const { message } = resp.data;
            await dispatch(getColors());
            addNotification({
                message,
                type: "success",
            });
            // return {
            //     label: color.name,
            //     value: color.id,
            // };
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
        }
    };

    useEffect(() => {
        if (edit) {
            getReceipt(editId!);
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
                setReceipt({
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
            contentClassName="custom-modal"
            dialogClassName="center"
            size="xl"
        >
            <Modal.Header closeButton>
                <div className="h5">
                    {edit ? "Edit Receipt" : "Add Receipt"}
                </div>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={2}>
                        <Form.Group>
                            <FormLabel>Ref. No</FormLabel>
                            <Form.Control
                                name="ref_no"
                                value={receipt.ref_no}
                                onChange={(e) =>
                                    setReceipt((p) => ({
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
                                value={receipt.ref_date}
                                onChange={(e) =>
                                    setReceipt((p) => ({
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
                                            contact.id == receipt.contact_id
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
                                    setReceipt((p) => ({
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
                                value={receipt.remarks}
                                onChange={(e) =>
                                    setReceipt((p) => ({
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
                                            cloth_id:
                                                state.items.length > 0
                                                    ? state.items[
                                                          state.items.length - 1
                                                      ].cloth_id
                                                    : null,
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
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    <box-icon
                                        name="loader"
                                        animation="spin"
                                        size="lg"
                                    ></box-icon>
                                </td>
                            </tr>
                        ) : (
                            state.items.length > 0 &&
                            state.items.map((item: ReceiptItem, index) => (
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
                                                options={cloths.map(
                                                    (cloth) => ({
                                                        label: cloth.name.toUpperCase(),
                                                        value: cloth.id,
                                                    })
                                                )}
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
                                            <AsyncCreateSelect
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
                                                loadOptions={loadColors}
                                                onCreateOption={addNewColor}
                                                isDisabled={
                                                    item.cloth_id === null
                                                }
                                            />
                                        </div>
                                    </td>
                                    <td className="weight-input">
                                        <div>
                                            <Form.Control
                                                disabled={
                                                    item.cloth_id === null
                                                }
                                                onChange={(e) => {
                                                    updateState({
                                                        type: "UPDATE_ITEM",
                                                        payload: {
                                                            ...item,
                                                            weight: e.target
                                                                .value,
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
                                                            cloth_id:
                                                                state.items
                                                                    .length > 0
                                                                    ? state
                                                                          .items[
                                                                          state
                                                                              .items
                                                                              .length -
                                                                              1
                                                                      ].cloth_id
                                                                    : null,
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
                            ))
                        )}
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
                        onClick={edit ? updateReceipt : addReceipt}
                        variant="dark"
                    >
                        {edit ? "UPDATE" : "SAVE"}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default AddEditReceipt;

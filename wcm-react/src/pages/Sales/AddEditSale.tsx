import axios from "axios";
import React, { useEffect, useReducer, useRef, useState } from "react";
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
import BreakupModal from "../../components/BreakupModal";
import AsyncCreateSelect from "react-select/async-creatable";

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
    actual_weight: string;
    rate: string;
    amount: string;
    isNewRow: boolean;
};

type Breakup = {
    ledger: string;
    value: string;
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
              actual_weight: string;
              rate: string;
          };
      }
    | { type: "REMOVE_ITEM"; payload: { index: number } }
    | { type: "CLEAR" }
    | { type: "REMOVE_EMPTY_ROWS" }
    | { type: "SET ITEM"; payload: SaleItem[] }
    | { type: "ADD NEW ROW" };

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
                        ? {
                              ...item,
                              ...action.payload,
                              amount:
                                  action.payload.rate &&
                                  action.payload.actual_weight
                                      ? (
                                            +action.payload.rate *
                                            +action.payload.actual_weight
                                        ).toFixed(2)
                                      : "",
                          }
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
                items: state.items.filter(
                    (item) => item.rate !== null && item.actual_weight !== null
                ),
            };
        case "SET ITEM":
            return {
                items: action.payload,
            };
        case "ADD NEW ROW":
            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        cloth_id:
                            state.items.length > 0
                                ? state.items[state.items.length - 1].cloth_id
                                : null,
                        color_id: null,
                        weight: "",
                        actual_weight: "",
                        rate: "",
                        amount: "",
                        isNewRow: true,
                    },
                ],
            };
        default:
            return state;
    }
};

type Summary = {
    weight: number;
    amount: number;
};

type Color = {
    id: number;
    name: string;
    active: string;
    user: {
        name: string;
    };
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
    const [currentStock, setCurrentStock] = useState<SaleItem[]>([]);
    const [editStock, setEditStock] = useState<SaleItem[]>([]);
    const [dc, setDc] = useState<Summary>({
        weight: 0,
        amount: 0,
    });
    const [actual, setActual] = useState<Summary>({
        weight: 0,
        amount: 0,
    });
    const lastRowRef = useRef<HTMLTableRowElement | null>(null);
    const [isRowAdded, setIsRowAdded] = useState(false);
    const [breakup, setBreakup] = useState<Breakup[]>([]);
    const [showBreakup, setShowBreakup] = useState(false);

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
        // updateState({ type: "REMOVE_EMPTY_ROWS" });
        if (!isValid()) return;
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${API_URL}sale`,
                {
                    ...sale,
                    sale_items: state.items,
                    breakup: breakup,
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
            setShowBreakup(false);
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

            const response2 = await axios.get(`${API_URL}delivery-stock`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { sale } = response.data;
            const { stock } = response2.data;

            setSale({
                ref_no: sale.ref_no,
                ref_date: sale.ref_date,
                contact_id: sale.contact_id,
                remarks: sale.remarks,
                user_id: user!.id,
            });
            const { sale_items, sale_breakup } = sale;

            let saleItems: SaleItem[] = [];
            let stockItems: SaleItem[] = [];
            let breakup: Breakup[] = [];

            sale_items.forEach((sale: SaleItem) => {
                let saleItem: SaleItem = {
                    cloth_id: +sale.cloth_id!,
                    color_id: +sale.color_id!,
                    weight: (+sale.weight).toFixed(2),
                    actual_weight: (+sale.actual_weight).toFixed(2),
                    rate: (+sale.rate).toFixed(2),
                    amount: (+sale.amount).toFixed(2),
                    isNewRow: false,
                };
                saleItems.push(saleItem);
            });
            stock.forEach((sto: SaleItem) => {
                let stockItem: SaleItem = {
                    cloth_id: +sto.cloth_id!,
                    color_id: +sto.color_id!,
                    weight: (+sto.weight).toFixed(2),
                    actual_weight: (+sto.weight).toFixed(2),
                    rate: (+sto.rate).toFixed(2),
                    amount: (+sto.amount).toFixed(2),
                    isNewRow: false,
                };
                stockItems.push(stockItem);
            });

            sale_breakup.forEach((e: Breakup) => {
                breakup.push({
                    ledger: e.ledger.toUpperCase(),
                    value: (+e.value).toFixed(2),
                });
            });

            updateState({
                type: "SET ITEM",
                payload: saleItems,
            });
            setCurrentStock(stockItems);
            setEditStock(saleItems);
            setBreakup(breakup);

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
        // updateState({ type: "REMOVE_EMPTY_ROWS" });
        if (!isValid()) return;
        try {
            setLoading(true);
            const resp = await axios.post(
                `${API_URL}sale/${editId}?_method=PUT`,
                {
                    ...sale,
                    sale_items: state.items,
                    breakup: breakup,
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
            setShowBreakup(false);
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

    const getStock = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}delivery-stock`, {
                headers: {
                    Accept: "application/json",
                },
            });
            const { stock } = response.data;
            let saleItems: SaleItem[] = [];

            stock.forEach((e: SaleItem) => {
                let saleItem: SaleItem = {
                    cloth_id: +e.cloth_id!,
                    color_id: +e.color_id!,
                    weight: (+e.weight).toFixed(2),
                    actual_weight: (+e.weight).toFixed(2),
                    rate: "",
                    amount: "",
                    isNewRow: false,
                };
                saleItems.push(saleItem);
            });

            updateState({
                type: "SET ITEM",
                payload: saleItems,
            });
            setCurrentStock(saleItems);
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

    const addRow = () => {
        updateState({ type: "ADD NEW ROW" });
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
        if (state.items.length <= 0) return;

        setDc({
            weight: state.items.reduce((acc, item) => +item.weight + acc, 0),
            amount: state.items.reduce(
                (acc, item) => +item.weight * +item.rate + acc,
                0
            ),
        });

        setActual({
            // weight: state.items.reduce(
            //     (acc, item) => +item.actual_weight + acc,
            //     0
            // ),

            //ignore kithan count
            //kithan id is 74

            weight: state.items.reduce((acc, item) => {
                if (item.color_id === 74) return acc;
                return +item.actual_weight + acc;
            }, 0),

            amount: state.items.reduce((acc, item) => +item.amount + acc, 0),
        });
    }, [state]);

    useEffect(() => {
        if (isRowAdded) {
            if (lastRowRef.current) {
                lastRowRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                lastRowRef.current.focus();
                setIsRowAdded(false);
            }
        }
    }, [state.items.length]);

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
                setShowBreakup(false);
                setBreakup([]);
                onClose();
            }}
            centered
            scrollable
            size="xl"
            contentClassName="custom-modal"
            onShow={() => {
                if (!edit) getStock();
            }}
            fullscreen="xxl-down"
        >
            <Modal.Header closeButton>
                <div className="h5">{edit ? "Edit Sale" : "Add Sale"}</div>
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
                    <Col xs={4}>
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
                </Row>
                <hr />
                <Table hover bordered size="sm">
                    <thead>
                        <tr>
                            <th className="text-center">#</th>
                            <th>CLOTH</th>
                            <th>COLOR</th>
                            <th>WEIGHT</th>
                            <th>ACT. WEIGHT</th>
                            <th>RATE</th>
                            <th>AMOUNT</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    <box-icon
                                        name="loader"
                                        animation="spin"
                                        size="lg"
                                    ></box-icon>
                                </td>
                            </tr>
                        ) : (
                            state.items.length > 0 &&
                            state.items.map((item: SaleItem, index) => (
                                <tr
                                    key={index}
                                    ref={
                                        state.items.length - 1 === index
                                            ? lastRowRef
                                            : null
                                    }
                                    tabIndex={-1}
                                >
                                    <td style={{ verticalAlign: "middle" }}>
                                        <div className="d-flex justify-content-center align-items-center h-100">
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="cloth-input">
                                        <div>
                                            <ReactSelect
                                                isDisabled={!item.isNewRow}
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
                                            {/* <ReactSelect
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
                                                isDisabled={!item.isNewRow}
                                                options={colors.map(
                                                    (color) => ({
                                                        label: color.name.toUpperCase(),
                                                        value: color.id,
                                                    })
                                                )}
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
                                            /> */}
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
                                                isDisabled={!item.isNewRow}
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
                                            />
                                        </div>
                                    </td>
                                    <td className="weight-input">
                                        <div>
                                            <Form.Control
                                                style={{
                                                    textAlign: "center",
                                                }}
                                                // disabled={
                                                //     item.cloth_id === null
                                                // }
                                                disabled
                                                onChange={(e) => {
                                                    let isValid = true;
                                                    try {
                                                        let weight = parseFloat(
                                                            e.target.value
                                                        );

                                                        let min = 0;
                                                        let max = parseFloat(
                                                            currentStock.find(
                                                                (c) =>
                                                                    c.cloth_id ===
                                                                        item.cloth_id &&
                                                                    c.color_id ===
                                                                        item.color_id
                                                            )!.weight
                                                        );

                                                        if (edit) {
                                                            max += parseFloat(
                                                                editStock.find(
                                                                    (e) =>
                                                                        e.cloth_id ===
                                                                            item.cloth_id &&
                                                                        e.color_id ===
                                                                            item.color_id
                                                                )!.weight
                                                            );
                                                        }

                                                        if (
                                                            weight < min ||
                                                            weight > max
                                                        ) {
                                                            addNotification({
                                                                message: `Weight should be between ${min} and ${max}`,
                                                                type: "failure",
                                                            });
                                                            isValid = false;
                                                        }
                                                    } catch (error: any) {
                                                        addNotification({
                                                            message:
                                                                error.message,
                                                            type: "failure",
                                                        });
                                                        isValid = false;
                                                    }
                                                    if (!isValid) return;
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
                                    <td className="actual-weight-input">
                                        <div>
                                            <Form.Control
                                                style={{
                                                    textAlign: "center",
                                                }}
                                                onChange={(e) => {
                                                    let isValid = true;
                                                    try {
                                                        parseFloat(
                                                            e.target.value
                                                        );
                                                    } catch (error: any) {
                                                        addNotification({
                                                            message:
                                                                error.message,
                                                            type: "failure",
                                                        });
                                                        isValid = false;
                                                    }
                                                    if (!isValid) return;
                                                    updateState({
                                                        type: "UPDATE_ITEM",
                                                        payload: {
                                                            ...item,
                                                            actual_weight:
                                                                e.target.value,
                                                            index,
                                                        },
                                                    });
                                                }}
                                                value={item.actual_weight}
                                            />
                                        </div>
                                    </td>
                                    <td className="rate-input">
                                        <div>
                                            <Form.Control
                                                style={{
                                                    textAlign: "center",
                                                }}
                                                disabled={
                                                    item.actual_weight === ""
                                                }
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;

                                                    const rate =
                                                        parseFloat(value);
                                                    if (rate < 0) {
                                                        addNotification({
                                                            message:
                                                                "Please enter a valid positive number for rate",
                                                            type: "failure",
                                                        });
                                                        return;
                                                    }

                                                    updateState({
                                                        type: "UPDATE_ITEM",
                                                        payload: {
                                                            ...item,
                                                            rate: e.target
                                                                .value,
                                                            index,
                                                        },
                                                    });
                                                }}
                                                value={item.rate}
                                            />
                                        </div>
                                    </td>
                                    <td className="amount">
                                        <div>
                                            <Form.Control
                                                style={{
                                                    textAlign: "center",
                                                }}
                                                disabled
                                                value={
                                                    isNaN(+item.amount)
                                                        ? ""
                                                        : item.amount
                                                }
                                            />
                                        </div>
                                    </td>
                                    <td
                                        style={{
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        <div className="d-flex align-items-center gap-1">
                                            <Button
                                                variant="dark"
                                                className="d-flex"
                                                disabled={!item.isNewRow}
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
                <div className="d-flex justify-content-center">
                    <Button
                        onClick={() => {
                            addRow();
                            setIsRowAdded(true);
                        }}
                        variant="dark"
                        className="d-flex"
                    >
                        <box-icon name="plus" color="white"></box-icon>
                    </Button>
                </div>
                <BreakupModal
                    show={showBreakup}
                    onHide={() => setShowBreakup(false)}
                    breakup={breakup}
                    setBreakup={setBreakup}
                    total={actual.amount.toFixed(2)}
                    addSale={edit ? updateSale : addSale}
                    loading={loading}
                />
            </Modal.Body>
            <Modal.Footer>
                <span className="me-1" style={{ width: "25%" }}>
                    <div>
                        <div>
                            <Row>
                                <Col xs={5}>
                                    <label>DC. Weight</label>
                                </Col>
                                <Col xs={1}>:</Col>
                                <Col>
                                    <strong>{dc.weight.toFixed(2)}</strong>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <Row>
                                <Col xs={5}>
                                    <label>DC. Amount</label>
                                </Col>
                                <Col xs={1}>:</Col>
                                <Col>
                                    <strong>{dc.amount.toFixed(2)}</strong>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </span>
                <span className="me-1" style={{ width: "25%" }}>
                    <div>
                        <div>
                            <Row>
                                <Col xs={5}>
                                    <label>Final Weight</label>
                                </Col>
                                <Col xs={1}>:</Col>
                                <Col>
                                    <strong>{actual.weight.toFixed(2)}</strong>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <Row>
                                <Col xs={5}>
                                    <label>Final Amount</label>
                                </Col>
                                <Col xs={1}>:</Col>
                                <Col>
                                    <strong>{actual.amount.toFixed(2)}</strong>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </span>
                <span className="me-auto" style={{ width: "25%" }}>
                    <div>
                        <div>
                            <Row>
                                <Col xs={5}>
                                    <label>Var. Weight</label>
                                </Col>
                                <Col xs={1}>:</Col>
                                <Col>
                                    <strong>
                                        {(actual.weight - dc.weight).toFixed(2)}
                                    </strong>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <Row>
                                <Col xs={5}>
                                    <label>Var. Amount</label>
                                </Col>
                                <Col xs={1}>:</Col>
                                <Col>
                                    <strong>
                                        {(actual.amount - dc.amount).toFixed(2)}
                                    </strong>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </span>
                {/* {+actual.amount > 0 && (
                    <Button onClick={() => {setShowBreakup(true)}} variant="dark">
                        BREAKUP
                    </Button>
                )} */}
                {loading ? (
                    <box-icon name="loader-alt" animation="spin"></box-icon>
                ) : (
                    <Button
                        disabled={actual.weight == 0 || actual.amount == 0}
                        onClick={() => {
                            setShowBreakup(true);
                        }}
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

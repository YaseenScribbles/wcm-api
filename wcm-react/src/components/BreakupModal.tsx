import { useRef, useState } from "react";
import { Button, Col, Form, FormLabel, Modal, Row } from "react-bootstrap";
import { useNotification } from "../contexts/NotificationContext";

type Breakup = {
    ledger: string;
    value: string;
};

type BreakupProps = {
    show: boolean;
    total: string;
    breakup: Breakup[];
    setBreakup: React.Dispatch<React.SetStateAction<Breakup[]>>;
    onHide: () => void;
    addSale: () => void;
    loading: boolean;
};

const Breakup: React.FC<BreakupProps> = ({
    show,
    total,
    breakup,
    setBreakup,
    onHide,
    addSale,
    loading,
}) => {
    const [data, setData] = useState<Breakup>({
        ledger: "",
        value: "",
    });
    const ledgerInputRef = useRef<HTMLInputElement | null>(null);
    const { addNotification } = useNotification();

    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            onHide={() => {
                onHide();
            }}
            scrollable
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Sale Breakup (
                    {(
                        +total -
                        breakup.reduce((acc, curr) => acc + +curr.value, 0)
                    ).toFixed(2)}
                    )
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col xs={5}>
                            <Form.Group>
                                <FormLabel>Ledger</FormLabel>
                                <Form.Control
                                    name="ledger"
                                    value={data.ledger}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            ledger: e.target.value.toUpperCase(),
                                        }))
                                    }
                                    autoFocus
                                    ref={ledgerInputRef}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={5}>
                            <Form.Group>
                                <Form.Label>Value</Form.Label>
                                <Form.Control
                                    name="value"
                                    value={data.value}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            value: e.target.value.toUpperCase(),
                                        }))
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col className="d-flex align-items-end">
                            <Button
                                variant="dark"
                                className="d-flex"
                                onClick={(e) => {
                                    e.preventDefault();
                                    let isValid = true;
                                    if (data.ledger == "") {
                                        addNotification({
                                            type: "failure",
                                            message: "Please fill the ledger",
                                        });
                                        isValid = false;
                                    } else if (data.value == "") {
                                        addNotification({
                                            type: "failure",
                                            message: "Please fill the value",
                                        });
                                        isValid = false;
                                    }
                                    if (!isValid) return;

                                    setBreakup((prev) => [
                                        ...prev,
                                        {
                                            ledger: data.ledger,
                                            value: data.value,
                                        },
                                    ]);
                                    setData({
                                        ledger: "",
                                        value: "",
                                    });
                                    ledgerInputRef.current?.focus();
                                }}
                            >
                                <i
                                // name="plus"
                                // color="white"
                                className="bx bx-plus text-white fs-4"></i>
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <hr />
                <Row className="mb-1 p-1 text-bg-dark ">
                    <Col xs={5}>LEDGER</Col>
                    <Col xs={4}>VALUE</Col>
                    <Col></Col>
                </Row>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <i
                            // name="loader"
                            // animation="spin"
                            // size="lg"
                            className="bx bx-loader bx-spin fs-3"
                        ></i>
                    </div>
                ) : (
                    breakup.length > 0 &&
                    loading === false &&
                    breakup.map((b, index) => (
                        <Row key={index} className="mb-1 p-1">
                            <Col xs={5}>{b.ledger.toUpperCase()}</Col>
                            <Col xs={4} className="text-end">
                                {(+b.value).toFixed(2)}
                            </Col>
                            <Col className="text-end">
                                <i
                                    // name="x"
                                    // color="black"
                                    className="bx bx-x text-black fs-4"
                                    onClick={() => {
                                        setBreakup((prev) =>
                                            prev.filter(
                                                (e) =>
                                                    e.ledger !== b.ledger ||
                                                    e.value !== b.value
                                            )
                                        );
                                    }}
                                ></i>
                            </Col>
                        </Row>
                    ))
                )}

                {breakup.length > 0 && (
                    <Row className="border-top p-1">
                        <Col xs={5}>TOTAL</Col>
                        <Col xs={4} className="text-end">
                            {breakup
                                .reduce((acc, curr) => acc + +curr.value, 0)
                                .toFixed(2)}
                        </Col>
                        <Col></Col>
                    </Row>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    disabled={loading}
                    variant="dark"
                    onClick={() => {
                        if (
                            +total ==
                            breakup.reduce((acc, cur) => acc + +cur.value, 0)
                        ) {
                            addSale();
                        } else {
                            addNotification({
                                type: "failure",
                                message: "breakup does not match",
                            });
                        }
                    }}
                >
                    SAVE
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Breakup;

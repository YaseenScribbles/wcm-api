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
};

const Breakup: React.FC<BreakupProps> = ({
    show,
    total,
    breakup,
    setBreakup,
    onHide,
    addSale,
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
                setBreakup([]);
                onHide();
            }}
            scrollable
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Sale Breakup ({(+total).toFixed(2)})</Modal.Title>
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
                                <box-icon name="plus" color="white"></box-icon>
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
                {breakup.length > 0 &&
                    breakup.map((b, index) => (
                        <Row key={index} className="mb-1 p-1">
                            <Col xs={5}>{b.ledger.toUpperCase()}</Col>
                            <Col xs={4} className="text-end">{(+b.value).toFixed(2)}</Col>
                            <Col className="text-end">
                                <box-icon
                                    name="x"
                                    color="black"
                                    onClick={() => {
                                        setBreakup((prev) =>
                                            prev.filter(
                                                (e) =>
                                                    e.ledger !== b.ledger ||
                                                    e.value !== b.value
                                            )
                                        );
                                    }}
                                ></box-icon>
                            </Col>
                        </Row>
                    ))}

                {breakup.length > 0 && (
                    <Row className="border-top p-1">
                        <Col xs={5}>TOTAL</Col>
                        <Col xs={4} className="text-end">
                            {breakup.reduce(
                                (acc, curr) => acc + +curr.value,
                                0
                            ).toFixed(2)}
                        </Col>
                        <Col></Col>
                    </Row>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
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

import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNotification } from "../contexts/NotificationContext";

type YesNoModalProps = {
    show: boolean;
    onYes: () => Promise<void>;
    onNo: () => void;
    onHide: () => void;
};

const YesNoModal: React.FC<YesNoModalProps> = ({
    show,
    onYes,
    onNo,
    onHide,
}) => {
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();

    const handleYes = async () => {
        try {
            setLoading(true);
            await onYes();
            onHide();
        } catch (error: any) {
            const message = error.message || "Error processing";
            addNotification({
                message,
                type: "failure",
            });
            onHide();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            size="sm"
            centered
            backdrop="static"
            keyboard={false}
            show={show}
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <i
                // name="shield-plus"
                // color="black"
                className="bx bx-shield-plus text-black fs-4"
                ></i>
                <Modal.Title className="ms-1">Confirmation</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Are you sure ?</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-dark" onClick={onNo}>
                    No
                </Button>
                <Button variant="dark" onClick={handleYes} disabled={loading}>
                    {loading ? "Processing..." : "Yes"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default YesNoModal;

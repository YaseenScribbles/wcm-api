import {
    Card,
    Container,
    OverlayTrigger,
    Table,
    Tooltip,
} from "react-bootstrap";
import Header from "../../components/Header";
import { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";
import { useUserContext } from "../../contexts/UserContext";
const AddEditModal = lazy(() => import("./AddEditReceipt"));
const CustomPagination = lazy(() => import("../../components/MyPagination"));
import YesNoModal from "../../components/YesNoModal";
import { format, startOfMonth } from "date-fns";

type Receipt = {
    r_no: number;
    id: number;
    date: string;
    ref_no: string;
    ref_date: string;
    contact: string;
    remarks: string;
    user: string;
    weight: string;
};

type Duration = {
    fromDate: string;
    toDate: string;
};

const Receipt: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const { addNotification } = useNotification();
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<number>();
    const { menus } = useUserContext();
    const [showAlert, setShowAlert] = useState(false);
    const [alertId, setAlertId] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [duration, setDuration] = useState<Duration>({
        fromDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
        toDate: format(new Date(), "yyyy-MM-dd"),
    });

    const getReceipts = async (page: number = 1, query = "") => {
        try {
            setLoading(true);
            const result = await axios.get(
                `${API_URL}receipt?page=${page}&query=${query}&from=${duration.fromDate}&to=${duration.toDate}`
            );
            const { data, total } = result.data.receipts;
            setReceipts(data);
            setTotalRecords(total);
            const lastPage = Math.ceil(total / 10);
            setLastPage(lastPage);
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

    const deleteReceipt = async (id: number) => {
        try {
            setLoading(true);
            const resp = await axios.delete(`${API_URL}receipt/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { message } = resp.data;
            addNotification({
                message: message,
                type: "success",
            });
            getReceipts(currentPage, searchTerm);
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
        getReceipts(currentPage, searchTerm);
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1)
        getReceipts(1, searchTerm);
    }, [searchTerm, duration]);

    return (
        <Container fluid>
            <Header
                title="RECEIPT"
                buttonText="ADD RECEIPT"
                buttonFunction={() => setShowModal(true)}
                isSearchable={true}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                duration={duration}
                setDuration={setDuration}
            />
            <hr />
            <Card className="p-2">
                <Table hover variant="dark" size="sm">
                    <thead>
                        <tr>
                            <th>R. NO.</th>
                            <th>DATE</th>
                            <th>REF. NO.</th>
                            <th>REF. DATE</th>
                            <th>CONTACT</th>
                            <th>REMARKS</th>
                            <th>WEIGHT</th>
                            <th>CREATED BY</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            receipts.map((receipt) => {
                                return (
                                    <tr key={receipt.id}>
                                        <td>{receipt.r_no}</td>
                                        <td>
                                            {new Date(
                                                receipt.date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>{receipt.ref_no.toUpperCase()}</td>
                                        <td>
                                            {new Date(
                                                receipt.ref_date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>{receipt.contact.toUpperCase()}</td>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>
                                                    {receipt.remarks &&
                                                        receipt.remarks.toUpperCase()}
                                                </Tooltip>
                                            }
                                        >
                                            <td className="remarks">
                                                {receipt.remarks &&
                                                    receipt.remarks.toUpperCase()}
                                            </td>
                                        </OverlayTrigger>
                                        <td>{(+receipt.weight).toFixed(2)}</td>
                                        <td>{receipt.user.toUpperCase()}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-1">
                                                <box-icon
                                                    onClick={() => {
                                                        if (
                                                            !menus.find(
                                                                (menu) =>
                                                                    menu.name ===
                                                                    "RECEIPT"
                                                            )?.edit
                                                        ) {
                                                            addNotification({
                                                                message:
                                                                    "ACCESS RESTRICTED",
                                                                type: "failure",
                                                            });
                                                            return;
                                                        }
                                                        setEditId(receipt.id);
                                                        setEditMode(true);
                                                        setShowModal(true);
                                                    }}
                                                    name="edit"
                                                    color="white"
                                                ></box-icon>
                                                <box-icon
                                                    onClick={() => {
                                                        if (
                                                            !menus.find(
                                                                (menu) =>
                                                                    menu.name ===
                                                                    "RECEIPT"
                                                            )?.delete
                                                        ) {
                                                            addNotification({
                                                                message:
                                                                    "ACCESS RESTRICTED",
                                                                type: "failure",
                                                            });
                                                            return;
                                                        }
                                                        setAlertId(receipt.id);
                                                        setShowAlert(true);
                                                    }}
                                                    name="x"
                                                    color="white"
                                                ></box-icon>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-between align-items-center">
                    <span>Total Records : {totalRecords}</span>
                    {lastPage > 1 && (
                        <Suspense
                            fallback={
                                <box-icon
                                    name="loader-alt"
                                    animation="spin"
                                ></box-icon>
                            }
                        >
                            <CustomPagination
                                currentPage={currentPage}
                                lastPage={lastPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </Suspense>
                    )}
                </div>
            </Card>
            <Suspense
                fallback={
                    <box-icon name="loader-alt" animation="spin"></box-icon>
                }
            >
                <AddEditModal
                    show={showModal}
                    edit={editMode}
                    onSave={() => getReceipts(currentPage, searchTerm)}
                    onClose={() => {
                        setShowModal(false);
                        setEditMode(false);
                    }}
                    editId={editId}
                />
            </Suspense>
            <YesNoModal
                show={showAlert}
                onHide={() => setShowAlert(false)}
                onYes={() => deleteReceipt(alertId)}
                onNo={() => setShowAlert(false)}
            />
        </Container>
    );
};

export default Receipt;

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
const AddEditModal = lazy(() => import("./AddEditReceipt"));
const CustomPagination = lazy(() => import("../../components/MyPagination"));

type Receipt = {
    id: number;
    date: string;
    ref_no: string;
    ref_date: string;
    contact: string;
    remarks: string;
    user: string;
    weight: string;
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

    const getReceipts = async (page: number = 1) => {
        try {
            setLoading(true);
            const result = await axios.get(`${API_URL}receipt?page=${page}`);
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
            getReceipts(currentPage);
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
        getReceipts(currentPage);
    }, [currentPage]);

    return (
        <Container fluid>
            <Header
                title="RECEIPT"
                buttonText="ADD RECEIPT"
                buttonFunction={() => setShowModal(true)}
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
                            receipts.map((receipt, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{receipt.id}</td>
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
                                                        setEditId(receipt.id);
                                                        setEditMode(true);
                                                        setShowModal(true);
                                                    }}
                                                    name="edit"
                                                    color="white"
                                                ></box-icon>
                                                <box-icon
                                                    onClick={() =>
                                                        deleteReceipt(
                                                            receipt.id
                                                        )
                                                    }
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
                    onSave={() => getReceipts(currentPage)}
                    onClose={() => {
                        setShowModal(false);
                        setEditMode(false);
                    }}
                    editId={editId}
                />
            </Suspense>
        </Container>
    );
};

export default Receipt;

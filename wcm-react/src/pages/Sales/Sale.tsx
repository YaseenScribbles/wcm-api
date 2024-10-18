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
const AddEditModal = lazy(() => import("./AddEditSale"));
const CustomPagination = lazy(() => import("../../components/MyPagination"));
import YesNoModal from "../../components/YesNoModal";

type Sale = {
    id: number;
    date: string;
    ref_no: string;
    ref_date: string;
    contact: string;
    remarks: string;
    user: string;
    weight: string;
};

const Sale: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [sales, setSales] = useState<Sale[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const { addNotification } = useNotification();
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<number>();
    const { menus } = useUserContext();
    const [alertId, setAlertId] = useState(0);
    const [showAlert, setShowAlert] = useState(false);

    const getSales = async (page: number = 1) => {
        try {
            setLoading(true);
            const result = await axios.get(`${API_URL}sale?page=${page}`);
            const { data, total } = result.data.sales;
            setSales(data);
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

    const deleteSale = async (id: number) => {
        try {
            setLoading(true);
            const resp = await axios.delete(`${API_URL}sale/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { message } = resp.data;
            addNotification({
                message: message,
                type: "success",
            });
            getSales(currentPage);
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
        getSales(currentPage);
    }, [currentPage]);

    return (
        <Container fluid>
            <Header
                title="SALE"
                buttonText="ADD SALE"
                buttonFunction={() => setShowModal(true)}
            />
            <hr />
            <Card className="p-2">
                <Table hover variant="dark" size="sm">
                    <thead>
                        <tr>
                            <th>S. NO.</th>
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
                            sales.map((sale, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{sale.id}</td>
                                        <td>
                                            {new Date(
                                                sale.date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>{sale.ref_no.toUpperCase()}</td>
                                        <td>
                                            {new Date(
                                                sale.ref_date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>{sale.contact.toUpperCase()}</td>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>
                                                    {sale.remarks &&
                                                        sale.remarks.toUpperCase()}
                                                </Tooltip>
                                            }
                                        >
                                            <td className="remarks">
                                                {sale.remarks &&
                                                    sale.remarks.toUpperCase()}
                                            </td>
                                        </OverlayTrigger>
                                        <td>{(+sale.weight).toFixed(2)}</td>
                                        <td>{sale.user.toUpperCase()}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-1">
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip>edit</Tooltip>
                                                    }
                                                >
                                                    <box-icon
                                                        onClick={() => {
                                                            if (
                                                                !menus.find(
                                                                    (menu) =>
                                                                        menu.name ===
                                                                        "SALE"
                                                                )?.edit
                                                            ) {
                                                                addNotification(
                                                                    {
                                                                        message:
                                                                            "ACCESS RESTRICTED",
                                                                        type: "failure",
                                                                    }
                                                                );
                                                                return;
                                                            }
                                                            setEditId(sale.id);
                                                            setEditMode(true);
                                                            setShowModal(true);
                                                        }}
                                                        name="edit"
                                                        color="white"
                                                    ></box-icon>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip>
                                                            delete
                                                        </Tooltip>
                                                    }
                                                >
                                                    <box-icon
                                                        onClick={() => {
                                                            if (
                                                                !menus.find(
                                                                    (menu) =>
                                                                        menu.name ===
                                                                        "SALE"
                                                                )?.delete
                                                            ) {
                                                                addNotification(
                                                                    {
                                                                        message:
                                                                            "ACCESS RESTRICTED",
                                                                        type: "failure",
                                                                    }
                                                                );
                                                                return;
                                                            }
                                                            setAlertId(sale.id);
                                                            setShowAlert(true);
                                                        }}
                                                        name="x"
                                                        color="white"
                                                    ></box-icon>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip>
                                                            invoice
                                                        </Tooltip>
                                                    }
                                                >
                                                    <box-icon
                                                        name="file"
                                                        color="white"
                                                        onClick={() => {
                                                            window.open(
                                                                `/sale/${sale.id}`,
                                                                "_blank"
                                                            );
                                                        }}
                                                    ></box-icon>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip>
                                                            variation
                                                        </Tooltip>
                                                    }
                                                >
                                                    <box-icon
                                                        name="file"
                                                        color="white"
                                                        onClick={() => {
                                                            window.open(
                                                                `/variation/${sale.id}`,
                                                                "_blank"
                                                            );
                                                        }}
                                                    ></box-icon>
                                                </OverlayTrigger>
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
                    onSave={() => getSales(currentPage)}
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
                onNo={() => setShowAlert(false)}
                onYes={() => deleteSale(alertId)}
            />
        </Container>
    );
};

export default Sale;

import { Card, Container, Table } from "react-bootstrap";
import Header from "../../components/Header";
import { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";
import { useUserContext } from "../../contexts/UserContext";
const AddEditModal = lazy(() => import("./AddEditCloth"));
const CustomPagination = lazy(() => import("../../components/MyPagination"));

type Cloth = {
    id: number;
    name: string;
    active: string;
    user: {
        name: string;
    };
};

const Cloth = () => {
    const [loading, setLoading] = useState(false);
    const [cloths, setCloths] = useState<Cloth[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const { addNotification } = useNotification();
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<number>();
    const { user } = useUserContext()

    const getCloths = async (page: number = 1) => {
        try {
            setLoading(true);
            const result = await axios.get(`${API_URL}cloth?page=${page}`);
            const { data, total } = result.data.cloths;
            setCloths(data);
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

    const deleteCloth = async (id: number) => {
        try {
            setLoading(true);
            const resp = await axios.delete(`${API_URL}cloth/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { message } = resp.data;
            addNotification({
                message: message,
                type: "success",
            });
            getCloths(currentPage);
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
        getCloths(currentPage);
    }, [currentPage]);

    return (
        <Container>
            <Header
                title="CLOTH"
                buttonText="ADD CLOTH"
                buttonFunction={() => setShowModal(true)}
            />
            <hr />
            <Card className="p-2">
                <Table hover variant="dark" size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>CLOTH</th>
                            <th>ACTIVE</th>
                            <th>CREATED BY</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            cloths.map((cloth, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>
                                        <td>{cloth.name.toUpperCase()}</td>
                                        <td>
                                            {cloth.active === "1"
                                                ? "ACTIVE"
                                                : "NOT ACTIVE"}
                                        </td>
                                        <td>{cloth.user.name.toUpperCase()}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-1">
                                                <box-icon
                                                    hidden={user?.role !== "admin"}
                                                    onClick={() => {
                                                        setEditId(cloth.id);
                                                        setEditMode(true);
                                                        setShowModal(true);
                                                    }}
                                                    name="edit"
                                                    color="white"
                                                ></box-icon>
                                                <box-icon
                                                    hidden
                                                    onClick={() =>
                                                        deleteCloth(cloth.id)
                                                    }
                                                    name={cloth.active == "1" ? "minus" : "plus"}
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
                    onSave={() => getCloths(currentPage)}
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

export default Cloth;

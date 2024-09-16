import { Card, Container, Table } from "react-bootstrap";
import Header from "../../components/Header";
import { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";
const CustomPagination = lazy(() => import("../../components/MyPagination"));
const AddEditModal = lazy(() => import("../../pages/Color/AddEditColor"));

type Color = {
    id: number;
    name: string;
    active: string;
    user: {
        name: string;
    };
};

const Color = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [colors, setColors] = useState<Color[]>();
    const [currentPage, setCurrentPage] = useState(1);
    const [editId, setEditId] = useState<number>();
    const [editMode, setEditMode] = useState(false);
    const { addNotification } = useNotification();
    const [lastPage, setLastPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const deleteColor = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.delete(`${API_URL}color/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { message } = response.data;
            addNotification({
                message: message,
                type: "success",
            });
            getColors(currentPage);
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

    const getColors = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}color?page=${page}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { data, total } = response.data.colors;
            setColors(data);
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

    useEffect(() => {
        getColors(currentPage);
    }, [currentPage]);

    return (
        <Container>
            <Header
                title="COLOR"
                buttonText="ADD COLOR"
                buttonFunction={() => {
                    setShowModal(true);
                }}
            />
            <hr />
            <Card className="p-2">
                <Table hover variant="dark" size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Active</th>
                            <th>Created By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td className="text-center" colSpan={5}>Loading...</td>
                            </tr>
                        ) : (
                            colors &&
                            colors.map((color, index) => (
                                <tr key={index}>
                                    <td>
                                        {(currentPage - 1) * 10 + index + 1}
                                    </td>
                                    <td>{color.name.toUpperCase()}</td>
                                    <td>
                                        {color.active == "1"
                                            ? "ACTIVE"
                                            : "NOT ACTIVE"}
                                    </td>
                                    <td>{color.user.name.toUpperCase()}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-1">
                                            <box-icon
                                                onClick={() => {
                                                    setEditId(color.id);
                                                    setEditMode(true);
                                                    setShowModal(true);
                                                }}
                                                name="edit"
                                                color="white"
                                            ></box-icon>
                                            <box-icon
                                                hidden
                                                onClick={() =>
                                                    deleteColor(color.id)
                                                }
                                                name={
                                                    color.active == "1"
                                                        ? "minus"
                                                        : "plus"
                                                }
                                                color="white"
                                            ></box-icon>
                                        </div>
                                    </td>
                                </tr>
                            ))
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
                    onSave={() => getColors(currentPage)}
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

export default Color;

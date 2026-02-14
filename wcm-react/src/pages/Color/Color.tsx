import { Card, Container, Table } from "react-bootstrap";
import Header from "../../components/Header";
import { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";
import { useUserContext } from "../../contexts/UserContext";
const CustomPagination = lazy(() => import("../../components/MyPagination"));
const AddEditModal = lazy(() => import("../../pages/Color/AddEditColor"));

type Color = {
    id: number;
    name: string;
    active: string;
    created_at: string;
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
    const { menus } = useUserContext()

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
                            <th>Created On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td className="text-center" colSpan={6}>
                                    Loading...
                                </td>
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
                                    <td>{new Date(color.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-1">
                                            <i
                                                onClick={() => {
                                                    if (
                                                        !menus.find(menu => menu.name === "COLOR")?.edit
                                                    ) {
                                                        addNotification({
                                                            message:
                                                                "ACCESS RESTRICTED",
                                                            type: "failure",
                                                        });
                                                        return;
                                                    }
                                                    setEditId(color.id);
                                                    setEditMode(true);
                                                    setShowModal(true);
                                                }}
                                                // name="edit"
                                                // color="white"
                                                className="bx bx-edit text-white fs-4"
                                            ></i>
                                            <i
                                                hidden
                                                onClick={() =>
                                                    deleteColor(color.id)
                                                }
                                                // name={
                                                //     color.active == "1"
                                                //         ? "minus"
                                                //         : "plus"
                                                // }
                                                // color="white"
                                                className={`bx text-white fs-4 ${color.active == "1" ? "bx-minus" : "bx-plus"}`}
                                            ></i>
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
                                <i
                                    // name="loader-alt"
                                    // animation="spin"
                                    className="bx bx-loader-alt bx-spin fs-4"
                                ></i>
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
                    <i
                    // name="loader-alt"
                    // animation="spin"
                    className="bx bx-loader-alt bx-spin fs-4"
                    ></i>
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

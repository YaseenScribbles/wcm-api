import React from "react";
import { Card, Container, Table } from "react-bootstrap";
import Header from "../../components/Header";
import { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";
import { useUserContext } from "../../contexts/UserContext";
const CustomPagination = lazy(() => import("../../components/MyPagination"));
const AddEditModal = lazy(() => import("../../pages/Users/AddEditUser"));
const UpdateUserMenu = lazy(() => import("../../pages/Users/UserMenu"));

type User = {
    id: number;
    name: string;
    email: string;
    active: string;
    role: string;
};

const Users: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const { addNotification } = useNotification();
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<number>();
    const [showMenuModal, setShowMenuModal] = useState(false);
    const { user: currentUser } = useUserContext();
    const [editUser, setEditUser] = useState<{ id: number; name: string }>({
        id: currentUser!.id,
        name: currentUser!.name,
    });

    const getUsers = async (page: number = 1) => {
        try {
            setLoading(true);
            const result = await axios.get(`${API_URL}user?page=${page}`);
            const { data, total } = result.data.users;
            setUsers(data);
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

    const deleteUser = async (id: number) => {
        try {
            setLoading(true);
            const resp = await axios.delete(`${API_URL}user/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { message } = resp.data;
            addNotification({
                message: message,
                type: "success",
            });
            getUsers(currentPage);
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
        getUsers(currentPage);
    }, [currentPage]);

    return (
        <Container>
            <Header
                title="USER"
                buttonText="ADD USER"
                buttonFunction={() => setShowModal(true)}
            />
            <hr />
            <Card className="p-2">
                <Table hover variant="dark" size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ROLE</th>
                            <th>ACTIVE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>
                                        <td>{user.name.toUpperCase()}</td>
                                        <td>{user.email.toUpperCase()}</td>
                                        <td>{user.role.toUpperCase()}</td>
                                        <td>
                                            {user.active === "1"
                                                ? "ACTIVE"
                                                : "NOT ACTIVE"}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-1">
                                                <box-icon
                                                    hidden={currentUser?.role !== "admin"}
                                                    onClick={() => {
                                                        setEditId(user.id);
                                                        setEditMode(true);
                                                        setShowModal(true);
                                                    }}
                                                    name="edit"
                                                    color="white"
                                                ></box-icon>
                                                <box-icon
                                                    hidden
                                                    onClick={() =>
                                                        deleteUser(user.id)
                                                    }
                                                    name={
                                                        user.active == "1"
                                                            ? "minus"
                                                            : "plus"
                                                    }
                                                    color="white"
                                                ></box-icon>
                                                <box-icon
                                                    hidden={currentUser?.role !== "admin"}
                                                    onClick={() => {
                                                        setEditUser({
                                                            id: user.id,
                                                            name: user.name,
                                                        });
                                                        setShowMenuModal(true);
                                                    }}
                                                    name="menu"
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
                    onSave={() => getUsers(currentPage)}
                    onClose={() => {
                        setShowModal(false);
                        setEditMode(false);
                    }}
                    editId={editId}
                />
            </Suspense>

            <Suspense
                fallback={
                    <box-icon name="loader-alt" animation="spin"></box-icon>
                }
            >
                <UpdateUserMenu
                    show={showMenuModal}
                    onHide={() => {
                        setShowMenuModal(false);
                    }}
                    user={editUser!}
                />
            </Suspense>
        </Container>
    );
};

export default Users;

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
const AddEditModal = lazy(() => import("./AddEditContact"));
const CustomPagination = lazy(() => import("../../components/MyPagination"));

type Contact = {
    id: number;
    name: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
    gst: string;
    active: string;
    user: {
        name: string;
    };
};

const Contact: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const { addNotification } = useNotification();
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<number>();
    const { user } = useUserContext()

    const getContacts = async (page: number = 1) => {
        try {
            setLoading(true);
            const result = await axios.get(`${API_URL}contact?page=${page}`);
            const { data, total } = result.data.contacts;
            setContacts(data);
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

    const deleteContact = async (id: number) => {
        try {
            setLoading(true);
            const resp = await axios.delete(`${API_URL}contact/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const { message } = resp.data;
            addNotification({
                message: message,
                type: "success",
            });
            getContacts(currentPage);
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

    const getAddress = (contact: Contact): string => {
        let address = "";

        if (contact.address) {
            address = contact.address.toUpperCase();
        }

        if (contact.city) {
            address += ", " + contact.city.toUpperCase();
        }

        if (contact.phone) {
            address += ", PIN-" + contact.pincode;
        }

        return address;
    };

    useEffect(() => {
        getContacts(currentPage);
    }, [currentPage]);

    return (
        <Container fluid>
            <Header
                title="CONTACT"
                buttonText="ADD CONTACT"
                buttonFunction={() => setShowModal(true)}
            />
            <hr />
            <Card className="p-2">
                <Table hover variant="dark" size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>NAME</th>
                            <th>ADDRESS</th>
                            <th>GST</th>
                            <th>PHONE</th>
                            <th>ACTIVE</th>
                            <th>CREATED BY</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            contacts.map((contact, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>
                                                    {contact.name.toUpperCase()}
                                                </Tooltip>
                                            }
                                        >
                                            <td className="contact-name">
                                                {contact.name.toUpperCase()}
                                            </td>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>
                                                    {getAddress(contact)}
                                                </Tooltip>
                                            }
                                        >
                                            <td className="contact-address">
                                                {getAddress(contact)}
                                            </td>
                                        </OverlayTrigger>
                                        <td>
                                            {contact.gst
                                                ? contact.gst.toUpperCase()
                                                : ""}
                                        </td>
                                        <td>
                                            {contact.phone ? contact.phone : ""}
                                        </td>
                                        <td>
                                            {contact.active === "1"
                                                ? "ACTIVE"
                                                : "NOT ACTIVE"}
                                        </td>
                                        <td>
                                            {contact.user.name.toUpperCase()}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-1">
                                                <box-icon
                                                    onClick={() => {
                                                        if (
                                                            user?.role !==
                                                            "admin"
                                                        ) {
                                                            addNotification({
                                                                message:
                                                                    "ACCESS RESTRICTED",
                                                                type: "failure",
                                                            });
                                                            return;
                                                        }
                                                        setEditId(contact.id);
                                                        setEditMode(true);
                                                        setShowModal(true);
                                                    }}
                                                    name="edit"
                                                    color="white"
                                                ></box-icon>
                                                <box-icon
                                                    hidden
                                                    onClick={() =>
                                                        deleteContact(
                                                            contact.id
                                                        )
                                                    }
                                                    name={
                                                        contact.active == "1"
                                                            ? "minus"
                                                            : "plus"
                                                    }
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
                    onSave={() => getContacts(currentPage)}
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

export default Contact;

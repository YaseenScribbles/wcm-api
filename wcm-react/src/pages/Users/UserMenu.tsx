import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";
import {
    Button,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    Row,
} from "react-bootstrap";
import ReactSelect from "react-select";

type Option = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
};

type UserMenuProps = {
    show: boolean;
    onHide: () => void;
    user: User;
};

// Export getMenus function so it can be used in other files
export const getMenus = async (userId: number) => {
    try {
        const response = await axios.get(`${API_URL}menus/${userId}`, {
            headers: {
                Accept: "application/json",
            },
        });
        return response.data; // This should contain the menus and user_menus
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            "An error occurred while fetching menus.";
        throw new Error(message); // Throw the error so it can be handled where it's called
    }
};

const UserMenu: React.FC<UserMenuProps> = ({ show, onHide, user }) => {
    const [loading, setLoading] = useState(false);
    const [menus, setMenus] = useState<Option[]>([]);
    const [selectedMenus, setSelectedMenus] = useState<Option[]>([]);
    const { addNotification } = useNotification();

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const data = await getMenus(user.id);
            setMenus(data.menus);
            setSelectedMenus(data.user_menus);
        } catch (error: any) {
            addNotification({
                message: error.message,
                type: "failure",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}user_menus`,
                {
                    user_id: user.id,
                    menu_ids: selectedMenus.map((menu) => menu.id),
                },
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );
            const { message } = response.data;
            addNotification({
                message,
                type: "success",
            });
            onHide();
        } catch (error: any) {
            const {
                response: {
                    data: { message },
                },
            } = error;
            addNotification({
                message,
                type: "failure",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            onShow={fetchMenus}
            centered
            backdrop="static"
            keyboard={false}
        >
            <ModalHeader closeButton>
                <ModalTitle>Menus ({user.name.toUpperCase()})</ModalTitle>
            </ModalHeader>
            <ModalBody>
                {loading ? (
                    <div className="text-center">
                        <i
                            // name="loader"
                            // animation="spin"
                            // size="lg"
                            className="bx bx-loader bx-spin fs-1"
                        ></i>
                    </div>
                ) : (
                    <div>
                        <Row>
                            <Col xs={9}>
                                <ReactSelect
                                    value={selectedMenus.map((menu) => ({
                                        label: menu.name.toUpperCase(),
                                        value: menu.id,
                                    }))}
                                    options={menus.map((menu) => ({
                                        label: menu.name.toUpperCase(),
                                        value: menu.id,
                                    }))}
                                    isMulti
                                    isLoading={loading}
                                    onChange={(options) =>
                                        setSelectedMenus(
                                            options.map((option) => ({
                                                id: option.value,
                                                name: option.label,
                                            }))
                                        )
                                    }
                                />
                            </Col>
                            <Col xs={3}>
                                <Button
                                    onClick={() => setSelectedMenus(menus)}
                                    className="w-100 h-100"
                                    size="sm"
                                    variant="dark"
                                >
                                    Select All
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                {loading ? (
                    <i
                    // name="loader"
                    // animation="spin"
                    className="bx bx-loader bx-spin fs-4"
                    ></i>
                ) : (
                    <Button onClick={updateUser} variant="dark">
                        UPDATE
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
};

export default UserMenu;

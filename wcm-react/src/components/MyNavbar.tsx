import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useUserContext } from "../contexts/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const MyNavbar = () => {


    const { user, removeUser, menus } = useUserContext();
    const [activeMenu, setActiveMenu] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        removeUser();
        navigate("/login");
    };

    useEffect(() => {
        setActiveMenu(location.pathname.slice(1));
    }, [location]);


    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/dashboard">
                        W C M
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link
                            href="/user"
                            active={activeMenu === "user"}
                            hidden={menus.findIndex(menu => menu.name === "USER") === -1}
                        >
                            USER
                        </Nav.Link>
                        <Nav.Link
                            href="/cloth"
                            active={activeMenu === "cloth"}
                            hidden={menus.findIndex(menu => menu.name === "CLOTH") === -1}
                        >
                            CLOTH
                        </Nav.Link>
                        <Nav.Link
                            href="/color"
                            active={activeMenu === "color"}
                            hidden={menus.findIndex(menu => menu.name === "COLOR") === -1}
                        >
                            COLOR
                        </Nav.Link>
                        <Nav.Link
                            href="/contact"
                            active={activeMenu === "contact"}
                            hidden={menus.findIndex(menu => menu.name === "CONTACT") === -1}
                        >
                            CONTACT
                        </Nav.Link>
                        <Nav.Link
                            href="/receipt"
                            active={activeMenu === "receipt"}
                            hidden={menus.findIndex(menu => menu.name === "RECEIPT") === -1}
                        >
                            RECEIPT
                        </Nav.Link>
                        <Nav.Link
                            href="/sale"
                            active={activeMenu === "sale"}
                            hidden={menus.findIndex(menu => menu.name === "SALE") === -1}
                        >
                            SALE
                        </Nav.Link>
                        <Nav.Link
                            href="/stock"
                            active={activeMenu === "stock"}
                            hidden={menus.findIndex(menu => menu.name === "STOCK") === -1}
                        >
                            STOCK
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown
                            title={user?.name.toUpperCase()}
                            id="navbarScrollingDropdown"
                        >
                            <NavDropdown.Item onClick={logout}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
};

export default MyNavbar;

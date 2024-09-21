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
                        WASTE CLOTH MANAGEMENT
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link
                            href="/user"
                            active={activeMenu === "user"}
                            hidden={!menus.includes("USER")}
                        >
                            USER
                        </Nav.Link>
                        <Nav.Link
                            href="/cloth"
                            active={activeMenu === "cloth"}
                            hidden={!menus.includes("CLOTH")}
                        >
                            CLOTH
                        </Nav.Link>
                        <Nav.Link
                            href="/color"
                            active={activeMenu === "color"}
                            hidden={!menus.includes("COLOR")}
                        >
                            COLOR
                        </Nav.Link>
                        <Nav.Link
                            href="/contact"
                            active={activeMenu === "contact"}
                            hidden={!menus.includes("CONTACT")}
                        >
                            CONTACT
                        </Nav.Link>
                        <Nav.Link
                            href="/receipt"
                            active={activeMenu === "receipt"}
                            hidden={!menus.includes("RECEIPT")}
                        >
                            RECEIPT
                        </Nav.Link>
                        <Nav.Link
                            href="/sale"
                            active={activeMenu === "sale"}
                            hidden={!menus.includes("SALE")}
                        >
                            SALE
                        </Nav.Link>
                        <Nav.Link
                            href="/stock"
                            active={activeMenu === "stock"}
                            hidden={!menus.includes("STOCK")}
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

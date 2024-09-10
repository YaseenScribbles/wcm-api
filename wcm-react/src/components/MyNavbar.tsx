import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useUserContext } from "../contexts/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const MyNavbar = () => {
    const { user, removeUser } = useUserContext();
    const [activeMenu, setActiveMenu] = useState("");
    const navigate = useNavigate();
    const location = useLocation();


    const logout = () => {
        removeUser();
        navigate("/login");
    };

    useEffect(() => {
        setActiveMenu(location.pathname.slice(1))
    }, [location])

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/">WASTE CLOTH MANAGEMENT</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link
                            href="/user"
                            active={activeMenu === "user"}
                        >
                            USER
                        </Nav.Link>
                        <Nav.Link
                            href="/cloth"
                            active={activeMenu === "cloth"}
                        >
                            CLOTH
                        </Nav.Link>
                        <Nav.Link
                            href="/color"
                            active={activeMenu === "color"}
                        >
                            COLOR
                        </Nav.Link>
                        <Nav.Link
                            href="/contact"
                            active={activeMenu === "contact"}
                        >
                            CONTACT
                        </Nav.Link>
                        <Nav.Link
                            href="/receipt"
                            active={activeMenu === "receipt"}
                        >
                            RECEIPT
                        </Nav.Link>
                        <Nav.Link
                            href="/sale"
                            active={activeMenu === "sale"}
                        >
                            SALE
                        </Nav.Link>
                        <Nav.Link
                            href="/stock"
                            active={activeMenu === "stock"}
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

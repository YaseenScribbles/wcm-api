import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const MyNavbar = () => {
    const { user, removeUser } = useUserContext();
    const navigate = useNavigate()

    const logout = () => {
        removeUser();
        navigate("/login")
    };

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/">WASTE CLOTH MANAGEMENT</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/user">USER</Nav.Link>
                        <Nav.Link href="/cloth">CLOTH</Nav.Link>
                        <Nav.Link href="/color">COLOR</Nav.Link>
                        <Nav.Link href="/contact">CONTACT</Nav.Link>
                        <Nav.Link href="/receipt">RECEIPTS</Nav.Link>
                        <Nav.Link href="">SALES</Nav.Link>
                        <Nav.Link href="">STOCK</Nav.Link>
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

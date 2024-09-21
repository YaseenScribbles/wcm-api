import { useLayoutEffect, useState } from "react";
import { Container } from "react-bootstrap";

const FourNotThree: React.FC = () => {
    // Initialize height to a default value (58 or any known default navbar height)
    const [navbarHeight, setNavbarHeight] = useState(58);

    useLayoutEffect(() => {
        const navbar: HTMLElement | null = document.querySelector('.navbar');
        const height = navbar ? navbar.offsetHeight : 58;
        setNavbarHeight(height); // Update state with the actual navbar height
    }, []);

    return (
        <Container
            fluid
            className="d-flex flex-col justify-content-center align-items-center"
            style={{ height: `calc(100dvh - ${navbarHeight}px)`, width: "100dvw" }}
        >
            <div className="h1 my-auto">403 | FORBIDDEN</div>
        </Container>
    );
};

export default FourNotThree;

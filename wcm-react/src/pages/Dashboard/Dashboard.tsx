import { useEffect, useLayoutEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import Header from "../../components/Header";
import { fetchStock } from "../Stock/Stock";
import { useNotification } from "../../contexts/NotificationContext";
import StockChart from "../../charts/StockChart";

type Stock = {
    cloth: string;
    color: string;
    weight: string;
};

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(58);
    const [headerHeight, setHeaderHeight] = useState(59.59);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const { addNotification } = useNotification();

    useEffect(() => {
        getStock();
    }, []);

    useLayoutEffect(() => {
        const navbar: HTMLElement | null = document.querySelector(".navbar");
        const header: HTMLElement | null = document.querySelector(".title");
        const height = navbar ? navbar.offsetHeight : 58;
        const headerHeight = header ? header.offsetHeight : 59.59;
        setNavbarHeight(height);
        setHeaderHeight(headerHeight);
    },[])

    const getStock = async () => {
        try {
            setLoading(true);
            const stocks = await fetchStock();
            setStocks(stocks);
        } catch (error: any) {
            addNotification({
                message: error.message,
                type: "failure",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            style={{
                height: `calc(100dvh - ${navbarHeight}px)`,
                maxHeight: `calc(100dvh - ${navbarHeight}px)`,
            }}
            className="d-flex flex-column"
        >
            <Header title="DASHBOARD" />
            <div
                className="dashboard"
                style={{
                    width: "100%",
                    height: `calc(100% - ${navbarHeight + headerHeight}px)`,
                    maxHeight: `calc(100% - ${navbarHeight + headerHeight}px)`,
                }}
            >
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center">
                        <box-icon
                            name="loader"
                            animation="spin"
                            size="lg"
                        ></box-icon>
                    </div>
                ) : (
                    <div className="d-flex flex-column flex-grow-1">
                        {stocks.length > 0 && (
                            <Card
                                bg={"dark"}
                                key={"dark"}
                                text={"white"}
                                className="my-2"
                            >
                                <Card.Header>STOCK</Card.Header>
                                <Card.Body>
                                    <StockChart stock={stocks} />
                                </Card.Body>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </Container>
    );
};

export default Dashboard;

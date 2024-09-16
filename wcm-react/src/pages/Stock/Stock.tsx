import { Card, Container, Table } from "react-bootstrap";
import Header from "../../components/Header";
import { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";
const CustomPagination = lazy(() => import("../../components/MyPagination"));
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

type Stock = {
    cloth: string;
    color: string;
    weight: string;
};

const Stock: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const { addNotification } = useNotification();

    const getStocks = async (page: number = 1) => {
        try {
            setLoading(true);
            const result = await axios.get(`${API_URL}report?page=${page}`);
            const { data, total } = result.data.stock;
            setStocks(data);
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

    const download = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Stock");

            // Define column headers
            worksheet.columns = [
                { header: "Cloth", key: "cloth", width: 20 },
                { header: "Color", key: "color", width: 20 },
                { header: "Weight", key: "weight", width: 15 },
            ];

            // Add data rows
            stocks.forEach((stock) => {
                worksheet.addRow({
                    cloth: stock.cloth,
                    color: stock.color,
                    weight: parseFloat(stock.weight), // Ensure weight is a number
                });
            });

            // Format the weight column (Column 3) as a decimal number with 2 decimal places
            worksheet.getColumn(3).numFmt = "0.00";

            // Align weight column (Column 3) to the right
            worksheet.getColumn(3).alignment = {
                horizontal: "right",
                vertical: "middle",
            };

            // Generate the Excel file and download it
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), "stock-report.xlsx");
        } catch (error) {
            console.error("Error creating Excel file:", error);
            // Add appropriate error handling or notification
        }
    };

    useEffect(() => {
        getStocks(currentPage);
    }, [currentPage]);

    return (
        <Container>
            <Header
                title="STOCK"
                buttonText="DOWNLOAD"
                buttonFunction={download}
                isReport
            />
            <hr />
            <Card className="p-2">
                <Table hover variant="dark" size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>CLOTH</th>
                            <th>COLOR</th>
                            <th>WEIGHT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            stocks.map((stock, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>
                                        <td>{stock.cloth.toUpperCase()}</td>
                                        <td>{stock.color.toUpperCase()}</td>
                                        <td>{stock.weight}</td>
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
        </Container>
    );
};

export default Stock;

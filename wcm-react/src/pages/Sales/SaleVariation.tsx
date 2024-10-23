import React, { useEffect, useState } from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
    PDFViewer,
} from "@react-pdf/renderer";
import axios from "axios";
import { API_URL } from "../../assets/common";
import { useNotification } from "../../contexts/NotificationContext";
import { useParams } from "react-router-dom";

// Define types
type Sale = {
    no: string;
    date: string;
    remarks: string;
    name: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
    gst: string;
    ref_no: string;
    ref_date: string;
};

type SaleItem = {
    s_no: string;
    cloth: string;
    color: string;
    weight: string;
    actual_weight: string;
    rate: string;
    amount: string;
};

type Breakup = {
    ledger: string;
    value: string;
};

Font.register({
    family: "Roboto",
    fonts: [
        {
            src: "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf", // Roboto Regular
            fontWeight: "normal",
        },
        {
            src: "https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmWUlfBBc9.ttf", // Roboto Bold
            fontWeight: "bold",
        },
    ],
});

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    companyName: {
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    title: {
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
    },
    twoTitles: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sectionTitle: {
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 10,
    },
    text: {
        fontFamily: "Roboto",
        fontSize: 12,
        marginBottom: 5,
    },
    tableHeader: {
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: 12,
        // marginBottom: 5,
        borderBottom: 1,
        paddingBottom: 3,
        backgroundColor: "#D3D3D3",
    },
    tableRow: {
        fontFamily: "Roboto",
        fontSize: 12,
        marginBottom: 3,
        display: "flex",
        flexDirection: "row",
        borderBottom: "1 solid #999",
    },
    tableContainer: {
        marginBottom: 20,
    },
    tableCell: {
        width: "15%",
        textAlign: "left",
        padding: 3,
        // border: "1 solid #333"
        // borderLeft:"1 solid #999",
        // borderRight: "1 solid #999"
    },
    tableFooter: {
        borderTop: 1,
        borderBottom: 1,
        backgroundColor: "#D3D3D3",
    },
    center: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    heading: {
        fontFamily: "Roboto",
        fontSize: 12,
        width: "55",
    },
    colon: {
        fontSize: "10",
        width: "20",
    },
    master: {
        fontFamily: "Roboto",
        fontSize: 12,
    },
    columns: {
        display: "flex",
        flexDirection: "row",
        marginBottom: "5",
    },
    summary: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        fontFamily: "Roboto",
        fontSize: "12",
        fontWeight: "bold",
        marginBottom: "5",
    },
    lastRow: {
        borderBottom: "none",
    },
});

const ITEM_PER_PAGE = 26;

// PDF Document Component
const SaleVariation: React.FC = () => {
    const params = useParams();

    const [sale, setSale] = useState<Sale>({
        no: "",
        date: "",
        remarks: "",
        name: "",
        address: "",
        city: "",
        pincode: "",
        phone: "",
        gst: "",
        ref_no: "",
        ref_date: "",
    });
    const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
    const [breakup, setBreakup] = useState<Breakup[]>([]);
    const { addNotification } = useNotification();
    // const chunkedItems: SaleItem[][] = [];
    const [chunkedItems, setChunkedItems] = useState<SaleItem[][]>([]);

    useEffect(() => {
        if (+params.id! > 0) {
            try {
                axios
                    .get(`${API_URL}report/${params.id}`, {
                        headers: {
                            Accept: "application/json",
                        },
                    })
                    .then((resp) => {
                        const { sale, saleItems, breakup } = resp.data;
                        let chunkedItems: SaleItem[][] = [];
                        for (
                            let index = 0;
                            index < saleItems.length;
                            index += ITEM_PER_PAGE
                        ) {
                            chunkedItems.push(
                                saleItems.slice(index, index + ITEM_PER_PAGE)
                            );
                        }
                        setChunkedItems(chunkedItems);
                        setSale(sale);
                        setSaleItems(saleItems);
                        setBreakup(breakup);
                    })
                    .catch((error: any) => {
                        const {
                            response: {
                                data: { message },
                            },
                        } = error;
                        addNotification({
                            message,
                            type: "failure",
                        });
                    });
            } catch (error: any) {
                addNotification({
                    message: error.message,
                    type: "failure",
                });
            }
        }
    }, [params.id]);

    return (
        <PDFViewer
            style={{
                height: "100vh",
                width: "100%",
            }}
        >
            <Document>
                {chunkedItems.map((items, pageIndex) => (
                    <Page key={pageIndex} size={"A4"} style={styles.page}>
                        {pageIndex === 0 && (
                            <View style={styles.companyName}>
                                <Text>ESSA GARMENTS PRIVATE LIMITED</Text>
                            </View>
                        )}

                        {/* {Company Address} */}
                        {pageIndex === 0 && (
                            <View style={[styles.center, styles.text]}>
                                <Text>
                                    NO. 21, VENKATESAIYA COLONY, KANGEYAM ROAD,
                                    TIRUPUR - 641604
                                </Text>
                            </View>
                        )}

                        {pageIndex === 0 && (
                            <View
                                style={[
                                    styles.center,
                                    styles.sectionTitle,
                                    { marginVertical: 10 },
                                ]}
                            >
                                <Text>
                                    CUTTING WASTE REPORT (
                                    {new Date(
                                        sale.ref_date
                                    ).toLocaleDateString()}
                                    )
                                </Text>
                            </View>
                        )}

                        {/* Sale Items Table */}
                        <View style={styles.tableContainer}>
                            {/* Table Header */}
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text
                                    style={[styles.tableCell, { width: "10%" }]}
                                >
                                    S No
                                </Text>
                                <Text style={styles.tableCell}>Color</Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        { textAlign: "right", width: "20%" },
                                    ]}
                                >
                                    DC
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        { textAlign: "right" },
                                    ]}
                                >
                                    Final
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        { textAlign: "right" },
                                    ]}
                                >
                                    Variation
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        { textAlign: "right" },
                                    ]}
                                >
                                    Rate
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        { textAlign: "right" },
                                    ]}
                                >
                                    Amount
                                </Text>
                            </View>

                            {/* Table Rows */}
                            {items.map((item: SaleItem, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.tableRow,
                                        index === items.length - 1
                                            ? styles.lastRow
                                            : {},
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { width: "10%" },
                                        ]}
                                    >
                                        {item.s_no}
                                    </Text>
                                    <Text style={[styles.tableCell, { width: "20%" }]}>
                                        {item.color.toUpperCase()}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { textAlign: "right" },
                                        ]}
                                    >
                                        {(+item.weight).toFixed(2)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { textAlign: "right" },
                                        ]}
                                    >
                                        {(+item.actual_weight).toFixed(2)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { textAlign: "right" },
                                        ]}
                                    >
                                        {(
                                            +item.actual_weight - +item.weight
                                        ).toFixed(2)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { textAlign: "right" },
                                        ]}
                                    >
                                        {(+item.rate).toFixed(2)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { textAlign: "right" },
                                        ]}
                                    >
                                        {(+item.amount).toFixed(2)}
                                    </Text>
                                </View>
                            ))}

                            {pageIndex === chunkedItems.length - 1 && (
                                <View
                                    style={[
                                        styles.tableFooter,
                                        styles.tableRow,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { width: "10%" },
                                        ]}
                                    ></Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            {
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            },
                                        ]}
                                    >
                                        {saleItems
                                            .reduce(
                                                (acc, item) =>
                                                    acc + +item.weight,
                                                0
                                            )
                                            .toFixed(2)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            {
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            },
                                        ]}
                                    >
                                        {saleItems
                                            .reduce((acc, item) => {
                                                //ignore kithan bags
                                                if (
                                                    item.color.toLowerCase() ===
                                                    "kithan"
                                                )
                                                    return acc;

                                                return (
                                                    acc + +item.actual_weight
                                                );
                                            }, 0)
                                            .toFixed(2)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            {
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            },
                                        ]}
                                    >
                                        {saleItems
                                            .reduce((acc, item) => {
                                                //ignore kithan
                                                if (
                                                    item.color.toLowerCase() ===
                                                    "kithan"
                                                )
                                                    return acc;

                                                return (
                                                    acc +
                                                    (+item.actual_weight -
                                                        +item.weight)
                                                );
                                            }, 0)
                                            .toFixed(2)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            {
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            },
                                        ]}
                                    ></Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            {
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            },
                                        ]}
                                    >
                                        {saleItems
                                            .reduce(
                                                (acc, item) =>
                                                    acc + +item.amount,
                                                0
                                            )
                                            .toFixed(2)}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {pageIndex === chunkedItems.length - 1 &&
                            breakup.map((b, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.summary,
                                        {
                                            width: "50%",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginLeft: "auto",
                                            marginVertical: "2",
                                            padding: "5",
                                        },
                                    ]}
                                >
                                    <Text>{b.ledger.toUpperCase()}</Text>
                                    <Text>{(+b.value).toFixed(2)}</Text>
                                </View>
                            ))}
                    </Page>
                ))}
            </Document>
        </PDFViewer>
    );
};

export default SaleVariation;

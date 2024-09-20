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
};

type SaleItem = {
    s_no: string;
    cloth: string;
    color: string;
    weight: string;
    rate: string;
    amount: string;
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
        marginBottom: 5,
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
    },
    tableContainer: {
        marginBottom: 20,
    },
    tableCell: {
        width: "20%",
        textAlign: "left",
        padding: 3,
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
});

// PDF Document Component
const SaleInvoice: React.FC = () => {
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
    });
    const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
    const { addNotification } = useNotification();

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
                        const { sale, saleItems } = resp.data;
                        setSale(sale);
                        setSaleItems(saleItems);
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
                <Page style={styles.page}>
                    {/* {Company Name} */}
                    <View style={styles.companyName}>
                        <Text>ESSA GARMENTS PRIVATE LIMITED</Text>
                    </View>

                    {/* {Company Address} */}
                    <View style={[styles.center, styles.text]}>
                        <Text>
                            NO. 21, VENKATESAIYA COLONY, KANGEYAM ROAD, TIRUPUR
                            - 641604
                        </Text>
                    </View>

                    {/* Title */}
                    <View style={styles.title}>
                        <Text>Sales Invoice</Text>
                    </View>

                    {/* Sale Details */}
                    <View style={styles.twoTitles}>
                        <Text style={styles.sectionTitle}>Bill To</Text>
                        <Text style={styles.sectionTitle}>Invoice Details</Text>
                    </View>
                    <View>
                        <View style={styles.columns}>
                            <Text style={styles.heading}>Name</Text>
                            <Text style={styles.master}>
                                {sale.name.toUpperCase()}
                            </Text>
                            <Text
                                style={[
                                    styles.heading,
                                    { marginLeft: "auto", width: "50" },
                                ]}
                            >
                                Inv. No
                            </Text>
                            <Text style={styles.colon}></Text>
                            <Text style={[styles.master, { width: "40" }]}>
                                {sale.no}
                            </Text>
                        </View>

                        <View style={styles.columns}>
                            <Text style={styles.heading}>Address</Text>
                            <Text
                                style={[
                                    styles.master,
                                    {
                                        display: "flex",
                                        flexWrap: "nowrap",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                    },
                                ]}
                            >
                                {sale.address && sale.address.toUpperCase()},{" "}
                                {sale.city && sale.city.toUpperCase()} -
                                {sale.pincode && sale.pincode}
                            </Text>
                            <Text
                                style={[
                                    styles.heading,
                                    { marginLeft: "auto", width: "50" },
                                ]}
                            >
                                Inv. Date
                            </Text>
                            <Text style={styles.colon}></Text>
                            <Text style={[styles.master, { width: "40" }]}>
                                {new Date(sale.date).toLocaleDateString()}
                            </Text>
                        </View>

                        <View style={styles.columns}>
                            <Text style={styles.heading}>Phone</Text>
                            <Text style={styles.master}>{sale.phone && sale.phone}</Text>
                        </View>

                        <View style={styles.columns}>
                            <Text style={styles.heading}>Gst</Text>
                            <Text style={styles.master}>
                                {sale.gst && sale.gst.toUpperCase()}
                            </Text>
                        </View>

                        <View style={styles.columns}>
                            <Text style={styles.heading}>Remarks</Text>
                            <Text style={styles.master}>
                                {sale.remarks && sale.remarks.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.center, styles.sectionTitle]}>
                        <Text>Sale Items</Text>
                    </View>
                    {/* Sale Items Table */}
                    <View style={styles.tableContainer}>
                        {/* Table Header */}
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={[styles.tableCell, { width: "10%" }]}>
                                S No
                            </Text>
                            <Text style={styles.tableCell}>Cloth</Text>
                            <Text style={styles.tableCell}>Color</Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    { textAlign: "right" },
                                ]}
                            >
                                Weight
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
                        {saleItems.map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text
                                    style={[styles.tableCell, { width: "10%" }]}
                                >
                                    {item.s_no}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {item.cloth.toUpperCase()}
                                </Text>
                                <Text style={styles.tableCell}>
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

                        <View style={[styles.tableFooter, styles.tableRow]}>
                            <Text
                                style={[styles.tableCell, { width: "10%" }]}
                            ></Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    { textAlign: "right", fontWeight: "bold" },
                                ]}
                            >
                                {saleItems
                                    .reduce(
                                        (acc, item) => acc + +item.weight,
                                        0
                                    )
                                    .toFixed(2)}
                            </Text>
                            <Text style={styles.tableCell}></Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    { textAlign: "right", fontWeight: "bold" },
                                ]}
                            >
                                {saleItems
                                    .reduce(
                                        (acc, item) => acc + +item.amount,
                                        0
                                    )
                                    .toFixed(2)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.summary}>
                        <Text>Total Weight</Text>
                        <Text>
                            {saleItems
                                .reduce((acc, item) => acc + +item.weight, 0)
                                .toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.summary}>
                        <Text>Total Amount</Text>
                        <Text>
                            {saleItems
                                .reduce((acc, item) => acc + +item.amount, 0)
                                .toFixed(2)}
                        </Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default SaleInvoice;

import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";

// Define types
type Stock = {
    cloth: string;
    color: string;
    weight: string;
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
        padding: 10,
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
        width: "30%",
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

type StockProps = {
    stock: Stock[];
};

// PDF Document Component
const StockDocument: React.FC<StockProps> = ({ stock }) => {
    return (
        <Document>
            <Page style={styles.page} break>
                {/* {Company Name} */}
                <View style={styles.companyName} fixed>
                    <Text>ESSA GARMENTS PRIVATE LIMITED</Text>
                </View>

                {/* {Company Address} */}
                <View style={[styles.center, styles.text]} fixed>
                    <Text>
                        NO. 21, VENKATESAIYA COLONY, KANGEYAM ROAD, TIRUPUR -
                        641604
                    </Text>
                </View>

                {/* Title */}
                <View style={styles.title} fixed>
                    <Text>Stock Report</Text>
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
                            style={[styles.tableCell, { textAlign: "right" }]}
                        >
                            Weight
                        </Text>
                    </View>

                    {/* Table Rows */}
                    {stock.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text
                                style={[
                                    styles.tableCell,
                                    { width: "10%", textAlign: "center" },
                                ]}
                            >
                                {index + 1}
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
                            {stock
                                .reduce((acc, item) => acc + +item.weight, 0)
                                .toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View style={styles.summary}>
                    <Text>Total Weight</Text>
                    <Text>
                        {stock
                            .reduce((acc, item) => acc + +item.weight, 0)
                            .toFixed(2)}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default StockDocument;

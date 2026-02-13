import { useLayoutEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

type Stock = {
    cloth: string;
    color: string;
    weight: string;
};

type StockChartProps = {
    stock: Stock[];
};

const StockChart: React.FC<StockChartProps> = ({ stock }) => {
    const [height, setHeight] = useState(0);

    const transformedData = stock.map((item) => ({
        Label: `${item.color.toUpperCase()}`,
        Weight: parseFloat((+item.weight).toFixed(2)),
    }));

    useLayoutEffect(() => {
        const container: HTMLElement | null =
            document.querySelector(".dashboard");
        const height = container ? container.offsetHeight : 0;
        setHeight(height);
    }, []);

    return (
        <ResponsiveContainer height={height / 3} width="100%">
            <BarChart
                data={transformedData}
                margin={{
                    top: 20,
                    right: 40,
                    left: 10,
                    bottom: 5,
                }}
            >
                <CartesianGrid />
                <XAxis dataKey="Label" />
                <YAxis dataKey="Weight" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Weight" fill="#1ABC9C" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StockChart;

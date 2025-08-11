import React, { useRef } from "react";
import ReactEcharts from "echarts-for-react";

const VisitorInsights = () => {
    const chartRef = useRef(null);

    const data = {
        "Loyal Customers": [320, 280, 240, 200, 190, 290, 310, 300, 280, 260, 220, 180],
        "New Customers": [240, 200, 120, 160, 220, 340, 360, 320, 290, 270, 230, 150],
        "Unique Customers": [280, 320, 300, 260, 210, 230, 290, 310, 300, 290, 250, 200],
    };

    const option = {
        color: ["#a855f7", "#ef4444", "#22c55e"], // Tailwind purple-500, red-500, green-500
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(31, 41, 55, 0.9)", // gray-800
            textStyle: { color: "#fff", fontSize: 12 },
            borderRadius: 6,
            padding: 8,
        },
        legend: {
            bottom: 0,
            icon: "circle",
            textStyle: {
                fontSize: 14,
                color: "#111827", // gray-900
            },
        },
        grid: {
            top: 40,
            left: 20,
            right: 20,
            bottom: 60,
            containLabel: true,
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ],
            axisLine: { lineStyle: { color: "#e5e7eb" } }, // gray-200
            axisLabel: {
                fontSize: 12,
                color: "#6b7280", // gray-500
            },
        },
        yAxis: {
            type: "value",
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
                lineStyle: {
                    type: "dashed",
                    color: "#e5e7eb",
                },
            },
            axisLabel: {
                fontSize: 12,
                color: "#9ca3af", // gray-400
            },
        },
        series: [
            {
                name: "Loyal Customers",
                type: "line",
                data: data["Loyal Customers"],
                smooth: true,
                symbol: "circle",
                symbolSize: 8,
                lineStyle: {
                    width: 4,
                },
            },
            {
                name: "New Customers",
                type: "line",
                data: data["New Customers"],
                smooth: true,
                symbol: "circle",
                symbolSize: 8,
                lineStyle: {
                    width: 4,
                },
            },
            {
                name: "Unique Customers",
                type: "line",
                data: data["Unique Customers"],
                smooth: true,
                symbol: "circle",
                symbolSize: 8,
                lineStyle: {
                    width: 4,
                },
            },
        ],
    };

    return (
        <div className="bg-white m-2 rounded-xl shadow-md p-6 max-w-3xl w-full mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Visitor Insights</h2>
            <ReactEcharts
                ref={chartRef}
                option={option}
                style={{ height: 300, width: "100%" }}
            />
        </div>
    );
};

export default VisitorInsights;

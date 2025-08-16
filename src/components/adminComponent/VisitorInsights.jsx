import React, { useEffect, useState, useRef } from "react";
import ReactEcharts from "echarts-for-react";

const VisitorInsights = () => {
    const chartRef = useRef(null);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        const observer = new MutationObserver(() => {
            setIsDark(root.classList.contains("admin-dark") || root.classList.contains("dark"));
        });
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        setIsDark(root.classList.contains("admin-dark") || root.classList.contains("dark"));
        return () => observer.disconnect();
    }, []);

    const data = {
        "Loyal Customers": [320, 280, 240, 200, 190, 290, 310, 300, 280, 260, 220, 180],
        "New Customers": [240, 200, 120, 160, 220, 340, 360, 320, 290, 270, 230, 150],
        "Unique Customers": [280, 320, 300, 260, 210, 230, 290, 310, 300, 290, 250, 200],
    };

    const option = {
        color: ["#a855f7", "#ef4444", "#22c55e"], // purple-500, red-500, green-500
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
                color: isDark ? "#f3f4f6" : "#111827", // dark->gray-100, light->gray-900
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
            axisLine: { lineStyle: { color: isDark ? "#374151" : "#e5e7eb" } }, // dark->gray-700
            axisLabel: {
                fontSize: 12,
                color: isDark ? "#d1d5db" : "#6b7280", // dark->gray-300, light->gray-500
            },
        },
        yAxis: {
            type: "value",
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
                lineStyle: {
                    type: "dashed",
                    color: isDark ? "#374151" : "#e5e7eb", // dark->gray-700
                },
            },
            axisLabel: {
                fontSize: 12,
                color: isDark ? "#9ca3af" : "#9ca3af", // cả hai ok nhưng dark sáng hơn
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
                lineStyle: { width: 4 },
            },
            {
                name: "New Customers",
                type: "line",
                data: data["New Customers"],
                smooth: true,
                symbol: "circle",
                symbolSize: 8,
                lineStyle: { width: 4 },
            },
            {
                name: "Unique Customers",
                type: "line",
                data: data["Unique Customers"],
                smooth: true,
                symbol: "circle",
                symbolSize: 8,
                lineStyle: { width: 4 },
            },
        ],
    };

    return (
        <div className="bg-white admin-dark:bg-gray-800 m-2 rounded-xl shadow-md p-6 max-w-3xl w-full mx-auto transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-900 admin-dark:text-white mb-4">
                Visitor Insights
            </h2>
            <ReactEcharts
                ref={chartRef}
                option={option}
                style={{ height: 300, width: "100%" }}
            />
        </div>
    );
};

export default VisitorInsights;

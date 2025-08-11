import React, { useRef, useMemo } from "react";
import ReactEcharts from "echarts-for-react";

const BuyersProfile = () => {
    const chartRef = useRef(null);

    const data = [
        { value: 50, name: "Male", color: "#F97316" },   // orange-500
        { value: 35, name: "Female", color: "#A7F3D0" }, // teal-200 (màu nhạt hơn)
        { value: 15, name: "Others", color: "#EF4444" }, // red-500
    ];

    const option = useMemo(() => ({
        tooltip: {
            trigger: "item",
            formatter: "{b}: {c}%",
            backgroundColor: "rgba(31, 41, 55, 0.9)", // Tailwind gray-800
            textStyle: { color: "#fff", fontSize: 14 },
            padding: [8, 12],
            borderRadius: 6,
        },
        color: data.map(d => d.color),
        legend: { show: false },
        series: [
            {
                name: "Buyers Profile",
                type: "pie",
                radius: ["60%", "80%"],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: "#fff",
                    borderWidth: 3,
                },
                label: { show: false, position: "center" },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 24,
                        fontWeight: "bold",
                        formatter: "{b}\n{d}%",
                        color: "#111827", // Tailwind gray-900
                    },
                },
                labelLine: { show: false },
                data,
            },
        ],
    }), [data]);

    return (
        <div className="max-w-xs mx-auto p-6 m-4 bg-white rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Buyers Profile</h2>

            <ReactEcharts
                ref={chartRef}
                option={option}
                style={{ height: 220, width: "100%" }}
            />

            <div className="mt-6 space-y-2">
                {data.map(({ name, value, color }) => (
                    <div
                        key={name}
                        className="flex justify-between items-center w-full px-2 py-1 rounded text-gray-700"
                        style={{ cursor: "default" }}
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-gray-700 font-medium">{name}</span>
                        </div>
                        <span className="text-gray-900 font-semibold">{value}%</span>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default BuyersProfile;

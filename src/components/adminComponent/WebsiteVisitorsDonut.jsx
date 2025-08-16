import React, { useRef, useMemo } from "react";
import ReactEcharts from "echarts-for-react";

const WebsiteVisitorsDonut = () => {
    const chartRef = useRef(null);

    const data = [
        { value: 38, name: "Direct", color: "#F97316" },   // orange-500
        { value: 22, name: "Organic", color: "#14B8A6" },  // teal-500
        { value: 12, name: "Paid", color: "#60A5FA" },     // blue-400
        { value: 28, name: "Social", color: "#EF4444" },   // red-500
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
                name: "Website Visitors",
                type: "pie",
                radius: ["60%", "80%"],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: "#fff",
                    borderWidth: 3,
                },
                label: {
                    show: false,
                    position: "center",
                },
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
        <div className="max-w-xs mx-auto p-6 m-4 bg-white rounded-xl shadow-md admin-dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 admin-dark:text-gray-100 mb-4">Website Visitors</h2>
            <ReactEcharts
                ref={chartRef}
                option={option}
                style={{ height: 220, width: "100%" }}
            />
            <div className="mt-6 space-y-2">
                {data.map(({ name, value, color }) => (
                    <div key={name} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-gray-600 font-medium admin-dark:text-gray-300">{name}</span>
                        </div>
                        <span className="text-gray-900 font-semibold admin-dark:text-gray-100">{value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WebsiteVisitorsDonut;

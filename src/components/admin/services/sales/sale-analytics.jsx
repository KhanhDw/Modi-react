"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useOutletContext } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    let display = "";

    // Chuyển T1 → Tháng 1
    const monthNumber = label.replace("T", "");
    const displayLabel = `Tháng ${monthNumber}`;

    // Format số tiền
    if (value >= 1000000) display = (value / 1000000).toFixed(2) + " Triệu";
    else if (value >= 1000) display = (value / 1000).toFixed(0) + "Nghìn";
    else display = value.toLocaleString("vi-VN") + "₫";

    return (
      <div className="p-2 bg-white border border-gray-200 rounded shadow admin-dark:bg-gray-800 admin-dark:border-gray-600">
        <p className="text-sm text-gray-700 admin-dark:text-gray-200">{displayLabel}</p>
        <p className="font-semibold text-green-600 admin-dark:text-green-400">{display}</p>
      </div>
    );
  }

  return null;
};



export default function SaleAnalytics() {
  const { initDataService, initDataBooking } = useOutletContext();
  const months = Array.from({ length: 12 }, (_, i) => ({ month: `T${i + 1}`, revenue: 0 }));

  initDataBooking.forEach((b) => {
    // chỉ tính booking completed
    if (b.status === "completed" && b.completed_date && b.is_deleted === 0) {
      const date = new Date(b.completed_date);
      const monthIndex = date.getMonth(); // 0 = Jan, 11 = Dec
      months[monthIndex].revenue += Number(b.price) * (b.quantity || 1);
    }
  });


  return (
    <>
      <Card className="bg-white admin-dark:bg-gray-800 rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-700/50 border border-[#e5e7eb] admin-dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 admin-dark:text-white">Doanh thu</CardTitle>
          <CardDescription className="text-[#5ea25e] admin-dark:text-green-400">
            Biểu đồ hiển thị doanh thu tổng hợp theo tháng từ tất cả dịch vụ,
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={months}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" admin-dark:stroke="#374151" />
              <XAxis dataKey="month" stroke="#374151" admin-dark:stroke="#9ca3af" />
              <YAxis
                stroke="#374151" admin-dark:stroke="#9ca3af"
                tickFormatter={(value) => {
                  if (value >= 1000000) return value / 1000000 + "M"; // 1,200,000 → 1.2M
                  if (value >= 1000) return value / 1000 + "k"; // 12,000 → 12k
                  return value;
                }}
              />
              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                admin-dark:stroke="#4ade80"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
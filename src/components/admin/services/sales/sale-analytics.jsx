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

export default function SaleAnalytics() {
  const { initDataService } = useOutletContext();
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: `T${i + 1}`,
    revenue: 0,
  }));

  initDataService.forEach((s) => {
    const revenue = s.revenue ? s.revenue : 0;
    if (s.created_at) {
      const date = new Date(s.created_at);
      const monthIndex = date.getMonth();

      const serviceRevenue = revenue || 0;

      months[monthIndex].revenue += parseFloat(serviceRevenue) || 0;
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
              <Tooltip
                formatter={(value) =>
                  value.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                }
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e5e7eb",
                  color: "#374151",
                }}
                admin-dark:contentStyle={{
                  backgroundColor: "#1f2937",
                  borderColor: "#374151",
                  color: "#d1d5db",
                }}
              />
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
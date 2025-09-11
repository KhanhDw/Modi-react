"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  console.log(initDataService);
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
      <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="admin-dark:text-primary">Doanh thu</CardTitle>
          <CardDescription className="text-[#5ea25e]">
            Biểu đồ hiển thị doanh thu tổng hợp theo tháng từ tất cả dịch vụ,
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={months}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
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
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}

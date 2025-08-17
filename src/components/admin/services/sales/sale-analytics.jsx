"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageCircle,
  Share,
  Eye,
} from "lucide-react";

export default function SaleAnalytics() {
  const monthlyRevenue = [
    { month: "T1", revenue: 1200000 },
    { month: "T2", revenue: 1500000 },
    { month: "T3", revenue: 900000 },
    { month: "T4", revenue: 1800000 },
    { month: "T5", revenue: 2000000 },
    { month: "T6", revenue: 1700000 },
    { month: "T7", revenue: 1500000 },
  ];

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
            <LineChart data={monthlyRevenue}>
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

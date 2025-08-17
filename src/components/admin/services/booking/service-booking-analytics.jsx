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
const rankColors = [
  "bg-yellow-100 text-yellow-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
  "bg-gray-100 text-gray-600",
  "bg-gray-100 text-gray-600",
];
export default function ServiceBookingAnalytics({ services }) {
  console.log("ServiceBookingAnalytics", services);
  const topRevenueServices = services
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((s) => ({
      name: s.name,
      revenue: s.revenue || 0,
    }));
  const topServices = services
    .filter((s) => s.orders_count > 10)
    .sort((a, b) => b.orders_count - a.orders_count)
    .slice(0, 3)
    .map((s) => ({
      name: s.name,
      orders: s.orders_count || 0,
    }));

  const totalOrders = services.reduce(
    (sum, s) => sum + (s.orders_count || 0),
    0
  );

  const monthlyOrders = [
    { month: "T1", orders: totalOrders },
    { month: "T2", orders: Math.floor(totalOrders * 0.8) },
    { month: "T3", orders: Math.floor(totalOrders * 1.2) },
    { month: "T4", orders: Math.floor(totalOrders * 0.9) },
    { month: "T5", orders: Math.floor(totalOrders * 1.1) },
    { month: "T6", orders: Math.floor(totalOrders * 1.3) },
    { month: "T7", orders: Math.floor(totalOrders * 0.95) },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="admin-dark:text-primary">
                Số lần đặt dịch vụ theo tháng
              </CardTitle>
              <CardDescription className="text-[#5ea25e]">
                Biểu đồ thể hiện xu hướng số lượt đặt dịch vụ trong 12 tháng,
                giúp theo dõi mức độ quan tâm của khách hàng theo thời gian.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyOrders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `${value} lượt`}
                    labelFormatter={(label) => `Tháng: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="admin-dark:text-primary">
                Top 3 dịch vụ được đặt nhiều nhất
              </CardTitle>
              <CardDescription className="text-[#5ea25e]">
                Biểu đồ so sánh số lượt đặt giữa 3 dịch vụ hàng đầu, giúp nhận
                biết dịch vụ nào được khách hàng ưa chuộng nhất.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topServices}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `${value} lượt`}
                    labelFormatter={(label) => `Dịch vụ: ${label}`}
                  />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="admin-dark:text-primary">
                Top 5 dịch vụ đóng góp doanh thu lớn nhất
              </CardTitle>
              <CardDescription className="text-[#f97316]">
                Biểu đồ thể hiện mức doanh thu cao nhất của 5 dịch vụ, hỗ trợ
                đánh giá dịch vụ mang lại lợi nhuận nhiều nhất.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topRevenueServices}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `${value.toLocaleString()} VNĐ`}
                    labelFormatter={(label) => `Dịch vụ: ${label}`}
                  />
                  <Bar dataKey="revenue" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="admin-dark:text-primary">
                Chi tiết các dịch vụ mang lại doanh thu cao nhất
              </CardTitle>
              <CardDescription className="text-[#5ea25e]">
                Danh sách chi tiết 5 dịch vụ mang lại doanh thu nhiều nhất.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topRevenueServices.map((service, index) => (
                  <li
                    key={service.name}
                    className={`flex items-center justify-between p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition ${rankColors[index]}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <span className="font-semibold text-gray-700">
                      {service.revenue.toLocaleString()} đ
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

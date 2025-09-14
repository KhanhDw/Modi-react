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
} from "recharts";

const rankColors = [
  "bg-yellow-100 text-yellow-600 admin-dark:bg-yellow-900 admin-dark:text-yellow-300",
  "bg-green-100 text-green-600 admin-dark:bg-green-900 admin-dark:text-green-300",
  "bg-purple-100 text-purple-600 admin-dark:bg-purple-900 admin-dark:text-purple-300",
  "bg-gray-100 text-gray-600 admin-dark:bg-gray-800 admin-dark:text-gray-300",
  "bg-gray-100 text-gray-600 admin-dark:bg-gray-800 admin-dark:text-gray-300",
];

export default function ServiceBookingAnalytics({ services }) {
  const topServices = services
    .filter((s) => s.booking_count > 10)
    .sort((a, b) => b.booking_count - a.booking_count)
    .slice(0, 3)
    .map((s) => ({
      name: s.ten_dich_vu,
      orders: s.booking_count || 0,
    }));

  const totalOrders = services.reduce(
    (sum, s) => sum + (s.booking_count || 0),
    0
  );

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: `T${i + 1}`,
    orders: 0,
  }));

  services.forEach((s) => {
    if (s.created_at) {
      const date = new Date(s.created_at);
      const monthIndex = date.getMonth();
      months[monthIndex].orders += s.booking_count || 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card
          className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb] 
            admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
        >
          <CardHeader>
            <CardTitle className="text-gray-900 admin-dark:text-gray-100">
              Số lần đặt dịch vụ theo tháng
            </CardTitle>
            <CardDescription className="text-[#5ea25e] admin-dark:text-green-400">
              Biểu đồ thể hiện xu hướng số lượt đặt dịch vụ trong 12 tháng,
              giúp theo dõi mức độ quan tâm của khách hàng theo thời gian.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={months}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="admin-dark:stroke-gray-600"
                />
                <XAxis
                  dataKey="month"
                  stroke="#374151"
                  className="admin-dark:stroke-gray-300"
                />
                <YAxis
                  stroke="#374151"
                  className="admin-dark:stroke-gray-300"
                />
                <Tooltip
                  formatter={(value) => `${value} lượt`}
                  labelFormatter={(label) => `Tháng: ${label}`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    borderColor: "#e5e7eb",
                    color: "#374151",
                    adminDark: {
                      backgroundColor: "#1f2937",
                      borderColor: "#4b5563",
                      color: "#d1d5db",
                    },
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#22c55e"
                  strokeWidth={2}
                  className="admin-dark:stroke-green-400"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card
          className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb] 
            admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
        >
          <CardHeader>
            <CardTitle className="text-gray-900 admin-dark:text-gray-100">
              Top 3 dịch vụ được đặt nhiều nhất
            </CardTitle>
            <CardDescription className="text-[#5ea25e] admin-dark:text-green-400">
              Biểu đồ so sánh số lượt đặt giữa 3 dịch vụ hàng đầu, giúp nhận
              biết dịch vụ nào được khách hàng ưa chuộng nhất.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topServices}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="admin-dark:stroke-gray-600"
                />
                <XAxis
                  dataKey="name"
                  stroke="#374151"
                  className="admin-dark:stroke-gray-300"
                />
                <YAxis
                  stroke="#374151"
                  className="admin-dark:stroke-gray-300"
                />
                <Tooltip
                  formatter={(value) => `${value} lượt`}
                  labelFormatter={(label) => `Dịch vụ: ${label}`}
                  labelStyle={{ color: "red", fontWeight: "bold" }}
                  itemStyle={{ color: "blue" }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    borderColor: "#e5e7eb",
                    color: "#374151",
                    adminDark: {
                      backgroundColor: "#1f2937",
                      borderColor: "#4b5563",
                      color: "#d1d5db",
                    },
                  }}
                />
                <Bar
                  dataKey="orders"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  className="admin-dark:fill-blue-500"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
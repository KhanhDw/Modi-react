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
  "bg-yellow-100 text-yellow-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
  "bg-gray-100 text-gray-600",
  "bg-gray-100 text-gray-600",
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
                <LineChart data={months}>
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
                    labelStyle={{ color: "red", fontWeight: "bold" }} // màu label
                    itemStyle={{ color: "blue" }} // màu value
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                    }} // khung
                  />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

// Hàm chuyển đổi bookings → services
function transformBookingsToServices(bookings) {
  const serviceMap = {};

  bookings.forEach((b) => {
    const key = b.service_id;

    if (!serviceMap[key]) {
      serviceMap[key] = {
        service_id: b.service_id,
        ten_dich_vu: b.service_name,
        booking_count: 0,
        totalRevenue: 0,
        created_at: b.created_at, // lấy created_at của lần đầu tiên gặp
      };
    }

    serviceMap[key].booking_count += 1;
    serviceMap[key].totalRevenue += Number(b.total) || 0;

    // nếu muốn created_at là lần mới nhất, thì update:
    if (new Date(b.created_at) > new Date(serviceMap[key].created_at)) {
      serviceMap[key].created_at = b.created_at;
    }
  });

  return Object.values(serviceMap);
}

export default function ServiceBookingAnalytics({ bookings }) {
  // Gom dữ liệu
  const services = transformBookingsToServices(bookings);

  // Top 3 dịch vụ nhiều booking nhất
  const topServices = services
    .sort((a, b) => b.booking_count - a.booking_count)
    .slice(0, 3)
    .map((s) => ({
      name: s.ten_dich_vu,
      orders: s.booking_count,
    }));

  // Tổng đơn
  const totalOrders = services.reduce(
    (sum, s) => sum + (s.booking_count || 0),
    0
  );

  // Tạo dữ liệu 12 tháng
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: `T${i + 1}`,
    orders: 0,
  }));

  bookings.forEach((b) => {
    if (b.created_at) {
      const date = new Date(b.created_at);
      const monthIndex = date.getMonth(); // 0 → 11
      months[monthIndex].orders += 1;
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Biểu đồ LineChart */}
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

        {/* Biểu đồ BarChart */}
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
                  tickFormatter={(value) =>
                    value.length > 20 ? value.substring(0, 20) + "..." : value
                  }
                />

                <YAxis
                  stroke="#374151"
                  className="admin-dark:stroke-gray-300"
                />
                <Tooltip
                  formatter={(value) => `${value} lượt`}
                  labelFormatter={(label) => `Dịch vụ: ${label}`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    borderColor: "#e5e7eb",
                    color: "#374151",
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

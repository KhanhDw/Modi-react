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
import { Car } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import useLenisLocal from '@/hook/useLenisLocal'


export default function ServiceCustomerAnalytics() {
  useLenisLocal(".lenis-local")

  const { initDataCustomer, initDataBooking } = useOutletContext();

  const sortCustomersByCreatedAt = initDataCustomer
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20); // lấy 5 khách hàng mới nhất
  const latestCustomer = [
    {
      monthlyYear: "1/2025",
      totalCustomers: 0,
    },
    {
      monthlyYear: "2/2025",
      totalCustomers: 0,
    },
    {
      monthlyYear: "3/2025",
      totalCustomers: 0,
    },
    {
      monthlyYear: "4/2025",
      totalCustomers: 0,
    },
    {
      monthlyYear: "5/2025",
      totalCustomers: 0,
    },
    {
      monthlyYear: "6/2025",
      totalCustomers: 0,
    },
    {
      monthlyYear: "7/2025",
      totalCustomers: 0,
    },
    {
      monthlyYear: "8/2025",
      totalCustomers: 0,
    },
    {
      monthlyYear: "9/2025",
      totalCustomers: 0,
    },
    {
      monthlyYear: "10/2025",
      totalCustomers: 0,
    },
    {
      monthlyYear: "11/2025",
      totalCustomers: 0,
    },
    {
      monthlyYear: "12/2025",
      totalCustomers: 0,
    },
  ];

  // Tạo sẵn 12 tháng với count = 0
  const bookingByMonth = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    year: new Date().getFullYear(),
    totalBookings: 0,
  }));

  // Đếm số booking theo tháng
  initDataBooking.forEach((booking) => {
    const date = new Date(booking.booking_date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // chỉ tính cho năm hiện tại, nếu muốn nhiều năm thì cần group thêm
    if (year === new Date().getFullYear()) {
      bookingByMonth[month - 1].totalBookings += 1;
    }
  });

  // Chuẩn hóa dữ liệu cho biểu đồ
  const chartBookingData = bookingByMonth.map((item) => ({
    name: `${item.month}/${item.year}`,
    totalBookings: item.totalBookings,
  }));





  initDataCustomer.forEach((customer) => {
    const date = new Date(customer.created_at);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthlyYear = `${month}/${year}`;

    const index = latestCustomer.findIndex(
      (item) => item.monthlyYear === monthlyYear
    );

    if (index !== -1) {
      latestCustomer[index].totalCustomers += 1;
    }
  });

  const chartLatestCustomer = latestCustomer
    .filter((c) => c.totalCustomers > 0)
    .map((item) => ({
      name: item.monthlyYear,
      totalCustomers: item.totalCustomers,
    }));



  // Hàm format thời gian tương đối
  function formatRelativeTime(dateString) {
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now - created;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  }


  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card
          className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb] 
            admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
        >
          <CardHeader>
            <CardTitle className="text-gray-900 admin-dark:text-gray-100">
              Khách hàng mới
            </CardTitle>
            <CardDescription className="text-[#5ea25e] admin-dark:text-green-400">
              Danh sách khách hàng mới nhất trong tháng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div data-lenis-prevent className=" space-y-2 scrollbar-hide max-h-100 overflow-y-auto  overscroll-y-auto lenis-local">
              {sortCustomersByCreatedAt
                .filter((c) => c.status === "active")
                .map((customer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-100 
                      admin-dark:bg-gray-700 admin-dark:border-gray-600"
                  >
                    <div>
                      <p className="font-medium text-black admin-dark:text-gray-200">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500 admin-dark:text-gray-400">
                        {customer.email || "Chưa có email"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-gray-800 admin-dark:bg-blue-900/30 admin-dark:text-gray-200"
                      >
                        {
                          initDataBooking.filter(
                            (o) =>
                              o.status !== "cancelled" &&
                              o.customer_id === customer.id
                          ).length
                        }
                        <span className="ml-1">đơn</span>
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#5ea25e] admin-dark:text-green-400">
                          {formatRelativeTime(customer.created_at)}
                        </p>

                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {sortCustomersByCreatedAt.length === 0 && (
              <p className="text-sm text-gray-500 admin-dark:text-gray-400">
                Chưa có khách hàng mới
              </p>
            )}
          </CardContent>
        </Card>

        <Card
          className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb] 
            admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
        >
          <CardHeader>
            <CardTitle className="text-gray-900 admin-dark:text-gray-100">
              Lượt đặt dịch vụ theo từng tháng
            </CardTitle>
            <CardDescription className="text-[#5ea25e] admin-dark:text-green-400">
              Biểu đồ thể hiện số lượng booking theo từng tháng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartBookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="admin-dark:stroke-gray-600" />
                <XAxis dataKey="name" stroke="#374151" className="admin-dark:stroke-gray-300" />
                <YAxis stroke="#374151" className="admin-dark:stroke-gray-300" />
                <Tooltip
                  formatter={(value) => `${value} đơn`}
                  labelFormatter={(label) => `Tháng: ${label}`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    borderColor: "#e5e7eb",
                    color: "#374151",
                  }}
                  className="admin-dark:bg-gray-800 admin-dark:border-gray-600 admin-dark:text-gray-200"
                />
                <Bar
                  dataKey="totalBookings"
                  fill="#4F46E5"
                  radius={[6, 6, 0, 0]}
                  className="admin-dark:fill-indigo-500"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>

        </Card>
      </div>
    </div>
  );
}
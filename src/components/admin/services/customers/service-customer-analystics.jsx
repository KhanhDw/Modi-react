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

export default function ServiceCustomerAnalytics() {
  const { initDataCustomer, initDataBooking } = useOutletContext();

  const sortCustomersByCreatedAt = initDataCustomer
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5); // lấy 5 khách hàng mới nhất
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
                      đơn
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#5ea25e] admin-dark:text-green-400">
                        {Math.floor(
                          (new Date() - new Date(customer.created_at)) /
                          (1000 * 60 * 60 * 24)
                        )}{" "}
                        Ngày trước
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
              Tăng trưởng khách hàng theo từng tháng
            </CardTitle>
            <CardDescription className="text-[#5ea25e] admin-dark:text-green-400">
              Biểu đồ thể hiện số lượng khách hàng mới theo từng tháng, giúp
              theo dõi xu hướng tăng trưởng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartLatestCustomer}>
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
                  formatter={(value) => `${value} khách hàng`}
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
                  dataKey="totalCustomers"
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
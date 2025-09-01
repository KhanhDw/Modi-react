import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare, Sprout, DollarSign, TrendingUp
} from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts"

// Data
const revenueData = [
  { month: "T1", revenue: 45000000 },
  { month: "T2", revenue: 52000000 },
  { month: "T3", revenue: 48000000 },
  { month: "T4", revenue: 61000000 },
  { month: "T5", revenue: 55000000 },
  { month: "T6", revenue: 67000000 },
  { month: "T7", revenue: 72000000 },
  { month: "T8", revenue: 69000000 },
  { month: "T9", revenue: 78000000 },
  { month: "T10", revenue: 85000000 },
  { month: "T11", revenue: 92000000 },
  { month: "T12", revenue: 98000000 },
]

const visitorData = [
  { day: "T2", visitors: 1200 },
  { day: "T3", visitors: 1800 },
  { day: "T4", visitors: 1600 },
  { day: "T5", visitors: 2200 },
  { day: "T6", visitors: 2800 },
  { day: "T7", visitors: 3200 },
  { day: "CN", visitors: 2900 },
]

// 1. KPI Cards
function KpiCards() {
  const cards = [
    { title: "Liên hệ tháng này", value: 24, change: "+12%", icon: MessageSquare },
    { title: "Đơn đặt website tháng này", value: 8, change: "+25%", icon: Sprout },
    { title: "Doanh thu tháng này", value: "98.5M", change: "+18%", icon: DollarSign },
    { title: "Lượt khách truy cập tháng này", value: 15, change: "+5", icon: TrendingUp },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map(({ title, value, change, icon: Icon }, i) => (
        <Card
          key={i}
          className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-800 admin-dark:text-gray-100">{title}</CardTitle>
            <Icon className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 admin-dark:text-gray-100">{value}</div>
            <p className="text-xs text-gray-500 admin-dark:text-gray-400">
              <span className="text-green-600 admin-dark:text-green-400">{change} so với tháng trước</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// 2. Revenue Chart
function RevenueChart() {
  return (
    <Card className="bg-white text-gray-900 admin-dark:bg-gray-900 admin-dark:text-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800 admin-dark:text-gray-100">Website bán ra trong 12 tháng</CardTitle>
        <CardDescription className="text-gray-500 admin-dark:text-gray-400">
          Biểu đồ đơn đặt hàng website theo tháng (Website)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="opacity-20"
            />
            <XAxis dataKey="month" stroke="currentColor" />
            <YAxis
              tickFormatter={(v) => `${v / 1000000}M`}
              stroke="currentColor"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--tooltip-bg)",
                color: "var(--tooltip-text)",
              }}
              formatter={(value) => [
                `${value.toLocaleString()} Website`,
                "Số lượng",
              ]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// function RevenueChart() {
//   return (
//     <Card className="bg-white text-gray-900 admin-dark:bg-gray-900 admin-dark:text-gray-100">
//       <CardHeader>
//         <CardTitle className="text-lg font-bold text-gray-800 admin-dark:text-gray-100">Doanh thu 12 tháng</CardTitle>
//         <CardDescription className="text-gray-500 admin-dark:text-gray-400">
//           Biểu đồ doanh thu theo tháng (VNĐ)
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={revenueData}>
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="currentColor"
//               className="opacity-20"
//             />
//             <XAxis dataKey="month" stroke="currentColor" />
//             <YAxis
//               tickFormatter={(v) => `${v / 1000000}M`}
//               stroke="currentColor"
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "var(--tooltip-bg)",
//                 color: "var(--tooltip-text)",
//               }}
//               formatter={(value) => [
//                 `${value.toLocaleString()} VNĐ`,
//                 "Doanh thu",
//               ]}
//             />
//             <Line
//               type="monotone"
//               dataKey="revenue"
//               stroke="#3b82f6"
//               strokeWidth={2}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// }


// 3. Visitor Chart

function VisitorChart() {
  return (
    <Card className="bg-white text-gray-900 admin-dark:bg-gray-900 admin-dark:text-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800 admin-dark:text-gray-100">Số lượng khách truy cập</CardTitle>
        <CardDescription className="text-gray-500 admin-dark:text-gray-400">
          Lượt truy cập demo trong tuần
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={visitorData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="opacity-20"
            />
            <XAxis dataKey="day" stroke="currentColor" />
            <YAxis stroke="currentColor" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--tooltip-bg)",
                color: "var(--tooltip-text)",
              }}
              formatter={(value) => [`${value} lượt`, "Truy cập"]}
            />
            <Bar
              dataKey="visitors"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


function OrderNeedToDone() {
  const currentTime = new Date("2025-09-01T21:48:00+07:00");

  const orders = [
    {
      color: "bg-blue-500",
      orderName: "Website bán hàng",
      customer: "Nguyễn Văn A",
      dueTime: "2025-09-10 14:00",
    },
    {
      color: "bg-green-500",
      orderName: "Dịch vụ SEO",
      customer: "Trần Thị B",
      dueTime: "2025-09-12 09:00",
    },
    {
      color: "bg-yellow-500",
      orderName: "Template giao diện",
      customer: "Lê Văn C",
      dueTime: "2025-09-15 17:00",
    },
    {
      color: "bg-purple-500",
      orderName: "Website corporate",
      customer: "Công ty ABC",
      dueTime: "2025-09-20 12:00",
    },
    {
      color: "bg-red-500",
      orderName: "Chỉnh sửa giao diện",
      customer: "Phạm Văn D",
      dueTime: "2025-09-02 16:00",
    },
  ];

  // Hàm tính trạng thái dựa trên thời gian
  const getOrderStatus = (dueTime) => {
    const dueDate = new Date(dueTime + "+07:00");
    const timeDiff = dueDate - currentTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (timeDiff < 0) return "Quá hạn";
    if (hoursDiff <= 24) return "Gần đến hạn";
    return "Đang xử lý";
  };

  // Hàm lấy màu nền dựa trên trạng thái
  const getStatusBackground = (status) => {
    switch (status) {
      case "Quá hạn":
        return "bg-red-100 admin-dark:bg-red-900/30";
      case "Gần đến hạn":
        return "bg-yellow-100 admin-dark:bg-yellow-900/30";
      default:
        return "bg-transparent";
    }
  };

  // Hàm lấy màu chữ cho trạng thái
  const getStatusTextStyle = (status) => {
    switch (status) {
      case "Quá hạn":
        return "text-red-600 admin-dark:text-red-400";
      case "Gần đến hạn":
        return "text-yellow-600 admin-dark:text-yellow-400";
      default:
        return "text-green-600 admin-dark:text-green-400";
    }
  };

  // Sắp xếp đơn hàng: Quá hạn -> Gần đến hạn -> Đang xử lý
  const sortedOrders = [...orders].sort((a, b) => {
    const statusA = getOrderStatus(a.dueTime);
    const statusB = getOrderStatus(b.dueTime);

    const statusPriority = {
      "Quá hạn": 1,
      "Gần đến hạn": 2,
      "Đang xử lý": 3,
    };

    return statusPriority[statusA] - statusPriority[statusB];
  });

  return (
    <Card className="bg-white text-gray-900 admin-dark:bg-gray-900 admin-dark:text-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800 admin-dark:text-gray-100">
          Đơn hàng cần hoàn thành
        </CardTitle>
        <CardDescription className="text-gray-500 admin-dark:text-gray-400">
          Danh sách đơn hàng cần hoàn thành trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200 admin-dark:border-gray-700">
                <th className="py-2 px-4 font-medium text-gray-700 admin-dark:text-gray-300">
                  Đơn hàng
                </th>
                <th className="py-2 px-4 font-medium text-gray-700 admin-dark:text-gray-300">
                  Người đặt
                </th>
                <th className="py-2 px-4 font-medium text-gray-700 admin-dark:text-gray-300">
                  Thời gian hoàn thành
                </th>
                <th className="py-2 px-4 font-medium text-gray-700 admin-dark:text-gray-300">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, i) => {
                const status = getOrderStatus(order.dueTime);
                return (
                  <tr
                    key={i}
                    className={`border-b border-gray-200 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-800 transition-colors ${getStatusBackground(status)}`}
                  >
                    <td className="py-3 px-4 flex items-center gap-2">
                      <div
                        className={`w-2 h-2 ${order.color} rounded-full`}
                      ></div>
                      <span>{order.orderName}</span>
                    </td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.dueTime}</td>
                    <td className={`py-3 px-4 ${getStatusTextStyle(status)}`}>
                      {status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

const sampleProducts = [
  { id: 1, name: "iPhone 15 Pro", views: 1200 },
  { id: 2, name: "Samsung Galaxy S24", views: 950 },
  { id: 3, name: "MacBook Air M3", views: 800 },
  { id: 4, name: "Apple Watch Ultra 2", views: 600 },
];


// 5. sản phẩm được xem nhiều
const MostViewedProducts = ({ products }) => {
  // Sắp xếp giảm dần theo lượt xem
  const sortedProducts = [...products].sort((a, b) => b.views - a.views);

  return (
    <Card className="bg-white text-gray-900 admin-dark:bg-gray-900 admin-dark:text-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800 admin-dark:text-gray-100">
          🔥 Sản phẩm được xem nhiều nhất
        </CardTitle>
        <CardDescription className="text-gray-500 admin-dark:text-gray-400">
          Danh sách Top sản phẩm theo lượt xem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedProducts.map((p, i) => (
          <div key={i} className="flex items-center gap-3 border-b py-1">
            {/* Vòng tròn màu + số thứ tự */}
            <div
              className={`w-6 h-6 flex items-center justify-center text-xs font-bold text-white ${p.color} rounded-full `}
            >
              {i + 1}
            </div>

            {/* Thông tin sản phẩm */}
            <div className="flex justify-between w-full items-center">
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-xs text-gray-500 admin-dark:text-gray-400">
                {p.views.toLocaleString()} lượt xem
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};


// 6. Main Dashboard Page
export default function DashboardPage() {
  return (
    <div className="flex  bg-white admin-dark:bg-gray-900">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <KpiCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RevenueChart />
            <VisitorChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderNeedToDone />
            <MostViewedProducts products={sampleProducts} />
          </div>
        </main>
      </div>
    </div>
  )
}

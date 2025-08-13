// import { useState, useEffect, useRef } from "react";
// import PageHeader from "../../components/admin/common/PageHeader";
// import Chart from "chart.js/auto";

// export default function DashboardPage() {
//   const [stats, setStats] = useState({
//     tinTuc: 0,
//     tuyenDung: 0,
//     lienHe: 0,
//     dailyContacts: Array(31).fill(0),
//   });

//   const chartRef = useRef(null);
//   const canvasRef = useRef(null); // Add ref for canvas to ensure it exists

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const [tinTucRes, tuyenDungRes, lienHeRes] = await Promise.all([
//           fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/tintuc`),
//           fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/tuyendung`),
//           fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/lienhe`),
//         ]);

//         const [tinTucData, tuyenDungData, lienHeData] = await Promise.all([
//           tinTucRes.json(),
//           tuyenDungRes.json(),
//           lienHeRes.json(),
//         ]);

//         console.log("Dữ liệu lienHe:", lienHeData);

//         setStats((prevStats) => {
//           const newDailyContacts = calculateDailyContacts(lienHeData);
//           const isDailyContactsEqual = prevStats.dailyContacts.every(
//             (value, index) => value === newDailyContacts[index]
//           );

//           if (
//             prevStats.tinTuc === tinTucData.length &&
//             prevStats.tuyenDung === tuyenDungData.length &&
//             prevStats.lienHe === lienHeData.length &&
//             isDailyContactsEqual
//           ) {
//             return prevStats;
//           }

//           return {
//             tinTuc: tinTucData.length,
//             tuyenDung: tuyenDungData.length,
//             lienHe: lienHeData.length,
//             dailyContacts: newDailyContacts,
//           };
//         });
//       } catch (error) {
//         console.error("Lỗi khi lấy dữ liệu:", error);
//       }
//     };

//     fetchStats();
//     // Optional: Add setInterval for periodic updates
//     // const interval = setInterval(fetchStats, 30000);
//     // return () => clearInterval(interval);
//   }, []); // Empty dependency array

//   const calculateDailyContacts = (data) => {
//     const dailyCounts = Array(31).fill(0);
//     const currentMonth = new Date().getMonth() + 1; // August is 8
//     const currentYear = new Date().getFullYear(); // 2025

//     data.forEach((item) => {
//       const itemDate = new Date(item.ngay_gui);
//       if (itemDate && !isNaN(itemDate.getTime())) {
//         // console.log("Ngày gửi:", item.ngay_gui, "Parsed:", itemDate);
//         if (
//           itemDate.getMonth() + 1 === currentMonth &&
//           itemDate.getFullYear() === currentYear
//         ) {
//           const day = itemDate.getDate() - 1; // 0-based index
//           if (day >= 0 && day < 31) {
//             dailyCounts[day]++;
//           }
//         }
//       } else {
//         console.log("Ngày không hợp lệ:", item.ngay_gui);
//       }
//     });

//     // console.log("Daily Counts:", JSON.stringify(dailyCounts)); // Improved logging
//     return dailyCounts;
//   };

//   useEffect(() => {
//     // Ensure canvas exists before initializing chart
//     if (!canvasRef.current) return;

//     const ctx = canvasRef.current.getContext("2d");
//     if (!ctx) return;

//     if (!chartRef.current) {
//       chartRef.current = new Chart(ctx, {
//         type: "bar",
//         data: {
//           labels: Array.from({ length: 31 }, (_, i) => i + 1),
//           datasets: [
//             {
//               label: "Số khách hàng liên hệ",
//               data: stats.dailyContacts,
//               backgroundColor: "rgba(54, 162, 235, 0.6)",
//               borderColor: "rgba(54, 162, 235, 1)",
//               borderWidth: 1,
//             },
//           ],
//         },
//         options: {
//           maintainAspectRatio: false,
//           responsive: true,
//           scales: {
//             y: {
//               beginAtZero: true,
//               title: { display: true, text: "Số lượng khách hàng", font: { size: 12 } },
//               ticks: { font: { size: 10 } },
//             },
//             x: {
//               title: { display: true, text: "Ngày trong tháng", font: { size: 12 } },
//               ticks: { font: { size: 10 } },
//             },
//           },
//           plugins: {
//             legend: { display: false },
//           },
//         },
//       });
//     } else {
//       chartRef.current.data.datasets[0].data = stats.dailyContacts;
//       chartRef.current.update();
//     }

//     return () => {
//       if (chartRef.current) {
//         chartRef.current.destroy();
//         chartRef.current = null; // Ensure chart is fully cleared
//       }
//     };
//   }, [stats.dailyContacts]);

//   return (
//     <div className="p-6">
//       <PageHeader title="Tổng quan hệ thống" />
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         {[
//           { label: "Tin tức", value: stats.tinTuc, icon: "" },
//           { label: "Tuyển dụng", value: stats.tuyenDung, icon: "" },
//           { label: "Liên hệ", value: stats.lienHe, icon: "" },
//         ].map((stat, index) => (
//           <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//             <div className="flex items-center">
//               <span className="text-3xl mr-4">{stat.icon}</span>
//               <div>
//                 <p className="text-sm text-gray-600">{stat.label}</p>
//                 <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê tổng quan</h2>
//         <div className="chart-container" style={{ width: "100%", height: "200px" }}>
//           <canvas id="statsChart" ref={canvasRef}></canvas>
//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <a href="/managers/news" className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
//             <div className="text-2xl mb-2">📝</div>
//             <div className="font-medium">Viết tin tức</div>
//           </a>
//           <a href="/managers/recruitment" className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
//             <div className="text-2xl mb-2">💼</div>
//             <div className="font-medium">Đăng tuyển dụng</div>
//           </a>
//           <a href="/managers/contact" className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
//             <div className="text-2xl mb-2">👁️</div>
//             <div className="font-medium">Xem liên hệ</div>
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Home,
  Users,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Globe,
  DollarSign,
  TrendingUp,
  Bell,
  CheckCircle,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Dữ liệu mẫu cho biểu đồ
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
export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 admin-dark:bg-gray-900 text-gray-900 admin-dark:text-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 admin-dark:text-gray-100">Liên hệ hôm nay</CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-700 admin-dark:text-gray-100">24</div>
                <p className="text-xs text-gray-500 admin-dark:text-gray-400">
                  <span className="text-green-600 admin-dark:text-green-400">+12%</span> so với hôm qua
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 admin-dark:text-gray-100">Đơn đặt website hôm nay</CardTitle>
                <Globe className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-700 admin-dark:text-gray-100">8</div>
                <p className="text-xs text-gray-500 admin-dark:text-gray-400">
                  <span className="text-green-600 admin-dark:text-green-400">+25%</span> so với hôm qua
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 admin-dark:text-gray-100">Doanh thu tháng này</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-700 admin-dark:text-gray-100">98.5M</div>
                <p className="text-xs text-gray-500 admin-dark:text-gray-400">
                  <span className="text-green-600 admin-dark:text-green-400">+18%</span> so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 admin-dark:text-gray-100">Giao diện mới được thêm</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-700 admin-dark:text-gray-100">15</div>
                <p className="text-xs text-gray-500 admin-dark:text-gray-400">
                  <span className="text-green-600 admin-dark:text-green-400">+5</span> template mới
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-700 admin-dark:text-gray-100">Doanh thu 12 tháng</CardTitle>
                <CardDescription className="text-gray-500 admin-dark:text-gray-400">
                  Biểu đồ doanh thu theo tháng (VNĐ)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" admin-dark:stroke="#374151" />
                    <XAxis dataKey="month" stroke="currentColor" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} stroke="currentColor" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--tooltip-bg, white)",
                        borderColor: "var(--tooltip-border, #e5e7eb)",
                        color: "var(--tooltip-color, black)",
                      }}
                      formatter={(value) => [`${value.toLocaleString()} VNĐ`, "Doanh thu"]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle>Số lượng khách truy cập</CardTitle>
                <CardDescription className="text-gray-500 admin-dark:text-gray-400">
                  Lượt truy cập demo trong tuần
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={visitorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" admin-dark:stroke="#374151" />
                    <XAxis dataKey="day" stroke="currentColor" />
                    <YAxis stroke="currentColor" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--tooltip-bg, white)",
                        borderColor: "var(--tooltip-border, #e5e7eb)",
                        color: "var(--tooltip-color, black)",
                      }}
                      formatter={(value) => [`${value} lượt`, "Truy cập"]}
                    />
                    <Bar dataKey="visitors" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities & Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Liên hệ mới từ Nguyễn Văn A</p>
                      <p className="text-xs text-muted-foreground">Yêu cầu báo giá website bán hàng - 5 phút trước</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Tin nhắn form contact</p>
                      <p className="text-xs text-muted-foreground">Khách hàng hỏi về dịch vụ SEO - 12 phút trước</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Bình luận mới</p>
                      <p className="text-xs text-muted-foreground">Phản hồi tích cực về template mới - 25 phút trước</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Đơn hàng mới</p>
                      <p className="text-xs text-muted-foreground">Website corporate cho công ty ABC - 1 giờ trước</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Phản hồi khách hàng</p>
                      <p className="text-xs text-muted-foreground">Yêu cầu chỉnh sửa giao diện - 2 giờ trước</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Việc cần làm</CardTitle>
                <CardDescription>Danh sách công việc ưu tiên hôm nay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm line-through text-muted-foreground">Gọi điện cho khách hàng XYZ</span>
                    <Badge variant="secondary" className="ml-auto">
                      Hoàn thành
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm">Cập nhật template mới cho trang chủ</span>
                    <Badge variant="destructive" className="ml-auto">
                      Khẩn cấp
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm">Trả lời email khách hàng về báo giá</span>
                    <Badge variant="outline" className="ml-auto">
                      Hôm nay
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm">Họp team về dự án website mới</span>
                    <Badge variant="outline" className="ml-auto">
                      14:00
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm">Review và phê duyệt thiết kế</span>
                    <Badge variant="secondary" className="ml-auto">
                      Tuần này
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm">Chuẩn bị báo cáo tháng</span>
                    <Badge variant="secondary" className="ml-auto">
                      Tuần này
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

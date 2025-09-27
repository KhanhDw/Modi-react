import DailyRevenueTable from "@/components/admin/services/overview/DailyRevenueTable";
import SaleAnalytics from "@/components/admin/services/sales/sale-analytics";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useLenisLocal from "@/hook/useLenisLocal";
import { ChevronLeft, ChevronRight, DollarSign, Layers, Star, Target } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";


// Hàm chuyển đổi bookings → services
function transformBookingsToServices(bookings) {
  const serviceMap = {};

  bookings.forEach((b) => {
    const key = b.service_id;

    if (!serviceMap[key]) {
      serviceMap[key] = {
        service_id: b.service_id,
        ten_dich_vu: b.service_name,
        price: b.price,
        booking_count: 0,
        totalRevenue: 0,
        created_at: b.created_at,
      };
    }

    serviceMap[key].booking_count += 1;
    serviceMap[key].totalRevenue += Number(b.total) || 0;

    if (new Date(b.created_at) > new Date(serviceMap[key].created_at)) {
      serviceMap[key].created_at = b.created_at;
    }
  });

  return Object.values(serviceMap);
}

export default function ServiceOverview() {
  useLenisLocal(".lenis-local");
  const { initDataService, initDataBooking, initDataCustomer } = useOutletContext();

  // Gom dữ liệu
  const services = transformBookingsToServices(initDataBooking);

  // Top dịch vụ nhiều booking nhất
  const topServices = services
    .sort((a, b) => b.booking_count - a.booking_count)
    .map((s) => ({
      name: s.ten_dich_vu,
      orders: s.booking_count,
      price: s.price,
      revenue: s.totalRevenue,
      created_at: s.created_at,
    }));

  // Pagination logic
  const pageSize = 4;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(topServices.length / pageSize);

  const pagedServices = topServices.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const totalRevenue = initDataBooking
    .filter(b => b.status === "completed" && b.is_deleted === 0)
    .reduce((sum, b) => sum + Number(b.total || b.price) * (b.quantity || 1), 0);


  return (
    <div className="text-black admin-dark:text-white">
      <div className="space-y-6">
        {/* 4 thẻ thống kê */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white admin-dark:bg-gray-800 rounded-xl lg:p-2 shadow-md border border-gray-300 admin-dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium admin-dark:text-white text-black ">Tổng dịch vụ</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl text-gray-800 admin-dark:text-white font-bold">{initDataService.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white admin-dark:bg-gray-800 rounded-xl lg:p-2 shadow-md border border-gray-300 admin-dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium admin-dark:text-white text-black">Tổng doanh thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl text-gray-800 admin-dark:text-white font-bold">
                {totalRevenue.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
            </CardContent>

          </Card>

          <Card className="bg-white admin-dark:bg-gray-800 rounded-xl lg:p-2 shadow-md border border-gray-300 admin-dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium admin-dark:text-white text-black">Đơn đặt</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl text-gray-800 admin-dark:text-white font-bold">{initDataBooking.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white admin-dark:bg-gray-800 rounded-xl lg:p-2 shadow-md border border-gray-300 admin-dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium admin-dark:text-white text-black">Khách hàng</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl text-gray-800 admin-dark:text-white font-bold">
                {initDataCustomer.filter((c) => c.status === "active").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dịch vụ hot + Analytics */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white admin-dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 admin-dark:border-gray-700">
            <CardHeader className={`flex flex-row items-center justify-between`}>
              <div>
                <CardTitle className={`admin-dark:text-white`}>Dịch vụ hot</CardTitle>
                <CardDescription className="text-[#5ea25e] admin-dark:text-green-400">
                  Các dịch vụ có đơn đặt nhiều nhất
                </CardDescription>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className="bg-transparent hover:bg-gray-600/30 px-3 py-2 rounded-xl disabled:opacity-40"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentPage === totalPages - 1}
                    className="bg-transparent hover:bg-gray-600/30 px-3 py-2 rounded-xl disabled:opacity-40"
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </CardHeader>
            <CardContent data-lenis-prevent className="space-y-2 overscroll-y-auto lenis-local">
              {pagedServices.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-200 admin-dark:bg-gray-800 admin-dark:border-gray-700"
                >
                  {/* Left content */}
                  <div className="flex items-center">
                    <div className="h-full gap-2 flex flex-col justify-between">
                      <p className="font-semibold text-gray-900 admin-dark:text-gray-100">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-500 admin-dark:text-gray-400">
                        Doanh thu:{" "}
                        {service.revenue.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Right content */}
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="secondary"
                      className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium admin-dark:bg-gray-700 admin-dark:text-gray-200"
                    >
                      {service.orders} đơn
                    </Badge>

                    <div className="text-right h-full gap-2 flex flex-col justify-between">
                      <p className="text-xs text-muted-foreground">Giá dịch vụ</p>
                      <p className="text-base font-semibold text-emerald-600 admin-dark:text-emerald-400">
                        {Number(service.price).toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {topServices.length === 0 && (
                <p className="text-gray-500 text-sm">Chưa có dịch vụ nào</p>
              )}
            </CardContent>
          </Card>

          {/* Biểu đồ phân tích */}
          <SaleAnalytics />
        </div>
        <div>
          <DailyRevenueTable
            data={initDataBooking.filter(
              (b) => b.status === "completed" && b.is_deleted === 0
            )}
          />

        </div>
      </div>
    </div>
  );
}

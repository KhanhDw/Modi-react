import { useEffect, useRef, useState } from "react";
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
import { DollarSign, Layers, Star, Target } from "lucide-react";
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

/**
 * Rút gọn số từ 100.000 trở lên (ví dụ: 507.917.830 -> 507.9M)
 * @param {number} num - Số cần định dạng
 * @returns {string} - Chuỗi đã định dạng
 */
const formatLargeNumber = (num) => {
  if (num >= 1000000) {
    // Nếu lớn hơn hoặc bằng 1 triệu (ví dụ: 507,917,830)
    // Chia cho 1,000,000 và làm tròn 1 chữ số thập phân
    const result = (num / 1000000).toFixed(1);
    // Xóa '.0' nếu có và thêm 'M'
    return result.replace(/\.0$/, "") + "Tr";
  }
  if (num >= 100000) {
    // Nếu lớn hơn hoặc bằng 100 nghìn (ví dụ: 917,830)
    // Chia cho 1,000 và làm tròn 1 chữ số thập phân
    const result = (num / 1000).toFixed(1);
    // Xóa '.0' nếu có và thêm 'K'
    return result.replace(/\.0$/, "") + "K";
  }
  // Nếu nhỏ hơn 100 nghìn, hiển thị số gốc với format VN
  return num.toLocaleString("vi-VN");
};

const StatCard = ({ title, icon: Icon, value, format = "count" }) => {
  // 1. Hàm định dạng đầy đủ (cho Desktop)
  const formatFull = (val) => {
    if (format === "currency") {
      // Định dạng tiền tệ VN, loại bỏ ký hiệu tiền tệ '₫'
      return val
        .toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
        .replace("₫", "")
        .trim();
    }
    // Định dạng số đếm thông thường với dấu phân cách VN
    return val.toLocaleString("vi-VN");
  };

  // 2. Hàm định dạng rút gọn (cho Mobile)
  const formatMobile = (val) => {
    // Sử dụng hàm formatLargeNumber đã có
    return formatLargeNumber(val);
  };

  return (
    <Card className="bg-white admin-dark:bg-gray-800 rounded-xl lg:p-2 shadow-md border border-gray-300 admin-dark:border-gray-700">
      <div className="flex flex-row items-center justify-between px-4 lg:px-2 xl:px-4">
        <CardTitle className="text-xs sm:text-base lg:text-base xs:font-semibold font-medium admin-dark:text-white text-black">
          {title}
        </CardTitle>
        <Icon className="xs:hidden md:block h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
      </div>
      <CardContent>
        <div className="mx-2 lg:-mx-2 xl:mx-0 text-xl text-gray-800 admin-dark:text-white font-bold">
          {/* HIỂN THỊ TRÊN MOBILE (Mặc định hiển thị, ẩn trên lg/Desktop trở lên) */}
          <span className="lg:hidden">{formatMobile(value)}</span>

          {/* HIỂN THỊ TRÊN DESKTOP (Ẩn trên Mobile, hiện trên lg/Desktop trở lên) */}
          <span className="hidden lg:inline">{formatFull(value)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Mảng dữ liệu cho các thẻ thống kê
const getStatsData = (
  initDataService,
  initDataBooking,
  initDataCustomer,
  totalRevenue
) => [
  {
    title: "Tổng dịch vụ",
    icon: Layers,
    value: initDataService.length,
    format: "count",
  },
  {
    title: "Tổng doanh thu",
    icon: DollarSign,
    value: totalRevenue,
    format: "currency",
  },
  {
    title: "Đơn đặt",
    icon: Target,
    value: initDataBooking.length,
    format: "count",
  },
  {
    title: "Khách hàng",
    icon: Star,
    value: initDataCustomer.filter((c) => c.status === "active").length,
    format: "count",
  },
];

export default function ServiceOverview() {
  useLenisLocal(".lenis-local");
  const containerRef = useRef(null);
  const [shouldPrevent, setShouldPrevent] = useState(false);

  const {
    initDataService,
    initDataBooking,
    initDataBookingAll,
    initDataCustomer,
  } = useOutletContext(); // src\pages\managers\ServicesPage.jsx

  // Gom dữ liệu
  const services = transformBookingsToServices(initDataBookingAll);

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

  const totalRevenue = initDataBookingAll
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + Number(b.total || 0) * (b.quantity || 1), 0);

  // Lấy dữ liệu cho stats cards
  const statsData = getStatsData(
    initDataService,
    initDataBookingAll,
    initDataCustomer,
    totalRevenue
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const checkScroll = () => {
      const hasScroll = el.scrollHeight > el.clientHeight + 2;
      setShouldPrevent(hasScroll); // ✅ chỉ bật prevent nếu thực sự có scroll
    };

    checkScroll();

    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);

    window.addEventListener("resize", checkScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkScroll);
    };
  }, [topServices]);

  return (
    <div className="text-black admin-dark:text-white">
      <div className="space-y-6">
        {/* 4 thẻ thống kê */}
        <div className="grid gap-3 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              icon={stat.icon}
              value={stat.value}
              format={stat.format}
            />
          ))}
        </div>

        {/* Dịch vụ hot + Analytics */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white admin-dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 admin-dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="admin-dark:text-white">
                  Dịch vụ hot
                </CardTitle>
                <CardDescription className="text-[#5ea25e] admin-dark:text-green-400">
                  Các dịch vụ có đơn đặt nhiều nhất
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent
              ref={containerRef}
              className="space-y-2 overflow-y-auto overscroll-y-auto scrollbar-hide lenis-local
              h-[320px]"
              data-lenis-prevent={!shouldPrevent || undefined}
            >
              {topServices.map((service, index) => (
                <div
                  key={index}
                  className="flex w-full items-start justify-between gap-3 flex-col p-2 rounded-xl border border-gray-300 bg-white shadow-sm hover:shadow-md transition-all duration-200 admin-dark:bg-slate-700 admin-dark:border-gray-700"
                >
                  <div className="flex items-center">
                    <div className="h-full gap-2 flex flex-col justify-between">
                      <p className="font-semibold text-sm sm:text-base text-gray-900 admin-dark:text-gray-100">
                        {service.name}
                      </p>
                      <p className="text-xs font-medium sm:text-sm text-gray-500 admin-dark:text-gray-400">
                        Doanh thu:{" "}
                        {service.revenue.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 w-full">
                    <Badge
                      variant="secondary"
                      className="px-2 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-medium admin-dark:bg-gray-700 admin-dark:text-gray-200 flex items-end"
                    >
                      <p>Số lượng: {service.orders} đơn</p>
                    </Badge>

                    <div className="text-right h-full gap-2 flex flex-wrap flex-row items-center justify-end">
                      <p className="text-xs text-gray-500 admin-dark:text-gray-400 font-medium">
                        Khách hàng vừa đặt:
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-emerald-600 admin-dark:text-emerald-400">
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

import React from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  Hourglass,
  CalendarCheck2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLenisLocal from "@/hook/useLenisLocal";

function ReadInforCustomer({ data }) {
  if (!data) {
    return (
      <p className="text-gray-500 admin-dark:text-gray-400">
        Đang tải dữ liệu...
      </p>
    );
  }

  useLenisLocal(".lenis-local");

  const customer = data;

  const getCustomerTypeInVietnamese = (type) => {
    switch (type) {
      case "new":
        return "Mới";
      case "regular":
        return "Thường xuyên";
      case "old":
        return "Cũ";
      case "vip":
        return "VIP";
      default:
        return type || "—";
    }
  };

  // Gom booking theo logic: nếu completed hết thì gộp, nếu có mix thì gộp completed riêng, trạng thái khác để riêng
  const bookingsSummary = [];
  (data.services_booked || []).forEach((service) => {
    const completedBookings = service.bookings.filter(
      (bk) => bk.status === "completed"
    );
    const otherBookings = service.bookings.filter(
      (bk) => bk.status !== "completed"
    );

    // Nếu có completed thì gộp thành 1 dòng
    if (completedBookings.length > 0) {
      bookingsSummary.push({
        service_name: service.ten_dich_vu,
        status: "completed",
        count: completedBookings.length,
        total_spent: completedBookings.reduce(
          (sum, bk) => sum + Number(bk.total || 0),
          0
        ),
      });
    }

    // Các booking khác giữ riêng
    otherBookings.forEach((bk) => {
      bookingsSummary.push({
        service_name: service.ten_dich_vu,
        status: bk.status,
        count: 1,
        total_spent: Number(bk.total || 0),
      });
    });
  });

  // Sắp xếp: processing -> pending -> confirmed -> completed -> cancelled -> còn lại
  const sortOrder = {
    processing: 1,
    pending: 2,
    confirmed: 3,
    completed: 4,
    cancelled: 5,
  };

  const sortedBookings = [...bookingsSummary].sort((a, b) => {
    const rankA = sortOrder[a.status] || 99;
    const rankB = sortOrder[b.status] || 99;
    return rankA - rankB;
  });

  return (

    <ScrollArea className="space-y-6 admin-dark:text-white lenis-local" data-lenis-prevent>
      {/* Thông tin khách hàng */}
      <div className="flex flex-col space-y-8">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4 text-gray-900 admin-dark:text-white">
            Thông tin khách hàng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base text-gray-700 admin-dark:text-gray-300">
            <div><span className="font-medium">Tên:</span> {customer.name}</div>
            <div><span className="font-medium">Email:</span> {customer.email || "—"}</div>
            <div><span className="font-medium">Số điện thoại:</span> {customer.phone || "—"}</div>
            <div><span className="font-medium">Địa chỉ:</span> {customer.address || "—"}</div>
            <div><span className="font-medium">Tổng chi tiêu:</span> {Number(customer.total_spent).toLocaleString("vi-VN")} ₫</div>
            <div><span className="font-medium">Số lần đặt:</span> {customer.booking_count || 0}</div>
            <div><span className="font-medium">Loại khách:</span> {getCustomerTypeInVietnamese(customer.type)}</div>
            <div><span className="font-medium">Số CCCD:</span> {customer.cccd || "—"}</div>

            {/* Ảnh CCCD */}
            <div className="sm:col-span-1">
              <span className="font-medium block mb-2">Ảnh CCCD mặt trước:</span>
              <div className="w-full aspect-[3/2] max-h-48 bg-gray-50 admin-dark:bg-gray-700 border border-gray-300 admin-dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_MAIN_BE_URL}${customer.img_cccd_top}`}
                  alt="CCCD mặt trước"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23eee' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ELỗi tải ảnh%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <span className="font-medium block mb-2">Ảnh CCCD mặt sau:</span>
              <div className="w-full aspect-[3/2] max-h-48 bg-gray-50 admin-dark:bg-gray-700 border border-gray-300 admin-dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_MAIN_BE_URL}${customer.img_cccd_bottom}`}
                  alt="CCCD mặt sau"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23eee' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ELỗi tải ảnh%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        <div className="w-full">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4 text-gray-900 admin-dark:text-white">
            Thống kê dịch vụ
          </h2>

          {bookingsSummary.length === 0 ? (
            <p className="text-gray-500 admin-dark:text-gray-400 text-sm sm:text-base">
              Chưa đặt dịch vụ nào.
            </p>
          ) : (
            <div className="overflow-x-auto overflow-y-hidden rounded-lg border border-gray-200 admin-dark:border-gray-700">
              <table className="w-full text-sm sm:text-base">
                <thead className="bg-gray-100 admin-dark:bg-gray-900">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left font-semibold">Dịch vụ</th>
                    <th className="px-3 sm:px-4 py-3 text-center font-semibold">Trạng thái</th>
                    <th className="px-3 sm:px-4 py-3 text-center font-semibold">Số lần đặt</th>
                    <th className="px-3 sm:px-4 py-3 text-right font-semibold">Tổng chi</th>
                  </tr>
                </thead>
                <tbody className="bg-white admin-dark:bg-gray-800">
                  {sortedBookings.map((b, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-200 admin-dark:border-gray-700 hover:bg-gray-100 admin-dark:hover:bg-gray-700 admin-dark:hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-3 sm:px-4 py-3 text-gray-900 admin-dark:text-gray-300">
                        {b.service_name}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center">
                        {b.status === "completed" && <CheckCircle className="h-5 w-5 text-green-600 admin-dark:text-green-400 inline-block" />}
                        {b.status === "pending" && <Hourglass className="h-5 w-5 text-gray-500 admin-dark:text-gray-400 inline-block" />}
                        {b.status === "processing" && <Clock className="h-5 w-5 text-yellow-600 admin-dark:text-yellow-400 inline-block" />}
                        {b.status === "confirmed" && <CalendarCheck2 className="h-5 w-5 text-blue-600 admin-dark:text-blue-400 inline-block" />}
                        {b.status === "cancelled" && <XCircle className="h-5 w-5 text-red-600 admin-dark:text-red-400 inline-block" />}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center text-gray-900 admin-dark:text-gray-300">
                        {b.count}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-right text-gray-900 admin-dark:text-gray-300">
                        {b.total_spent.toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  ))}

                  {/* Tổng cộng */}
                  <tr className="border-t-2 border-gray-300 admin-dark:border-gray-600 font-semibold bg-gray-50 admin-dark:bg-gray-900">
                    <td className="px-3 sm:px-4 py-3 text-gray-900 admin-dark:text-white">
                      Tổng cộng
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-center">—</td>
                    <td className="px-3 sm:px-4 py-3 text-center text-gray-900 admin-dark:text-white">
                      {bookingsSummary.reduce((sum, b) => sum + b.count, 0)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right text-gray-900 admin-dark:text-white">
                      {bookingsSummary
                        .reduce((sum, b) => sum + b.total_spent, 0)
                        .toLocaleString("vi-VN")}{" "}
                      ₫
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </ScrollArea>
  );
}

export default ReadInforCustomer;

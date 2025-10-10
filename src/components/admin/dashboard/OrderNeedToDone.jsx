"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OrderNeedToDone({ bookings }) {
  const getOrderStatus = (booking) => {
    if (booking.status === "completed" || booking.status === "cancelled")
      return "Hoàn thành";

    const now = new Date();
    const dueDate = booking.completed_date
      ? new Date(booking.completed_date)
      : null;

    if (!dueDate) return "Đang xử lý";

    const diffDays = (dueDate - now) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return "Quá hạn";
    if (diffDays <= 5) return "Gần đến hạn";
    return "Đang xử lý";
  };

  const getStatusBackground = (status) => {
    switch (status) {
      case "Quá hạn":
        return "bg-red-100 admin-dark:bg-red-900/30";
      case "Gần đến hạn":
        return "bg-yellow-100 admin-dark:bg-yellow-900/30";
      case "Đang xử lý":
        return "bg-transparent";
      default:
        return "bg-transparent";
    }
  };

  const getStatusTextStyle = (status) => {
    switch (status) {
      case "Quá hạn":
        return "text-red-600 admin-dark:text-red-400";
      case "Gần đến hạn":
        return "text-yellow-600 admin-dark:text-yellow-400";
      case "Đang xử lý":
        return "text-green-600 admin-dark:text-green-400";
      default:
        return "text-gray-600 admin-dark:text-gray-400";
    }
  };

  const statusPriority = {
    "Quá hạn": 1,
    "Gần đến hạn": 2,
    "Đang xử lý": 3,
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.status !== "completed" && b.status !== "cancelled" && b.is_deleted === 0
  );

  const sortedOrders = filteredBookings.sort((a, b) => {
    const statusA = getOrderStatus(a);
    const statusB = getOrderStatus(b);

    if (statusPriority[statusA] !== statusPriority[statusB]) {
      return statusPriority[statusA] - statusPriority[statusB];
    }

    const dateA = a.completed_date ? new Date(a.completed_date) : new Date(0);
    const dateB = b.completed_date ? new Date(b.completed_date) : new Date(0);

    return dateA - dateB;
  });

  return (
    <Card className="bg-white text-gray-900 border border-gray-200 admin-dark:border-gray-700 admin-dark:bg-gray-900 admin-dark:text-gray-100">
      <CardHeader>
        <CardTitle className="text-base sm:text-[18px] md:text-xl lg:text-xl font-bold text-gray-800 admin-dark:text-gray-100">
          Đơn hàng cần hoàn thành
        </CardTitle>
        <CardDescription className={'admin-dark:text-gray-400'}>
          Danh sách đơn hàng cần hoàn thành trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto h-70 scrollbar-hide">
          <table className="w-full text-sm text-left ">
            <thead className="sticky top-0 bg-white admin-dark:bg-gray-800">
              <tr className="border-b border-gray-200 admin-dark:border-gray-700">
                <th className="py-2 px-4 font-medium text-gray-700 admin-dark:text-gray-300">
                  Dịch vụ
                </th>
                <th className="py-2 px-4 font-medium text-gray-700 admin-dark:text-gray-300">
                  Khách hàng
                </th>
                <th className="py-2 px-4 font-medium text-gray-700 admin-dark:text-gray-300">
                  Ngày bàn giao
                </th>
                <th className="py-2 px-4 font-medium text-gray-700 admin-dark:text-gray-300">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order, i) => {
                  const status = getOrderStatus(order);
                  return (
                    <tr
                      key={i}
                      className={`border-b border-gray-200 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-800 transition-colors ${getStatusBackground(
                        status
                      )}`}
                    >
                      <td className="py-3 px-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span
                          className="truncate block max-w-30"
                          title={order.service_name}
                        >
                          {order.service_name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {order.customer_name || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {order.completed_date
                          ? new Date(order.completed_date).toLocaleDateString(
                              "vi-VN"
                            )
                          : "-"}
                      </td>
                      <td className={`py-3 px-4 ${getStatusTextStyle(status)}`}>
                        {status}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="border-b border-gray-200 admin-dark:border-gray-700">
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-500 admin-dark:text-gray-400"
                  >
                    Không có đơn hàng nào cần hoàn thành
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

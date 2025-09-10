import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OrderNeedToDone({ bookings }) {
  // Hàm tính trạng thái dựa trên thời gian
  const getOrderStatus = (bookingDate, completedDate) => {
    const now = new Date();

    if (!completedDate) return "Đang xử lý";

    const due = new Date(completedDate);
    const diffDays = (due - now) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return "Quá hạn";
    if (diffDays <= 5) return "Gần đến hạn";
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
  const statusPriority = {
    "Quá hạn": 1,
    "Cũ chưa xong": 2,
    "Đang xử lý": 3,
  };

  // Lọc trước các booking chưa hoàn thành
  const filteredBookings = bookings.filter(
    (b) => b.status !== "completed" && b.status !== "cancelled"
  );

  // Sắp xếp
  const sortedOrders = filteredBookings.sort((a, b) => {
    const statusA = getOrderStatus(a.booking_date);
    const statusB = getOrderStatus(b.booking_date);

    if (a.booking_date !== b.booking_date)
      return new Date(a.booking_date) - new Date(b.booking_date);

    // Nếu cùng ngày, sắp xếp theo trạng thái
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
                <th className="py-2 px-4 font-medium text-gray-700 admin-dark:text-gray-300 hidden">
                  Ngày tạo
                </th>
                <th className="py-2 px-4 font-medium text-gray-700 admin-dark:text-gray-300">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, i) => {
                const status = getOrderStatus(
                  order.booking_date,
                  order.completed_date
                );
                return (
                  <tr
                    key={i}
                    className={`border-b border-gray-200 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-800 transition-colors ${getStatusBackground(
                      status
                    )}`}
                  >
                    <td className="py-3 flex items-center gap-2">
                      <div
                        className={`w-2 h-2 ${order.color} rounded-full`}
                      ></div>
                      <span>{order.ten_dich_vu}</span>
                    </td>
                    <td className="py-3 px-4">{order.name}</td>
                    <td className="py-3 px-12">
                      {new Date(order.completed_date).toLocaleDateString()}
                    </td>
                    <td className={`py-3 px-4 ${getStatusTextStyle(status)}`}>
                      {status}
                    </td>
                    {/* <td className="py-3 px-4">{order.dueTime}</td> */}
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

import React from "react";
import { CheckCircle, Clock, XCircle, Hourglass, CalendarCheck2 } from "lucide-react";

function ReadInforCustomer({ data }) {
    if (!data) {
        return <p className="text-gray-500 admin-dark:text-gray-400">Đang tải dữ liệu...</p>;
    }

    const customer = data;

    // Gom booking theo logic: nếu completed hết thì gộp, nếu có mix thì gộp completed riêng, trạng thái khác để riêng
    const bookingsSummary = [];
    (data.services_booked || []).forEach((service) => {
        const completedBookings = service.bookings.filter((bk) => bk.status === "completed");
        const otherBookings = service.bookings.filter((bk) => bk.status !== "completed");

        // Nếu có completed thì gộp thành 1 dòng
        if (completedBookings.length > 0) {
            bookingsSummary.push({
                service_name: service.ten_dich_vu,
                status: "completed",
                count: completedBookings.length,
                total_spent: completedBookings.reduce((sum, bk) => sum + Number(bk.total || 0), 0),
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
        <div className="space-y-6 admin-dark:text-white">
            {/* Thông tin khách hàng */}
            <div>
                <h2 className="text-xl font-bold mb-3 text-gray-900 admin-dark:text-white">
                    Thông tin khách hàng
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 admin-dark:text-gray-300">
                    <div><span className="font-medium">Tên: </span>{customer.name}</div>
                    <div><span className="font-medium">Email: </span>{customer.email || "—"}</div>
                    <div><span className="font-medium">Số điện thoại: </span>{customer.phone || "—"}</div>
                    <div><span className="font-medium">Địa chỉ: </span>{customer.address || "—"}</div>
                    <div>
                        <span className="font-medium">Tổng chi tiêu: </span>
                        {Number(customer.total_spent).toLocaleString("vi-VN")} ₫
                    </div>
                    <div><span className="font-medium">Số lần đặt: </span>{customer.booking_count || 0}</div>
                    <div><span className="font-medium">Loại khách: </span>{customer.type || "—"}</div>
                </div>
            </div>

            {/* Thống kê dịch vụ */}
            <div>
                <h2 className="text-xl font-bold mb-3 text-gray-900 admin-dark:text-white">
                    Thống kê dịch vụ
                </h2>
                {bookingsSummary.length === 0 ? (
                    <p className="text-gray-500 admin-dark:text-gray-400">Chưa đặt dịch vụ nào.</p>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 admin-dark:border-gray-700">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 admin-dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left">Dịch vụ</th>
                                    <th className="px-4 py-3 text-center">Trạng thái</th>
                                    <th className="px-4 py-3 text-right">Số lần đặt</th>
                                    <th className="px-4 py-3 text-right">Tổng chi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white admin-dark:bg-gray-800">
                                {sortedBookings.map((b, i) => (
                                    <tr key={i} className="border-t border-gray-200 admin-dark:border-gray-700">
                                        <td className="px-4 py-3 text-gray-900 admin-dark:text-gray-300">
                                            {b.service_name}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {b.status === "completed" && (
                                                <CheckCircle className="h-5 w-5 text-green-600 admin-dark:text-green-400 inline-block" />
                                            )}
                                            {b.status === "pending" && (
                                                <Hourglass className="h-5 w-5 text-gray-500 admin-dark:text-gray-400 inline-block" />
                                            )}
                                            {b.status === "processing" && (
                                                <Clock className="h-5 w-5 text-yellow-600 admin-dark:text-yellow-400 inline-block" />
                                            )}
                                            {b.status === "confirmed" && (
                                                <CalendarCheck2 className="h-5 w-5 text-blue-600 admin-dark:text-blue-400 inline-block" />
                                            )}
                                            {b.status === "cancelled" && (
                                                <XCircle className="h-5 w-5 text-red-600 admin-dark:text-red-400 inline-block" />
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-900 admin-dark:text-gray-300">
                                            {b.count}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-900 admin-dark:text-gray-300">
                                            {b.total_spent.toLocaleString("vi-VN")} ₫
                                        </td>
                                    </tr>
                                ))}

                                {/* Dòng tổng cộng */}
                                <tr className="border-t-2 border-gray-300 admin-dark:border-gray-600 font-semibold">
                                    <td className="px-4 py-3 text-gray-900 admin-dark:text-white">Tổng cộng</td>
                                    <td className="px-4 py-3 text-center">—</td>
                                    <td className="px-4 py-3 text-right text-gray-900 admin-dark:text-white">
                                        {bookingsSummary.reduce((sum, b) => sum + b.count, 0)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-900 admin-dark:text-white">
                                        {bookingsSummary
                                            .reduce((sum, b) => sum + b.total_spent, 0)
                                            .toLocaleString("vi-VN")} ₫
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReadInforCustomer;

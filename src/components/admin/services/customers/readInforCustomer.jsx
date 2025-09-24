import React, { useEffect, useState } from "react";

function ReadInforCustomer({ data }) {
    console.log("🎨 [ReadInforCustomer] Component rendering with data:", data);

    if (!data) {
        console.log("⚠️ [ReadInforCustomer] No data provided");
        return <p className="text-gray-500 admin-dark:text-gray-400">Đang tải dữ liệu...</p>;
    }

    // Kiểm tra cấu trúc dữ liệu và adapt cho phù hợp
    let customer, bookings, servicesSummary;

    if (data.customer) {
        // Nếu dữ liệu đã được nest trong object customer
        customer = data.customer;
        bookings = data.bookings || [];
        servicesSummary = data.servicesSummary || [];
    } else {
        // Nếu dữ liệu customer nằm trực tiếp trong root object
        customer = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            total_spent: data.total_spent,
            booking_count: data.booking_count,
            type: data.type,
            customer_id: data.customer_id
        };
        bookings = data.bookings || [];
        servicesSummary = data.servicesSummary || data.services_summary || [];
    }

    console.log("📊 [ReadInforCustomer] Data breakdown:");
    console.log("   - customer:", customer);
    console.log("   - bookings:", bookings.length, "items");
    console.log("   - servicesSummary:", servicesSummary.length, "items");
    console.log("   - raw data keys:", Object.keys(data));

    return (
        <div className="space-y-6 admin-dark:text-white">
            {/* Thông tin khách hàng */}
            <div>
                <h2 className="text-xl font-bold mb-3 text-gray-900 admin-dark:text-white">Thông tin khách hàng</h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 admin-dark:text-gray-300">
                    <div><span className="font-medium text-gray-900 admin-dark:text-white">Tên: </span>{customer.name}</div>
                    <div><span className="font-medium text-gray-900 admin-dark:text-white">Email: </span>{customer.email || "—"}</div>
                    <div><span className="font-medium text-gray-900 admin-dark:text-white">Số điện thoại: </span>{customer.phone || "—"}</div>
                    <div><span className="font-medium text-gray-900 admin-dark:text-white">Địa chỉ: </span>{customer.address || "—"}</div>
                    <div><span className="font-medium text-gray-900 admin-dark:text-white">Tổng chi tiêu: </span>{customer.total_spent?.toLocaleString("vi-VN")} ₫</div>
                    <div><span className="font-medium text-gray-900 admin-dark:text-white">Số lần đặt: </span>{customer.booking_count || 0}</div>
                    <div><span className="font-medium text-gray-900 admin-dark:text-white">Loại khách: </span>{customer.type || "—"}</div>
                </div>
            </div>

            {/* Thống kê dịch vụ */}
            <div>
                <h2 className="text-xl font-bold mb-3 text-gray-900 admin-dark:text-white">Thống kê dịch vụ</h2>
                {servicesSummary.length === 0 ? (
                    <p className="text-gray-500 admin-dark:text-gray-400">Chưa đặt dịch vụ nào.</p>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 admin-dark:border-gray-700">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 admin-dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-900 admin-dark:text-white">Dịch vụ</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-900 admin-dark:text-white">Số lần đặt</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-900 admin-dark:text-white">Tổng chi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white admin-dark:bg-gray-800">
                                {servicesSummary.map((s, i) => (
                                    <tr key={i} className="border-t border-gray-200 admin-dark:border-gray-700">
                                        <td className="px-4 py-3 text-gray-900 admin-dark:text-gray-300">{s.service_name}</td>
                                        <td className="px-4 py-3 text-right text-gray-900 admin-dark:text-gray-300">{s.count}</td>
                                        <td className="px-4 py-3 text-right text-gray-900 admin-dark:text-gray-300">{s.total_spent.toLocaleString("vi-VN")} ₫</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Danh sách booking */}
            <div>
                <h2 className="text-xl font-bold mb-3 text-gray-900 admin-dark:text-white">Lịch sử đặt dịch vụ</h2>
                {bookings.length === 0 ? (
                    <p className="text-gray-500 admin-dark:text-gray-400">Chưa có lịch sử đặt dịch vụ.</p>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 admin-dark:border-gray-700">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 admin-dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-900 admin-dark:text-white">Ngày đặt</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-900 admin-dark:text-white">Dịch vụ</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-900 admin-dark:text-white">Số tiền</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-900 admin-dark:text-white">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white admin-dark:bg-gray-800">
                                {bookings.map((b, i) => (
                                    <tr key={i} className="border-t border-gray-200 admin-dark:border-gray-700">
                                        <td className="px-4 py-3 text-gray-900 admin-dark:text-gray-300">{new Date(b.booking_date).toLocaleDateString("vi-VN")}</td>
                                        <td className="px-4 py-3 text-gray-900 admin-dark:text-gray-300">{b.service_name}</td>
                                        <td className="px-4 py-3 text-right text-gray-900 admin-dark:text-gray-300">{b.price.toLocaleString("vi-VN")} ₫</td>
                                        <td className="px-4 py-3 text-gray-900 admin-dark:text-gray-300">
                                            <span className={`px-2 py-1 rounded-full text-xs ${b.status === 'completed'
                                                ? 'bg-green-100 text-green-800 admin-dark:bg-green-900 admin-dark:text-green-200'
                                                : b.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800 admin-dark:bg-yellow-900 admin-dark:text-yellow-200'
                                                    : 'bg-red-100 text-red-800 admin-dark:bg-red-900 admin-dark:text-red-200'
                                                }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReadInforCustomer;
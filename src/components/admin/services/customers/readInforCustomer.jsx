import React, { useEffect, useState } from "react";

function ReadInforCustomer({ data }) {


    const [informationCustomer, setInformationCustomer] = useState(null);



    useEffect(() => {
        setInformationCustomer(data);
        if (data === null) {
            return <p className="text-gray-500">1Chưa có dữ liệu khách hàng.</p>;
        }
    }, [data]);

    const {
        customer = {},
        bookings = [],
        servicesSummary = [],
    } = data;


    if (!data) {
        return <p className="text-gray-500">Đang tải dữ liệu...</p>;
    }

    return (
        <div className="space-y-6">
            {/* Thông tin khách hàng */}
            <div>
                <h2 className="text-xl font-bold mb-3">Thông tin khách hàng</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium">Tên: </span>
                        {customer.name}
                    </div>
                    <div>
                        <span className="font-medium">Email: </span>
                        {customer.email || "—"}
                    </div>
                    <div>
                        <span className="font-medium">Số điện thoại: </span>
                        {customer.phone || "—"}
                    </div>
                    <div>
                        <span className="font-medium">Địa chỉ: </span>
                        {customer.address || "—"}
                    </div>
                    <div>
                        <span className="font-medium">Tổng chi tiêu: </span>
                        {customer.total_spent?.toLocaleString("vi-VN")} ₫
                    </div>
                    <div>
                        <span className="font-medium">Số lần đặt: </span>
                        {customer.booking_count || 0}
                    </div>
                    <div>
                        <span className="font-medium">Loại khách: </span>
                        {customer.type || "—"}
                    </div>
                </div>
            </div>

            {/* Thống kê dịch vụ */}
            <div>
                <h2 className="text-xl font-bold mb-3">Thống kê dịch vụ</h2>
                {servicesSummary.length === 0 ? (
                    <p className="text-gray-500">Chưa đặt dịch vụ nào.</p>
                ) : (
                    <table className="w-full text-sm border border-gray-200 admin-dark:border-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 admin-dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left">Dịch vụ</th>
                                <th className="px-4 py-2 text-right">Số lần đặt</th>
                                <th className="px-4 py-2 text-right">Tổng chi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicesSummary.map((s, i) => (
                                <tr
                                    key={i}
                                    className="border-t border-gray-200 admin-dark:border-gray-700"
                                >
                                    <td className="px-4 py-2">{s.service_name}</td>
                                    <td className="px-4 py-2 text-right">{s.count}</td>
                                    <td className="px-4 py-2 text-right">
                                        {s.total_spent.toLocaleString("vi-VN")} ₫
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Danh sách booking */}
            <div>
                <h2 className="text-xl font-bold mb-3">Lịch sử đặt dịch vụ</h2>
                {bookings.length === 0 ? (
                    <p className="text-gray-500">Chưa có lịch sử đặt dịch vụ.</p>
                ) : (
                    <table className="w-full text-sm border border-gray-200 admin-dark:border-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 admin-dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left">Ngày đặt</th>
                                <th className="px-4 py-2 text-left">Dịch vụ</th>
                                <th className="px-4 py-2 text-right">Số tiền</th>
                                <th className="px-4 py-2 text-left">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b, i) => (
                                <tr
                                    key={i}
                                    className="border-t border-gray-200 admin-dark:border-gray-700"
                                >
                                    <td className="px-4 py-2">
                                        {new Date(b.booking_date).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="px-4 py-2">{b.service_name}</td>
                                    <td className="px-4 py-2 text-right">
                                        {b.price.toLocaleString("vi-VN")} ₫
                                    </td>
                                    <td className="px-4 py-2">{b.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ReadInforCustomer;

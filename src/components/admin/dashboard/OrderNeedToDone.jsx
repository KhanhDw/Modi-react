import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"


export default function OrderNeedToDone() {
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
                                        className={`border-b border-gray-200 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-800 transition-colors ${getStatusBackground(
                                            status
                                        )}`}
                                    >
                                        <td className="py-3 px-4 flex items-center gap-2">
                                            <div className={`w-2 h-2 ${order.color} rounded-full`}></div>
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
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle
} from "lucide-react"



export default function TaskList() {
    const tasks = [
        { done: true, text: "Gọi điện cho khách hàng XYZ", badge: "Hoàn thành", variant: "secondary" },
        { done: false, text: "Cập nhật template mới cho trang chủ", badge: "Khẩn cấp", variant: "destructive" },
        { done: false, text: "Trả lời email khách hàng về báo giá", badge: "Hôm nay", variant: "outline" },
        { done: false, text: "Họp team về dự án website mới", badge: "14:00", variant: "outline" },
        { done: false, text: "Review và phê duyệt thiết kế", badge: "Tuần này", variant: "secondary" },
        { done: false, text: "Chuẩn bị báo cáo tháng", badge: "Tuần này", variant: "secondary" },
    ]
    return (
        <Card className="bg-white text-gray-900 admin-dark:bg-gray-900 admin-dark:text-gray-100">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 admin-dark:text-gray-100">Chiến dịch truyền thông và marketing</CardTitle>
                <CardDescription className="text-gray-500 admin-dark:text-gray-400">
                    Danh sách quảng cáo đang chạy
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {tasks.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                        {t.done ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 admin-dark:border-gray-600 rounded-full"></div>
                        )}
                        <span
                            className={`text-sm ${t.done
                                ? "line-through text-gray-500 admin-dark:text-gray-400"
                                : ""
                                }`}
                        >
                            {t.text}
                        </span>
                        <Badge theme="admin" variant={t.variant} className={`ml-auto ${t.variant === "destructive" ? "text-black" : ""}`}>
                            {t.badge}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    );

}

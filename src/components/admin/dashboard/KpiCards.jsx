import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import {
    MessageSquare, Sprout, DollarSign, TrendingUp
} from "lucide-react"

export default function KpiCards() {
    const cards = [
        { title: "Liên hệ tháng này", value: 24, change: "+12%", icon: MessageSquare },
        { title: "Đơn đặt website tháng này", value: 8, change: "+25%", icon: Sprout },
        { title: "Doanh thu tháng này", value: "98.5M", change: "+18%", icon: DollarSign },
        { title: "Lượt khách truy cập tháng này", value: 15, change: "+5", icon: TrendingUp },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map(({ title, value, change, icon: Icon }, i) => (
                <Card
                    key={i}
                    className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 shadow-sm"
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-800 admin-dark:text-gray-100">{title}</CardTitle>
                        <Icon className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-800 admin-dark:text-gray-100">{value}</div>
                        <p className="text-xs text-gray-500 admin-dark:text-gray-400">
                            <span className="text-green-600 admin-dark:text-green-400">{change} so với tháng trước</span>
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"

const revenueData = [
    { month: "T1", revenue: 45000000 },
    { month: "T2", revenue: 52000000 },
    { month: "T3", revenue: 48000000 },
    { month: "T4", revenue: 61000000 },
    { month: "T5", revenue: 55000000 },
    { month: "T6", revenue: 67000000 },
    { month: "T7", revenue: 72000000 },
    { month: "T8", revenue: 69000000 },
    { month: "T9", revenue: 78000000 },
    { month: "T10", revenue: 85000000 },
    { month: "T11", revenue: 92000000 },
    { month: "T12", revenue: 98000000 },
]

export default function RevenueChart() {
    return (
        <Card className="bg-white text-gray-900 admin-dark:bg-gray-900 admin-dark:text-gray-100">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Website bán ra trong 12 tháng</CardTitle>
                <CardDescription>
                    Biểu đồ đơn đặt hàng website theo tháng (Website)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(v) => `${v / 1000000}M`} />
                        <Tooltip formatter={(value) => [`${value.toLocaleString()} Website`, "Số lượng"]} />
                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

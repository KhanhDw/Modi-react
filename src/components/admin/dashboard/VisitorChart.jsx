import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import { useEffect, useState } from "react"


const visitorData = [
    { day: "T2", visitors: 1200 },
    { day: "T3", visitors: 1800 },
    { day: "T4", visitors: 1600 },
    { day: "T5", visitors: 2200 },
    { day: "T6", visitors: 2800 },
    { day: "T7", visitors: 3200 },
    { day: "CN", visitors: 2900 },
]

export default function VisitorChart() {

    const url = `${import.meta.env.VITE_MAIN_BE_URL}/api/site/visits/current-week`
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(url)
                const json = await res.json()

                // Chuyển đổi daily -> format cho recharts
                const chartData = json.daily.map(d => ({
                    day: d.weekday.replace("Thứ ", "T").replace("Chủ nhật", "CN"), // trục X
                    weekday: d.weekday,  // giữ nguyên "Thứ 2", "Thứ 3", "Chủ nhật"
                    visitors: d.total ?? 0,   // null -> 0
                }))

                console.log("d:", chartData);

                setData(chartData)
            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <Card className="bg-white text-gray-900 admin-dark:bg-gray-900 admin-dark:text-gray-100">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Số lượng khách truy cập</CardTitle>
                <CardDescription>Lượt truy cập demo trong tuần</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        // data={visitorData}
                        data={data}
                    >
                        <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload || !payload.length) return null

                                const dayLabel = payload[0].payload.weekday // "Thứ 2", "Thứ 3", ...
                                const visitors = payload[0].value

                                return (
                                    <div className="rounded-lg bg-white p-2 text-sm shadow 
                      text-black admin-dark:bg-gray-900 admin-dark:text-white">
                                        <p className="font-medium">{dayLabel}</p>
                                        <p>{visitors} lượt truy cập</p>
                                    </div>
                                )
                            }}
                        />



                        <Bar dataKey="visitors" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from "recharts"
import SiteVisitsModal from "./siteVisitorModal.jsx"


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
    const [openVistor, setOpenVistor] = useState(false);



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
        <div>
            <Card className="bg-white border border-gray-200 admin-dark:border-gray-700 text-gray-900 admin-dark:bg-gray-900 admin-dark:text-gray-100">
                <CardHeader>
                    <div className="flex items-center xs:flex-col sm:flex-row sm:justify-between xs:gap-2 xs:justify-center justify-between">
                        <div>
                            <CardTitle className="text-base sm:text-[18px] md:text-xl lg:text-xl font-bold text-gray-900 admin-dark:text-gray-100">Số lượng khách truy cập</CardTitle>
                            <CardDescription className="xs:text-center sm:text-start">Lượt truy cập trong tuần</CardDescription>
                        </div>
                        <div>
                            <button onClick={() => setOpenVistor(true)} className="text-blue-500 admin-dark:text-blue-400 hover:text-black border border-gray-600 px-3 py-2 rounded-sm cursor-pointer shadow-sm admin-dark:hover:bg-black hover:bg-gray-200  transition-colors duration-200">
                                <p className="text-xs font-medium">Xem thống kê</p>
                            </button>
                        </div>
                    </div>
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
            <SiteVisitsModal open={openVistor} onClose={() => setOpenVistor(false)} />
        </div>
    )
}

// =============================
// Sản phẩm được xem nhiều nhất
// =============================
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { useEffect, useState } from "react"

import { Link } from "react-router-dom"


export default function MostViewedProducts() {
    const [topSamples, setTopSamples] = useState([])

    useEffect(() => {
        const fetchTopSamples = async () => {
            try {
                const url = `${import.meta.env.VITE_MAIN_BE_URL}/api/web-samples/most-viewed?limit=5&lang=vi`
                const res = await fetch(url)
                const data = await res.json()
                if (data.success) {
                    setTopSamples(data.data) // lấy danh sách top N
                }
            } catch (err) {
                console.error("Lỗi khi fetch sản phẩm xem nhiều nhất:", err)
            }
        }
        fetchTopSamples()
    }, [])

    if (!topSamples || topSamples.length === 0) {
        return (
            <Card className="bg-white text-gray-900 border border-gray-200 admin-dark:border-gray-700 admin-dark:bg-gray-900 admin-dark:text-gray-100">
                <CardHeader>
                    <CardTitle className="text-base sm:text-[18px] md:text-xl lg:text-xl font-bold text-gray-900 admin-dark:text-gray-300">Sản phẩm được xem nhiều nhất</CardTitle>
                    <CardDescription>Danh sách Top sản phẩm theo lượt xem</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="text-center text-gray-500 admin-dark:text-gray-400 text-sm font-medium">
                        Chưa Có Dữ Liệu
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white text-gray-900 border border-gray-200 admin-dark:border-gray-700 admin-dark:bg-gray-900 admin-dark:text-gray-100">
            <CardHeader>
                <CardTitle className="text-base sm:text-[18px] md:text-xl lg:text-xl font-bold text-gray-900 admin-dark:text-gray-300">Sản phẩm được xem nhiều nhất</CardTitle>
                <CardDescription>Danh sách Top sản phẩm theo lượt xem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {topSamples.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3 border-b py-1">
                        <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-blue-500 rounded-full">
                            {i + 1}
                        </div>
                        <div className="flex justify-between w-full items-center">
                            <Link
                                to={`${import.meta.env.VITE_MAIN_FE_URL}/products/${p.id}`}
                                className="text-sm font-medium">
                                {p.name}
                            </Link>
                            <p className="text-xs text-gray-500 admin-dark:text-gray-400">
                                {p.views.toLocaleString()} lượt xem
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

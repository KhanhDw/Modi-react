import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"

export default function MostViewedProducts() {

    const sampleProducts = [
        { id: 1, name: "iPhone 15 Pro", views: 1200 },
        { id: 2, name: "Samsung Galaxy S24", views: 950 },
        { id: 3, name: "MacBook Air M3", views: 800 },
        { id: 4, name: "Apple Watch Ultra 2", views: 600 },
    ]

    const sortedProducts = [...sampleProducts].sort((a, b) => b.views - a.views)

    return (
        <Card className="bg-white text-gray-900 admin-dark:bg-gray-900 admin-dark:text-gray-100">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900  admin-dark:text-gray-100">🔥 Sản phẩm được xem nhiều nhất</CardTitle>
                <CardDescription>Danh sách Top sản phẩm theo lượt xem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {sortedProducts.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 border-b py-1">
                        <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-blue-500 rounded-full">
                            {i + 1}
                        </div>
                        <div className="flex justify-between w-full items-center">
                            <p className="text-sm font-medium">{p.name}</p>
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

// src/pages/marketing/index.jsx
import { useEffect, useState } from "react"
import ArticlesList from "@/pages/marketing/articles-list"
import { Search } from "lucide-react"

export default function MarketingPage() {
    const [articles, setArticles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isSearching, setIsSearching] = useState(false)

    const [visibleCount, setVisibleCount] = useState(5) // 🔹 số bài hiện tại
    const pageSize = 5

    const fetchArticles = async (term = "") => {
        try {
            setIsLoading(true)
            setIsSearching(!!term)

            let apiUrl = `${import.meta.env.VITE_MAIN_BE_URL}/api/marketing`
            if (term) {
                apiUrl += `/search?term=${encodeURIComponent(term)}`
            }

            const response = await fetch(apiUrl)
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

            const data = await response.json()
            setArticles(data.data || data)
            setVisibleCount(pageSize) // reset lại mỗi lần tìm kiếm
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu:", error)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearchSubmit = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            fetchArticles(searchTerm.trim())
        }
    }

    useEffect(() => {
        fetchArticles()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-foreground">
                Đang tải dữ liệu...
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-destructive">
                Lỗi: {error}
            </div>
        )
    }

    const visibleArticles = articles.slice(0, visibleCount)

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto py-10 px-4">
                <div className="mb-8 flex justify-between items-center">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            Kết nối thương hiệu với khách hàng
                        </h2>
                        <p className="text-muted-foreground">
                            Với một website chuẩn SEO doanh nghiệp bạn sẽ tiếp cận hàng ngàn khách hàng và vượt qua đối thủ.
                        </p>
                    </div>

                    {/* Ô tìm kiếm */}
                    <div className="mt-4 relative flex items-center space-x-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            placeholder="Tìm kiếm..."
                            className="flex-grow py-2 pl-4 pr-10 w-md border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground bg-input transition-colors duration-200"
                        />
                        <div
                            className="absolute right-5 cursor-pointer"
                            onClick={() => fetchArticles(searchTerm.trim())}
                        >
                            <Search className="text-gray-600 dark:text-white h-5 w-5" />
                        </div>
                    </div>
                </div>

                {articles.length > 0 ? (
                    <>
                        <ArticlesList articles={visibleArticles} />

                        {/* Nút xem thêm */}
                        {visibleCount < articles.length && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setVisibleCount((prev) => prev + pageSize)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Xem thêm
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    isSearching && (
                        <div className="text-center text-lg text-muted-foreground">
                            Không tìm thấy bài viết nào.
                        </div>
                    )
                )}
            </main>
        </div>
    )
}

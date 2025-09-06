// src/pages/marketing/index.jsx
import { useEffect, useState } from "react"
import ArticlesList from "@/pages/marketing/articles-list"
import { Search } from "lucide-react"
// import languageAPI from "@/hook/currentLang";
import useCurrentLanguage, { setAppLanguage } from "@/hook/currentLang";

export default function MarketingPage() {
    const [articles, setArticles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [visibleCount, setVisibleCount] = useState(5)
    const { lang, prefix } = useCurrentLanguage();
    const pageSize = 5

    const fetchArticles = async (term = "") => {
        try {
            setIsLoading(true)
            setIsSearching(!!term)

            let apiUrl = `${import.meta.env.VITE_MAIN_BE_URL}${prefix}/api/marketing`
            if (term) {
                apiUrl += `/search?term=${encodeURIComponent(term)}`
            }

            const response = await fetch(apiUrl)
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

            const data = await response.json()

            const blogsPublis = data.data.filter((post) => post.status === "published")
            const sortData = blogsPublis.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            setArticles(sortData)
            setVisibleCount(pageSize)
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
    }, [prefix])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-foreground dark:text-white">
                Đang tải dữ liệu...
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-destructive dark:text-red-400">
                Lỗi: {error}
            </div>
        )
    }

    const visibleArticles = articles.slice(0, visibleCount)

    return (
        <div className="min-h-screen bg-transparent dark:bg-background">
            <main className="container mx-auto py-10 px-4">
                <div className="mb-8 flex justify-between items-center">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold text-foreground dark:text-white mb-2">
                            Kết nối thương hiệu với khách hàng
                        </h2>
                        <p className="text-muted-foreground dark:text-gray-400">
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
                            className="flex-grow py-2 pl-4 pr-10 w-md border border-border rounded-md 
                                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring 
                                       text-foreground dark:text-white 
                                       bg-input dark:bg-gray-800 
                                       transition-colors duration-200"
                        />
                        <div
                            className="absolute right-5 cursor-pointer"
                            onClick={() => fetchArticles(searchTerm.trim())}
                        >
                            <Search className="text-gray-600 dark:text-gray-200 h-5 w-5" />
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
                                    className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg 
                                               hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                                >
                                    Xem thêm
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    isSearching && (
                        <div className="text-center text-lg text-muted-foreground dark:text-gray-400">
                            Không tìm thấy bài viết nào.
                        </div>
                    )
                )}
            </main>
        </div>
    )
}

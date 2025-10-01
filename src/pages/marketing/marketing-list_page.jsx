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
    const pageSize = 6
    const [visibleCount, setVisibleCount] = useState(pageSize)
    const { lang, prefix } = useCurrentLanguage();

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

    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD") // tách dấu
            .replace(/[\u0300-\u036f]/g, "") // xóa dấu
            .trim()
    }

    const handleSearchSubmit = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()

            const term = normalizeText(searchTerm)
            if (!term) {
                // nếu search rỗng thì load lại toàn bộ
                fetchArticles()
                return
            }

            const filtered = articles.filter((post) => {
                const title = normalizeText(post.title || "")
                return title.includes(term)
            })

            setArticles(filtered)
            setVisibleCount(pageSize)
            setIsSearching(true)
        }
    }

    useEffect(() => {
        fetchArticles()
    }, [prefix])

    // if (isLoading) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center text-xl text-foreground dark:text-white">
    //             Đang tải dữ liệu...
    //         </div>
    //     )
    // }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-destructive dark:text-red-400">
                Lỗi: {error}
            </div>
        )
    }

    const visibleArticles = articles.slice(0, visibleCount)

    return (
        <div className="min-h-screen bg-transparent ">
            <main className="container mx-auto py-8 px-4">
                <div className="mb-8 flex flex-col gap-4">
                    {/* Text + Search */}
                    <div className="flex flex-col text-center md:text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white mb-2">
                            {lang === "vi" ? "Kết nối thương hiệu với khách hàng" : "Connecting the brand with customers"}
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400 mb-3">
                            {lang == "vi" ? "Với một website chuẩn SEO doanh nghiệp bạn sẽ tiếp cận hàng ngàn khách hàng và vượt qua đối thủ" : "An SEO-friendly business website helps you reach thousands of customers and stay ahead of the competition"}
                        </p>

                        {/* Ô tìm kiếm ngay dưới title */}
                        <div className="relative flex items-center w-full md:w-96 md:self-end lg:self-end">
                            <input autoComplete="off"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                                placeholder={lang == "vi" ? "Tìm kiếm..." : "Search..."}
                                className="w-full py-2 pl-4 pr-10 border border-border rounded-md
                   focus:outline-none focus:ring-2 focus:ring-ring focus:border-none
                   text-foreground dark:text-white
                   bg-input dark:bg-gray-800
                   transition-colors duration-200"
                            />
                            <div
                                className="absolute right-3 cursor-pointer"
                                onClick={() => fetchArticles(searchTerm.trim())}
                            >
                                <Search className="text-gray-600 dark:text-gray-200 h-5 w-5" />
                            </div>
                        </div>

                        {!articles.length && (
                            <div className="mt-40 flex items-center justify-center">
                                <div className="text-center flex items-center justify-center flex-col">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        {lang === "vi"
                                            ? isSearching
                                                ? "Không tìm thấy kết quả!"
                                                : "Hiện tại chưa có bài viết nào."
                                            : isSearching
                                                ? "No results found!"
                                                : "There are no articles yet."}
                                    </h3>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {articles.length > 0 && (
                    <>
                        <ArticlesList articles={visibleArticles} />

                        {/* Nút xem thêm */}
                        {visibleCount < articles.length && (
                            <div className="flex justify-center mt-6 ">
                                <button
                                    onClick={() => setVisibleCount((prev) => prev + pageSize)}
                                    className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg
                                               hover:bg-blue-700 dark:hover:bg-blue-600 transition cursor-pointer"
                                >
                                    Xem thêm
                                </button>
                            </div>
                        )}
                    </>
                )}

            </main>
        </div>
    )
}

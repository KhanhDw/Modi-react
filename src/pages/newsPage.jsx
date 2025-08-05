import { useEffect, useState } from "react"
import { Clock, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function NewsInterface() {
  const [newsArticles, setNewsArticles] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  const pageSize = 6

  useEffect(() => {
    fetch("http://localhost:3000/api/tintuc")
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => new Date(b.ngay_dang) - new Date(a.ngay_dang));
        setNewsArticles(sorted);
      })
      .catch((error) => {
        console.error(error);
        setNewsArticles([]);
      })
  }, [])

  // Thêm hàm format ngày
  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("vi-VN")
  }

  if (!newsArticles.length) {
    return <div className="text-center py-20 text-gray-500">Không có tin tức nào.</div>
  }

  // Tính toán dữ liệu hiển thị cho từng trang
  let heroArticle = null
  let articlesToShow = []

  if (currentPage === 1) {
    heroArticle = newsArticles[0]
    articlesToShow = newsArticles.slice(1, 1 + pageSize)
  } else {
    const startIdx = 1 + (currentPage - 2) * pageSize + pageSize
    articlesToShow = newsArticles.slice(startIdx, startIdx + pageSize)
  }

  const totalPages = Math.ceil((newsArticles.length - 1) / pageSize) || 1

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Article chỉ ở trang 1 */}
        {currentPage === 1 && heroArticle && (
          <div className="mb-12">
            <div
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => navigate(`/news/${heroArticle.id}`)}
            >
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={heroArticle.hinh_anh || "/placeholder.svg"}
                    alt={heroArticle.tieu_de}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{heroArticle.tieu_de}</h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed line-clamp-5">
                    {heroArticle.noi_dung}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{heroArticle.tac_gia}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(heroArticle.ngay_dang)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesToShow.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/news/${article.id}`)}
            >
              <img src={article.hinh_anh || "/placeholder.svg"} alt={article.tieu_de} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white line-clamp-2">
                  {article.tieu_de}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{article.noi_dung}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{article.tac_gia}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(article.ngay_dang)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="text-center mt-12 flex justify-center gap-2">
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Trang trước
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={`px-4 py-2 rounded ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  )
}

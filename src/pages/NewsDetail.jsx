import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Clock, User } from "lucide-react"

export default function NewsDetail1() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3000/api/tintuc/${id}`)
      .then(res => res.json())
      .then(data => setArticle(data))
  }, [id])

  if (!article) return <div className="text-center py-20 text-gray-500">Đang tải...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <img src={article.hinh_anh || "/placeholder.svg"} alt={article.tieu_de} className="w-full h-96 object-cover" />
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{article.tieu_de}</h1>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.tac_gia}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.ngay_dang}</span>
            </div>
          </div>
          <div className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
            {article.noi_dung}
          </div>
        </div>
      </div>
    </div>
  )
}
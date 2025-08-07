// src/components/NewsDetail1.js
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, User } from "lucide-react";
import SlateContentRenderer from "../components/feature/SlateContentRenderer";
import { newsData } from "../data/MockData";

export default function NewsDetail1() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.MAIN_BE_URL}/api/tintuc/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("API không phản hồi");
        return res.json();
      })
      .then((data) => {
        if (data && data.id && data.tieu_de && data.noi_dung) {
          setArticle(data);
        } else {
          const foundArticle = newsData.find((item) => item.id === parseInt(id));
          setArticle(foundArticle || null);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        const foundArticle = newsData.find((item) => item.id === parseInt(id));
        setArticle(foundArticle || null);
      });
  }, [id]);

  if (!article) {
    return <div className="text-center py-10 text-gray-500">Không tìm thấy bài viết.</div>;
  }

  return (
    <div className="md:container mx-auto px-0 sm:px-4 py-4 sm:py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 sm:mb-6 px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition text-sm sm:text-base"
      >
        ← Quay lại
      </button>
      <div className="bg-white dark:bg-slate-800 md:rounded-lg sm:rounded-lg overflow-hidden shadow-lg sm:shadow-lg">
        <img
          src={article.hinh_anh || "/placeholder.svg"}
          alt={article.tieu_de}
          className="w-full h-48 sm:h-96 object-cover"
        />
        <div className="p-4 sm:p-8">
          <h1 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">{article.tieu_de}</h1>
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <User className="w-3 sm:w-4 h-3 sm:h-4" />
              <span>{article.tac_gia}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
              <span>{new Date(article.ngay_dang).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
          <div className="text-gray-700 dark:text-gray-200 text-base sm:text-lg leading-relaxed">
            <SlateContentRenderer jsonContent={article.noi_dung} />
          </div>
        </div>
      </div>
    </div>
  );
}
// src/components/NewsDetail1.js
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, User } from "lucide-react";
import SlateContentRenderer from "../components/feature/SlateContentRenderer";
import { newsData } from "../data/MockData"; // Import dữ liệu mẫu

export default function NewsDetail1() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/api/tintuc/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("API không phản hồi"); // Kiểm tra lỗi HTTP
        return res.json();
      })
      .then((data) => {
        // Kiểm tra dữ liệu từ API
        if (data && data.id && data.tieu_de && data.noi_dung) {
          setArticle(data);
        } else {
          // Sử dụng dữ liệu mẫu nếu API trả về dữ liệu không hợp lệ
          const foundArticle = newsData.find((item) => item.id === parseInt(id));
          setArticle(foundArticle || null);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        // Sử dụng dữ liệu mẫu khi API thất bại
        const foundArticle = newsData.find((item) => item.id === parseInt(id));
        setArticle(foundArticle || null);
      });
  }, [id]);

  if (!article) {
    return <div className="text-center py-20 text-gray-500">Không tìm thấy bài viết.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition"
      >
        ← Quay lại
      </button>
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <img
          src={article.hinh_anh || "/placeholder.svg"}
          alt={article.tieu_de}
          className="w-full h-96 object-cover"
        />
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{article.tieu_de}</h1>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.tac_gia}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{new Date(article.ngay_dang).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
          <div className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
            {/* Biên dịch JSON thành HTML */}
            <SlateContentRenderer jsonContent={article.noi_dung} />
          </div>
        </div>
      </div>
    </div>
  );
}
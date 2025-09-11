// src/components/NewsInterface.js
import { useEffect, useState } from "react";
import { Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useCurrentLanguage from "@/hook/currentLang";

export default function NewsInterface() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { prefix } = useCurrentLanguage();
  const pageSize = 6;

  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_MAIN_BE_URL}${prefix}/api/blogs`)
      .then((res) => {
        if (!res.ok) throw new Error("API không phản hồi");
        return res.json();
      })
      .then((apiData) => {
        if (apiData?.data?.length) {
          const blogsPublis = apiData.data.filter(
            (blog) => new Date(blog.published_at) <= new Date()
          );
          const sorted = blogsPublis.sort(
            (a, b) => new Date(b.published_at) - new Date(a.published_at)
          );
          const mappedData = sorted.map((item) => ({
            id: item.id,
            tieu_de: item.title,
            slug: item.slug,
            noi_dung: item.content,
            hinh_anh: item.image,
            tac_gia: item.author_name,
            ngay_dang: item.published_at,
          }));
          setNewsArticles(mappedData);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setNewsArticles([]);
        setIsLoading(false);
      });
  }, [prefix]);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "";

  if (isLoading)
    return (
      <div className="text-center py-20 text-gray-500 animate-pulse">
        Đang tải tin tức...
      </div>
    );
  if (!newsArticles.length)
    return <div className="text-center py-20 text-gray-500">Chưa có tin tức.</div>;

  let heroArticle = null;
  let articlesToShow = [];
  if (currentPage === 1) {
    heroArticle = newsArticles[0];
    articlesToShow = newsArticles.slice(1, 1 + pageSize);
  } else {
    const startIdx = 1 + (currentPage - 2) * pageSize + pageSize;
    articlesToShow = newsArticles.slice(startIdx, startIdx + pageSize);
  }
  const totalPages = Math.ceil((newsArticles.length - 1) / pageSize) || 1;

  const handleArticleClick = (slug, id) => {
    navigate(`/news/${slug}`, { state: { blogId: id } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Article */}
        {currentPage === 1 && heroArticle && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-shadow duration-500"
              onClick={() => handleArticleClick(heroArticle.slug, heroArticle.id)}
            >
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-1/2 relative overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                    src={`${import.meta.env.VITE_MAIN_BE_URL}${heroArticle.hinh_anh}`}
                    alt={heroArticle.tieu_de}
                    className="w-full h-64 md:h-full object-cover transform-gpu"
                  />
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <motion.div
                  className="md:w-1/2 p-8 flex flex-col justify-center"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, x: 30 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { staggerChildren: 0.15 },
                    },
                  }}
                >
                  <motion.h1
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="
              text-3xl font-bold mb-4 text-gray-900 dark:text-white
              line-clamp-2 md:line-clamp-none
              group-hover:text-blue-600 dark:group-hover:text-blue-400
              transition-colors duration-300
            "
                  >
                    {heroArticle.tieu_de}
                  </motion.h1>

                  <motion.p
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed line-clamp-5"
                    dangerouslySetInnerHTML={{ __html: heroArticle.noi_dung }}
                  />

                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{heroArticle.tac_gia}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(heroArticle.ngay_dang)}</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}


        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesToShow.map((article, idx) => (
            <motion.div
              key={article.id}
              className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md cursor-pointer group"
              onClick={() => handleArticleClick(article.slug, article.id)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.12, type: "spring", stiffness: 80 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Image wrapper */}
              <div className="relative w-full h-48 overflow-hidden">
                <motion.img
                  src={`${import.meta.env.VITE_MAIN_BE_URL}${article.hinh_anh}`}
                  alt={article.tieu_de}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay khi hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {article.tieu_de}
                </h3>
                <p
                  className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: article.noi_dung }}
                />
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
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="text-center mt-12 flex justify-center gap-2">
          {/* Nút trước */}
          <button
            className="px-3 cursor-pointer dark:text-white py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {/* Các trang */}
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={`px-4 py-2 rounded transition-colors cursor-pointer ${currentPage === idx + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
                }`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          {/* Nút sau */}
          <button
            className="dark:text-white cursor-pointer px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>

      </div>
    </div>
  );
}

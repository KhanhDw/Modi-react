// src/components/NewsInterface.js
import { useEffect, useState } from "react";
import { Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useCurrentLanguage from "@/hook/currentLang";
import PageList from "@/components/feature/pagination";

export default function NewsInterface() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [articlesToShow, setArticlesToShow] = useState([]);
  const navigate = useNavigate();
  const { prefix, lang } = useCurrentLanguage();
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
            status: item.status,
            noi_dung: item.content,
            hinh_anh: item.image,
            tac_gia: item.author_name,
            ngay_dang: item.published_at,
          }));
          setNewsArticles(mappedData);
        } else {
          setNewsArticles([]);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setNewsArticles([]);
        setIsLoading(false);
      });
  }, [prefix]);

  // Update articlesToShow when newsArticles changes
  useEffect(() => {
    if (newsArticles.length > 0) {
      const gridArticles = newsArticles.slice(1);
      const startIndex = 0;
      const endIndex = Math.min(startIndex + pageSize, gridArticles.length);
      setArticlesToShow(gridArticles.slice(startIndex, endIndex));
    } else {
      setArticlesToShow([]);
    }
  }, [newsArticles, pageSize]);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "";

  if (isLoading)
    return (
      <div className="text-center min-h-screen flex items-center justify-center flex-col">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {lang === "vi"
            ? "Hiện chưa tìm thấy tin tức!"
            : "No news articles found!"}
        </h3>
      </div>
    );

  if (!newsArticles.length)
    return (
      <div className="text-center min-h-screen flex items-center justify-center flex-col">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {lang === "vi"
            ? "Hiện chưa tìm thấy tin tức!"
            : "No news articles found!"}
        </h3>
      </div>
    );

  const heroArticle = newsArticles[0];
  const gridArticles = newsArticles.slice(1);
  const totalPages = Math.ceil(gridArticles.length / pageSize);

  const handleArticleClick = (slug, id) => {
    navigate(`/news/${slug}`, { state: { blogId: id } });
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
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
              onClick={() =>
                handleArticleClick(heroArticle.slug, heroArticle.id)
              }
            >
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-1/2 relative overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                    src={`${import.meta.env.VITE_MAIN_BE_URL}${
                      heroArticle.hinh_anh
                    }`}
                    alt={heroArticle.tieu_de}
                    className="w-full h-64 md:h-full object-cover transform-gpu"
                  />
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <motion.div
                  className="md:w-1/2 p-3 md:p-5 flex flex-col justify-center"
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
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="
              text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 text-gray-900 dark:text-white
              line-clamp-2 md:line-clamp-none
              group-hover:text-blue-600 dark:group-hover:text-blue-400
              transition-colors duration-300
            "
                  >
                    {heroArticle.tieu_de}
                  </motion.h1>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="preview-html prose prose-sm max-w-none line-clamp-3 break-words dark:text-gray-400 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px]"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                    }}
                    dangerouslySetInnerHTML={{ __html: heroArticle.noi_dung }}
                  />

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="flex mt-4 items-center gap-6 text-sm sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[20px] text-gray-500 dark:text-gray-400"
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
          {articlesToShow.map((article) => (
            <motion.div
              key={article.id}
              className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md cursor-pointer group"
              onClick={() => handleArticleClick(article.slug, article.id)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
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
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-3 md:p-5">
                <h3 className="text-base sm:text-xl md:text-xl lg:text-2xl xl:text-3xl font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {article.tieu_de}
                </h3>
                <div
                  className="preview-html prose prose-sm max-w-none line-clamp-2 wrap-break-word dark:text-gray-400 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[19px] mb-2"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                  dangerouslySetInnerHTML={{ __html: article.noi_dung }}
                />
                <div className="text-sm sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[19px] flex items-center gap-4 text-gray-500 dark:text-gray-400">
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
        {totalPages > 1 && (
          <div className="text-center mt-12 flex justify-center gap-2">
            <PageList
              data={gridArticles}
              pageSize={pageSize}
              onPageChange={setArticlesToShow}
              onPageNumberChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

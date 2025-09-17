
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoChevronBackSharp } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

  const fetchService = async () => {
    try {
      const langPrefix = language === "vi" ? "" : `/en`;
      const res = await fetch(
        `${API_BASE_URL}${langPrefix}/api/services/${slug}`
      );
      const data = await res.json();

      if (data.success) {
        const srv = data.data;
        setService({
          id: srv.id,
          status: srv.status,
          slug: srv.slug,
          lang: srv.translation.lang,
          title: srv.translation.ten_dich_vu,
          booking_count: srv.booking_count,
          subtitle: srv.translation.mo_ta,
          features: srv.translation.features?.split("#") || [],
          details: srv.translation.details?.split("#") || [],
          image_url: srv.image_url,
          price: formatCurrency(srv.floor_price),
        });
      } else {
        setService(null);
      }
    } catch (err) {
      console.error("Lỗi khi tải chi tiết dịch vụ:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    fetchService();
  }, [slug, language]);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">Đang tải...</div>
    );
  }

  if (!service) {
    return (
      <div className="p-16 text-center text-2xl text-red-600 font-bold">
        Dịch vụ không tồn tại!
      </div>
    );
  }

  return (
    <div className="max-w-5xl dark:bg-gray-800 bg-white shadow-lg rounded-md md:rounded-xl mx-auto px-4 sm:px-6 lg:px-8 m-8 p-4 md:pb-8">
      {/* Back Button */}
      <div>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-black hover:text-blue-600 dark:text-white text-[16px] font-medium"
        >
          <IoChevronBackSharp size={18} />
          Trở về
        </Link>
      </div>

      {/* Main Image */}
      <motion.div className="w-full md:mt-4 overflow-hidden rounded-md shadow-md border border-gray-200 dark:border-gray-700">
        <img
          src={service.image_url}
          alt="Service banner"
          className="w-full h-64 sm:h-80 md:h-[400px] object-cover"
        />
      </motion.div>

      {/* Title + Subtitle */}
      <div className="mt-8 space-y-3">
        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-3xl font-bold text-gray-900 dark:text-white">
          {service.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-xl lg:text-[18px] xl:text-[18px]">
          {service.subtitle}
        </p>
      </div>

      {/* Info Cards */}
      <div className="flex justify-start gap-10 md:gap-30 lg:gap-40 xl:gap-50 mt-6">
        {/* Giá */}
        <motion.div className="bg-white dark:bg-gray-800 flex items-center justify-center">
          <span className="text-2xl md:text-3xl lg:text-4xl mr-2">💰</span>
          <div className="flex flex-col md:flex-col">
            <p className="text-[15px] md:text-[17px] font-semibold text-gray-500 dark:text-gray-300">
              Giá dịch vụ
            </p>
            <p className="text-[16px] md:text-xl font-semibold text-gray-900 dark:text-white">
              {service.price}
            </p>
          </div>
        </motion.div>

        {/* Trạng thái */}
        <motion.div className="bg-white dark:bg-gray-800 flex items-center justify-center">
          <span className="text-2xl md:text-3xl lg:text-4xl mr-2">✨</span>
          <div className="flex flex-col md:flex-col">
            <p className="text-[15px] md:text-[17px] font-semibold text-gray-500 dark:text-gray-300">
              Trạng thái
            </p>
            <p className="text-[16px] md:text-xl font-semibold text-gray-900 dark:text-white">
              {service.status}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      {service.features.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2 mb-4 flex items-center gap-2">
            Tính năng nổi bật
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {service.features.map((feat, i) => (
              <motion.li
                key={i}
                className="bg-white shadow-sm border dark:bg-gray-800 p-3 rounded-md flex items-start gap-3 text-gray-700 dark:text-gray-200"
              >
                <FaCheckCircle className="text-green-500 mt-1" size={18} />
                <span>{feat}</span>
              </motion.li>
            ))}
          </ul>
        </section>
      )}

      {/* Details */}
      {service.details.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2 mb-4 flex items-center gap-2">
            Chi tiết dịch vụ
          </h2>
          <motion.ul className="list-disc list-inside space-y-4 text-gray-700 dark:text-gray-300">
            {service.details.map((detail, i) => (
              <motion.li key={i} className="leading-relaxed">
                {detail}
              </motion.li>
            ))}
          </motion.ul>
        </section>
      )}
    </div>
  );
}

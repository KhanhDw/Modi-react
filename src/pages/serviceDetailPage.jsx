// import { useParams, Link } from "react-router-dom";
// import { useLanguage } from "../contexts/LanguageContext";
// import { FaCheckCircle } from "react-icons/fa";
// import { motion } from "framer-motion";
// import { useMemo } from "react";

// const bannerStyle = (image) => ({
//     backgroundImage: `url(${image || "/images/banner2.jpg"})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
// });

// const fadeInUp = {
//     hidden: { opacity: 0, y: 10 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
// };

// export default function ServiceDetailPage() {
//     const { slug } = useParams();
//     const { t } = useLanguage();

//     // Dùng useMemo để cache kết quả tìm service, tránh lặp gọi t() và tìm kiếm nhiều lần
//     const service = useMemo(() => {
//         const services = t("servicesPage.services") || [];
//         return services.find((item) => item.slug === slug);
//     }, [slug, t]);

//     if (!service)
//         return (
//             <div className="p-16 text-center text-2xl text-red-600 font-bold">
//                 Dịch vụ không tồn tại!
//             </div>
//         );

//     return (
//         <div className="min-h-screen text-gray-800 dark:text-white transition-all duration-500 my-6">
//             {/* Banner */}
//             <div className="px-4 mt-4 mb-6">
//                 <motion.div
//                     className="h-[400px] flex items-center justify-center text-white rounded-2xl overflow-hidden shadow-2xl relative"
//                     style={bannerStyle(service.bannerImage)}
//                     initial="hidden"
//                     animate="visible"
//                     variants={{
//                         hidden: { opacity: 0, scale: 0.95 },
//                         visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
//                     }}
//                 >
//                     <div className="absolute inset-0 bg-black/40"></div>
//                     <div className="relative text-center px-4 py-4 z-10">
//                         <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">{service.title}</h1>
//                         <p className="text-sm md:text-base text-white/90 font-medium">
//                             <Link to="/" className="hover:underline font-semibold">
//                                 {t("servicesPage.banner.breadcrumbHome")}
//                             </Link>{" "}
//                             &gt;{" "}
//                             <Link to="/services" className="hover:underline font-semibold">
//                                 {t("servicesPage.banner.title")}
//                             </Link>{" "}
//                             &gt; <span className="font-semibold">{service.title}</span>
//                         </p>
//                     </div>
//                 </motion.div>
//             </div>

//             {/* Nội dung chính */}
//             <div className="max-w-6xl mx-auto px-6 py-6 my-12 bg-gradient-to-tr from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-xl">
//                 {/* Tiêu đề phụ */}
//                 <motion.h2
//                     initial="hidden"
//                     animate="visible"
//                     variants={fadeInUp}
//                     className="text-center text-3xl font-extrabold italic text-gray-800 dark:text-gray-200 mb-12 tracking-wide"
//                 >
//                     {service.subtitle}
//                 </motion.h2>

//                 {/* Tính năng nổi bật */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
//                     {service.features.map((feat, idx) => (
//                         <motion.div
//                             key={idx}
//                             initial="hidden"
//                             whileInView="visible"
//                             viewport={{ once: true }}
//                             variants={fadeInUp}
//                             transition={{ delay: idx * 0.1 }}
//                             className="flex items-start space-x-4 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
//                         >
//                             <div className="flex-shrink-0">
//                                 <FaCheckCircle className="text-green-500" size={24} />
//                             </div>
//                             <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{feat}</p>
//                         </motion.div>
//                     ))}
//                 </div>

//                 {/* Giá dịch vụ */}
//                 <motion.section
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
//                     className="relative max-w-3xl mx-auto mb-6"
//                 >
//                     <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-500 dark:bg-orange-600 rounded-full px-6 py-2 shadow-lg text-white font-bold tracking-wide text-lg">
//                         {t("servicesPage.servicePrice") || "Giá dịch vụ"}
//                     </div>

//                     <div className="bg-orange-100 dark:bg-orange-900 border-4 border-orange-300 dark:border-orange-600 rounded-3xl p-6 shadow-inner text-center">
//                         <p className="text-gray-900 dark:text-orange-100 text-3xl font-extrabold">{service.price}</p>
//                     </div>
//                 </motion.section>

//                 {/* Chi tiết dịch vụ */}
//                 <motion.section
//                     initial={{ opacity: 0, y: 10 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
//                     viewport={{ once: true }}
//                     className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg space-y-6"
//                 >
//                     <h3 className="text-gray-900 dark:text-gray-100 text-2xl font-semibold tracking-wide">
//                         {t("servicesPage.detailTitle") || "Chi tiết dịch vụ"}
//                     </h3>
//                     {service.details.map((paragraph, idx) => (
//                         <p
//                             key={idx}
//                             className="text-gray-700 dark:text-gray-300 text-base leading-relaxed text-justify"
//                         >
//                             {paragraph}
//                         </p>
//                     ))}
//                 </motion.section>
//             </div>
//         </div>
//     );
// }

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {/* Giá */}
        <motion.div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <span className="text-2xl md:text-3xl lg:text-3xl">💰</span>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
              Giá
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {service.price}
            </p>
          </div>
        </motion.div>

        {/* Đặt chỗ */}
        <motion.div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <span className="text-2xl md:text-3xl lg:text-3xl">📅</span>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
              Booking
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {service.booking_count}
            </p>
          </div>
        </motion.div>

        {/* Trạng thái */}
        <motion.div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <span className="text-2xl md:text-3xl lg:text-3xl">✨</span>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
              Trạng thái
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
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

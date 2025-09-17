
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoChevronBackSharp } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const bannerStyle = (image) => ({
  backgroundImage: `url(${image || "/images/banner2.jpg"})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [servicesItemBySlug, setServicesItemBySlug] = useState(null);
  const [loading, setLoading] = useState(true);


  const FetchDataServicesBySlug = async (slug = "", lang = "vi") => {
    if (!slug) {
      console.warn("Không có slug → clear service chi tiết");
      setServicesItemBySlug(null);
      return;
    }

    try {
      const lang_api = lang === "vi" ? "" : "/en";
      const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}${lang_api}/api/services/${slug}`);
      const data = await res.json();

      if (data.success) {
        setServicesItemBySlug(data.data);
        console.log("Chi tiết service:", data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchDataServicesBySlug(slug);
  }, [slug]);


  // Dùng useMemo để cache kết quả tìm service, tránh lặp gọi t() và tìm kiếm nhiều lần
  // const service = useMemo(() => {
  //     const services = t("servicesPage.services") || [];
  //     return services.find((item) => item.slug === slug);
  // }, [slug, t]);

  if (!slug)
    return (
      <div className="p-16 text-center text-2xl text-red-600 font-bold">
        Dịch vụ không tồn tại!
      </div>
    );

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

  // không được xóa vì đây là logic cho hiển thị dữ liệu - còn sử dùng
  // return (
  //   <div className="min-h-screen text-gray-800 dark:text-white transition-all duration-500 my-6">
  //     <div className="space-y-4">
  //       {/* Hình ảnh */}
  //       <img
  //         src={servicesItemBySlug?.image_url}
  //         alt={servicesItemBySlug?.translation.ten_dich_vu}
  //         className="w-full max-w-md rounded-lg shadow"
  //       />

  //       {/* Tên dịch vụ */}
  //       <h2 className="text-xl font-semibold">
  //         {servicesItemBySlug?.translation.ten_dich_vu}
  //       </h2>

  //       {/* Mô tả */}
  //       <p className="text-gray-700 admin-dark:text-gray-300">
  //         {servicesItemBySlug?.translation.mo_ta}
  //       </p>

  //       {/* Giá & trạng thái */}
  //       <div className="flex gap-4 text-sm text-gray-600 admin-dark:text-gray-400">
  //         <span>💰 Giá: {servicesItemBySlug?.floor_price} VND</span>
  //         <span>📦 Booking: {servicesItemBySlug?.booking_count}</span>
  //         <span>⚡ Trạng thái: {servicesItemBySlug?.status}</span>
  //       </div>

  //       {/* Features */}
  //       <div>
  //         <h3 className="font-medium">Tính năng:</h3>
  //         <ul className="list-disc list-inside space-y-1 text-gray-700 admin-dark:text-gray-300">
  //           {servicesItemBySlug?.translation.features
  //             ?.split("#")
  //             .map((f, idx) => (
  //               <li key={idx}>{f.trim()}</li>
  //             ))}
  //         </ul>
  //       </div>

  //       {/* Chi tiết */}
  //       <div>
  //         <h3 className="font-medium">Chi tiết:</h3>
  //         <div className="space-y-2 text-gray-700 admin-dark:text-gray-300">
  //           {servicesItemBySlug?.translation.details
  //             ?.split("#")
  //             .map((d, idx) => (
  //               <p key={idx}>{d.trim()}</p>
  //             ))}
  //         </div>
  //       </div>
  //     </div>

  //     {/* Banner */}
  //     {/* <div className="px-4 mt-4 mb-6">
  //               <motion.div
  //                   className="h-[400px] flex items-center justify-center text-white rounded-2xl overflow-hidden shadow-2xl relative"
  //                   style={bannerStyle(service.bannerImage)}
  //                   initial="hidden"
  //                   animate="visible"
  //                   variants={{
  //                       hidden: { opacity: 0, scale: 0.95 },
  //                       visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
  //                   }}
  //               >
  //                   <div className="absolute inset-0 bg-black/40"></div>
  //                   <div className="relative text-center px-4 py-4 z-10">
  //                       <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">{service.title}</h1>
  //                       <p className="text-sm md:text-base text-white/90 font-medium">
  //                           <Link to="/" className="hover:underline font-semibold">
  //                               {t("servicesPage.banner.breadcrumbHome")}
  //                           </Link>{" "}
  //                           &gt;{" "}
  //                           <Link to="/services" className="hover:underline font-semibold">
  //                               {t("servicesPage.banner.title")}
  //                           </Link>{" "}
  //                           &gt; <span className="font-semibold">{service.title}</span>
  //                       </p>
  //                   </div>
  //               </motion.div>
  //           </div> */}

  //     {/* Nội dung chính */}
  //     {/* <div className="max-w-6xl mx-auto px-6 py-6 my-12 bg-gradient-to-tr from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-xl"> */}
  //     {/* Tiêu đề phụ */}
  //     {/* <motion.h2
  //                   initial="hidden"
  //                   animate="visible"
  //                   variants={fadeInUp}
  //                   className="text-center text-3xl font-extrabold italic text-gray-800 dark:text-gray-200 mb-12 tracking-wide"
  //               >
  //                   {service.subtitle}
  //               </motion.h2> */}

  //     {/* Tính năng nổi bật */}
  //     {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
  //                   {service.features.map((feat, idx) => (
  //                       <motion.div
  //                           key={idx}
  //                           initial="hidden"
  //                           whileInView="visible"
  //                           viewport={{ once: true }}
  //                           variants={fadeInUp}
  //                           transition={{ delay: idx * 0.1 }}
  //                           className="flex items-start space-x-4 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
  //                       >
  //                           <div className="flex-shrink-0">
  //                               <FaCheckCircle className="text-green-500" size={24} />
  //                           </div>
  //                           <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{feat}</p>
  //                       </motion.div>
  //                   ))}
  //               </div> */}

  //     {/* Giá dịch vụ */}
  //     {/* <motion.section
  //                   initial={{ opacity: 0, scale: 0.95 }}
  //                   animate={{ opacity: 1, scale: 1 }}
  //                   transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
  //                   className="relative max-w-3xl mx-auto mb-6"
  //               >
  //                   <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-500 dark:bg-orange-600 rounded-full px-6 py-2 shadow-lg text-white font-bold tracking-wide text-lg">
  //                       {t("servicesPage.servicePrice") || "Giá dịch vụ"}
  //                   </div>

  //                   <div className="bg-orange-100 dark:bg-orange-900 border-4 border-orange-300 dark:border-orange-600 rounded-3xl p-6 shadow-inner text-center">
  //                       <p className="text-gray-900 dark:text-orange-100 text-3xl font-extrabold">{service.price}</p>
  //                   </div>
  //               </motion.section> */}

  //     {/* Chi tiết dịch vụ */}
  //     {/* <motion.section
  //                   initial={{ opacity: 0, y: 10 }}
  //                   whileInView={{ opacity: 1, y: 0 }}
  //                   transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
  //                   viewport={{ once: true }}
  //                   className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg space-y-6"
  //               >
  //                   <h3 className="text-gray-900 dark:text-gray-100 text-2xl font-semibold tracking-wide">
  //                       {t("servicesPage.detailTitle") || "Chi tiết dịch vụ"}
  //                   </h3>
  //                   {service.details.map((paragraph, idx) => (
  //                       <p
  //                           key={idx}
  //                           className="text-gray-700 dark:text-gray-300 text-base leading-relaxed text-justify"
  //                       >
  //                           {paragraph}
  //                       </p>
  //                   ))}
  //               </motion.section> 
  //           </div>*/}
  //   </div>
  // );
}

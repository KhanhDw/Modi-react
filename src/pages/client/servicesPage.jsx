import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import ServiceCard from "@/components/servicesClient/serviceCard";
import useCurrentLanguage from "@/hook/currentLang";

const bannerStyle = {
  backgroundImage: "url('/images/banner2.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export const mockService = {
  id: 1,
  status: "Active",
  slug: "re-vision",
  image_url:
    "https://plus.vtc.edu.vn/wp-content/uploads/2022/08/thiet-ke-web.jpg",
  translation: {
    lang: "vi",
    ten_dich_vu: "1RE:VISION thiết kế website chuyên nghiệp mọi ngành nghề",
    mo_ta: "Nâng cấp website hiện có",
  },
  article: {
    headerTitle: "Chi tiết dịch vụ",
    content: {
      features: [
        "Tư vấn nâng cấp 1:1 miễn phí",
        "Nâng cấp mã nguồn cũ lên chuẩn mới",
        "Tích hợp công cụ và phương thức trả góp",
        "Cải thiện điểm chất lượng SEO",
      ],
      details: [
        "RE:VISION là giải pháp nâng cấp toàn diện website hiện có mà không cần xây dựng lại từ đầu, đảm bảo công nghệ cập nhật, thiết kế hiện đại và tính năng theo xu hướng.",
        "Qua buổi tư vấn 1:1, chuyên gia sẽ phân tích website, đánh giá điểm mạnh/yếu, và đề xuất chiến lược nâng cấp hiệu quả nhất.",
        "Nâng cấp bao gồm tối ưu mã nguồn giúp tải trang nhanh hơn, cải thiện điểm SEO, và tăng cường bảo mật. Chúng tôi tích hợp các công cụ hiện đại như thanh toán online, đặt lịch, chatbot tự động.",
      ],
    },
  },
};

export default function ServicePage() {
  const { t } = useLanguage();
  const location = useLocation();
  const { lang, prefix } = useCurrentLanguage();
  const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;
  const [services, setServices] = useState([]);
  const [servicesItemBySlug, setServicesItemBySlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false); // State loading riêng cho danh sách

  const queryParams = new URLSearchParams(location.search);

  // const queryParams_q = queryParams.get("q");
  const { parentSlug: queryParams_q } = useParams();
  const queryParams_sub = queryParams.get("sub");

  const FetchDataServicesALL = async (lang = "vi") => {
    try {
      const lang_api = lang === "vi" ? "" : "/en";
      const res = await fetch(`${API_BASE_URL}${lang_api}/api/services`);
      if (!res.ok) throw new Error("Không thể tải tất cả dịch vụ");
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ServicePage.jsx
  const FetchDataServicesBySlug = async (slug = "", lang = "vi") => {
    if (!slug) {
      setServicesItemBySlug(null);
      return;
    }

    setListLoading(true);
    try {
      const lang_api = lang === "vi" ? "" : "/en";
      const res = await fetch(
        `${API_BASE_URL}${lang_api}/api/services/${slug}`
      );
      const data = await res.json();

      if (data.success) {
        setServicesItemBySlug(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
      setLoading(false); // Dừng loading chung khi đã có dữ liệu chi tiết
    }
  };

  useEffect(() => {
    const processDataFetching = async () => {
      setLoading(true);
      setListLoading(true);
      setServices([]);
      setServicesItemBySlug(null);

      // 1. Ưu tiên cao nhất: Fetch chi tiết dịch vụ nếu có `sub`
      if (queryParams_sub) {
        FetchDataServicesBySlug(queryParams_sub, lang);
        // setLoading và listLoading sẽ được xử lý trong FetchDataServicesBySlug
        return;
      }

      // 2. Nếu không có `sub` nhưng có `q` (danh mục cha)
      if (queryParams_q) {
        try {
          // Lấy slug của các dịch vụ con trong nhóm
          const lang_api = lang === "vi" ? "" : "/en";
          const menuRes = await fetch(
            `${API_BASE_URL}${lang_api}/api/section-items/type/${queryParams_q}?slug=header`
          );
          if (!menuRes.ok) throw new Error("Không thể tải mục con");

          const menuData = await menuRes.json();
          const servicesArray = Array.isArray(menuData) ? menuData : [];
          if (servicesArray.length === 0) {
            const getTypeDataGroupService = await fetch(
              `${API_BASE_URL}/api/service-header-config/group-service/${queryParams_q}`
            );
            const resultDataGroupService = await getTypeDataGroupService.json();
            const allSlugs =
              resultDataGroupService.data[0]?.groupServices || [];
            // Nếu có slug con, fetch từng dịch vụs
            if (allSlugs.length > 0) {
              const servicePromises = allSlugs.map(async (slug) => {
                const tailLang = lang === "vi" ? "" : `-en`;
                const serviceRes = await fetch(
                  `${API_BASE_URL}${lang_api}/api/services/${slug}${tailLang}`
                );
                if (!serviceRes.ok) return null;
                const serviceData = await serviceRes.json();
                return serviceData.success ? serviceData.data : null;
              });
              const results = (await Promise.all(servicePromises)).filter(
                Boolean
              );
              setServices(results);
            } else {
              // Nếu không có slug con, danh sách dịch vụ là rỗng
              setServices([]);
            }
          } else {
            const allSlugs =
              servicesArray[0]?.section_title?.groupServices
                ?.split(",")
                .filter(Boolean) || [];

            // Nếu có slug con, fetch từng dịch vụ
            if (allSlugs.length > 0) {
              const servicePromises = allSlugs.map(async (slug) => {
                const tailLang = lang === "vi" ? "" : `-en`;
                const serviceRes = await fetch(
                  `${API_BASE_URL}${lang_api}/api/services/${slug}${tailLang}`
                );
                if (!serviceRes.ok) return null;
                const serviceData = await serviceRes.json();
                return serviceData.success ? serviceData.data : null;
              });
              const results = (await Promise.all(servicePromises)).filter(
                Boolean
              );
              setServices(results);
            } else {
              // Nếu không có slug con, danh sách dịch vụ là rỗng
              setServices([]);
            }
          }
        } catch (err) {
          console.error(err);
          setServices([]); // Đảm bảo services rỗng khi có lỗi
        }
      } else {
        // 3. Trường hợp mặc định: không có `q` và `sub`, fetch tất cả dịch vụ
        await FetchDataServicesALL(lang);
      }

      setListLoading(false);
      setLoading(false);
    };

    processDataFetching();
  }, [lang, queryParams_q, queryParams_sub]);

  return (
    <div className="min-h-screen mb-10 text-gray-800 dark:text-white transition-all duration-500">
      <div className="flex w-full  flex-col">
        {queryParams_sub && servicesItemBySlug && (
          <div className="space-y-6 p-4 border rounded-lg shadow">
            <img
              loading="lazy"
              src={`${import.meta.env.VITE_MAIN_BE_URL}${
                servicesItemBySlug.image_url
              }`}
              alt={servicesItemBySlug.translation?.ten_dich_vu}
              className="w-full max-w-md rounded-lg shadow"
            />
            <h2 className="text-xl font-semibold">
              {servicesItemBySlug.translation?.ten_dich_vu}
            </h2>
            <p>{servicesItemBySlug.translation?.mo_ta}</p>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>💰 Giá: {servicesItemBySlug.floor_price} VND</span>
              <span>📦 Booking: {servicesItemBySlug.booking_count}</span>
              <span>⚡ Trạng thái: {servicesItemBySlug.status}</span>
            </div>
            {servicesItemBySlug.translation?.features && (
              <ul className="list-disc list-inside">
                {servicesItemBySlug.translation.features
                  .split("#")
                  .map((f, i) => (
                    <li key={i}>{f.trim()}</li>
                  ))}
              </ul>
            )}
            {servicesItemBySlug.translation?.details && (
              <div className="space-y-2">
                {servicesItemBySlug.translation.details
                  .split("#")
                  .map((d, i) => (
                    <p key={i}>{d.trim()}</p>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Banner */}
      <div className="mb-16">
        <motion.div
          className="h-[300px] flex items-center justify-center md:h-[400px] md:mx-4 md:mt-4 text-white md:rounded-2xl overflow-hidden shadow-2xl relative rounded-xl rounded-tl-none rounded-tr-none"
          style={bannerStyle}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-blue-900/70 via-black/60 to-indigo-900/70"></div>

          <div className="relative text-center px-4 py-4 z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              {t("servicesPage.banner.title")}
            </h1>
            <p className="text-sm md:text-base text-white/90 font-medium">
              <Link
                to="/"
                className="hover:underline font-semibold"
              >
                {t("servicesPage.banner.breadcrumbHome")}
              </Link>{" "}
              &gt;{" "}
              <span className="font-semibold">
                {t("servicesPage.banner.title")}
              </span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Intro */}
      <div className="max-w-8xl mx-auto px-4 pb-16 text-center">
        <motion.p
          className="text-xl sm:text-2xl lg:text-3xl text-center font-bold mb-4 leading-snug"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {t("servicesPage.intro.description")}
        </motion.p>

        <motion.div
          className="text-gray-600 font-semibold dark:text-gray-300 max-w-2xl mx-auto text-center text-sm sm:text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {t("servicesPage.intro.subtitle")}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
        </motion.div>
      </div>

      {/* Service list */}
      <div className=" mx-auto px-4 pb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-[#111] -z-10 rounded-t-3xl"></div>
        {/* Hiển thị ALL SERVICES */}
        {listLoading ? (
          <div className="text-center py-10 text-lg font-medium text-gray-500 dark:text-gray-300">
            Đang tải danh sách dịch vụ...
          </div>
        ) : !queryParams_sub && services.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7 lg:gap-7 xl:gap-8">
            {services.map((srv, i) => {
              return (
                <motion.div
                  key={srv.service_id || i} // key tốt hơn dùng id
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.15,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className={
                    "sm:col-span-2 2xl:col-span-1  flex justify-center"
                  }
                >
                  {/* Optional wrapper để kiểm soát width của card khi span-2 */}
                  <div className={"w-full sm:max-w-5xl"}>
                    {/* <ServiceCard service={mockService} /> */}
                    <ServiceCard
                      service={srv}
                      onFetchService={FetchDataServicesBySlug}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          !queryParams_sub &&
          !listLoading && (
            <div className="text-center py-10 text-lg font-medium text-gray-500 dark:text-gray-300">
              {queryParams_q
                ? "Không có dịch vụ nào trong danh mục này."
                : "Hiện chưa có dịch vụ nào."}
            </div>
          )
        )}
      </div>

      {/* Final CTA */}
      <div
        className="
    relative
    text-center px-6 py-8 md:py-10
    text-white max-w-4xl mx-auto
    sm:rounded-3xl rounded-none
    shadow-2xl
    transition-all duration-700 ease-in-out
    hover:brightness-110
    lg:max-w-6xl
    bg-cover bg-center
    bg-[url('/moutain-banner.jpg')]
  "
      >
        {/* Lớp phủ mờ */}
        <div className="absolute inset-0 bg-black/40 bg-opacity-40 sm:rounded-3xl rounded-none pointer-events-none"></div>

        {/* Nội dung nằm trên lớp phủ */}
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight"
          >
            {t("servicesPage.cta.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-[14px] md:text-[19px] opacity-90 max-w-2xl md:max-w-xl mx-auto mb-4"
          >
            {t("servicesPage.cta.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              to="/contact"
              className="
          inline-block bg-white/90 text-blue-700 text-sm sm:text-base font-semibold p-2 px-2 md:py-3 md:px-4 rounded-full shadow-md
          hover:shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105
        "
            >
              {t("servicesPage.cta.button")}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

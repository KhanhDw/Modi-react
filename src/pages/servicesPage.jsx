import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useMemo } from "react";
import ServiceCard from "@/components/servicesClient/serviceCard"

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
        ten_dich_vu: "RE:VISION thiết kế website chuyên nghiệp mọi ngành nghề",
        mo_ta: "Nâng cấp website hiện có",
        price: "0.00",
        revenue: 15000000,
        booking_count: 32
    },
    article: {
        headerTitle: "Chi tiết dịch vụ",
        content: {
            features: [
                "Tư vấn nâng cấp 1:1 miễn phí",
                "Nâng cấp mã nguồn cũ lên chuẩn mới",
                "Tích hợp công cụ và phương thức trả góp",
                "Cải thiện điểm chất lượng SEO",
                "Tăng trải nghiệm người dùng (UX/UI)",
                "Hướng dẫn chuyển giao và đào tạo",
            ],
            details: [
                "RE:VISION là giải pháp nâng cấp toàn diện website hiện có mà không cần xây dựng lại từ đầu, đảm bảo công nghệ cập nhật, thiết kế hiện đại và tính năng theo xu hướng.",
                "Qua buổi tư vấn 1:1, chuyên gia sẽ phân tích website, đánh giá điểm mạnh/yếu, và đề xuất chiến lược nâng cấp hiệu quả nhất.",
                "Nâng cấp bao gồm tối ưu mã nguồn giúp tải trang nhanh hơn, cải thiện điểm SEO, và tăng cường bảo mật. Chúng tôi tích hợp các công cụ hiện đại như thanh toán online, đặt lịch, chatbot tự động.",
                "Trải nghiệm người dùng được cải thiện rõ rệt với thiết kế UI/UX thân thiện, tăng thời gian ở lại và tỷ lệ chuyển đổi khách hàng.",
                "Cuối cùng, bạn sẽ nhận tài liệu chi tiết và đào tạo sử dụng hệ thống để tự tin vận hành và phát triển website."
            ]
        },
        author: "Creative Team",
        viewed: 120
    }
};

export default function ServicePage() {
    const { t } = useLanguage();
    const location = useLocation();
    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;
    const [services, setServices] = useState([]);
    const [servicesDetail, setServicesDetail] = useState([]);
    const [servicesItemDetail, setServicesItemDetail] = useState([]);

    const queryParams = new URLSearchParams(location.search);

    const queryParams_q = queryParams.get("q");
    const queryParams_i = queryParams.get("i");
    const queryParams_sub = queryParams.get("sub");

    const servicesLocales = t("servicesPage.services");

    const loadAllDataSection = async () => {
        try {
            // 1) fetch danh mục cha
            const res = await fetch(`${API_BASE_URL}/api/sections/type/${queryParams_q}`);
            if (!res.ok) throw new Error("Không thể tải danh mục cha");
            const sectionsRes = await res.json();

            setServicesDetail(sectionsRes.data);

            // setServices();
        } catch (err) {
            console.error("Lỗi loadAllDataSection:", err);
        }
    };

    const loadAllDataSectionItem = async () => {
        try {
            // 1) fetch danh mục cha
            const res = await fetch(`${API_BASE_URL}/api/section-items/${queryParams_i}`);
            if (!res.ok) throw new Error("Không thể tải danh mục cha");
            const sectionsRes = await res.json();

            setServicesItemDetail(sectionsRes);

            // setServices();
        } catch (err) {
            console.error("Lỗi loadAllDataSection:", err);
        }
    };

    useEffect(() => {
        loadAllDataSection();
        loadAllDataSectionItem()
    }, [queryParams_q, queryParams_sub]);

    return (
        <div className="min-h-screen mb-10 text-gray-800 dark:text-white transition-all duration-500">
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
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-black/60 to-indigo-900/70"></div>

                    <div className="relative text-center px-4 py-4 z-10">
                        <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                            {t("servicesPage.banner.title")}
                        </h1>
                        <p className="text-sm md:text-base text-white/90 font-medium">
                            <Link to="/" className="hover:underline font-semibold">Trang chủ</Link> &gt;{" "}
                            <span className="font-semibold">{t("servicesPage.banner.title")}</span>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Intro */}
            <div className="max-w-4xl mx-auto px-4 pb-16 text-center">
                <motion.p
                    className="text-xl text-center md:text-2xl lg:text-4xl font-bold mb-4 leading-snug"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    {t("servicesPage.intro.description")}
                </motion.p>

                <motion.p
                    className="text-gray-600 font-semibold dark:text-gray-300 max-w-2xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    {t("servicesPage.intro.subtitle")}
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
                </motion.p>

            </div>

            {/* Service list */}
            <div className=" mx-auto px-4 pb-10 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-[#111] -z-10 rounded-t-3xl"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {servicesLocales.map((service, i) => {
                        {/* const isLast = i === servicesLocales.length - 1; */ }
                        const isFirst = i === 0;

                        const isOdd = servicesLocales.length % 2 !== 0;

                        return (
                            <motion.div
                                key={service.slug}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                                viewport={{ once: true }}
                                className={isFirst && isOdd ? "sm:col-span-2 flex justify-center" : ""}
                            >
                                <ServiceCard service={mockService} />
                            </motion.div>
                        );
                    })}
                </div>
            </div>


            {/* Final CTA */}
            <div
                className="
    text-center px-6 py-8 md:py-10
    bg-gradient-to-r from-blue-700 to-indigo-700
    text-white max-w-4xl mx-auto
    sm:rounded-3xl rounded-none
    shadow-2xl
    transition-all duration-700 ease-in-out
    hover:from-blue-600 hover:to-indigo-600
    lg:max-w-6xl
  "
            >
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-xl md:text-3xl lg:text-4xl font-extrabold mb-4 leading-tight"
                >
                    {t("servicesPage.cta.title")}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-sm md:text-[18px] opacity-90 max-w-2xl md:max-w-xl mx-auto mb-8"
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
        inline-block bg-white text-blue-700 font-semibold py-2 px-3 md:py-3 md:px-4 rounded-full shadow-md
        hover:shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105
      "
                    >
                        {t("servicesPage.cta.button")}
                    </Link>
                </motion.div>
            </div>

        </div>

    );
}

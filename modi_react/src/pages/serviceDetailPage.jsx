import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useMemo } from "react";

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

    // Dùng useMemo để cache kết quả tìm service, tránh lặp gọi t() và tìm kiếm nhiều lần
    const service = useMemo(() => {
        const services = t("servicesPage.services") || [];
        return services.find((item) => item.slug === slug);
    }, [slug, t]);

    if (!service)
        return (
            <div className="p-16 text-center text-2xl text-red-600 font-bold">
                Dịch vụ không tồn tại!
            </div>
        );

    return (
        <div className="min-h-screen text-gray-800 dark:text-white transition-all duration-500 my-6">
            {/* Banner */}
            <div className="px-4 mt-4 mb-6">
                <motion.div
                    className="h-[400px] flex items-center justify-center text-white rounded-2xl overflow-hidden shadow-2xl relative"
                    style={bannerStyle(service.bannerImage)}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, scale: 0.95 },
                        visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
                    }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative text-center px-4 py-4 z-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">{service.title}</h1>
                        <p className="text-sm md:text-base text-white/90 font-medium">
                            <Link to="/" className="hover:underline font-semibold">
                                {t("servicesPage.banner.breadcrumbHome")}
                            </Link>{" "}
                            &gt;{" "}
                            <Link to="/services" className="hover:underline font-semibold">
                                {t("servicesPage.banner.title")}
                            </Link>{" "}
                            &gt; <span className="font-semibold">{service.title}</span>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Nội dung chính */}
            <div className="max-w-6xl mx-auto px-6 py-6 my-12 bg-gradient-to-tr from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-xl">
                {/* Tiêu đề phụ */}
                <motion.h2
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="text-center text-3xl font-extrabold italic text-gray-800 dark:text-gray-200 mb-12 tracking-wide"
                >
                    {service.subtitle}
                </motion.h2>

                {/* Tính năng nổi bật */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                    {service.features.map((feat, idx) => (
                        <motion.div
                            key={idx}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start space-x-4 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex-shrink-0">
                                <FaCheckCircle className="text-green-500" size={24} />
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{feat}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Giá dịch vụ */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    className="relative max-w-3xl mx-auto mb-6"
                >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-500 dark:bg-orange-600 rounded-full px-6 py-2 shadow-lg text-white font-bold tracking-wide text-lg">
                        {t("servicesPage.servicePrice") || "Giá dịch vụ"}
                    </div>

                    <div className="bg-orange-100 dark:bg-orange-900 border-4 border-orange-300 dark:border-orange-600 rounded-3xl p-6 shadow-inner text-center">
                        <p className="text-gray-900 dark:text-orange-100 text-3xl font-extrabold">{service.price}</p>
                    </div>
                </motion.section>

                {/* Chi tiết dịch vụ */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg space-y-6"
                >
                    <h3 className="text-gray-900 dark:text-gray-100 text-2xl font-semibold tracking-wide">
                        {t("servicesPage.detailTitle") || "Chi tiết dịch vụ"}
                    </h3>
                    {service.details.map((paragraph, idx) => (
                        <p
                            key={idx}
                            className="text-gray-700 dark:text-gray-300 text-base leading-relaxed text-justify"
                        >
                            {paragraph}
                        </p>
                    ))}
                </motion.section>
            </div>
        </div>
    );
}

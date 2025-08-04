import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const bannerStyle = {
    backgroundImage: "url('/images/banner2.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
};

export default function ServicePage() {
    const { t } = useLanguage();
    const services = t("servicesPage.services");

    return (
        <div className="min-h-screen text-gray-800 dark:text-white transition-all duration-500">
            {/* Banner */}
            <div className="px-4 mt-4 mb-12">
                <motion.div
                    className="h-[400px] flex items-center justify-center text-white rounded-2xl overflow-hidden shadow-2xl relative"
                    style={bannerStyle}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative text-center px-4 py-4 z-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                            {t("servicesPage.banner.title")}
                        </h1>
                        <p className="text-sm md:text-base text-white/90 font-medium">
                            <Link to="/" className="hover:underline font-semibold">Trang chủ</Link> &gt;{" "}
                            <span className="font-semibold">{t("servicesPage.banner.title")}</span>
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-6xl mx-auto px-4 pb-12">
                <motion.p
                    className="text-2xl md:text-3xl font-bold text-center mb-10 leading-snug"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    {t("servicesPage.intro.description")}
                </motion.p>

                {/* Danh sách dịch vụ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="relative bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-transparent dark:from-blue-900/20 z-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <h3 className="text-lg uppercase text-center font-bold text-black dark:text-white mb-1">
                                        {service.title}
                                    </h3>
                                    <p className="text-sm text-center font-medium mb-4 text-gray-600 dark:text-gray-400">
                                        {service.subtitle}
                                    </p>

                                    <ul className="space-y-2 mb-4">
                                        {service.features.map((feat, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                                            >
                                                <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-4">
                                    <p className="font-bold text-lg text-red-600 mb-4 text-center">
                                        {service.price}
                                    </p>
                                    <Link
                                        to={`/services/${service.slug}`}
                                        state={{ service }}
                                        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition-all duration-300"
                                    >
                                        {service.btnText}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

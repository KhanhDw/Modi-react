import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const bannerStyle = {
    backgroundImage: "url('/images/banner2.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
};

const services = [
    {
        title: "RE:VISION",
        subtitle: "Nâng cấp website có sẵn",
        features: [
            "Tư vấn nâng cấp miễn phí 1-1",
            "Nâng cấp source code cũ theo xu thế mới",
            "Tích hợp các công cụ và trả góp",
            "Tăng điểm chất lượng",
            "Cải tiến trải nghiệm người dùng (UX/UI)",
            "Đào tạo và bàn giao hướng dẫn sử dụng",
            "Quà tặng kèm !!!"
        ],
        price: "Theo gói",
        btnText: "Đặt Hàng Ngay"
    },
    {
        title: "Khởi Đầu Online",
        subtitle: "Website giới thiệu cơ bản",
        features: [
            "Thiết kế website giới thiệu theo yêu cầu",
            "Giao diện chuẩn responsive",
            "Tên miền .vn / .com 1 năm",
            "Hosting SSD tốc độ cao 12 tháng",
            "Tích hợp Google Analytics, Google Maps",
            "Cài đặt HTTPS SSL"
        ],
        price: "Chỉ từ 1.5tr–3tr",
        btnText: "Đặt Hàng Ngay"
    },
    {
        title: "One-Me",
        subtitle: "Thiết kế theo yêu cầu",
        features: [
            "Tư vấn định hướng miễn phí 1:1",
            "Thiết kế website độc quyền theo cá tính cá nhân",
            "Tích hợp các công cụ hỗ trợ cá nhân",
            "Tên miền + hosting miễn phí 1 năm",
            "Cấu hình SEO cơ bản & hướng dẫn sử dụng",
            "Quà tặng kèm !!!"
        ],
        price: "Theo gói",
        btnText: "Đặt Hàng Ngay"
    },
    {
        title: "Xây dựng thương hiệu",
        subtitle: "Xây dựng thương hiệu theo xu hướng",
        features: [
            "Website giới thiệu doanh nghiệp hiện đại",
            "Thiết kế logo chuyên nghiệp",
            "Bộ nhận diện thương hiệu",
            "Thiết kế 3 banner dịch vụ nổi bật",
            "Hosting SSD + tên miền + email tên miền",
            "Cấu hình SEO cơ bản + tốc độ web"
        ],
        price: "Chỉ từ 4tr–10tr",
        btnText: "Đặt Hàng Ngay"
    },
    {
        title: "Bán hàng Online",
        subtitle: "Smart Shop",
        features: [
            "Website bán hàng + giỏ hàng + thanh toán online",
            "Quản lý sản phẩm, đơn hàng, khách hàng",
            "Tích hợp thanh toán (VNPay, Momo, COD...",
            "Tích hợp vận chuyển (Giao hàng tiết kiệm, GHN...)",
            "5 banner khuyến mãi",
            "Đào tạo quản trị hệ thống",
            "Gói SEO sản phẩm mẫu (5 sản phẩm)"
        ],
        price: "Chỉ từ 8tr–16tr",
        btnText: "Đặt Hàng Ngay"
    },
    {
        title: "Đặt lịch dịch vụ",
        subtitle: "Smart Booking",
        features: [
            "Website giới thiệu dịch vụ + đội ngũ",
            "Hệ thống booking online theo lịch (ngày/giờ)",
            "Gửi thông báo xác nhận qua email",
            "Thiết kế landing page khuyến mãi",
            "Thiết lập Google Business, SEO theo từ khóa",
            "3 banner chuyên nghiệp + icon set đồng bộ"
        ],
        price: "Chỉ từ 14tr–22tr",
        btnText: "Đặt Hàng Ngay"
    },
    {
        title: "Quản lý toàn diện",
        subtitle: "Mini ERP",
        features: [
            "Website giới thiệu công ty",
            "Hệ thống quản lý công việc (task, deadline)",
            "Quản lý nhân sự cơ bản (chấm công, lương)",
            "CRM khách hàng đơn giản",
            "Email công ty, subdomain riêng cho quản trị nội bộ",
            "Đào tạo 1-1 cho nhân viên sử dụng hệ thống"
        ],
        price: "Chỉ từ 25tr–50tr",
        btnText: "Đặt Hàng Ngay"
    },
    {
        title: "Website + Ứng dụng",
        subtitle: "Web & App Đồng Bộ",
        features: [
            "Website bán hàng hoặc dịch vụ",
            "App mobile (IOS, Android) đồng bộ với website",
            "Tính năng đăng nhập, đặt hàng, thông báo",
            "Tự động cập nhật dữ liệu giữa web và app",
            "Tích hợp các dịch vụ bên thứ ba (chat, maps...)"
        ],
        price: "Chỉ từ 35tr–60tr",
        btnText: "Đặt Hàng Ngay"
    },
];


export default function ServicePage() {
    const { lang } = useLanguage();

    return (
        <div className="min-h-screen text-gray-800 dark:text-white transition-all duration-500">

            {/* Banner */}
            <div className="px-4 my-4">
                <motion.div
                    className="h-[300px] flex items-center justify-center text-white rounded-xl overflow-hidden shadow-lg"
                    style={bannerStyle}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="text-center px-4 py-4">
                        <h1 className="text-4xl font-bold mb-2">Dịch Vụ</h1>
                        <p className="text-sm">
                            <a href="/" className="text-white hover:underline font-semibold">Trang chủ</a> &gt; <span className="text-white font-semibold">Dịch vụ</span>
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 min-h-[50vh]">
                <motion.h2
                    className="mb-2 font-bold text-xl md:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    Dịch vụ
                </motion.h2>

                <motion.h2
                    className="text-2xl md:text-3xl font-bold mb-6 "
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    Chúng tôi cung cấp dịch vụ xây dựng website, ứng dụng và giải pháp công nghệ, giúp doanh nghiệp tối ưu và phát triển bền vững.
                </motion.h2>

                {/* Danh sách dịch vụ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="group relative bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-transparent dark:from-blue-900/20 z-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                            <div className="relative z-10">
                                <h3 className="text-lg uppercase text-center font-bold text-black dark:text-white mb-1">{service.title}</h3>
                                <p className="text-sm text-center font-medium mb-4 text-gray-600 dark:text-gray-400">{service.subtitle}</p>

                                <ul className="space-y-2 mb-4">
                                    {service.features.map((feat, idx) => (
                                        <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                                            <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <p className="font-bold text-red-500 mb-4">{service.price}</p>

                                {/* Button center & equal size */}
                                <div className="flex justify-center">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition-all duration-300">
                                        {service.btnText}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>


            </div>

        </div>
    );
}

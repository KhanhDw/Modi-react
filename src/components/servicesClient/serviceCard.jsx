import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
    if (!service) return null;

    const { translation, article } = service;

    return (
        <div
            className="relative w-full mx-auto rounded-2xl shadow-lg hover:shadow-black/40 dark:hover:shadow-green-400/40 border border-gray-200 dark:border-gray-700 overflow-hidden
  transform transition duration-500 hover:-translate-y-2 group"
        >
            {/* Hover background overlay */}
            <div
                className="absolute inset-0 bg-[url('https://i.pinimg.com/originals/63/45/08/6345088e1d1a622a2c0996122a187ee0.jpg')]
    bg-cover bg-center opacity-0 group-hover:opacity-60 blur-xl transition duration-500"
            ></div>

            {/* Content container */}
            <div className="relative flex flex-col bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">

                {/* Title + Description */}
                <div className="flex flex-col w-full justify-center items-start pt-4">
                    <h2 className="text-[16px] md:text-[18px] lg:text-[20px] font-bold text-gray-900 dark:text-white mb-2 px-2">
                        {translation.ten_dich_vu}
                    </h2>
                    <p className="text-gray-500 text-xs md:text-[14px] lg:text-[16px] dark:text-gray-400 text-center px-2">
                        {translation.mo_ta}
                    </p>
                </div>

                {/* Layout ảnh và nội dung */}
                <div className="flex flex-col xl:gap-2 2xl:flex-row mt-2 p-2">
                    {/* Image Section */}
                    <div className="border-2 border-gray-400 dark:border-gray-200 dark:group-hover:shadow-white transition-all duration-200 shadow-lg
        w-full h-64 sm:h-72 flex justify-center items-center bg-gray-50 dark:bg-gray-800 overflow-hidden mb-4 2xl:mb-0 2xl:w-1/3 2xl:h-auto rounded-sm md:rounded-xl">
                        <img
                            src={service.image_url}
                            alt={translation.ten_dich_vu}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 md:p-0 lg:py-4 flex flex-col justify-between relative z-10">
                        {/* Features */}
                        {article?.content?.features && (
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                {article.content.features.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex text-[12px] md:text-[13px] lg:text-[14px] items-start gap-3 p-3 border rounded-lg shadow-sm bg-gray-50/80 dark:bg-gray-800/80
                  transition duration-300 group-hover:bg-white/60 dark:group-hover:bg-gray-700/60"
                                    >
                                        <span className="text-blue-600 dark:text-blue-400">✔</span>
                                        <p className="text-gray-700 dark:text-gray-300">{feature}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA buttons */}
                        <div className="flex justify-center flex-col sm:flex-row gap-4 md:p-2">
                            <Link
                                to={`/services/${service.slug}`}
                                className="text-[12px] md:text-[13px] lg:text-[14px] w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                            >
                                Xem chi tiết
                            </Link>
                            <Link
                                to="/contact"
                                className="text-[12px] md:text-[13px] lg:text-[14px] w-full sm:w-auto text-center border border-blue-600 text-blue-600 dark:border-yellow-300 dark:text-yellow-300 dark:hover:bg-amber-200 dark:hover:text-gray-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                            >
                                Liên hệ ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

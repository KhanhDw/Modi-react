import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef, } from "react";
import { ChevronUp, ChevronsDown } from 'lucide-react';
import useLenisLocal from '@/hook/useLenisLocal';


export default function ServiceCard({ service }) {
    if (!service) return null;
    useLenisLocal(".lenis-local");

    const translation = service?.translation || {};
    const article = service?.article || {};

    const [showDetails, setShowDetails] = useState(false);

    const handleToggle = () => {
        setShowDetails(prev => !prev);
    };

    // Handler khi chuột rời khỏi card
    const handleMouseLeave = () => {
        setShowDetails(false);
    };

    // Lấy chuỗi features/details từ translation
    const features = translation.features
        ? translation.features.split('#').map(f => f.trim()).filter(Boolean)
        : [];

    const details = translation.details
        ? translation.details.split('#').map(d => d.trim()).filter(Boolean)
        : [];


    return (
        <div
            className="h-102 relative w-full mx-auto rounded-2xl shadow-lg hover:shadow-black/40 
                 dark:hover:shadow-green-400/40 border border-gray-200 
                 dark:border-gray-700 overflow-hidden transform 
                 transition duration-500 hover:-translate-y-2 group"
            onMouseLeave={handleMouseLeave}
        >
            {/* Hover background overlay */}
            <div
                className="absolute inset-0 bg-[url('https://i.pinimg.com/originals/63/45/08/6345088e1d1a622a2c0996122a187ee0.jpg')]
                   bg-cover bg-center opacity-0 group-hover:opacity-60 blur-4xl 
                   transition duration-500"
            ></div>

            {/* Content */}
            <div className="relative h-full flex flex-col bg-gray-200/60 dark:bg-gray-900/60 backdrop-blur-lg">
                <div className="flex flex-col w-full justify-center items-start pt-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 px-4 cursor-default">
                        {translation.ten_dich_vu || "Chưa có tên dịch vụ"}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center px-4 cursor-default">
                        {translation.mo_ta || ""}
                    </p>
                </div>

                <div className="flex ">
                    {/* Left: Image */}
                    <div className="border-2 border-gray-400 dark:border-gray-200 dark:group-hover:shadow-gray-600 
                          transition-all duration-200 shadow-lg w-full lg:w-1/3 h-72 
                          flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 
                          overflow-hidden m-2 rounded-xl"
                    >
                        <img
                            src={service.image_url}
                            alt={translation.ten_dich_vu || "Ảnh dịch vụ"}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right: Content */}
                    <div className="min-h-full flex-1 sm:p-3 flex flex-col justify-between relative z-10">

                        {/* Features V2 */}
                        <div className="relative overflow-hidden h-fit">
                            {/* Features list */}
                            <div className="relative">
                                <div className={`transform transition-all duration-500 ${!showDetails ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
                                    {/* Features list */}
                                    {features.length > 0 && (
                                        <ul className="mb-6 space-y-2 h-45">
                                            {features.map((feature, idx) => (
                                                <li
                                                    key={idx}
                                                    className="cursor-default flex items-center gap-2 p-2 pl-3 border-l-4 border-blue-500 rounded bg-gray-50 dark:bg-gray-800 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <span className="text-blue-500 dark:text-blue-400">✔</span>
                                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Nội dung chi tiết overlay - Có thể scroll với Lenis config */}
                            <div data-lenis-prevent className={`absolute inset-0 transform transition-all duration-500 ${showDetails ? "translate-y-0 opacity-100 z-10" : "translate-y-full opacity-0"}`}>
                                <div data-lenis-prevent className="h-full overflow-y-auto scrollbar-hide">
                                    <div className="text-gray-700 dark:text-gray-300 mb-4 font-semibold p-2">
                                        {details.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                                {details.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-start gap-3 p-3 border rounded-lg shadow-sm 
                                           bg-gray-50/80 dark:bg-gray-800/80 
                                           transition duration-300 group-hover:bg-white/60 
                                           dark:group-hover:bg-gray-700/60"
                                                    >
                                                        <p className="text-gray-700 cursor-default dark:text-gray-300">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleToggle}
                                className="flex items-center justify-center gap-2 flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white 
       font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                            >
                                Xem chi tiết
                                {showDetails ? <ChevronsDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                            </button>

                            <Link
                                to="/contact"
                                className="flex-1 text-center border border-blue-600 text-blue-600 
       dark:border-yellow-300 dark:text-yellow-300 
       dark:hover:bg-amber-200 dark:hover:text-gray-700 
       hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg 
       transition-colors duration-300"
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
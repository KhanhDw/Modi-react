import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef, } from "react";
import { ChevronUp, ChevronsDown, ChevronDown } from 'lucide-react';
import useLenisLocal from '@/hook/useLenisLocal';
import HoverButtonsServiceCard from "./buttonServiceCard";
import { useNavigate } from "react-router-dom";


export default function ServiceCard({ service, onFetchService }) {
    if (!service) return null;
    useLenisLocal(".lenis-local");
    const navigate = useNavigate();

    const translation = service?.translation || {};
    const article = service?.article || {};

    const [showDetails, setShowDetails] = useState(false);

    const handleToUp = () => {
        setShowDetails(false);
    };

    const handleToDown = () => {
        setShowDetails(true);
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
            className="h-auto relative w-full mx-auto rounded-md md:rounded-xl shadow-lg hover:shadow-black/40
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
            <div className="relative h-full bg-gray-200/60 dark:bg-gray-900/60 backdrop-blur-lg grid grid-rows-[auto_1fr]">
                {/* Title & Description */}
                <div className="grid gap-1 p-2 md:p-3 lg:mb-2 lg:px-4 xl:px-4">
                    <h2 className="text-base sm:text-[18px] md:text-xl lg:text-[22px] xl:text-[24px] font-bold text-gray-900 dark:text-white cursor-default line-clamp-2">
                        {translation.ten_dich_vu || "Chưa có tên dịch vụ"}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 cursor-default text-[13px] sm:text-[15px] md:text-[17px] lg:text-[18px] xl:text-[21px] line-clamp-2">
                        {translation.mo_ta || ""}
                    </p>
                </div>

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 lg:grid-cols-1 xl:grid-cols-3 gap-4 items-start px-2 pb-4 md:pr-4 lg:px-4 xl:px-4">
                    {/* Left: Image */}
                    <div className="md:col-span-2 lg:col-span-3 xl:col-span-1">
                        <div className="border-2 border-gray-400 dark:border-gray-200 dark:group-hover:shadow-gray-600
                transition-all duration-200 shadow-lg w-full h-72
                bg-gray-50 dark:bg-gray-800 rounded-md md:rounded-xl overflow-hidden grid place-items-center"
                        >
                            <img
                                src={service.image_url}
                                alt={translation.ten_dich_vu || "Ảnh dịch vụ"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Features + Detail + Buttons */}
                    <div className="md:col-span-3 xl:col-span-2">
                        {/* Features & Toggle */}
                        <div className="grid grid-cols-1 sm:grid-cols-5">
                            {/* Features */}
                            <div className="sm:col-span-4 relative overflow-hidden w-full sm:mb-2">
                                {/* Features list */}
                                <div className={`transition-all duration-500 ${!showDetails ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
                                    {features.length > 0 && (
                                        <ul className="mb-6 space-y-2 h-45">
                                            {features.map((feature, idx) => (
                                                <li
                                                    key={idx}
                                                    className="cursor-default flex items-center gap-2 p-2 border-l-4 border-blue-500 rounded
                                        bg-gray-50 dark:bg-gray-800 transition duration-200
                                        hover:bg-gray-100 dark:hover:bg-gray-700 text-xs sm:text-sm md:text-base lg:text-[17px] xl:text-[18px] font-normal"
                                                >
                                                    <span className="text-blue-500 dark:text-blue-400">✔</span>
                                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Nội dung chi tiết overlay */}
                                <div data-lenis-prevent className={`absolute inset-0 transition-all duration-500 ${showDetails ? "translate-y-0 opacity-100 z-10" : "translate-y-full opacity-0"}`}>
                                    <div data-lenis-prevent className="h-full overflow-y-auto scrollbar-hide">
                                        <div className="text-gray-700 dark:text-gray-300 font-semibold">
                                            {details.length > 0 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 mb-4">
                                                    {details.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-start p-2 border rounded-md shadow-sm
                                                    bg-gray-50/80 dark:bg-gray-800/80
                                                    transition duration-300 group-hover:bg-white/60
                                                    dark:group-hover:bg-gray-700/60"
                                                        >
                                                            <p className="text-gray-700 font-normal cursor-default dark:text-gray-300 text-xs sm:text-sm md:text-base lg:text-[17px] xl:text-[18px]">{item}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Toggle Buttons */}
                            {/* sm:col-span-1 */}
                            <div className="grid place-items-center mt-2 sm:ml-2 lg:ml-3 xl:ml-1">
                                <HoverButtonsServiceCard
                                    onClickUp={handleToUp}
                                    onClickDown={handleToDown}
                                    valuePosition={showDetails}
                                />
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mt-3 sm:mt-2 md:mt-10 lg:mt-6 xl:mt-7">
                            <button
                                onClick={() => {
                                    if (translation.slug) {
                                        onFetchService(translation.slug);
                                        navigate(`/services/${translation.slug}`);
                                    }
                                }}
                                className="text-center bg-blue-600 hover:bg-blue-700 text-white
                        font-semibold rounded-sm lg:rounded-xl transition-colors duration-300 cursor-pointer p-1 lg:p-2"
                            >
                                <span className="text-xs sm:text-sm md:text-base lg:text-[17px] xl:text-[18px] font-semibold">Xem chi tiết</span>
                            </button>

                            <Link
                                to="/contact"
                                className="text-center border-2 border-blue-600 text-blue-600
                        dark:border-yellow-300 dark:text-yellow-300
                        dark:hover:bg-amber-200 dark:hover:text-gray-700
                        hover:bg-blue-50 font-semibold rounded-sm lg:rounded-xl
                        transition-colors duration-300 p-1 lg:p-2"
                            >
                                <span className="text-xs sm:text-sm md:text-base lg:text-[17px] xl:text-[18px] font-semibold">Liên hệ ngay</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );

}

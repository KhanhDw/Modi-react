import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import modiservicesImage from "/images/modiservices.jpg"
import { TiArrowSortedDown } from "react-icons/ti";
import "../assets/css/MarqueeBanner.css"
import { useLanguage } from '../contexts/LanguageContext';
import PricingPage from '../components/home/pricingPage';
import { Link } from 'react-router-dom';
import { FaArrowUp } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import useCurrentLanguage, { setAppLanguage } from "@/hook/currentLang";


function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        visible && (
            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300 z-50"
            >
                <FaArrowUp className="w-5 h-5" />
            </button>
        )
    );
}


function HomePage({ activeSidebarHeader }) {
    const { t } = useLanguage();
    const { lang, prefix } = useCurrentLanguage();
    const [activeLang, setActiveLang] = useState("vi"); // vi en

    useEffect(() => {
        setActiveLang(lang);

    }, [lang]);

    useEffect(() => {
        // Khi load lại trang thì reset scroll
        window.history.scrollRestoration = "manual";
        window.scrollTo(0, 0);

        // Khi chuẩn bị reload/đóng tab -> về top
        const handleBeforeUnload = () => {
            window.scrollTo(0, 0);
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);


    const [homeData, setHomeData] = useState({
        vi: {
            banner: [],
            nenTang: [],
            cards: [],
            dichVu: [],
            loiIch: [],
            khauHieu: [],
            khachHang: [],
        },
        en: {
            banner: [],
            nenTang: [],
            cards: [],
            dichVu: [],
            loiIch: [],
            khauHieu: [],
            khachHang: [],
        },
    });
    const currentData = homeData[activeLang];
    // ===================== PARSERS =====================
    const sectionParsers = {
        banner: (data) => {
            // Mapping riêng cho buttonText
            const buttonTextMapping = [
                "home.banner.goal.buttonText",
                "home.banner.coreValues.buttonText",
            ];

            return data.map((item, idx) => ({
                id: item.id,
                title: { vi: item.title?.vi || "", en: item.title?.en || "" },
                description: { vi: item.description?.vi || "", en: item.description?.en || "" },
                banner: item.image_url
                    ? `${import.meta.env.VITE_MAIN_BE_URL}${item.image_url}`
                    : "",
                buttonText: buttonTextMapping[idx] || "", // 👈 append ở đây
            }));
        },

        nenTang: (data) => ({
            title: { vi: data[0]?.title?.vi || "", en: data[0]?.title?.en || "" },
            description: { vi: data[0]?.description?.vi || "", en: data[0]?.description?.en || "" },
        }),

        cards: (data) =>
            data.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                image: item.image_url,
            })),

        dichVu: (data) =>
            data.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                image: item.image_url,
            })),

        loiIch: (data) =>
            data.map((item) => ({
                id: item.id,
                title: {
                    vi: item.title?.vi || "",
                    en: item.title?.en || "",
                },
                description: {
                    vi: item.description?.vi
                        ? item.description.vi.split("\n") // tách thành list
                        : [],
                    en: item.description?.en
                        ? item.description.en.split("\n")
                        : [],
                },
                imageUrl: item.image_url,
                position: item.position,
            })),


        khauHieu: (data) => ({
            text: data[0]?.title || "",
        }),

        khachHang: (data) =>
            data.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                image: item.image_url,
            })),
    };

    // ===================== FETCH CHUNG =====================
    const fetchSection = async (type) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/type/${type}?slug=home`
            );
            const data = await res.json();
            const parsed = sectionParsers[type]?.(data) || data;

            setHomeData((prev) => ({
                ...prev,
                [activeLang]: {
                    ...prev[activeLang],
                    [type]: parsed,
                },
            }));
        } catch (err) {
            console.error(`❌ Fetch ${type} failed:`, err);
        }
    };

    useEffect(() => {
        const sections = ["banner", "nenTang", "cards", "dichVu", "loiIch", "khauHieu", "khachHang"];
        Promise.all(sections.map((type) => fetchSection(type)));
    }, [activeLang]);

    return (
        <div className={`${activeSidebarHeader ? 'overflow-hidden' : ''} w-full h-full md:p-4 mx-auto flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900`}>
            {currentData.banner.length > 0 && (
                <BannerSilder data={currentData.banner} activeLang={activeLang} />
            )}
            {currentData.nenTang && (
                <BaseModi data={currentData.nenTang} activeLang={activeLang} />
            )}
            {currentData.cards.length > 0 && (
                <ThreeCardBusiness data={currentData.cards} activeLang={activeLang} />
            )}
            {currentData.dichVu.length > 0 && (
                <ServiceModi data={currentData.dichVu} activeLang={activeLang} />
            )}
            {currentData.loiIch.length > 0 && (
                <BenefitBusiness data={currentData.loiIch} activeLang={activeLang} />
            )}
            <PricingPage />
            {currentData.khauHieu && (
                <BannerText data={currentData.khauHieu} activeLang={activeLang} />
            )}
            {currentData.khachHang.length > 0 && (
                <Customer data={currentData.khachHang} activeLang={activeLang} />
            )}
            <ScrollToTopButton />
        </div>
    );

}
function BannerSilder({ data, activeLang }) {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [showNext, setShowNext] = useState(false);

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.8 });

    useEffect(() => {
        const interval = setInterval(() => {
            setShowNext(true);

            const timeout = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % data.length);
                setNextIndex((prev) => (prev + 1) % data.length);
                setShowNext(false);
            }, 1000);

            return () => clearTimeout(timeout);
        }, 10000);

        return () => clearInterval(interval);
    }, [data]);

    // Nếu chưa có data thì return loading
    if (!data || data.length === 0) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return <>
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative h-[80vh] w-full md:rounded-[40px] overflow-hidden mb-10"
        >
            <AnimatePresence>
                {/* Ảnh hiện tại */}
                <motion.img
                    key={`current-image-${currentIndex}`}
                    src={data[currentIndex].banner}
                    initial={{ opacity: 1, filter: "brightness(100%)" }}
                    animate={
                        isInView
                            ? {
                                opacity: showNext ? 0 : 1,
                                filter: showNext ? "brightness(100%)" : "brightness(50%)",
                            }
                            : {}
                    }
                    transition={{ duration: 1 }}
                    className="absolute top-0 left-0 w-full h-full object-cover md:rounded-[40px] z-20"
                    alt="banner"
                />

                {/* Nội dung */}
                <motion.div
                    key={`content-${currentIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: showNext ? 0 : 1, y: 0 } : {}}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-30 flex flex-col items-start justify-center text-white bg-transparent sm:px-12 md:px-20 md:pl-20 lg:pl-40 2xl:w-2/3"
                >
                    <h2 className="mb-4 text-2xl xs:ml-4 md:text-5xl 2xl:text-5xl font-bold bg-transparent text-start">
                        {data[currentIndex].title[activeLang]}
                    </h2>
                    <p className="mb-8 w-full xs:text-justify xs:text-sm md:text-md md:text-start md:text-xl 2xl:text-3xl xs:ml-4">
                        {data[currentIndex].description[activeLang]}
                    </p>
                    {data[currentIndex].buttonText && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="px-6 py-3 text-xl font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-blue-700 md:text-xl 2xl:text-2xl xs:ml-4 cursor-pointer"
                        >
                            <Link to="/about">{t(data[currentIndex].buttonText)}</Link>
                        </motion.button>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Ảnh kế tiếp */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={`next-image-${nextIndex}`}
                    src={data[nextIndex].banner}
                    initial={{ opacity: 0, filter: "blur(5px)" }}
                    animate={
                        isInView
                            ? {
                                opacity: showNext ? 1 : 0,
                                filter: "blur(0px)",
                            }
                            : {}
                    }
                    transition={{ duration: 1 }}
                    className="absolute top-0 left-0 w-full h-full object-cover md:rounded-[40px] z-10"
                    alt="next banner"
                />
            </AnimatePresence>

            {/* Nút dot chọn banner */}
            <div className="absolute right-0 flex md:flex-col items-center justify-center h-[80vh] md:mx-4 md:transform xs:-translate-y-1/2 z-51 xs:bottom md:top-1/2 xs:gap-1 md:gap-2">
                {data.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`${currentIndex === index ? "bg-gray-100" : "bg-gray-600"
                            } xs:h-2 md:w-4 xs:w-2 md:h-4 mb-3 rounded-full cursor-pointer`}
                    />
                ))}
            </div>
        </motion.div>
    </>
}

function BaseModi({ data, activeLang }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.8 });

    if (!data) return null;

    return (
        <div ref={ref} className="flex flex-col items-center justify-center sm:my-2 md:my-6 pb-10">
            <div className="w-3/4">
                <motion.p
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                    className={`mb-4 text-3xl sm:text-4xl xs:text-xl md:text-5xl 3xl:text-6xl font-bold text-center dark:text-white text-black `}
                >
                    {data.title?.[activeLang]}
                </motion.p>
                <motion.p
                    initial={{ y: 40, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center text-gray-600 sm:text-xl md:text-2xl 3xl:text-xl dark:text-gray-300"
                >
                    {data.description?.[activeLang]}
                </motion.p>
            </div>
        </div>
    );
}

function ThreeCardBusiness({ data, activeLang }) {
    const [isMobileView, setIsMobileView] = useState(false);
    const [expandedCardId, setExpandedCardId] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 1024); // mobile + tablet
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleExpand = (id) => {
        setExpandedCardId((prev) => (prev === id ? null : id));
    };

    if (!data || data.length === 0) return null;

    return (
        <section className="w-full rounded-2xl">

            <div className="container mx-auto w-full my-4">
                {isMobileView ? (

                    // ================= MOBILE / TABLET =================
                    <div className="flex items-start overflow-x-auto snap-x snap-mandatory gap-6 px-2 scrollbar-hide">
                        {data.map((item) => {
                            const isExpanded = expandedCardId === item.id;
                            const description = item.description?.[activeLang] || "";

                            return (
                                <div
                                    key={item.id}
                                    className="snap-center shrink-0 
                   w-[80%] sm:w-[70%] md:w-[60%] 
                   bg-white dark:bg-gray-800 
                   rounded-2xl shadow-lg overflow-hidden flex flex-col "
                                >
                                    {/* Hình ảnh */}
                                    <div className="h-56 sm:h-60 md:h-70 rounded-xl p-4 overflow-hidden  ">
                                        <img
                                            src={`${import.meta.env.VITE_MAIN_BE_URL}${item.image}`}
                                            alt={item.title?.[activeLang]}
                                            className="w-full h-full object-cover  border-2 border-gray-600 rounded-xl"
                                            onError={(e) => (e.currentTarget.src = "/no-image.png")}
                                        />
                                    </div>

                                    {/* Title + Mô tả */}
                                    <div className="p-4 md:p-6 flex flex-col justify-start">
                                        <h4 className={`text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2
                                        ${isExpanded ? "line-clamp-none" : "line-clamp-1"}`}>
                                            {item.title?.[activeLang]}
                                        </h4>

                                        <p
                                            className={`text-gray-700 dark:text-gray-200 
                        text-sm sm:text-base md:text-lg 
                        transition-all duration-300 
                        ${isExpanded ? "line-clamp-none" : "line-clamp-3"}`}
                                        >
                                            {description}
                                        </p>

                                        {/* Nút Xem thêm / Thu gọn */}
                                        {description.length > 100 && (
                                            <button
                                                onClick={() => toggleExpand(item.id)}
                                                className="text-blue-500 hover:underline text-sm self-start mt-2 cursor-pointer"
                                            >
                                                {isExpanded ? "Thu gọn" : "Xem thêm"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                ) : (
                    // ================= DESKTOP =================
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 items-start">
                        {data.map((item) => {
                            const isExpanded = expandedCardId === item.id;
                            const description = item.description?.[activeLang] || "";

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col"
                                >
                                    {/* Hình ảnh */}
                                    <div className="h-65  rounded-xl p-4 overflow-hidden ">
                                        <img
                                            src={`${import.meta.env.VITE_MAIN_BE_URL}${item.image}`}
                                            alt={item.title?.[activeLang]}
                                            className="w-full h-full object-cover  border-2 border-gray-600 rounded-xl"
                                            onError={(e) => (e.currentTarget.src = "/no-image.png")}
                                        />
                                    </div>

                                    {/* Title + Mô tả */}
                                    <div className="p-6 flex flex-col">
                                        <h4 className={`text-xl font-bold text-gray-900 dark:text-white mb-2
                                             ${isExpanded ? "line-clamp-none" : "line-clamp-1"}`}>
                                            {item.title?.[activeLang]}
                                        </h4>

                                        {/* Mô tả thu gọn/mở rộng */}
                                        <p
                                            className={`text-gray-700 dark:text-gray-200 text-base leading-relaxed transition-all duration-300 ${isExpanded ? "line-clamp-none" : "line-clamp-3"
                                                }`}
                                        >
                                            {description}
                                        </p>

                                        {/* Nút Xem thêm / Thu gọn */}
                                        {description.length > 120 && (
                                            <button
                                                onClick={() => toggleExpand(item.id)}
                                                className="text-blue-500 hover:underline text-sm self-start mt-2 cursor-pointer"
                                            >
                                                {isExpanded ? "Thu gọn" : "Xem thêm"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                )}
            </div>
        </section >
    );
}

function ServiceModi({ data, activeLang }) {

    const { t } = useLanguage();
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);
    const [expandedCardId, setExpandedCardId] = useState(null); // card đang mở rộng

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 1024); // mobile & tablet
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleMouseEnter = (id) => setHoveredItemId(id);
    const handleMouseLeave = () => setHoveredItemId(null);

    const getItemWidth = (id) => {
        if (hoveredItemId === null) {
            return `${100 / data.length}%`;
        }
        if (hoveredItemId === id) {
            return "35%";
        }
        return `${(100 - 35) / (data.length - 1)}%`;
    };

    if (!data || data.length === 0) return null;

    return (
        <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 bg-neutral-50 dark:bg-transparent w-full rounded-3xl">
            <div className="container mx-auto text-center flex flex-col gap-4 xs:gap-5 sm:gap-6 px-4 xs:px-5 sm:px-6 md:px-8 relative z-20">
                <h3 className="  text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-bold text-black dark:text-[#F3F4F6]">
                    {t("home.serviceModi.title")}

                </h3>
                <div className="text-lg xs:text-xl sm:text-2xl text-gray-600 dark:text-[#D1D5DB]">
                    {t("home.serviceModi.description")}
                </div>
            </div>

            <div className="relative z-20 mt-8 md:mt-12 container mx-auto w-full">
                {isMobileView ? (
                    // ================= MOBILE / TABLET =================
                    <div className="flex items-start overflow-x-auto snap-x snap-mandatory gap-6 px-4 pb-6 scrollbar-hide">

                        {data.map((service) => {
                            const isExpanded = expandedCardId === service.id;
                            const description = service.description?.[activeLang] || "";

                            return (
                                <div
                                    key={service.id}
                                    className="snap-center shrink-0 w-[80%] sm:w-[60%] bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col"
                                >
                                    {/* Ảnh + overlay + title */}
                                    <div className="relative h-65">
                                        <img
                                            src={`${import.meta.env.VITE_MAIN_BE_URL}${service.image}`}
                                            alt={service.title?.[activeLang]}
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.src = "/no-image.png")}
                                        />

                                        {/* Overlay phủ toàn bộ ảnh */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10"></div>

                                        {/* Title nằm riêng dưới ảnh */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h4 className="text-lg sm:text-xl font-bold text-white">
                                                {service.title?.[activeLang]}
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Nội dung bên dưới ảnh */}
                                    <div className="p-4 flex flex-col justify-start">
                                        <p
                                            className={`text-gray-700 dark:text-gray-200 text-sm sm:text-base transition-all duration-300 ${isExpanded ? "line-clamp-none" : "line-clamp-3"
                                                }`}
                                        >
                                            {description}
                                        </p>

                                        {/* Nút Xem thêm / Thu gọn */}
                                        {description.length > 100 && (
                                            <button
                                                onClick={() => toggleExpand(service.id)}
                                                className="text-blue-500 hover:underline text-sm self-start"
                                            >
                                                {isExpanded ? "Thu gọn" : "Xem thêm"}
                                            </button>
                                        )}

                                        {/* CTA */}
                                        <a
                                            className="mt-3 inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors focus:bg-blue-600"
                                            href={service.href || "#"}
                                        >
                                            {t("home.serviceModi.findOutMore")}

                                        </a>
                                    </div>
                                </div>

                            );
                        })}
                    </div>
                ) : (
                    // ================= DESKTOP =================
                    <div className="flex w-full h-[400px] overflow-hidden rounded-lg shadow-lg">
                        {data.map((service) => (
                            <div
                                key={service.id}
                                onMouseEnter={() => setHoveredItemId(service.id)}
                                onMouseLeave={() => setHoveredItemId(null)}
                                className={`relative overflow-hidden cursor-pointer transition-[flex-grow] duration-500 ease-in-out ${hoveredItemId === service.id ? "flex-[4]" : "flex-[1]"
                                    }`}
                            >
                                <img
                                    src={`${import.meta.env.VITE_MAIN_BE_URL}${service.image}`}
                                    alt={service.title?.[activeLang]}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = "/no-image.png")}
                                />
                                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 py-8 text-white z-10 bg-gradient-to-t from-black/80 dark:from-gray-900/90 to-transparent">
                                    <h4 className="text-2xl font-bold mb-4">
                                        {service.title?.[activeLang]}
                                    </h4>
                                    <div
                                        className={`transition-all duration-300 ease-in-out ${hoveredItemId === service.id
                                            ? "max-h-screen opacity-100"
                                            : "max-h-0 opacity-0 overflow-hidden"
                                            }`}
                                    >
                                        <p className="text-lg mb-4 font-light">
                                            {service.description?.[activeLang]}
                                        </p>
                                        <a
                                            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white text-white hover:bg-blue-500 hover:text-gray-900 transition-colors"
                                            href={service.href || "#"}
                                        >
                                            Tìm hiểu thêm
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function BenefitBusiness({ data, activeLang }) {
    const { t } = useLanguage();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.8 });
    const [hovered, setHovered] = useState(null);
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div
            ref={ref}
            className="flex items-center justify-center w-full mx-auto md:gap-2 xs:pb-1 md:pb-10 xs:px-2"
        >
            {/* Left Images */}
            <div className="flex items-center justify-end md:w-1/2 xs:hidden md:flex md:gap-3">
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8 }}
                    className="flex md:w-1/2 overflow-hidden xs:h-140 md:h-140 3xl:h-180 rounded-2xl shadow-sm shadow-black"
                >
                    <img src="/images/company.jpg" className="object-cover w-full h-full" />
                </motion.div>
                <div className="flex flex-col w-1/2 gap-3 h-140 3xl:h-180">
                    <motion.img
                        initial={{ y: -80, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        src="/images/business.jpg"
                        className="object-cover w-full h-full overflow-hidden rounded-2xl shadow-sm shadow-black"
                    />
                    <motion.img
                        initial={{ y: 80, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        src="/images/Benefits.jpg"
                        className="object-cover w-full h-full overflow-hidden rounded-2xl shadow-sm shadow-black"
                    />
                </div>
            </div>

            {/* Right Text */}
            <div className="flex flex-col md:items-start xs:items-center justify-center md:w-1/2 md:pl-10 xs:px-5">
                <motion.p
                    initial={{ x: 100, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8 }}
                    className="mb-10 md:text-3xl xs:text-xl 3xl:text-6xl font-bold text-center dark:text-white text-black"
                >
                    {t("home.benefit.mainTitle")}

                </motion.p>
                {data.map((item, index) => (
                    <div key={item.id} className="mb-10">
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            className="flex items-center justify-start xs:gap-0 mb-2 xs:text-lg md:text-md 3xl:text-3xl font-bold text-center transition-all duration-300 cursor-pointer"
                            type="button"
                        >
                            <TiArrowSortedDown
                                className={`dark:text-white text-black transition-all duration-300 ${hovered === index ? "text-green-600 border-1 border-black rounded-2xl" : ""}`}
                            />
                            <span className="dark:text-white text-black font-semibold text-3xl">
                                {item.title?.[activeLang]}
                            </span>
                        </motion.button>
                        <AnimatePresence mode="wait">
                            {openIndex === index && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <ul className='pl-15 mt-5'>
                                        {item.description?.[activeLang]?.map((contentItem, subIndex) => (
                                            <li
                                                key={subIndex}
                                                className="py-1 pl-1 list-disc 3xl:text-xl dark:text-white text-black"
                                            >
                                                {contentItem}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BannerText({ data, activeLang }) {
    if (!data || !data.text) return null;

    return (
        <div className="w-full marquee">
            <div className="xs:text-2xl md:text-5xl 3xl:text-6xl font-bold text-gray-400 dark:text-gray-400 marquee-content">
                {data.text?.[activeLang]}
            </div>
        </div>
    );
}

function Customer({ data, activeLang }) {
    const { t } = useLanguage()
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, threshold: 0.8 })

    return (
        <div className="w-full  rounded-lg bg-transparent p-6 shadow-lg md:p-10">
            <div ref={ref}>
                <div className="flex flex-col items-center justify-center w-full xs:gap-2 md:p-4 xs:px-3 xs:py-6 md:px-3 mb-10 bg-transparent rounded-lg md:flex-row">
                    {/* Hình ảnh khách hàng cho màn hình nhỏ (ẩn trên md:) */}
                    <motion.div
                        initial={{ x: -100, scale: 0.8, opacity: 0 }}
                        animate={isInView ? { x: 0, scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="md:hidden md:p-2 xs:p-2 overflow-hidden shadow-sm md:w-1/2 shadow-black rounded-2xl"
                    >
                        <img
                            src="./images/What-Customers-Want.jpg"
                            alt={t("home.customer.alt")}
                            className="rounded-lg w-full h-auto"
                        />
                    </motion.div>

                    {/* Nội dung với hình ảnh nền (hiển thị từ md:) */}
                    <div className="border-2 border-slate-700 relative  xs:w-full md:w-full md:min-h-[400px]  flex flex-col justify-center items-center md:items-start rounded-lg overflow-hidden">
                        {/* Hình ảnh nền (ẩn trên xs:, hiển thị từ md:) */}
                        <div className="absolute inset-0 hidden md:block  w-full">
                            <img
                                src="./images/What-Customers-Want.jpg" // Sử dụng hình ảnh phù hợp làm nền
                                alt="Background image of customer support"
                                className="object-cover opacity-3 rounded-lg  w-full" // Che phủ, độ mờ nhẹ
                            />
                        </div>
                        {/* Lớp phủ để đảm bảo chữ dễ đọc */}
                        <div className="absolute inset-0 hidden md:block bg-black/30 rounded-lg "></div>
                        <div className='flex justify-between items-center gap-3 px-3'>

                            {/* Nội dung văn bản (tiêu đề, mô tả, nút) */}
                            <div className="relative z-10 text-center md:text-left text-black md:text-white md:w-1/2 md:px-10">
                                <motion.h2
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                                    transition={{ type: "spring", stiffness: 120 }}
                                    className="mb-4 xs:text-2xl md:text-3xl 2xl:text-7xl 3xl:text-8xl font-bold xs:py-2 md:py-6 dark:text-slate-100"
                                >
                                    {t("home.customer.title")}
                                </motion.h2>
                                {data.map((customer, index) => (
                                    <motion.p
                                        key={customer.id || index}
                                        initial={{ opacity: 0 }}
                                        animate={isInView ? { opacity: 1 } : {}}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="mb-4 text-justify text-gray-700 dark:text-gray-300 md:text-sm 2xl:text-lg 3xl:text-3xl xs:py-2 md:py-5"
                                    >
                                        {/* {t("home.customer.description")} */}
                                        {customer.description?.[activeLang]}
                                    </motion.p>
                                ))}
                                <div className="flex justify-center md:justify-start py-5">
                                    <Button size={"lg"} className="bg-[#2C3E50] hover:bg-[#415263] text-white px-6 xs:py-2  rounded-md text-lg cursor-pointer">
                                        {t("home.customer.btn")}
                                    </Button>
                                </div>
                            </div>
                            <div className="hidden md:block bg-black/30 rounded-lg w-1/2 ">
                                <img
                                    src="./images/What-Customers-Want.jpg"
                                    alt={t("home.customer.alt")}
                                    className="rounded-lg w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default HomePage;
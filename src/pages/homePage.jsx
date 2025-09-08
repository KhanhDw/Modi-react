import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import modiservicesImage from "/images/modiservices.jpg"
import { TiArrowSortedDown } from "react-icons/ti";
import "../assets/css/MarqueeBanner.css"
import { useLanguage } from '../contexts/LanguageContext';
import PricingPage from '../components/home/pricingPage';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useCurrentLanguage, { setAppLanguage } from "@/hook/currentLang";




function HomePage({ activeSidebarHeader }) {
    const { t } = useLanguage();
    const { lang, prefix } = useCurrentLanguage();
    const [activeLang, setActiveLang] = useState("vi"); // vi en

    useEffect(() => {
        setActiveLang(lang);
    }, [lang]);


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

    // Nếu chưa có data thì return null (tránh crash)
    if (!data || data.length === 0) {
        return <div className="text-center py-10">Loading...</div>
    }

    return (
        <><motion.div
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
                    className="absolute top-0 left-0 w-full h-full object-cover md:rounded-[40px] z-20 xl:border-2 xl:border-gray-300"
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
                    <h2 className="mb-4 text-2xl md:text-7xl 2xl:text-7xl font-bold bg-transparent text-start">
                        {data[currentIndex].title[activeLang]}
                    </h2>
                    <p className="mb-8 w-full xs:text-justify xs:text-sm md:text-md md:text-start md:text-xl 2xl:text-3xl">
                        {data[currentIndex].description[activeLang]}
                    </p>
                    {data[currentIndex].buttonText && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="px-6 py-3 text-xl font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-blue-700 md:text-xl 2xl:text-2xl"
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
                        className={`${currentIndex === index ? "bg-gray-100" : "bg-gray-600"} w-3 h-3 xs:h-2 xs:w-2 md:w-4 md:h-4 mb-3 rounded-full cursor-pointer`}
                    />
                ))}
            </div>
        </motion.div></>
    )
}

function BaseModi({ data, activeLang }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.8 });

    if (!data) return null;

    return (
        <div ref={ref} className="flex flex-col items-center justify-center pb-10">
            <div className="w-3/4">
                <motion.p
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                    className={`mb-4 xs:text-xl md:text-4xl 3xl:text-6xl font-bold text-center dark:text-white text-black `}
                >
                    {data.title?.[activeLang]}
                </motion.p>
                <motion.p
                    initial={{ y: 40, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center xs:text-sm md:text-md 3xl:text-xl dark:text-white text-black"
                >
                    {data.description?.[activeLang]}
                </motion.p>
            </div>
        </div>
    );
}


function ThreeCardBusiness({ data, activeLang }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.2 });

    if (!data || data.length === 0) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div ref={ref} className="w-[80%] mx-auto py-12">
            <div className="grid xs:grid-cols-1 md:grid-cols-3 gap-8">
                {data.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className="relative flex flex-col items-center justify-start 
                   rounded-3xl bg-white dark:bg-gray-900 shadow-lg 
                   border border-gray-200 dark:border-gray-700 
                   overflow-hidden transition-all duration-300 hover:shadow-2xl p-2"
                    >
                        {/* Hình ảnh phía trên */}
                        <div className="rounded-2xl w-full overflow-hidden h-56 bg-gradient-to-tr from-blue-200 to-indigo-300 flex items-center justify-center">
                            <img
                                src={`${import.meta.env.VITE_MAIN_BE_URL}${item.image}`}
                                alt={item.title?.[activeLang]}
                                className="w-auto h-auto object-contain drop-shadow-lg"
                            />
                        </div>

                        {/* Nội dung */}
                        <div className="p-6 text-center">
                            {/* Tiêu đề */}
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                                {item.title?.[activeLang]}
                            </h3>

                            {/* Mô tả */}
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                {item.description?.[activeLang]}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

    );
}


function ServiceModi({ data, activeLang }) {

    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleMouseEnter = (id) => setHoveredItemId(id);
    const handleMouseLeave = () => setHoveredItemId(null);

    const getItemWidth = (id, index, isFirst, isLast) => {
        const totalItems = data.length;

        if (hoveredItemId === null) {
            return `${100 / totalItems}%`; // Chưa hover → chia đều
        }

        const hoveredIndex = data.findIndex(item => item.id === hoveredItemId);

        if (hoveredItemId === id) {
            return "35%"; // item đang hover
        }

        // Nếu item khác bị ảnh hưởng
        const remainingWidth = 100 - 35;
        // === Logic mở rộng tùy hướng ===
        if (hoveredIndex === 1) {
            // Item 2 → mở sang phải
            if (index < hoveredIndex) {
                return `${100 / totalItems}%`; // giữ nguyên bên trái
            } else {
                return `${remainingWidth / (totalItems - 2)}%`; // chia phần còn lại bên phải
            }
        }

        if (hoveredIndex === 3) {
            // Item 4 → mở sang trái
            if (index > hoveredIndex) {
                return `${100 / totalItems}%`; // giữ nguyên bên phải
            } else {
                return `${remainingWidth / (totalItems - 2)}%`; // chia phần còn lại bên trái
            }
        }

        // Item 3 hoặc các item khác → mở đều
        return `${remainingWidth / (totalItems - 1)}%`;
    };


    if (!data || data.length === 0) return null;

    return (
        <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 bg-neutral-50 dark:bg-transparent w-full rounded-3xl">
            <div className="container mx-auto text-center flex flex-col gap-4 xs:gap-5 sm:gap-6 px-4 xs:px-5 sm:px-6 md:px-8 relative z-20">
                <h3 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-bold text-black dark:text-[#F3F4F6]">
                    Dịch vụ
                </h3>
                <div className="text-lg xs:text-xl sm:text-2xl text-gray-600 dark:text-[#D1D5DB]">
                    <p>Chúng tôi cung cấp giải pháp phù hợp cho doanh nghiệp của bạn.</p>
                </div>
            </div>

            <div className="relative z-20 mt-6 xs:mt-8 sm:mt-10 md:mt-12 container mx-auto w-full">
                {isMobileView ? (
                    // ================= MOBILE =================
                    <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 px-4 sm:px-6 md:px-0 scrollbar-hide">
                        {data.map((service, index) => (
                            <div
                                key={service.id}
                                className="relative overflow-hidden cursor-pointer"
                                onMouseEnter={() => handleMouseEnter(service.id, index)}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                    width: getItemWidth(service.id, index), 
                                    transition: "width 0.2s ease-out",
                                }}
                            >
                                <div className="relative overflow-hidden rounded-lg shadow-lg h-[400px] sm:h-[450px]">
                                    <a
                                        className="block w-full h-full"
                                        href={service.href || "#"}
                                        title={service.title?.[activeLang]}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_MAIN_BE_URL}${service.image}`}
                                            alt={service.title?.[activeLang]}
                                            className="w-full h-full object-cover xs:opacity-50 md:opacity-100"
                                        />
                                    </a>
                                    <div className="absolute bottom-0 left-0 right-0 px-6 py-6 text-white z-10 bg-gradient-to-t from-black/80 dark:from-[#1F2937]/90 to-transparent">
                                        <h4 className="text-xl md:text-2xl font-bold mb-3">
                                            {service.title?.[activeLang]}
                                        </h4>
                                        <p className="text-base font-light mb-3">
                                            {service.description?.[activeLang]}
                                        </p>
                                        <a
                                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white hover:bg-[#3B82F6] hover:text-[#1F2937] transition-colors"
                                            href={service.href || "#"}
                                        >
                                            Tìm hiểu thêm
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // ================= DESKTOP =================
                    <div className="flex w-full h-[450px] overflow-hidden rounded-lg shadow-lg">
                        {data.map((service, index) => {
                            const isFirst = index === 0;
                            const isLast = index === data.length - 1;

                            return (
                                <div
                                    key={service.id}
                                    onMouseEnter={() => handleMouseEnter(service.id)}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ flexBasis: 0 }}
                                    className={`
                                        relative overflow-hidden cursor-pointer
                                        ${isLast ? "ml-auto" : ""}
                                        ${hoveredItemId === service.id ? "flex-[4]" : "flex-[1]"}
                                        transition-[flex-grow] duration-500 ease-in-out
                                    `}

                                >
                                    <a
                                        className="block w-full h-full"
                                        href={service.href || "#"}
                                        title={service.title?.[activeLang]}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_MAIN_BE_URL}${service.image}`}
                                            alt={service.title?.[activeLang]}
                                            className="w-full h-full object-cover"
                                        />
                                    </a>
                                    <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 py-8 text-white z-10 bg-gradient-to-t from-black/80 dark:from-[#1F2937]/90 to-transparent">
                                        <h4 className="text-2xl font-bold mb-4">
                                            {service.title?.[activeLang]}
                                        </h4>
                                        <div
                                            className={`transition-all duration-300 ease-in-out ${hoveredItemId === service.id
                                                ? "max-h-screen opacity-100"
                                                : "max-h-0 opacity-0 overflow-hidden"
                                                }`}
                                        >
                                            <p className="text-xl mb-4 font-light">
                                                {service.description?.[activeLang]}
                                            </p>
                                            <a
                                                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white text-white hover:bg-[#3B82F6] hover:text-[#1F2937] transition-colors"
                                                href={service.href || "#"}
                                            >
                                                Tìm hiểu thêm
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {isMobileView && (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-4 text-sm sm:text-base">
                        Vuốt sang ngang để xem thêm dịch vụ
                    </div>
                )}
            </div>
        </section>
    );
}





function BenefitBusiness({ data, activeLang }) {
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
                    {activeLang === "vi" ? "Lợi ích" : "Benefits"}
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
                            <span className="dark:text-white text-black">
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
                                    <ul>
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
            <div className="xs:text-2xl md:text-6xl 3xl:text-6xl font-bold text-gray-400 dark:text-white marquee-content">
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
                                    className="mb-4 xs:text-2xl md:text-4xl 2xl:text-8xl 3xl:text-9xl font-bold xs:py-2 md:py-10 dark:text-slate-100"
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
                                    <Button size={"lg"} className="bg-[#2C3E50] hover:bg-[#415263] text-white px-6 xs:py-2  rounded-md text-lg ">
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
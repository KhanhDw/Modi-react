import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import modiservicesImage from "/images/modiservices.jpg"
import { TiArrowSortedDown } from "react-icons/ti";
import "../assets/css/MarqueeBanner.css"
import { useLanguage } from '../contexts/LanguageContext';
import PricingPage from '../components/home/pricingPage';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';


function HomePage({ activeSidebarHeader }) {
    return (
        <div className={`${activeSidebarHeader ? 'overflow-hidden' : ''}  w-full h-full md:p-4 mx-auto flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32`}>
            <BannerSilder />
            <BaseModi />
            <ThreeCardBusiness />
            <ServiceModi />
            <BenefitBusiness />
            <PricingPage />
            <BannerText />
            <Customer />
        </div>
    );
}

function BannerSilder() {


    const { t } = useLanguage();
    const bannerImagesAndContent = [
        {
            title: t("home.banner.goal.title"),
            img: "/images/banner3.jpg",
            description: t("home.banner.goal.description"),
            buttonText: t("home.banner.goal.buttonText"),
        },
        {
            title: t("home.banner.coreValues.title"),
            img: "/images/banner2.jpg",
            description: t("home.banner.coreValues.description"),
            buttonText: t("home.banner.coreValues.buttonText"),
        },
    ];



    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [showNext, setShowNext] = useState(false);

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.8 });

    useEffect(() => {
        const interval = setInterval(() => {
            // Hiện ảnh kế tiếp phía dưới ảnh hiện tại
            setShowNext(true);

            // Sau 1s mới đổi index chính
            const timeout = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % bannerImagesAndContent.length);
                setNextIndex((prev) => (prev + 1) % bannerImagesAndContent.length);
                setShowNext(false);
            }, 1000); // thời gian mờ ảnh

            return () => clearTimeout(timeout);
        }, 10000); // tổng 10s mỗi ảnh

        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <motion.div ref={ref}
                initial={{ opacity: 0 }} // Trạng thái ban đầu (mờ và dịch chuyển xuống 50px)
                animate={isInView ? { opacity: 1 } : {}} // Trạng thái khi hoàn thành (hiển thị và trở về vị trí ban đầu)
                transition={{ duration: 1.5, ease: 'easeOut' }} // Thời gian và kiểu chuyển động
                className={`relative h-[80vh] w-full  md:rounded-[40px] overflow-hidden mb-10`}>
                {/* Ảnh hiện tại - đây là cái người dùng nhìn thấy*/}
                <AnimatePresence >
                    <motion.img
                        key={`current-image-${currentIndex}`}
                        src={bannerImagesAndContent[currentIndex].img}
                        initial={{ opacity: 1, filter: 'brightness(100%)', }}
                        animate={isInView ? { opacity: showNext ? 0 : 1, filter: showNext ? 'brightness(100%)' : 'brightness(50%)' } : {}}
                        transition={{ duration: 1 }}
                        className="absolute top-0 left-0 w-full h-full object-cover  md:rounded-[40px] z-20 xl:border-2 xl:border-gray-300 "
                        alt="banner"
                    />
                    {/* --- Nội dung nằm trên ảnh --- */}
                    <div className="relative top-0 left-0 w-full h-full " >
                        {/* nội dung nằm trên - đây là cái người dùng nhìn thấy*/}

                        <AnimatePresence >
                            <motion.div
                                key={`content-${currentIndex}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: showNext ? 0 : 1, filter: showNext ? 'blur(0px)' : 'blur(0px)', y: 0 } : {}}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2, }}
                                className="absolute inset-0 z-30 flex flex-col items-start justify-center text-white bg-transparent sm:px-12 md:px-20 md:pl-20 lg:pl-40 2xl:w-2/3" // z-index cao hơn ảnh
                            >
                                <div className="flex flex-col items-start justify-center gap-2 p-4 ">
                                    <motion.h2
                                        key={`title-${currentIndex}`}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.8 }}
                                        className="mb-4 xs:text-2xl md:text-7xl  2xl:text-7xl font-bold bg-transparent text-start ">
                                        {bannerImagesAndContent[currentIndex].title}
                                    </motion.h2>
                                    <motion.p
                                        key={`desc-${currentIndex}`}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        className="mb-8 w-full xs:text-justify xs:text-sm md:text-md md:text-start md:text-xl 2xl:text-3xl">
                                        {bannerImagesAndContent[currentIndex].description}
                                    </motion.p>
                                    <motion.button
                                        key={`btncontent-${currentIndex}`}
                                        initial={{ opacity: 0, }}
                                        animate={isInView ? { opacity: 1, } : {}}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="px-6 py-3 text-xl font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-blue-700 md:text-xl  2xl:text-2xl">
                                        <Link to={"/about"}>{bannerImagesAndContent[currentIndex].buttonText}</Link>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        {/* nội dung nằm dưới */}
                        <AnimatePresence >
                            <motion.div
                                key={`content-${currentIndex}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: showNext ? 1 : 0, filter: showNext ? 'blur(500px)' : 'blur(0px)', y: 0 } : {}}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2, }}
                                className="absolute inset-0 z-30 flex flex-col items-start justify-center pl-40 text-white bg-transparent " // z-index cao hơn ảnh
                            >
                                <div className="flex flex-col items-start justify-center gap-2 p-4 ">
                                    <motion.h2
                                        key={`title-${currentIndex}`}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.8 }}
                                        className="mb-4 xs:text-2xl md:text-5xl font-bold bg-transparent text-start ">
                                        {bannerImagesAndContent[currentIndex].title}
                                    </motion.h2>
                                    <motion.p
                                        key={`desc-${currentIndex}`}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        className="mb-8 w-2xl text-md text-start">
                                        {bannerImagesAndContent[currentIndex].description}
                                    </motion.p>
                                    <motion.button
                                        key={`btncontent-${currentIndex}`}
                                        initial={{ opacity: 0, }}
                                        animate={isInView ? { opacity: 1, } : {}}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        className="text-xl font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-blue-700">
                                        <Link to={"/about"} className='px-6 py-3'>{bannerImagesAndContent[currentIndex].buttonText}</Link>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {/* Ảnh kế tiếp (ẩn dưới, chỉ hiện khi showNext=true) */}
                    <motion.img
                        key={`next-image-${nextIndex}`}
                        src={bannerImagesAndContent[nextIndex].img}
                        initial={{ opacity: 0, filter: 'blur(5px)' }}
                        animate={isInView ? { opacity: showNext ? 1 : 0, filter: showNext ? 'blur(0px)' : 'blur(0px)' } : {}}
                        transition={{ duration: 1 }}
                        className="absolute top-0 left-0 w-full h-full object-cover md:rounded-[40px] z-10"
                        alt="next banner"
                    />
                </AnimatePresence>

                {/* dot change background */}
                <div className='absolute right-0 flex md:flex-col items-center justify-center h-[80vh] md:mx-4 md:transform xs:-translate-y-1/2 z-51 xs:bottom md:top-1/2 xs:gap-1 md:gap-2'>

                    {bannerImagesAndContent.map((item, index) => {
                        return (
                            <AnimatePresence mode="wait" key={`btn-banner-${index}`}>
                                <motion.button
                                    initial={{ opacity: 1, }}
                                    animate={isInView ? { opacity: 1, } : {}}
                                    exit={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`${currentIndex === index ? "bg-gray-100" : "bg-gray-600"} xs:h-2 md:w-4 xs:w-2 md:h-4 mb-3  rounded-full cursor-pointer`}></motion.button>
                            </AnimatePresence>)
                    })}
                </div>
            </motion.div>

        </>
    )
}

function BaseModi() {
    const { t } = useLanguage();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.8 });
    return (
        <div ref={ref} className="flex flex-col items-center justify-center pb-10">
            <div className="w-3/4">
                {/* Tiêu đề: phóng từ nhỏ đến lớn */}
                <AnimatePresence mode='wait'>
                    <motion.p
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`mb-4 xs:text-xl md:text-4xl 3xl:text-6xl font-bold text-center dark:text-white text-black `}
                    >
                        {t("home.baseModi.title")}
                    </motion.p>
                </AnimatePresence>
                {/* Nội dung: trượt lên từ dưới */}
                <AnimatePresence mode='wait'>
                    <motion.p
                        initial={{ y: 40, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="text-center xs:text-sm md:text-md 3xl:text-xl dark:text-white text-black"
                    >
                        {t("home.baseModi.description")}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
}

function ThreeCardBusiness() {

    const { t } = useLanguage();

    const cards = [
        {
            img: './images/office(1).png',
            title: t("home.threeCards.largeEnterprise.title"),
            content: t("home.threeCards.largeEnterprise.content"),
        },
        {
            img: './images/office(2).png',
            title: t("home.threeCards.businessHousehold.title"),
            content: t("home.threeCards.businessHousehold.content"),
        },
        {
            img: './images/office(3).png',
            title: t("home.threeCards.sme.title"),
            content: t("home.threeCards.sme.content"),
        }
    ]


    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.8 });
    return (
        <div ref={ref} className="flex xs:flex-col md:flex-row items-center justify-center md:gap-2 md:pb-10">
            {cards.map((item, index) => {
                // Chọn animation theo vị trí index
                let initial, animate;
                if (index === 0) {
                    initial = { x: -100, opacity: 0 };
                    animate = { x: 0, opacity: 1 };
                } else if (index === 1) {
                    initial = { scale: 0.8, opacity: 0 };
                    animate = { scale: 1, opacity: 1 };
                } else {
                    initial = { x: 100, opacity: 0 };
                    animate = { x: 0, opacity: 1 };
                }

                return (
                    <motion.div
                        key={index}
                        initial={initial}
                        animate={isInView ? animate : {}}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-start justify-start md:w-1/3  md:p-4 xs:p-3 xs:m-2 bg-gray-200 dark:bg-gray-700 xs:h-fit md:h-fit rounded-2xl"
                    >
                        <div className="flex md:flex-col 3xl:items-start md:items-center justify-between w-full md:gap-1 md:px-1">
                            <img className="w-25" src={item.img} alt={`img-${index}`} />
                            <div className="flex items-center justify-start w-full md:text-xl font-bold text-center 3xl:text-3xl dark:text-white text-black">
                                <p>{item.title}</p>
                            </div>
                        </div>
                        <p className="pb-2 mt-4 text-justify text-gray-700 3xl:text-xl dark:text-white">{item.content}</p>
                    </motion.div>
                );
            })}
        </div>
    );
}

function ServiceModi() {

    const services = [
        {
            id: 1,
            title: "Thiết Kế Website",
            description:
                "Khám phá cách Công ty thiết kế website chuyên nghiệp Cánh Cam giúp khách hàng bán hàng trực tuyến hiệu quả và tạo ấn tượng thương hiệu tốt hơn thông qua chiến lược ưu việt dưới đây.",
            href: "thiet-ke-website.htm",
            imgSrc: "https://www.canhcam.vn/wp-content/uploads/2024/10/wwebdesign-640x640.jpg",
            imgAlt: "Thiết Kế Website",
        },
        {
            id: 2,
            title: "Thiết Kế Website E-Commerce",
            description:
                "Gia tăng doanh số bán hàng trên kênh online cũng như xây dựng vị thế trên thị trường của bạn với những giải pháp thương mại điện tử (TMĐT) hàng đầu. Đó là những gì dịch vụ thiết kế website của Cánh Cam mang lại.",
            href: "e-commerce.htm",
            imgSrc: "https://www.canhcam.vn/wp-content/uploads/2024/08/ecomerce-webdesign-640x640.jpeg",
            imgAlt: "Thiết Kế Website E-Commerce",
        },
        {
            id: 3,
            title: "Thiết Kế App Mobile",
            description:
                "Thiết kế và lập trình chuyên nghiệp các ứng dụng di động và ứng dụng web (MVP), cung cấp các sản phẩm phần mềm phù hợp với nhu cầu chuyển đổi số và trải nghiệm thân thiện với người dùng.",
            href: "thiet-ke-app-mobile.htm",
            imgSrc: "https://www.canhcam.vn/wp-content/uploads/2024/10/wordpress-640x640.jpg",
            imgAlt: "Thiết Kế App Mobile",
        },
        {
            id: 4,
            title: "Sáng Tạo Nội Dung",
            description:
                "Xây dựng nội dung website sáng tạo, thu hút và giữ chân khách hàng hiệu quả, đặc biệt từ khóa, nội dung được tối ưu chuẩn SEO giúp gia tăng thứ hạng trên công cụ tìm kiếm, bởi đội ngũ Copywriter dày dặn kinh nghiệm.",
            href: "sang-tao-noi-dung.htm",
            imgSrc: "https://www.canhcam.vn/wp-content/uploads/2024/10/mobileapp-640x640.jpg",
            imgAlt: "Sáng Tạo Nội Dung",
        },
        {
            id: 5,
            title: "Chiến Dịch Quảng Cáo",
            description:
                "Chiến dịch quảng cáo bám sát mục tiêu kinh doanh sẽ mang bạn đến gần khách hàng tiềm năng một cách nhanh chóng.",
            href: "chien-dich-quang-cao.htm",
            imgSrc: "https://www.canhcam.vn/wp-content/uploads/2024/08/onlinemarketing-640x640.jpg",
            imgAlt: "Chiến Dịch Quảng Cáo",
        },
    ];


    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const handleMouseEnter = (id) => {
        if (!isMobileView) {
            setHoveredItemId(id);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobileView) {
            setHoveredItemId(null);
        }
    };

    const getItemWidth = (id) => {
        if (hoveredItemId === null) {
            return "20%";
        }
        if (hoveredItemId === id) {
            return "40%";
        }
        return "15%";
    };

    return (
        <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 bg-neutral-50 dark:bg-transparent w-full rounded-3xl">
            <div className="container mx-auto text-center flex flex-col gap-4 xs:gap-5 sm:gap-6 px-4 xs:px-5 sm:px-6 md:px-8 relative z-20">
                <h3 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-bold text-black dark:text-[#F3F4F6]">
                    Dịch vụ
                </h3>
                <div className="text-lg xs:text-xl sm:text-2xl text-gray-600 dark:text-[#D1D5DB]">
                    <p>Cánh Cam Agency chuyên cung cấp đầy đủ các dịch vụ được thiết kế riêng cho doanh nghiệp của bạn.</p>
                </div>
            </div>

            <div className="relative z-20 mt-6 xs:mt-8 sm:mt-10 md:mt-12 container mx-auto w-full">
                {isMobileView ? (
                    <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 px-4 sm:px-6 md:px-0 scrollbar-hide">
                        {services.map((service) => (
                            <div key={service.id} className="flex-shrink-0 w-full snap-center px-2">
                                <div className="item-service-main relative overflow-hidden rounded-lg shadow-lg h-[400px] sm:h-[450px] md:h-auto">
                                    <a
                                        className="img img-full full-link block w-full h-full"
                                        href={service.href}
                                        title={service.title}
                                    >
                                        <img
                                            src={service.imgSrc || "/placeholder.svg"}
                                            alt={service.imgAlt}
                                            className="w-full h-full object-cover xs:opacity-50 md:opacity-100"
                                        />
                                    </a>
                                    <div className="content absolute bottom-0 left-0 right-0 px-4 xs:px-6 sm:px-8 md:px-10 py-4 xs:py-6 sm:py-7 md:py-8 text-white z-10 bg-gradient-to-t from-black/80 dark:from-[#1F2937]/90 to-transparent">
                                        <h4 className="text-xl xs:text-xs sm:text-xl md:text-2xl font-bold mb-2 xs:mb-3 sm:mb-4">
                                            {service.title}
                                        </h4>
                                        <div className="wrap-desc">
                                            <div className="desc-service text-base xs:text-sm sm:text-sm md:text-xl mb-2 xs:mb-3 sm:mb-4 font-light">
                                                <p>{service.description}</p>
                                            </div>
                                            <a
                                                className="inline-flex items-center justify-center px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-full  text-white hover:bg-[#3B82F6] hover:text-[#1F2937] dark:hover:bg-[#3B82F6] dark:hover:text-[#F3F4F6] transition-colors"
                                                href={service.href}
                                                title={`Tìm hiểu thêm - ${service.title}`}
                                            >
                                                Tìm hiểu thêm
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex w-full h-[450px] overflow-hidden rounded-lg shadow-lg">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="item-service-main relative overflow-hidden cursor-pointer"
                                onMouseEnter={() => handleMouseEnter(service.id)}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                    width: getItemWidth(service.id),
                                    transition: "width 0.5s ease-in-out",
                                }}
                            >
                                <a className="img img-full full-link block w-full h-full" href={service.href} title={service.title}>
                                    <img
                                        src={service.imgSrc || "/placeholder.svg"}
                                        alt={service.imgAlt}
                                        className="w-full h-full object-cover"
                                    />
                                </a>
                                <div className=" content absolute bottom-0 left-0 right-0 px-6 md:px-10 py-8 text-white z-10 bg-gradient-to-t from-black/80 dark:from-[#1F2937]/90 to-transparent">
                                    <h4 className="text-2xl 3xl:text-5xl  font-bold mb-4 ">{service.title}</h4>
                                    <div
                                        className={`wrap-desc transition-all duration-300 ease-in-out ${hoveredItemId === service.id ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                                            }`}
                                    >
                                        <div className="desc-service text-xl mb-4 font-light">
                                            <p>{service.description}</p>
                                        </div>
                                        <a
                                            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white text-white hover:bg-[#3B82F6] hover:text-[#1F2937] dark:hover:bg-[#3B82F6] dark:hover:text-[#F3F4F6] transition-colors"
                                            href={service.href}
                                            title={`Tìm hiểu thêm - ${service.title}`}
                                        >
                                            Tìm hiểu thêm
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
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


function BenefitBusiness() {
    const { t } = useLanguage();

    const benefitBusiness = [
        {
            title: t("home.benefit.forBusiness.title"),
            content: [
                t("home.benefit.forBusiness.content.0"),
                t("home.benefit.forBusiness.content.1"),
                t("home.benefit.forBusiness.content.2"),
                t("home.benefit.forBusiness.content.3"),

            ]
        },
        {
            title: t("home.benefit.forConsumer.title"),
            content: [
                t("home.benefit.forConsumer.content.0"),
                t("home.benefit.forConsumer.content.1"),
                t("home.benefit.forConsumer.content.2"),
                t("home.benefit.forConsumer.content.3"),

            ]
        }
    ]

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.8 });
    const [hovered, setHovered] = useState(false);
    const [showContent, setShowContent] = useState(false);
    return (
        <div ref={ref} className='flex items-center justify-center w-full mx-auto md:gap-2 xs:pb-1 md:pb-10 xs:px-2'>
            {/* Left Images */}
            <div className='flex items-center justify-end md:w-1/2 xs:hidden md:flex md:gap-3 '>
                {/* Image 1 - Từ trái sang phải */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8 }}
                    className='flex md:w-1/2  overflow-hidden xs:h-140 md:h-140 3xl:h-180 rounded-2xl shadow-sm shadow-black'
                >
                    <img src='/images/company.jpg' className='object-cover w-full h-full ' />
                </motion.div>

                {/* Image 2 + 3 */}
                <div className='flex flex-col w-1/2 gap-3 h-140 3xl:h-180'>
                    {/* Image 2 - Trên xuống */}
                    <motion.img
                        initial={{ y: -80, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        src='/images/business.jpg'
                        className='object-cover w-full h-full overflow-hidden rounded-2xl shadow-sm shadow-black'
                    />

                    {/* Image 3 - Dưới lên */}
                    <motion.img
                        initial={{ y: 80, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        src='/images/Benefits.jpg'
                        className='object-cover w-full h-full overflow-hidden rounded-2xl shadow-sm shadow-black'
                    />
                </div>
            </div>

            {/* Right Text */}
            <div className='flex flex-col md:items-start xs:items-center justify-center md:w-1/2 md:pl-10 xs:px-5 '>
                {/* Title - phải sang trái */}
                <motion.p
                    initial={{ x: 100, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8 }}
                    className='mb-10 md:text-3xl xs:text-xl 3xl:text-6xl font-bold text-center dark:text-white text-black'
                >
                    {t("home.benefit.mainTitle")}
                </motion.p>

                {/* Danh sách lợi ích */}
                {benefitBusiness.map((item, index) => (
                    <div key={index} className='mb-10'>
                        <AnimatePresence mode='wait'>
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 1 }}
                                whileHover={{ scale: 1.05 }}
                                onAnimationComplete={() => setShowContent(true)}
                                className='flex items-center justify-start xs:gap-0 mb-2 xs:text-lg  md:text-md 3xl:text-3xl font-bold text-center transition-all duration-300 cursor-pointer'
                                type='button'
                            >
                                <TiArrowSortedDown
                                    className={`dark:text-white text-black transition-all duration-300 ${hovered ? 'text-green-600 border-1 border-black rounded-2xl' : ''}`}
                                />

                                {/* Title từ dưới lên */}
                                <span className="dark:text-white text-black">
                                    {item.title}
                                </span>
                            </motion.button>
                        </AnimatePresence>
                        {/* Nội dung ul hiện ra */}
                        <AnimatePresence mode='wait'>
                            {showContent && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                >
                                    <ul>
                                        {item.content.map((contentItem, subIndex) => (
                                            <li key={subIndex} className='py-1 pl-1 list-disc 3xl:text-xl dark:text-white text-black'>
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


function BannerText() {
    const { t } = useLanguage();
    return (

        <div className="w-full marquee">
            <div className="xs:text-2xl md:text-6xl 3xl:text-6xl font-bold text-gray-400 marquee-content dark:text-white ">
                {t("home.bannerText")}
            </div>
        </div>
    )
}


function Customer() {
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
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="mb-4 text-justify text-gray-700 dark:text-gray-300 md:text-sm 2xl:text-lg 3xl:text-3xl xs:py-2 md:py-5"
                                >
                                    {t("home.customer.description")}
                                </motion.p>
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
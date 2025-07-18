import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import modiservicesImage from "/images/modiservices.jpg"
import { TiArrowSortedDown } from "react-icons/ti";
import "../assets/css/MarqueeBanner.css"

const bannerImagesAndContent = [
    {
        title: "Mục tiêu của Modi",
        img: '/images/banner1.jpg',
        description: "Mộc Điền đặt mục tiêu trở thành đối tác chiến lược tin cậy trong hành trình chuyển đổi số của doanh nghiệp Việt. Chúng tôi không chỉ cung cấp các giải pháp công nghệ hiện đại mà còn đồng hành cùng doanh nghiệp từ những bước đầu trong việc xây dựng hình ảnh thương hiệu, phát triển hệ thống vận hành và tối ưu hiệu quả kinh doanh.",
        buttonText: "Xem thêm"
    },
    {
        title: "Giá trị cốt lõi",
        img: '/images/banner2.jpg',
        description: "Tại Mộc Điền, chúng tôi cam kết mang đến những giải pháp công nghệ tiên tiến, đột phá, luôn đặt lợi ích và sự phát triển bền vững của khách hàng lên hàng đầu. Sự minh bạch, uy tín và không ngừng học hỏi, đổi mới là kim chỉ nam cho mọi hoạt động của chúng tôi.",
        buttonText: "Tìm hiểu thêm"
    }
];

const cards = [
    {
        img: './images/office(1).png',
        title: 'Doanh nghiệp lớn',
        content: 'Trong bối cảnh chuyển đổi số và yêu cầu tối ưu hóa quy trình kinh doanh ngày nay, Modi mang lại những giải pháp vượt trội cho các doanh nghiệp lớn, đặc biệt trong việc quản lý và phát triển các kênh thương mại điện tử và các chiến lược kinh doanh số...'
    },
    {
        img: './images/office(2).png',
        title: 'Hộ kinh doanh',
        content: 'Đối với hộ kinh doanh, việc duy trì và phát triển hoạt động trong môi trường cạnh tranh hiện nay đòi hỏi một giải pháp quản lý linh hoạt và tiết kiệm chi phí. Modi chính là công cụ lý tưởng để các hộ kinh doanh nâng cao hiệu quả hoạt động, tối ưu quy trình và gia tăng cơ hội tiếp cận khách hàng trong thời đại công nghệ'
    },
    {
        img: './images/office(3).png',
        title: 'Doanh nghiệp vừa và nhỏ',
        content: 'Modi mang đến những giải pháp hiệu quả cho doanh nghiệp nhỏ và vừa, giúp họ tối ưu hóa các quy trình kinh doanh, tiết kiệm chi phí và nâng cao khả năng cạnh tranh trong thị trường số ngày càng phát triển. '
    }
]

const services = [
    { title: "Thiết kế website" },
    { title: "Marketing sản phẩm" },
    { title: "?" },
    { title: "?" },
    { title: "?" },
    { title: "?" },
    { title: "?" },
    { title: "?" },
]

const benefitBusiness = [
    {
        title: "Lợi ích cho doanh nghiệp",
        content: [
            "Nâng tầm giá trị doanh nghiệp",
            "Tăng độ uy tín của doanh nghiệp đối với người tiêu dùng",
            "Được hỗ trợ xúc tiến thương mại, đầu ra bán sản phẩm",
            "Được hỗ trợ về tất cả các kênh bán hàng truyền thống, online,...",
        ]
    },
    {
        title: "Lợi ích cho người tiêu dùng",
        content: [
            "Tiết kiệm thời gian và chi phí",
            "Tăng độ nhận diện thương hiệu với website chuyên nghiệp",
            "Nâng cao hiệu quả kinh doanh",
            "Linh hoạt mở rộng theo nhu cầu",
            "Được đồng hành lâu dài, với đội ngũ kỹ thuật tận tâm và hỗ trợ",
        ]
    }
]

const customerCards = [
    "Khách hàng ?",
    "Khách hàng ?",
    "Khách hàng ?",
    "Khách hàng ?",
    "Khách hàng ?",
    "Khách hàng ?",
]

function HomePage() {
    return (
        <div className='w-full h-full p-4 '>
            <BannerSilder />
            <BaseModi />
            <ThreeCardBusiness />
            <ServiceModi />
            <BenefitBusiness />
            <BannerText />
            <Customer />
        </div>
    );
}

function BannerSilder() {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [showNext, setShowNext] = useState(false);


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
            <motion.div
                initial={{ opacity: 0 }} // Trạng thái ban đầu (mờ và dịch chuyển xuống 50px)
                animate={{ opacity: 1 }} // Trạng thái khi hoàn thành (hiển thị và trở về vị trí ban đầu)
                transition={{ duration: 1.5, ease: 'easeOut' }} // Thời gian và kiểu chuyển động
                className={`relative h-[80vh] w-full rounded-[60px] overflow-hidden mb-10`}>
                {/* Ảnh hiện tại - đây là cái người dùng nhìn thấy*/}
                <AnimatePresence mode="wait">
                    <motion.img
                        key={`current-image-${currentIndex}`}
                        src={bannerImagesAndContent[currentIndex].img}
                        initial={{ opacity: 1, filter: 'brightness(100%)', }}
                        animate={{ opacity: showNext ? 0 : 1, filter: showNext ? 'brightness(100%)' : 'brightness(50%)' }}
                        transition={{ duration: 1 }}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-[60px] z-20"
                        alt="banner"
                    />

                    {/* --- Nội dung nằm trên ảnh --- */}
                    <div className="relative top-0 left-0 w-full h-full border-red-600" >
                        {/* nội dung nằm trên - đây là cái người dùng nhìn thấy*/}

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`content-${currentIndex}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: showNext ? 0 : 1, filter: showNext ? 'blur(0px)' : 'blur(0px)', y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2, }}
                                className="absolute inset-0 z-30 flex flex-col items-start justify-center pl-40 text-white bg-transparent " // z-index cao hơn ảnh
                            >
                                <div className="flex flex-col items-start justify-center gap-2 p-4 ">
                                    <motion.h2
                                        key={`title-${currentIndex}`}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.8 }}
                                        className="mb-4 text-5xl font-bold bg-transparent text-start ">
                                        {bannerImagesAndContent[currentIndex].title}
                                    </motion.h2>
                                    <motion.p
                                        key={`desc-${currentIndex}`}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        className="max-w-2xl mb-8 text-md text-start">
                                        {bannerImagesAndContent[currentIndex].description}
                                    </motion.p>
                                    <motion.button
                                        key={`desc-${currentIndex}`}
                                        initial={{ opacity: 0, }}
                                        animate={{ opacity: 1, }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="px-6 py-3 text-xl font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-blue-700">
                                        {bannerImagesAndContent[currentIndex].buttonText}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        {/* nội dung nằm dưới */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`content-${currentIndex}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: showNext ? 1 : 0, filter: showNext ? 'blur(500px)' : 'blur(0px)', y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2, }}
                                className="absolute inset-0 z-30 flex flex-col items-start justify-center pl-40 text-white bg-transparent " // z-index cao hơn ảnh
                            >
                                <div className="flex flex-col items-start justify-center gap-2 p-4 ">
                                    <motion.h2
                                        key={`title-${currentIndex}`}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.8 }}
                                        className="mb-4 text-5xl font-bold bg-transparent text-start ">
                                        {bannerImagesAndContent[currentIndex].title}
                                    </motion.h2>
                                    <motion.p
                                        key={`desc-${currentIndex}`}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        className="max-w-2xl mb-8 text-md text-start">
                                        {bannerImagesAndContent[currentIndex].description}
                                    </motion.p>
                                    <motion.button
                                        key={`desc-${currentIndex}`}
                                        initial={{ opacity: 0, }}
                                        animate={{ opacity: 1, }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        className="px-6 py-3 text-xl font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-blue-700">
                                        {bannerImagesAndContent[currentIndex].buttonText}
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
                        animate={{ opacity: showNext ? 1 : 0, filter: showNext ? 'blur(0px)' : 'blur(0px)' }}
                        transition={{ duration: 1 }}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-[60px] z-10"
                        alt="next banner"
                    />
                </AnimatePresence>

                <div className='absolute right-0 flex flex-col items-center justify-center h-[80vh] mx-4 transform -translate-y-1/2  z-51 top-1/2'>

                    {bannerImagesAndContent.map((item, index) => {
                        return (
                            <AnimatePresence mode="wait">
                                <motion.button
                                    key={`desc-${currentIndex}`}
                                    initial={{ opacity: 1, }}
                                    animate={{ opacity: 1, }}
                                    exit={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`${currentIndex === index ? "bg-gray-100" : "bg-gray-600"} w-4 h-4 mb-3  rounded-full cursor-pointer`}></motion.button>
                            </AnimatePresence>)
                    })}
                </div>
            </motion.div>

        </>
    )
}

function BaseModi() {
    return (
        <div className="flex flex-col items-center justify-center pb-10">
            <div className="w-1/2">
                {/* Tiêu đề: phóng từ nhỏ đến lớn */}
                <AnimatePresence mode='wait'>
                    <motion.p
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="mb-4 text-4xl font-bold text-center"
                    >
                        Nền tảng Modi
                    </motion.p>
                </AnimatePresence>
                {/* Nội dung: trượt lên từ dưới */}
                <AnimatePresence mode='wait'>
                    <motion.p
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="text-center"
                    >
                        Mộc Điền xây dựng nền tảng công nghệ linh hoạt, dễ tùy biến, tích hợp quản lý bán hàng, nội dung và khách hàng. Ưu tiên bảo mật, tốc độ và khả năng mở rộng, giúp doanh nghiệp vận hành hiệu quả và phát triển bền vững trong kỷ nguyên số.
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
}

function ThreeCardBusiness() {
    return (
        <div className="flex items-center justify-center gap-5 pb-10">
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
                        animate={animate}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-start justify-start w-1/4 p-4 bg-gray-100 h-80 rounded-2xl"
                    >
                        <div className="flex items-center justify-between w-full gap-2 px-6">
                            <img className="w-25" src={item.img} alt={`img-${index}`} />
                            <div className="flex items-center justify-start w-full text-xl font-bold text-center">
                                <p>{item.title}</p>
                            </div>
                        </div>
                        <p className="mt-4">{item.content}</p>
                    </motion.div>
                );
            })}
        </div>
    );
}

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function ServiceModi() {
    // Random thứ tự delay cho mỗi lần render
    const randomizedIndexes = useMemo(() => shuffleArray(services.map((_, i) => i)), []);

    return (
        <div className="pb-20">
            <div className="relative flex flex-col items-center justify-center w-full gap-4 py-20 rounded-2xl">
                <div
                    style={{
                        backgroundImage: `url(${modiservicesImage})`,
                    }}
                    className="absolute w-full h-full bg-center bg-no-repeat bg-cover brightness-40 rounded-2xl"
                />
                <AnimatePresence mode='await'>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative flex flex-col items-center justify-center gap-4"
                    >
                        <p className="text-4xl font-bold text-center text-white">Dịch vụ Modi</p>
                    </motion.div>
                </AnimatePresence>
                <AnimatePresence mode='await'>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                        className="relative w-[460px] text-center text-white font-semibold"
                    >
                        Nền tảng kết nối, cung cấp dịch vụ toàn diện, đồng hành cùng doanh nghiệp Việt từ khởi nghiệp đến xuất khẩu quốc tế
                    </motion.p>
                </AnimatePresence>
                <div className="flex items-center justify-center w-full gap-4 pt-10">
                    <div className="relative grid grid-cols-4 gap-8">
                        {services.map((item, index) => {
                            const delay = randomizedIndexes[index] * 0.2;

                            return (
                                <AnimatePresence mode='await'>
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay }}
                                        className="backdrop-blur-md bg-black/20"
                                    >
                                        <p className="px-5 py-6 text-2xl font-bold text-center text-white border-2 border-white rounded-2xl">
                                            {item.title}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function BenefitBusiness() {
    const [hovered, setHovered] = useState(false);
    const [showContent, setShowContent] = useState(false);
    return (
        <div className='flex items-center justify-center w-full gap-5 pb-10 px-30'>
            {/* Left Images */}
            <div className='flex items-center justify-center w-1/2 gap-5'>
                {/* Image 1 - Từ trái sang phải */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className='flex w-1/2 overflow-hidden h-140 rounded-2xl'
                >
                    <img src='/images/company.jpg' className='object-cover w-full h-full' />
                </motion.div>

                {/* Image 2 + 3 */}
                <div className='flex flex-col w-1/2 gap-5 h-140'>
                    {/* Image 2 - Trên xuống */}
                    <motion.img
                        initial={{ y: -80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        src='/images/business.jpg'
                        className='object-cover w-full h-full overflow-hidden rounded-2xl'
                    />

                    {/* Image 3 - Dưới lên */}
                    <motion.img
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        src='/images/Benefits.jpg'
                        className='object-cover w-full h-full overflow-hidden rounded-2xl'
                    />
                </div>
            </div>

            {/* Right Text */}
            <div className='flex flex-col items-start justify-center w-1/2 pl-20'>
                {/* Title - phải sang trái */}
                <motion.p
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className='mb-10 text-4xl font-bold text-center'
                >
                    Lợi ích từ Modi
                </motion.p>

                {/* Danh sách lợi ích */}
                {benefitBusiness.map((item, index) => (
                    <div key={index} className='mb-10'>
                        <AnimatePresence mode='wait'>
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                                whileHover={{ scale: 1.05 }}
                                onAnimationComplete={() => setShowContent(true)}
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                                className='flex items-center justify-start gap-2 mb-2 text-2xl font-bold text-center transition-all duration-300 cursor-pointer'
                                type='button'
                            >
                                <TiArrowSortedDown
                                    className={`transition-all duration-300 ${hovered ? 'text-green-600 border-1 border-black rounded-2xl' : ''}`}
                                />

                                {/* Title từ dưới lên */}
                                <span>
                                    {item.title}
                                </span>
                            </motion.button>
                        </AnimatePresence>
                        {/* Nội dung ul hiện ra */}
                        <AnimatePresence mode='wait'>
                            {showContent && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                >
                                    <ul>
                                        {item.content.map((contentItem, subIndex) => (
                                            <li key={subIndex} className='py-1 pl-1 list-disc'>
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

// các gói dịch vụ chính của công ty?
function ServiceMain() {}

function BannerText() {
    return (

        <div class="marquee w-full ">
            <div class="marquee-content text-6xl font-bold text-gray-400">
                Modi tận tâm và đồng hành cùng bạn!
            </div>

        </div>
    )
}

function Customer() {

    return (
        <div>
            <div className="flex flex-col items-center justify-center w-full gap-10 p-6 px-20 mb-10 bg-white rounded-lg md:flex-row">
                {/* Hình ảnh khách hàng */}
                <motion.div
                    initial={{ x: -100, scale: 0.8, opacity: 0 }}
                    animate={{ x: 0, scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="p-4 overflow-hidden shadow-sm md:w-1/3 shadow-black rounded-2xl"
                >
                    <img src="./images/customer-support.jpg" alt="Hỗ trợ khách hàng" className="rounded-lg" />
                </motion.div>

                {/* Nội dung */}
                <div className="p-4 md:w-1/2">
                    {/* Tiêu đề */}
                    <motion.h2
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 120 }}
                        className="mb-4 text-4xl font-bold text-center"
                    >
                        Khách hàng
                    </motion.h2>

                    {/* Mô tả */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mb-4 text-justify text-gray-700"
                    >
                        Chúng tôi luôn lắng nghe ý kiến khách hàng để hoàn thiện, nâng cao chất lượng dịch vụ trong suốt hành trình mua sắm của quý khách. Chúng tôi luôn sẵn sàng hỗ trợ quý khách trong việc mua sắm, tư vấn, giải đáp thắc mắc hoặc khiếu nại của quý khách. Hãy liên hệ với chúng tôi để được hỗ trợ tốt nhất!
                    </motion.p>

                    {/* Grid thẻ khách hàng */}
                    <div className="grid grid-cols-2 gap-4">
                        {customerCards.map((text, index) => (
                            <motion.div
                                key={index}
                                initial={{ rotateX: 90, opacity: 0 }}
                                animate={{ rotateX: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                                className="p-4 text-center bg-gray-100 rounded-lg shadow-md shadow-gray-300"
                            >
                                {text}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;

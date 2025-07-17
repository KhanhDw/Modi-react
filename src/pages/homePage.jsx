import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import modiservicesImage from "/images/modiservices.jpg"
import { TiArrowSortedDown } from "react-icons/ti";
import "../assets/css/MarqueeBanner.css"

const images = [
    '/images/banner1.jpg',
    '/images/banner2.jpg',
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

function HomePage() {
    return (
        <div className='h-full w-full p-4 '>
            <BannerSilder />
            <BaseModi />
            <ThreeCardBusiness />
            <ServiceModi />
            <BenefitBusiness />
            <BannerText/>
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
                setCurrentIndex((prev) => (prev + 1) % images.length);
                setNextIndex((prev) => (prev + 1) % images.length);
                setShowNext(false);
            }, 1000); // thời gian mờ ảnh

            return () => clearTimeout(timeout);
        }, 5000); // tổng 5s mỗi ảnh

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }} // Trạng thái ban đầu (mờ và dịch chuyển xuống 50px)
                animate={{ opacity: 1 }} // Trạng thái khi hoàn thành (hiển thị và trở về vị trí ban đầu)
                transition={{ duration: 1.5, ease: 'easeOut' }} // Thời gian và kiểu chuyển động
                className={`h-[80vh] w-full rounded-4xl overflow-hidden`}>
                {/* Ảnh hiện tại */}
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: showNext ? 0 : 1 }}
                    transition={{ duration: 1 }}
                    className="absolute top-0 left-0 w-full h-[80%] p-4 object-cover rounded-[60px] z-20"
                    alt="banner"
                />

                {/* Ảnh kế tiếp (ẩn dưới, chỉ hiện khi showNext=true) */}
                <motion.img
                    key={nextIndex}
                    src={images[nextIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showNext ? 1 : 0 }}
                    transition={{ duration: 1 }}
                    className="absolute top-0 left-0 w-full h-[80%] p-4 object-cover rounded-[60px] z-10"
                    alt="next banner"
                />
            </motion.div>
        </>
    )
}

function BaseModi() {

    return (<>
        <div className='flex items-center justify-center flex-col pb-10'>
            <div className='w-1/2'>
                <p className='text-4xl font-bold text-center mb-4'>Nền tảng Modi</p>
                <p className='text-center'>Mộc Điền xây dựng nền tảng công nghệ linh hoạt, dễ tùy biến, tích hợp quản lý bán hàng, nội dung và khách hàng. Ưu tiên bảo mật, tốc độ và khả năng mở rộng, giúp doanh nghiệp vận hành hiệu quả và phát triển bền vững trong kỷ nguyên số.</p>
            </div>
        </div>
    </>)
}

function ThreeCardBusiness() {

    return (
        <div className=' flex items-center justify-center gap-5 pb-10'>
            {cards.map((item, index) => {
                return (
                    <div key={index} className='flex items-start justify-start flex-col bg-gray-100 w-1/4 h-80 p-4 rounded-2xl'>
                        <div className='flex items-center justify-between w-full px-6 gap-2'>
                            <img className='w-25' src={item.img} alt={`img-${index}`} />
                            <div className='font-bold text-center text-xl flex items-center justify-start w-full'>
                                <p className=''>{item.title}</p>
                            </div>
                        </div>
                        <p>
                            {item.content}
                        </p>
                    </div>
                )
            })
            }
        </div>
    )
}

function ServiceModi() {
    return (
        <div className=' pb-20'>
            <div
                className=' relative flex flex-col items-center justify-center gap-4  w-full py-20  rounded-2xl'>

                <div
                    style={{
                        backgroundImage: `url(${modiservicesImage})`
                    }}
                    className='absolute  brightness-40 bg-cover bg-center bg-no-repeat w-full h-full rounded-2xl'>
                </div>
                <div className='relative flex flex-col items-center justify-center gap-4'>
                    <p className='text-4xl font-bold text-center text-white'>Dịch vụ Modi</p>
                    <p className='w-[460px] text-center text-white font-semibold'>Nền tảng kết nối, cung cấp dịch vụ toàn diện, đồng hành cùng doanh nghiệp Việt từ khởi nghiệp đến xuất khẩu quốc tế</p>
                </div>
                <div className='flex items-center justify-center gap-4 w-full pt-10'>
                    <div className='relative grid grid-cols-4 gap-8 '>
                        {
                            services.map((item, index) => {
                                return (
                                    <div key={index} className='backdrop-blur-md bg-black/20' >
                                        <p className='border-2  border-white text-center px-5 py-6 rounded-2xl text-white font-bold text-2xl'>{item.title}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

function BenefitBusiness() {

    const [hovered, setHovered] = useState(false);

    return (
        <div className='flex items-center justify-center gap-5 pb-10 w-full px-30'>
            <div className='flex items-center justify-center gap-5 w-1/2 '>
                <div className='flex w-1/2 h-140 rounded-2xl  overflow-hidden'>
                    <img src='/images/company.jpg' className='w-full h-full object-cover'></img>
                </div>
                <div className='flex flex-col w-1/2 h-140 gap-5'>
                    <img src='/images/business.jpg' className='w-full h-full rounded-2xl  overflow-hidden object-cover'></img>
                    <img src='/images/Benefits.jpg' className='w-full h-full rounded-2xl  overflow-hidden object-cover'></img>
                </div>
            </div>
            <div className='flex flex-col items-start justify-center w-1/2 pl-20'>
                <p className='text-4xl font-bold text-center mb-10'>Lợi ích từ Modi</p>
                {
                    benefitBusiness.map((item, index) => {
                        return (
                            <div key={index} className='mb-10'>
                                <button onMouseEnter={() => setHovered(false)} onMouseLeave={() => setHovered(false)} className='cursor-pointer flex items-center justify-start text-2xl font-bold text-center gap-2 transition-all duration-300  mb-2' type='button'>
                                    <TiArrowSortedDown className={`transition-all duration-300 ${hovered ? 'text-green-600 border-1 border-black rounded-2xl' : ''}`} />
                                    <span>
                                        {item.title}
                                    </span>
                                </button>
                                <div >
                                    <ul>
                                        {item.content.map((item, index) => {
                                            return (
                                                <li key={index} className='py-1 list-disc pl-1'>
                                                    {item}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

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
            <div class="bg-white rounded-lg shadow-lg p-6 w-full px-20 flex flex-col items-center justify-center gap-10 md:flex-row">
                <div class="md:w-1/3 p-4 shadow-sm shadow-black rounded-2xl overflow-hidden">
                    <img src="./images/customer-support.jpg" alt="Hỗ trợ khách hàng" class="rounded-lg" />
                </div>

                <div class="md:w-1/2 p-4">
                    <h2 class="text-4xl font-bold text-center mb-4">Khách hàng</h2>
                    <p class="text-gray-700 mb-4 text-justify">
                        Chúng tôi luôn lắng nghe ý kiến khách hàng để hoàn thiện, nâng cao chất lượng dịch vụ trong suốt hành trình mua sắm của quý khách. Chúng tôi luôn sẵn sàng hỗ trợ quý khách trong việc mua sắm, tư vấn, giải đáp thắc mắc hoặc khiếu nại của quý khách. Hãy liên hệ với chúng tôi để được hỗ trợ tốt nhất!
                    </p>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gray-100 p-4 rounded-lg text-center shadow-md shadow-gray-300">Khách hàng ?</div>
                        <div class="bg-gray-100 p-4 rounded-lg text-center shadow-md shadow-gray-300">Khách hàng ?</div>
                        <div class="bg-gray-100 p-4 rounded-lg text-center shadow-md shadow-gray-300">Khách hàng ?</div>
                        <div class="bg-gray-100 p-4 rounded-lg text-center shadow-md shadow-gray-300">Khách hàng ?</div>
                        <div class="bg-gray-100 p-4 rounded-lg text-center shadow-md shadow-gray-300">Khách hàng ?</div>
                        <div class="bg-gray-100 p-4 rounded-lg text-center shadow-md shadow-gray-300">Khách hàng ?</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;

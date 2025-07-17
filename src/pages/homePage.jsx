import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

function HomePage() {
    return (
        <div className='h-[3000px] w-full p-4 '>
            <BannerSilder />
            <BaseModi />
            <ThreeCardBusiness />
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
        <div className=' flex items-center justify-center gap-5'>
            {cards.map((item, index) => {
                return (
                    <div className='flex items-start justify-start flex-col bg-gray-100 w-1/4 h-80 p-4 rounded-2xl'>
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

export default HomePage;

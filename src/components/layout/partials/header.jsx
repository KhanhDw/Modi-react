import react, { useState } from 'react'
import { FaUser } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from 'react-router-dom';
import { FaEarthAmericas } from "react-icons/fa6";
function Header({ scrolled }) {
  
  const [acitveIndex, setActiveIndex] = useState(1);
  const [isHoverServices, setIsHoverServices] = useState(false);
  const [isHoverNews, setIsHoverNews] = useState(false);

  return (
    <>
      <div className={`${scrolled ? 'h-20' : 'h-30'}  bg-transparent   w-full flex justify-between items-center px-40 transition-all duration-200`}>
        <div className='flex items-center justify-center h-10 px-3 py-2 overflow-hidden rounded-2xl w-fit'>
          <img src="./logoModi.png" className='h-10 w-fit' alt='logo' />
        </div>
        <div className='flex items-center justify-center text-lg font-bold gap-15 '>
          <Link to={'/'} onClick={() => setActiveIndex(1)} className={`flex justify-center items-center ${acitveIndex === 1 ? 'text-green-400' : 'text-white'}`}>Trang Chủ</Link>

          <Link to={'/about'} onClick={() => setActiveIndex(2)} className={`flex justify-center items-center ${acitveIndex === 2 ? 'text-green-400' : 'text-white'}`}>Về Chúng Tôi</Link>

          <Link to={'/'} onMouseEnter={() => setIsHoverServices(true)} onMouseLeave={() => setIsHoverServices(false)} onClick={() => setActiveIndex(3)} href='#'
            className={` h-full flex justify-center items-center ${acitveIndex === 3 ? 'text-green-400' : 'text-white'}`}>
            Dịch Vụ<IoMdArrowDropdown />
            <div className={` rounded-lg text-black font-normal text-sm absolute translate-x-15 ${scrolled ? 'top-13.5' : 'top-18.5'} transition-all duration-300`}>
              {isHoverServices && <ModalServices />}
            </div>
          </Link>

          <Link to={'/'} onMouseEnter={() => setIsHoverNews(true)} onMouseLeave={() => setIsHoverNews(false)} onClick={() => setActiveIndex(4)} href='#' className={`flex justify-center items-center ${acitveIndex === 4 ? 'text-green-400' : 'text-white'}`}>
            Tin Tức<IoMdArrowDropdown />
            <div className={` rounded-lg text-black font-normal text-sm absolute translate-x-8 ${scrolled ? 'top-13.5':'top-18.5'} transition-all duration-300`}>
              {isHoverNews && <ModalNews />}
            </div>  
          </Link>

          <Link to={'/'} onClick={() => setActiveIndex(5)} href='#' className={`flex justify-center items-center ${acitveIndex === 5 ? 'text-green-400' : 'text-white'}`}>Liên Hệ</Link>
          <Link to={'/recruitment'} onClick={() => setActiveIndex(5)} href='#' className={`flex justify-center items-center ${acitveIndex === 5 ? 'text-green-400' : 'text-white'}`}>Tuyển Dụng</Link>
        </div>
        <div >

          <Link  to={'/about'} className='transtion-all duration-200 p-2 text-white flex justify-center items-center border-2 border-white rounded-3xl gap-2 hover:bg-[#bf263d] hover:border-[#bf263d] cursor-pointer'><FaEarthAmericas /></Link>
          <Link hidden to={'/about'} className='transtion-all duration-200 p-2 text-white flex justify-center items-center border-2 border-white rounded-3xl gap-2 hover:bg-[#bf263d] hover:border-[#bf263d] cursor-pointer'><FaUser />Tài khoản</Link>
        </div>
      </div>

    </>
  )
}

function ModalServices() {

  const services = [
    "Công xạc thục eHub",
    "Thành lập Doanh nghiệp",
    "Mã số mã vạch",
    "Thiết kế Website",
    "Dịch vụ Logistics",
    "Thương mại điện tử Numbala",
    "Quản trị KISCL",
    "Nhận mặt, Bảo bì, Tém chống giả",
    "Quản trị QLC",
    "Đào tạo",
    "Marketing truyền thông",
    "Bảo hiểm",
    "Sở hữu trí tuệ",
  ];

  return (<>
    <div className='bg-white rounded-lg w-fit h-fit '>
      <ul className="max-w-xs p-0 list-none rounded-tr-lg">
        {services.map((service, index) => (
          <li
            key={index}
            className={`${index == 0 ? "rounded-tl-lg" : ''}${index == services.length - 1 ? "rounded-bl-lg" : ''} bg-white px-3 py-1 border-l-4 rounded-tr-lg rounded-br-lg hover:border-blue-500 border-1 border-transparent  hover:translate-x-3 transition-transform duration-200`}
          >
            {service}
          </li>
        ))}
      </ul>
    </div>
  </>);
}

function ModalNews() {

  const news = [
    "Công xạc thục eHub",
    "Thành lập Doanh nghiệp",
    "Mã số mã vạch",
  ];

  return (<>
    <div className='bg-white rounded-lg w-fit h-fit '>
      <ul className="max-w-xs p-0 list-none rounded-tr-lg">
        {news.map((item, index) => (
          <li
            key={index}
            className={`${index == 0 ? "rounded-tl-lg" : ''}${index == news.length - 1 ? "rounded-bl-lg" : ''} bg-white px-3 py-1 border-l-4 rounded-tr-lg rounded-br-lg hover:border-blue-500 border-1 border-transparent  hover:translate-x-3 transition-transform duration-200`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  </>);
}


export default Header

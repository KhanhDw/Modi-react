import react, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { FaEarthAmericas } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";

const MenuHeader = [
  { id: 1, name: 'Trang Chủ', link: '/' },
  { id: 2, name: 'Về Chúng Tôi', link: '/about' },
  { id: 3, name: 'Dịch Vụ', link: '/services' },
  { id: 4, name: 'Tin Tức', link: '/news' },
  { id: 5, name: 'Liên Hệ', link: '/contact' },
  { id: 6, name: 'Tuyển Dụng', link: '/recruitment' },
];


function Header({ scrolled, setActiveScoll_open_HeaderSideBar }) {

  const location = useLocation();

  // const [acitveIndex, setActiveIndex] = useState(() => {
  //   const savedIndex = localStorage.getItem("activeIndex");
  //   return savedIndex ? Number(savedIndex) : 1;
  // });
  const [isHoverServices, setIsHoverServices] = useState(false);
  const [isHoverNews, setIsHoverNews] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // useEffect(() => { 
  //   localStorage.setItem("activeIndex", acitveIndex);
  // }, [acitveIndex]);

  const toggleSidebar = () => {
    const next = !isSidebarOpen;
    setIsSidebarOpen(next);
    setActiveScoll_open_HeaderSideBar(next);
  };

  return (
    <>
      <div className={`${scrolled ? 'h-20' : 'h-30'}  bg-transparent   w-full flex justify-between items-center px-40 transition-all duration-200`}>
        <div className='flex justify-center items-center  rounded-2xl overflow-hidden w-fit h-10 px-3 py-2'>
          <img src="./logoModi.png" className='w-fit h-10' alt='logo' />
        </div>
        <div className='flex justify-center items-center gap-15 font-bold text-lg '>
          <a onClick={() => setActiveIndex(1)} href='/' className={`flex justify-center items-center ${acitveIndex === 1 ? 'text-green-400' : 'text-white'}`}>Trang Chủ</a>

          <a onClick={() => setActiveIndex(2)} href='/about' className={`flex justify-center items-center ${acitveIndex === 2 ? 'text-green-400' : 'text-white'}`}>Về Chúng Tôi</a>

          <Link to={'/services'} onMouseEnter={() => setIsHoverServices(true)} onMouseLeave={() => setIsHoverServices(false)}
            className={` h-full flex justify-center items-center 2xl:text-xl ${location.pathname === '/services' ? 'text-green-400' : 'text-white'}`}>
            Dịch Vụ<IoMdArrowDropdown />
            <div className={`rounded-lg text-black font-normal 2xl:text-lg text-sm absolute translate-x-15 ${scrolled ? 'md:top-13.5 xl:top-13.5' : 'md:top-18.5 xl:top-23.5'} transition-all duration-300`}>
              {isHoverServices && <ModalServices />}
            </div>
          </Link>

          <Link to={'/news'} onMouseEnter={() => setIsHoverNews(true)} onMouseLeave={() => setIsHoverNews(false)} className={`flex justify-center items-center 2xl:text-xl ${location.pathname === '/news' ? 'text-green-400' : 'text-white'}`}>
            Tin Tức<IoMdArrowDropdown />
            <div className={` rounded-lg text-black font-normal 2xl:text-lg text-sm absolute translate-x-8 ${scrolled ? 'md:top-13.5 xl:top-13.5' : 'md:top-18.5 xl:top-23.5'} transition-all duration-300`}>
              {isHoverNews && <ModalNews />}
            </div>
          </Link>

          <Link to={'/contact'} className={`flex justify-center items-center ${location.pathname === '/contact' ? 'text-green-400' : 'text-white'} 2xl:text-xl`}>Liên Hệ</Link>
          <Link to={'/recruitment'} className={`flex justify-center items-center ${location.pathname === '/recruitment' ? 'text-green-400' : 'text-white'} 2xl:text-xl`}>Tuyển Dụng</Link>
        </div>

        <div >
          <Link to={'/about'} className='hidden md:flex transtion-all duration-200 p-1 text-white 2xl:text-lg justify-center items-center border-2 border-white rounded-3xl gap-2 hover:bg-[#bf263d] hover:border-[#bf263d] cursor-pointer'><FaEarthAmericas /></Link>
          {/* Menu for mobi and tablet */}
          <button type="button" onClick={toggleSidebar} className='flex  md:hidden transtion-all duration-200 p-1 text-white justify-center items-center border-2 border-gray-500 rounded-lg gap-2 hover:bg-[#bf263d] hover:border-[#bf263d] cursor-pointer'><TiThMenu /></button>
        </div>
      </div>
      {/* Sidebar */}
      <div >
        <div
          onClick={toggleSidebar}
          className={`
            fixed top-0 left-0 w-full h-full z-30 md:hidden
            transition-opacity duration-300 ease-in-out
            ${isSidebarOpen ? 'opacity-100 pointer-events-auto bg-gray-900/80' : 'opacity-0 pointer-events-none'}
          `}
        />
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
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
    <div className='rounded-lg bg-linear-to-b/increasing from-indigo-500 to-teal-400 w-fit h-fit '>
      <ul className="max-w-xs p-0 list-none rounded-tr-lg rounded-br-lg">
        {services.map((service, index) => (
          <li
            key={index}
            className={`${index == 0 ? "rounded-tl-lg" : ''}${index == services.length - 1 ? "rounded-bl-lg" : ''} bg-white px-3 py-1 border-l-4 first:rounded-tr-lg last:rounded-br-lg hover:border-yellow-500 border-1 border-transparent  hover:translate-x-3 transition-transform duration-200 hover:rounded-tr-2xl hover:rounded-br-2xl`}
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
    <div className='rounded-lg bg-linear-to-b/increasing from-indigo-500 to-teal-400 w-fit h-fit '>
      <ul className="max-w-xs p-0 list-none rounded-tr-lg">
        {news.map((item, index) => (
          <li
            key={index}
            className={`${index == 0 ? "rounded-tl-lg" : ''}${index == news.length - 1 ? "rounded-bl-lg" : ''} bg-white px-3 py-1 border-l-4  first:rounded-tr-lg last:rounded-br-lg hover:border-blue-500 border-1 border-transparent  hover:translate-x-3 transition-transform duration-200 hover:rounded-tr-2xl hover:rounded-br-2xl`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  </>);
}

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <div id="drawer-navigation" className={`fixed top-0 left-0 z-40 w-64  h-screen p-4 overflow-y-auto bg-white dark:bg-gray-800 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      <div className='flex items-center justify-center xs:h-10 2xl:h-20 px-3 py-2 overflow-hidden rounded-2xl w-fit'>
        <img src="./logoModi.png" className='xs:h-5 sm:h-6 md:h-7 lg:h-7 xl:h-8 2xl:h-12 3xl:h-15 w-fit' alt='logo' />
      </div>
      <button onClick={() => setIsSidebarOpen(false)} type="button" data-drawer-hide="drawer-navigation" aria-controls="drawer-navigation" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        <span className="sr-only">Close menu</span>
      </button>
      <div className="py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {MenuHeader.map((item) => {
            return (
              <li key={item.id}>
                <Link to={item.link} onClick={() => setIsSidebarOpen(false)} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>

  )
}



export default Header

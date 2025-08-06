import react, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../../../contexts/LanguageContext';




function Header({ scrolled, setActiveScoll_open_HeaderSideBar, isDarkHeader }) {

  const { t } = useLanguage();
  const location = useLocation();

  const [isHoverServices, setIsHoverServices] = useState(false);
  const [isHoverNews, setIsHoverNews] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    const next = !isSidebarOpen;
    setIsSidebarOpen(next);
    setActiveScoll_open_HeaderSideBar(next);
  };




  return (
    <>
      <div className={`${location.pathname === "/"
        ? (scrolled
          ? "xs:h-10 md:h-20 2xl:h-20 3xl:h-30"
          : "xs:h-15 md:h-30 2xl:h-30 3xl:h-30")
        : "h-20"
        } w-full bg-transparent flex justify-between items-center  transition-all duration-200 xs:px-3 sm:px-3 md:px-10 lg:px-20`}>
        <Link to={'/'} className='flex items-center justify-center xs:h-10 2xl:h-20 px-3 py-2 overflow-hidden rounded-2xl w-fit'>
          <img src="./logoModi.png" className='xs:h-5 sm:h-6 md:h-7 lg:h-7 xl:h-8 2xl:h-8 3xl:h-12 w-fit' alt='logo' />
        </Link>


        <div className='items-center justify-center xs:hidden text-base font-bold md:flex md:text-xs md:gap-6 lg:gap-8 xl:gap-10 lg:text-md xl:text-xl'>

          <Link to={'/'} className={`flex 2xl:text-xl lg:text-md  justify-center items-center ${location.pathname === '/' ? 'text-green-400' : 'text-white'}`}>{t("header.home.title")}</Link>

          <Link to={'/about'} className={`2xl:text-xl lg:text-md  flex justify-center items-center ${location.pathname === '/about' ? 'text-green-400' : 'text-white'}`}>{t("header.about.title")}</Link>

          <div
            onMouseEnter={() => setIsHoverServices(true)}
            onMouseLeave={() => setIsHoverServices(false)}
            className="relative h-full flex items-center "
          >
            <Link
              to="/services"
              className={`flex justify-center items-center lg:text-md  2xl:text-xl h-full ${location.pathname === '/services' ? 'text-green-400' : 'text-white'}`}
            >
              {t("header.services.title")} <IoMdArrowDropdown />
            </Link>

            {isHoverServices && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 z-50 min-w-max"
              >
                <ModalServices />
              </div>
            )}
          </div>


         
            <Link
              to="/news"
              className={`flex justify-center items-center lg:text-md  2xl:text-xl h-full ${location.pathname === '/news' ? 'text-green-400' : 'text-white'}`}
            >
              {t("header.news.title")}
            </Link>

            



          <Link to={'/contact'} className={`flex justify-center items-center lg:text-md  ${location.pathname === '/contact' ? 'text-green-400' : 'text-white'} 2xl:text-xl`}>{t("header.contact.title")}</Link>
          <Link to={'/careers'} className={`flex justify-center items-center lg:text-md  ${location.pathname === '/recruitment' ? 'text-green-400' : 'text-white'} 2xl:text-xl`}>{t("header.recruitment.title")}</Link>
        </div>

        <div >
          <div className='hidden md:flex'><ThemeToggle /></div>
          {/* Menu for mobi and tablet */}
          <button type="button" onClick={toggleSidebar} className='flex md:hidden transtion-all duration-200 p-1 text-white justify-center items-center border-2 border-gray-500 rounded-lg gap-2 hover:bg-[#bf263d] hover:border-[#bf263d] cursor-pointer'><TiThMenu /></button>
        </div>
      </div>
      {/* Sidebar - mobi*/}
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
  const { t } = useLanguage();
  const services = [
    {title: t("header.services.listServices.0"), link: "/services"},
    {title: t("header.services.listServices.1"), link: "/services"},
    {title: t("header.services.listServices.2"), link: "/services"},
    {title: t("header.services.listServices.3"), link: "/services"},
    {title: t("header.services.listServices.4"), link: "/services"},
    {title: t("header.services.listServices.5"), link: "/services"},
    {title: t("header.services.listServices.6"), link: "/services"},
    {title: t("header.services.listServices.7"), link: "/services"},
    {title: t("header.services.listServices.8"), link: "/services"},
    {title: t("header.services.listServices.9"), link: "/services"},
    {title: t("header.services.listServices.10"), link: "/services"},
    {title: t("header.services.listServices.11"), link: "/services"},
    {title: t("header.services.listServices.12"), link: "/services"},
    {title: t("header.services.listServices.13"), link: "/services"},
  ];

  return (
    <div className="w-fit">
      <div className="rounded-lg bg-linear-to-b from-indigo-500 to-teal-400 w-fit h-fit">
        <ul className="list-none rounded-tr-lg rounded-br-lg overflow-hidden">
          {services.map((service, index) => (
            <li
              key={index}
              className="cursor-default first:rounded-tl-xl last:rounded-bl-xl bg-white px-3 py-1 border-l-4 text-gray-700
                       border-transparent hover:bg-green-900 hover:text-white
                       hover:translate-x-3 transition-transform duration-200
                       md:text-sm lg:text-md xl:text-md 2xl:text-md font-normal"
            >
             <Link to={service.link}>{service.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}



function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { t } = useLanguage();
  const MenuHeader = [
    { id: 1, name: t("header.home.title"), link: '/' },
    { id: 2, name: t("header.about.title"), link: '/about' },
    { id: 3, name: t("header.services.title"), link: '/services' },
    { id: 4, name: t("header.news.title"), link: '/news' },
    { id: 5, name: t("header.contact.title"), link: '/contact' },
    { id: 6, name: t("header.recruitment.title"), link: '/careers' },
  ];

  return (
    <div id="drawer-navigation" className={`fixed top-0 left-0 z-40 w-64 flex h-screen p-4 overflow-y-auto bg-white dark:bg-gray-800 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      <div className='flex items-start justify-between flex-col w-full'>
        <div className='flex items-start justify-start flex-col w-full'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center justify-start xs:h-10 2xl:h-20 px-3 py-2 overflow-hidden rounded-2xl w-fit'>
              <img src="./logoModi.png" className='xs:h-5 sm:h-10 md:h-7 lg:h-7 xl:h-8 2xl:h-12 3xl:h-15 w-fit' alt='logo' />
            </div>
            <button onClick={() => setIsSidebarOpen(false)} type="button" data-drawer-hide="drawer-navigation" aria-controls="drawer-navigation" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <div className="py-4 overflow-y-auto w-full">
            <ul className="space-y-2 font-medium w-full">
              {MenuHeader.map((item) => {
                return (
                  <li key={item.id}>
                    <Link to={item.link} onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center p-2 text-gray-900 rounded-lg  w-full
                    dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <div className='flex items-center justify-center w-full mt-4'>
          <ThemeToggle />
        </div>
      </div>
    </div>

  )
}



export default Header

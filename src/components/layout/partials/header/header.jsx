import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";
import ThemeToggle from "../ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import ModalServices from "./ModalServices";
import ModalDesignWeb from "./ModalDesignWeb";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import NavItem from "./NavItem";
import NavDropdown from "./NavDropdown";

const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

function Header({ scrolled, setActiveScoll_open_HeaderSideBar }) {
  const { t } = useLanguage();
  const location = useLocation();

  const [isHoverServices, setIsHoverServices] = useState(false);
  const [isHoverDesignWeb, setIsHoverDesignWeb] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const [cachedLogo, setCachedLogo] = useState(null);

  const [servicesPreloaded, setServicesPreloaded] = useState(false);
  const modalServicesRef = useRef(null);

  const preloadServicesData = () => {
    if (modalServicesRef.current && !servicesPreloaded) {
      modalServicesRef.current.loadAllData(); // gọi hàm fetch trong ModalServices
      setServicesPreloaded(true);
    }
  };

  const fetchLogo = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/section-items/type/logo?slug=header`
      );
      if (!res.ok) throw new Error("Không thể tải logo");
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const finalLogo = item.image_url
          ? `${API_BASE_URL}${item.image_url}`
          : "/logoModi.png";

        // Nếu logo mới khác logo cũ thì update
        if (finalLogo !== cachedLogo) {
          setLogo(finalLogo);
          localStorage.setItem("header_logo", finalLogo);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // fetch logo
  useEffect(() => {
    setCachedLogo(localStorage.getItem("header_logo"));
    if (cachedLogo) {
      setLogo(cachedLogo); // ✅ hiển thị tức thì logo cũ
    }
    fetchLogo();
    preloadServicesData(); // gọi trước 1 lần
  }, []);

  const toggleSidebar = () => {
    const next = !isSidebarOpen;
    setIsSidebarOpen(next);
    setActiveScoll_open_HeaderSideBar(next);
  };

  // Navigation config array
  const navItems = [
    { type: "link", to: "/", label: t("header.home.title") },
    { type: "link", to: "/about", label: t("header.about.title") },
    {
      type: "dropdown",
      to: "/Products",
      label: t("header.designweb.title"),
      hoverState: [isHoverDesignWeb, setIsHoverDesignWeb],
      component: <ModalDesignWeb />,
    },
    {
      type: "dropdown",
      to: "/services",
      label: t("header.services.title"),
      hoverState: [isHoverServices, setIsHoverServices],
      component: <ModalServices ref={modalServicesRef} />,
    },
    { type: "link", to: "/marketing", label: t("header.marketing.title") },
    { type: "link", to: "/news", label: t("header.news.title") },
    { type: "link", to: "/contact", label: t("header.contact.title") },
  ];

  return (
    <>
      <motion.div
        animate={{
          height: location.pathname === "/" ? (scrolled ? 80 : 120) : 80,
          backgroundColor: scrolled ? "rgba(31,41,55,1)" : "rgba(31,41,55,0)",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full fixed top-0 left-0 z-40 bg-transparent"
      >
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center h-full px-5 lg:px-10">
          {/* Logo */}
          <motion.div
            animate={{
              y: scrolled ? -4 : 0,
              scale: scrolled ? 0.9 : 1,
              opacity: scrolled ? 0.9 : 1,
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex items-center justify-center h-10 px-3 py-2 overflow-hidden rounded-2xl w-fit"
          >
            <Link to={"/"}>
              {logo ? (
                <img
                  src={logo}
                  className="h-8 w-auto lg:h-10"
                  alt="logo"
                  loading="lazy"
                />
              ) : (
                <div className="h-8 w-[50px] bg-gray-700 animate-pulse rounded lg:h-10" />
              )}
            </Link>
          </motion.div>

          {/* Nav */}
          <motion.nav
            animate={{ y: scrolled ? 0 : 0, opacity: scrolled ? 0.9 : 1 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className=" hidden lg:flex items-center text-[15px] font-bold gap-6 lg:gap-6 xl:gap-8 2xl:gap-10 whitespace-nowrap "
          >
            {navItems.map((item) =>
              item.type === "link" ? (
                <NavItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  scrolled={scrolled}
                />
              ) : (
                <NavDropdown
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  isHover={item.hoverState[0]}
                  setIsHover={item.hoverState[1]}
                >
                  {item.component}
                </NavDropdown>
              )
            )}
          </motion.nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <div className="hidden md:flex md:p-2">
              <ThemeToggle />
            </div>

            {/* Menu button */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex lg:hidden h-9 w-9 transition-all duration-200 text-white justify-center items-center border-2 border-gray-500 rounded-lg hover:bg-[#bf263d] hover:border-[#bf263d] cursor-pointer"
            >
              <TiThMenu className="text-base" size={20} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sidebar Overlay */}
      <div
        onClick={toggleSidebar}
        className={`
    fixed top-0 left-0 w-full h-full z-30 lg:hidden
    transition-opacity duration-300 ease-in-out
    ${isSidebarOpen
            ? "opacity-100 pointer-events-auto bg-gray-900/40"
            : "opacity-0 pointer-events-none"
          }
  `}
      />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </>
  );
}

export default Header;

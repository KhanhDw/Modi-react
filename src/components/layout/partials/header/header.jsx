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
  const [cachedLogo, setCachedLogo] = useState(null);
  const [logo, setLogo] = useState(() => localStorage.getItem("header_logo"));


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
    const cached = localStorage.getItem("header_logo");

    if (cached) {
      setLogo(cached); // hiển thị ngay
    }

    // fetch ngầm để cập nhật nếu có thay đổi
    fetchLogo();
    preloadServicesData();
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
          height: location.pathname === "/" ? (scrolled ? 80 : 100) : 80,
          backgroundColor: scrolled ? "rgba(17, 24, 39, 0.8)" : "rgba(17, 24, 39, 0)",
          backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full fixed top-0 left-0 z-40"
      >
        <div className="max-w-screen-2xl mx-auto grid xs:grid-cols-2 md:grid-cols-3 items-center h-full px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <motion.div
            animate={{
              scale: scrolled ? 0.95 : 1,
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex items-center justify-start"
          >
            <Link to={"/"} className="flex items-center">
              {logo ? (
                <img
                  src={logo}
                  className="h-8 w-auto lg:h-10 transition-all duration-300"
                  alt="logo"
                  loading="lazy"
                />
              ) : (
                <div className="h-8 w-24 bg-gray-700 animate-pulse rounded-md lg:h-10" />
              )}
            </Link>

          </motion.div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center justify-center text-sm font-bold gap-6 lg:gap-6 xl:gap-8 2xl:gap-10 whitespace-nowrap">
            {navItems.map((item) => {
              const isActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);

              if (item.type === "link") {
                return (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    scrolled={scrolled}
                    isActive={isActive}
                  />
                );
              }
              return (
                <NavDropdown
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  isHover={item.hoverState[0]}
                  setIsHover={item.hoverState[1]}
                  isActive={isActive}
                >
                  {item.component}
                </NavDropdown>
              );
            })}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            {/* Theme toggle */}
            <div className="hidden md:flex p-2 rounded-full border border-transparent hover:border-gray-600 transition-colors">
              <ThemeToggle />
            </div>

            {/* Menu button */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex lg:hidden h-10 w-10 transition-all duration-300 text-white justify-center items-center border border-gray-600 rounded-lg hover:bg-gray-700/50 hover:border-gray-500 cursor-pointer"
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
    fixed top-0 left-0 w-full h-full z-40 lg:hidden
    transition-opacity duration-300 ease-in-out
    ${isSidebarOpen
            ? "opacity-100 pointer-events-auto bg-black/60"
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

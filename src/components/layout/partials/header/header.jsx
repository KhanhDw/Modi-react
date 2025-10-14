// header.jsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";
import ThemeToggle from "../ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import ModalServices from "./ModalServices";
import ModalDesignWeb from "./ModalDesignWeb";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import NavItem from "./NavItem";
import NavDropdown from "./NavDropdown";

const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

// Simplified Logo component
const Logo = React.memo(({ logo }) => (
  <div className="flex items-center justify-start lg:pl-5 xl:pl-0">
    <Link
      to="/"
      className="flex items-center"
    >
      {logo ? (
        <motion.img
          src={logo}
          className="h-8 w-auto lg:h-10 transition-all duration-300"
          alt="logo"
          loading="eager"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      ) : (
        <div className="h-8 w-24 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-md lg:h-10 animate-pulse" />
      )}
    </Link>
  </div>
));

function Header({ setActiveScoll_open_HeaderSideBar }) {
  const { t } = useLanguage();
  const location = useLocation();

  const [isHoverServices, setIsHoverServices] = useState(false);
  const [isHoverDesignWeb, setIsHoverDesignWeb] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logo, setLogo] = useState(() => localStorage.getItem("header_logo"));
  const [servicesPreloaded, setServicesPreloaded] = useState(false);

  const modalServicesRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleHoverStart = useCallback((setter) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setter(true);
  }, []);

  const handleHoverEnd = useCallback((setter) => {
    hoverTimeoutRef.current = setTimeout(() => {
      setter(false);
    }, 150);
  }, []);

  const preloadServicesData = useCallback(() => {
    if (modalServicesRef.current && !servicesPreloaded) {
      modalServicesRef.current.loadAllData();
      setServicesPreloaded(true);
    }
  }, [servicesPreloaded]);

  const fetchLogo = useCallback(async () => {
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

        if (finalLogo !== logo) {
          setLogo(finalLogo);
          localStorage.setItem("header_logo", finalLogo);
        }
      }
    } catch (err) {
      console.error("Lỗi tải logo:", err);
    }
  }, [logo]);

  useEffect(() => {
    const cached = localStorage.getItem("header_logo");
    if (cached) {
      setLogo(cached);
    }
    fetchLogo();
    preloadServicesData();
  }, [fetchLogo, preloadServicesData]);

  const toggleSidebar = useCallback(() => {
    const nextState = !isSidebarOpen;
    setIsSidebarOpen(nextState);
    setActiveScoll_open_HeaderSideBar(nextState);
  }, [isSidebarOpen, setActiveScoll_open_HeaderSideBar]);

  // Navigation config
  const navItems = useMemo(
    () => [
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
    ],
    [t, isHoverDesignWeb, isHoverServices]
  );

  return (
    <>
      <div className="w-full h-full">
        <div className="mx-auto grid xs:grid-cols-2 lg:grid-cols-3 items-center h-full px-4 sm:px-6 md:px-20 lg:px-10 xl:px-20">
          {/* Logo */}
          <Logo logo={logo} />

          {/* Navigation */}
          <nav className="hidden lg:flex items-center justify-center text-sm font-bold lg:gap-3 xl:gap-5 2xl:gap-10 whitespace-nowrap">
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
                  onHoverStart={() => handleHoverStart(item.hoverState[1])}
                  onHoverEnd={() => handleHoverEnd(item.hoverState[1])}
                >
                  {item.component}
                </NavDropdown>
              );
            })}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <div className="hidden lg:flex rounded-full hover:border-gray-600 transition-colors">
              <ThemeToggle />
            </div>

            {/* Menu Button */}
            <motion.button
              type="button"
              onClick={toggleSidebar}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(55, 65, 81, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="flex lg:hidden h-10 w-10 text-white justify-center items-center border border-gray-600 rounded-lg cursor-pointer transition-colors"
            >
              <TiThMenu size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed top-0 left-0 w-full h-full z-40 lg:hidden bg-black/60"
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </>
  );
}

export default React.memo(Header);

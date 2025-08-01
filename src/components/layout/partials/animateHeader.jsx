import { use, useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion";
import Header from "./header";

function AnimationHeader({ ActiveSideBarHeader }) {
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [animatedBackgroundColor, setAnimatedBackgroundColor] = useState("rgba(0,0,0,0)");

    useEffect(() => {

        console.log("AnimationHeader mounted: ", location.pathname);

        const onScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const color = scrolled
            ? "rgba(25, 27, 31, 0.95)"
            : location.pathname === "/"
                ? "rgba(0, 0, 0, 0)"
                : "rgba(0, 0, 0, 1)";
        setAnimatedBackgroundColor(color);
    }, [location.pathname, scrolled, windowWidth]);


    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;
    const isDesktop = windowWidth >= 1024 && windowWidth < 1920;
    const isTV = windowWidth >= 1920;


    return (<>
                <motion.div key={location.pathname + scrolled}
                    className={`fixed top-0 left-0 right-0 z-50 transition-all shadow-md w-full`}
                    initial={location.pathname === "/" ? { backgroundColor: "rgba(0,0,0,0)" } : { backgroundColor: "rgba(0,0,0,1)" }}
                    animate={{
                        backgroundColor: animatedBackgroundColor,
                        height: location.pathname === "/"
                            ? (scrolled
                                ? (isMobile ? 40 : (isTablet ? 80 : (isDesktop ? 80 : 130))) : 80) : 80,
                        opacity: scrolled ? 1 : 1,
                        boxShadow: scrolled ? "0 2px 12px rgba(255, 255, 255, 0.2)" : "0 0 0 rgba(0, 0, 0, 0)",
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center justify-center w-full">
                        <Header
                            setActiveScoll_open_HeaderSideBar={ActiveSideBarHeader}
                            scrolled={scrolled ? true : false}
                        />
                    </div>
                </motion.div>
    </>);
}

export default AnimationHeader;
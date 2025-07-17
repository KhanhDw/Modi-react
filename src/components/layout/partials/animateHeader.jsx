import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "./header";

function AnimationHeader() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (<>
        <motion.div
            className={`fixed top-0 left-0 right-0 z-50 transition-all shadow-md`}
            animate={{
                backgroundColor: scrolled ? "rgba(25, 27, 31, 0.95)" : "rgba(0,0,0,0)",
                height: scrolled ? 80 : 120,
                opacity: scrolled ? 1 : 1,
                boxShadow: scrolled ? "0 2px 12px rgba(0, 0, 0, 0.1)" : "0 0 0 rgba(0, 0, 0, 0)",
            }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-center w-full"> <Header scrolled={scrolled ? true : false} /></div>
        </motion.div>
    </>);
}

export default AnimationHeader;
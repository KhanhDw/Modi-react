import { Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

function NavDropdown({ to, label, isHover, setIsHover, children, isActive = false }) {
  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="relative h-full flex items-center"
    >
      <Link
        to={to}
        className={`flex justify-center items-center text-lg h-full ${isActive ? "text-green-400" : "text-white hover:text-green-300"
          }`}
      >
        {label}
        <IoMdArrowDropdown
          className={`ml-1 ${isHover ? "rotate-180" : ""} transition-transform duration-200`}
        />
      </Link>

      <AnimatePresence>
        {isHover && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-full left-0 -translate-x-0 z-50 min-w-max pt-4 pointer-events-auto"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NavDropdown;

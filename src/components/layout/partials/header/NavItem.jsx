import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function NavItem({ to, label, scrolled, isActive = false }) {
  return (
    <motion.div
      animate={{ scale: scrolled ? 0.95 : 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Link
        to={to}
        className={`flex text-lg justify-center items-center ${isActive ? "text-green-400" : "text-white hover:text-green-300"
          }`}
      >
        {label}
      </Link>
    </motion.div>
  );
}

export default NavItem;

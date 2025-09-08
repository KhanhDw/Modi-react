import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function NavItem({ to, label, scrolled, isActive }) {
  const location = useLocation();
  const active = location.pathname === to || isActive;

  return (
    <motion.div
      animate={{ scale: scrolled ? 0.95 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={to}
        className={`flex text-lg justify-center items-center ${
          active ? "text-green-400" : "text-white"
        }`}
      >
        {label}
      </Link>
    </motion.div>
  );
}

export default NavItem;

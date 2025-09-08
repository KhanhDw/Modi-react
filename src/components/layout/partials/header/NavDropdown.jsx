import { Link, useLocation } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";

function NavDropdown({ to, label, isHover, setIsHover, children, scrolled }) {
  const location = useLocation();
  const active = location.pathname.startsWith(to);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="relative h-full flex items-center"
    >
      <Link
        to={to}
        className={`flex justify-center items-center text-lg h-full ${
          active ? "text-green-400" : "text-white"
        }`}
      >
        {label}
        <IoMdArrowDropdown
          className={`ml-1 ${isHover ? "rotate-180" : ""} transition-transform duration-200`}
        />
      </Link>

      {isHover && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 min-w-max pt-2 pointer-events-auto">
          {children}
        </div>
      )}
    </div>
  );
}

export default NavDropdown;

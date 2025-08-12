import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Dropdown cha
export const CustomDropdown = ({ trigger, children, align = "end" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={cn(
            "w-64 p-2 bg-white admin-dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 admin-dark:border-gray-700",
            "absolute mt-2 min-w-[16rem] max-w-none",
            align === "end" ? "right-0" : "left-0",
            "animate-in fade-in-0 zoom-in-95 duration-200 ease-out"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Dropdown con
export const CustomSubDropdown = ({ onClick, trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
    if (onClick) onClick();
  };

  return (
    <div>
      <div
        onClick={handleDropdownClick}
        className="flex items-center px-3 py-2 text-sm text-gray-700 admin-dark:text-gray-200 hover:bg-gray-100 admin-dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-150"
      >
        {trigger}
      </div>
      {isOpen && <div className="pl-6">{children}</div>}
    </div>
  );
};

// Item
export const CustomDropdownItem = ({ children, className, onClick, asChild }) => {
  return (
    <div
      className={cn(
        "flex items-center px-3 py-2 text-sm text-gray-700 admin-dark:text-gray-200 hover:bg-gray-50 admin-dark:hover:bg-gray-700/70 rounded-lg cursor-pointer transition-colors duration-150",
        "active:scale-[0.98] active:bg-gray-100 admin-dark:active:bg-gray-600/80",
        className
      )}
      onClick={onClick}
    >
      {asChild ? children : <div className="flex w-full h-full justify-start items-center gap-2">{children}</div>}
    </div>
  );
};

// Separator
export const CustomDropdownSeparator = ({ className }) => {
  return (
    <hr
      className={cn("border-0 h-px bg-gray-200 admin-dark:bg-gray-600 my-2", className)}
    />
  );
};

// Label
export const CustomDropdownLabel = ({ children, className }) => {
  return (
    <div
      className={cn(
        "px-3 py-2 text-sm font-semibold text-gray-900 admin-dark:text-gray-100",
        "tracking-wide uppercase",
        className
      )}
    >
      {children}
    </div>
  );
};

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CustomSelect({
  value,
  onValueChange,
  placeholder = "Lọc theo trạng thái",
  options,
  className,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  // Đóng khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div
      className={cn("relative inline-block w-full", className)}
      ref={triggerRef}
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-md border-2 border-gray-300 bg-white px-3 py-1.5 text-gray-800 text-sm focus:ring-2 focus:border-none focus:ring-blue-500 cursor-pointer admin-dark:bg-gray-800 admin-dark:border-gray-600"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className="block flex-1  text-left text-gray-700 admin-dark:text-gray-300 "
          title={selectedLabel || placeholder}
        >
          {selectedLabel || placeholder}
        </span>
        {open ? (
          <ChevronUpIcon className="w-4 h-4 opacity-60 text-gray-500 admin-dark:text-gray-300" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 opacity-60 text-gray-500 admin-dark:text-gray-300" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            width: "100%",
            maxHeight: "200px",
          }}
          className="z-50 overflow-auto rounded-md border border-gray-200 bg-white text-sm md:text-base font-normal text-gray-700 shadow-lg admin-dark:border-gray-700 admin-dark:bg-gray-800 admin-dark:text-white scrollbar-hide"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              tabIndex={0}
              onClick={() => {
                onValueChange(opt.value);
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onValueChange(opt.value);
                  setOpen(false);
                }
              }}
              className={cn(
                "relative flex items-center cursor-pointer px-3 py-2 hover:bg-gray-100 admin-dark:hover:bg-gray-700",
                value === opt.value ? "font-medium" : ""
              )}
            >
              {/* Wrapper cho text với truncate */}
              <span
                className="flex-1  pr-6" // pr-6 để chừa chỗ cho icon check
                title={opt.label} // Thêm title để hiển thị đầy đủ text khi hover
              >
                {opt.label}
              </span>

              {value === opt.value && (
                <CheckIcon className="flex-shrink-0 w-4 h-4 text-gray-500 admin-dark:text-gray-200" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

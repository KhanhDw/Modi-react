import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, Filter } from "lucide-react";
import { cn } from "@/lib/utils"; // hoặc dùng 'classnames'

export default function CustomSelectFilter({
  value,
  onValueChange,
  placeholder = "Chọn giá trị",
  options = [],
  className,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

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
    <div ref={triggerRef} className={cn("relative inline-block", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center w-full h-full shadow justify-between gap-2 rounded-md border border-gray-300 bg-white px-2 py-2 text-black cursor-pointer admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:border-gray-600"
      >
        <div className="flex items-center truncate">
          <Filter className="h-4 w-4 mr-1 sm:mr-2 text-gray-600 admin-dark:text-gray-200" />
          <span
            className="truncate text-sm font-medium text-gray-700 admin-dark:text-gray-200"
            title={selectedLabel || placeholder}
          >
            {selectedLabel || placeholder}
          </span>
        </div>
        {open ? (
          <ChevronUpIcon className="h-4 w-4 text-gray-500 admin-dark:text-gray-200" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-500 admin-dark:text-gray-200" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          style={{ minWidth: '100%', width: 'max-content' }}
          className="absolute z-100 mt-1 w-full h-auto overflow-auto rounded-md border border-gray-300 bg-white text-sm text-black shadow-md admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:text-gray-200"
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
                "cursor-pointer px-3 py-2 hover:bg-gray-100 admin-dark:hover:bg-gray-600 relative",
                value === opt.value ? "font-medium" : ""
              )}
            >
              {opt.label}
              {value === opt.value && (
                <CheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 admin-dark:text-gray-300" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // Nếu không dùng thì thay bằng 'classnames' hoặc tự viết

export default function CustomSelectWithFooter({
  value,
  onValueChange,
  options,
  placeholder = "Chọn một giá trị",
  className,
  footer,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className={cn("relative inline-block w-full", className)} ref={containerRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-md border-2 border-gray-300 bg-white px-3 py-1 text-gray-800 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none admin-dark:bg-gray-800 admin-dark:border-gray-600"
      >
        <span className="truncate text-left text-gray-700 admin-dark:text-gray-300">
          {selectedLabel || placeholder}
        </span>
        {open ? (
          <ChevronUpIcon className="w-4 h-4 text-gray-500 admin-dark:text-gray-300" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-gray-500 admin-dark:text-gray-300" />
        )}
      </button>

      {open && (
        <div
          style={{ minWidth: '100%', width: 'max-content' }}
          className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200
               bg-white text-sm md:text-base font-normal text-gray-700 shadow-md admin-dark:border-gray-700
               admin-dark:bg-gray-800 admin-dark:text-white"
        >
          <ul role="listbox" tabIndex={-1}>
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
                  "relative cursor-pointer px-3 py-2 hover:bg-gray-100 admin-dark:hover:bg-gray-700",
                  value === opt.value ? "font-medium" : ""
                )}
              >
                {opt.label}
                {value === opt.value && (
                  <CheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 admin-dark:text-gray-200" />
                )}
              </li>
            ))}
          </ul>

          {footer && (
            <div className="border-t border-gray-200 admin-dark:border-gray-700 mt-2 px-3 py-2">
              {footer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

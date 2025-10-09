import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

export default function TableRowActions({ actions = [], className = "" }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.right + window.scrollX - 160,
        });
      }
    };

    // Cập nhật vị trí lần đầu
    updatePosition();

    // Hàm đóng dropdown
    const handleClose = (e) => {
      // Click ngoài
      if (e?.type === "mousedown") {
        if (
          menuRef.current &&
          !menuRef.current.contains(e.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(e.target)
        ) {
          setOpen(false);
        }
      }
      // Escape, scroll, resize
      else {
        setOpen(false);
      }
    };

    // Event listeners
    document.addEventListener("mousedown", handleClose);
    window.addEventListener("keydown", (e) => e.key === "Escape" && handleClose());
    window.addEventListener("scroll", handleClose, true); // capture để bắt scroll trong container
    window.addEventListener("resize", handleClose);

    return () => {
      document.removeEventListener("mousedown", handleClose);
      window.removeEventListener("keydown", (e) => e.key === "Escape" && handleClose());
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [open]);


  // Tính vị trí dropdown
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.right - 160,
      });
    }
  }, [open]);

  return (
    <div className={`inline-block text-left ${className}`}>
      {/* Nút trigger */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="text-gray-600 hover:bg-gray-200 rounded p-2 transition admin-dark:text-gray-300 admin-dark:hover:bg-gray-700 cursor-pointer"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: 160,
            zIndex: 1000,
          }}
          className="rounded-md shadow-lg border border-gray-200 bg-white admin-dark:bg-gray-700 admin-dark:border-gray-600"
        >
          <ul className="py-1 text-sm text-gray-700 font-normal admin-dark:text-gray-200">
            {actions.map((action, index) => (
              <li
                key={index}
                onClick={() => {
                  action.onClick?.();
                  setOpen(false);
                }}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 admin-dark:hover:bg-gray-600"
              >
                {action.icon && (
                  <action.icon className="w-4 h-4 mr-2 text-gray-500 admin-dark:text-gray-300" />
                )}
                {action.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

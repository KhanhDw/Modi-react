import { useState, useRef, useEffect } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLES = [
  { value: "manager", label: "Manager (Quản lý)" },
  { value: "admin", label: "Admin (Quản trị viên)" },
  { value: "dev", label: "Dev (Lập trình viên)" },
];

export default function RoleDropdown({ form, setForm }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const selectedRole = ROLES.find((r) => r.value === form.role);

  // Đóng dropdown khi click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col space-y-1 relative" ref={ref}>
      <label
        htmlFor="role"
        className="text-sm sm:text-base font-medium text-gray-700 admin-dark:text-gray-300"
      >
        Vai trò (Role) <span className="text-red-500">*</span>
      </label>

      <Button
        type="button"
        variant="outline"
        className={`
          w-full justify-between border px-2.5 py-2 h-[40px] hover:bg-gray-100
          border-gray-300 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-800
          text-gray-900 hover:text-gray-900 admin-dark:text-gray-100
          focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer
          truncate
        `}
        onClick={() => setOpen(!open)}
      >
        <span className="truncate max-w-[calc(100%-24px)] text-left">
          {selectedRole ? selectedRole.label : "Chọn vai trò..."}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <ul
          className={`
      absolute top-full mt-1 w-full max-h-60 overflow-auto rounded-md shadow-md
      border border-gray-300 bg-white text-gray-900
      admin-dark:border-gray-700 admin-dark:bg-gray-800 admin-dark:text-gray-100
    `}
        >
          {ROLES.map((role) => (
            <li
              key={role.value}
              className="
    px-4 py-2
    cursor-pointer text-sm sm:text-base
    text-gray-900 admin-dark:text-gray-100
    hover:bg-gray-100 admin-dark:hover:bg-gray-700
    hover:text-gray-700 admin-dark:hover:text-gray-300
  "
              onClick={() => {
                setForm({ ...form, role: role.value });
                setOpen(false);
              }}
            >
              {role.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

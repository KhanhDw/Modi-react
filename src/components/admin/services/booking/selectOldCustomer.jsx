import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";

export default function CustomerCombobox({ customers, formData, setFormData }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const selectedCustomer = customers.find(
    (c) => c.id === formData.customerId
  );

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Nút chính */}
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="w-full justify-between border px-3 py-1.5 border-black/30 text-black bg-white
                   admin-dark:text-gray-100 admin-dark:bg-gray-800 admin-dark:border-gray-600
                   hover:bg-gray-100 admin-dark:hover:bg-gray-700 cursor-pointer hover:text-gray-700 truncate"
      >
        <span className="truncate max-w-[calc(100%-24px)] text-gray-800 admin-dark:text-gray-200">
          {selectedCustomer
            ? `${selectedCustomer.name} - ${selectedCustomer.phone}`
            : "Chọn khách hàng..."}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute w-full top-full mt-1 p-2 max-h-60 overflow-auto border border-black/30
                     bg-white text-black admin-dark:bg-gray-800 admin-dark:text-gray-100
                     admin-dark:border-gray-600 rounded-md shadow-lg z-50"
        >
          {customers.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500 text-center">
              Không có khách hàng
            </div>
          ) : (
            customers.map((c) => {
              const isSelected = c.id === formData.customerId;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      customerId: c.id,
                      cusName: c.name,
                      cusPhone: c.phone,
                      cusEmail: c.email,
                      cusAddress: c.address,
                      cccd: c.cccd,
                      bankAccount: c.number_bank,
                      bankName: c.name_bank,
                    });
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between cursor-pointer px-3 py-2 text-sm rounded-sm transition-all
                    ${isSelected
                      ? "bg-blue-100 text-blue-700 admin-dark:bg-blue-900/40 admin-dark:text-blue-300"
                      : "hover:bg-gray-100 admin-dark:hover:bg-gray-700"
                    }`}
                >
                  <span>{c.name} - {c.phone}</span>
                  {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { banks } from "@/data/banks.js";

export const VIETNAMESE_BANKS = banks;

export default function BankDropdown({
  formData,
  setFormData,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  let selectedBank = "";
  if (formData.bankName) {
    selectedBank = VIETNAMESE_BANKS.find((b) => b.value === formData.bankName);
  } else {
    selectedBank = VIETNAMESE_BANKS.find((b) => b.value === formData.name_bank);
  }

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative w-full space-y-1"
      ref={dropdownRef}
    >
      <Button
        disabled={disabled}
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen(!open)}
        className={`
          w-full justify-between border h-[40px]
          border-black/30 text-black bg-white
          admin-dark:text-gray-100 admin-dark:bg-gray-700
          admin-dark:border-gray-600
          hover:bg-gray-100 admin-dark:hover:bg-gray-700 cursor-pointer hover:text-gray-700
          truncate
        `}
      >
        <span className="admin-dark:text-gray-200 text-gray-800 truncate max-w-[calc(100%-24px)]">
          {selectedBank
            ? `${selectedBank.label} (${selectedBank.value})`
            : "Chọn ngân hàng..."}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div
          className={`
      absolute w-full bottom-full mb-1
      border border-black/30 bg-white text-black
      admin-dark:bg-gray-800 admin-dark:text-gray-100
      admin-dark:border-gray-600 rounded-md shadow-md
    `}
          role="listbox"
        >
          <Command className="bg-transparent">
            {/* Input tìm kiếm - luôn dính trên */}
            <CommandInput
              placeholder="Tìm theo tên ngân hàng..."
              className={`
          placeholder:text-gray-500 text-black
          admin-dark:placeholder:text-gray-400
          admin-dark:text-gray-100
          sticky top-0 z-10 bg-white admin-dark:bg-gray-800
          border-b border-gray-200 admin-dark:border-gray-700
        `}
            />

            {/* Vùng cuộn chỉ dành cho danh sách */}
            <div>
              <CommandList
                data-lenis-prevent
                className="max-h-60 overflow-y-auto scrollbar-hide lenis-local"
              >
                <CommandEmpty className="px-4 py-2 text-sm text-gray-500 admin-dark:text-gray-400 text-center">
                  Không tìm thấy ngân hàng
                </CommandEmpty>
                <CommandGroup>
                  {VIETNAMESE_BANKS.map((bank) => (
                    <CommandItem
                      key={bank.value}
                      value={`${bank.label} - ${bank.value}`}
                      onSelect={() => {
                        setFormData({
                          ...formData,
                          name_bank: bank.value,
                          bankName: bank.value,
                        });
                        setOpen(false);
                      }}
                      className={`
                  cursor-pointer px-2 py-1.5
                  text-black admin-dark:text-gray-100 admin-dark:hover:text-white
                  rounded-sm transition-all admin-dark:hover:bg-gray-700
                `}
                    >
                      {bank.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </div>
          </Command>
        </div>
      )}
    </div>
  );
}

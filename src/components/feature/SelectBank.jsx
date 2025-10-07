
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

export const VIETNAMESE_BANKS = [
  { code: "VCB", name: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)" },
  { code: "TCB", name: "Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)" },
  { code: "ACB", name: "Ngân hàng TMCP Á Châu (ACB)" },
  { code: "BIDV", name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)" },
  { code: "MB", name: "Ngân hàng TMCP Quân đội (MB Bank)" },
];

export default function BankDropdown({ formData, setFormData }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const selectedBank = VIETNAMESE_BANKS.find(
    (b) => b.code === formData.name_bank // lookup theo name_bank
  );

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
    <div className="relative w-full space-y-1" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen(!open)}
        className={`
          w-full justify-between border h-[40px]
          border-black/30 text-black bg-white
          admin-dark:text-gray-100 admin-dark:bg-gray-800
          admin-dark:border-gray-600
          hover:bg-gray-100 admin-dark:hover:bg-gray-700 cursor-pointer hover:text-gray-700
          truncate
        `}
      >
        <span
          className="admin-dark:text-gray-400 text-gray-500 truncate max-w-[calc(100%-24px)]"
        >
          {selectedBank
            ? `${selectedBank.name} (${selectedBank.code})`
            : "Chọn ngân hàng..."}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div
          className={`
      absolute w-full bottom-full mb-1 max-h-60 overflow-auto
      border border-black/30 bg-white text-black
      admin-dark:bg-gray-900 admin-dark:text-gray-100
      admin-dark:border-gray-600 rounded-md shadow-md
    `}
          role="listbox"
        >
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Tìm theo tên ngân hàng..."
              className={`
                placeholder:text-gray-500 text-black
                admin-dark:placeholder:text-gray-400
                admin-dark:text-gray-100
              `}
              onValueChange={() => { }}
            />
            <CommandList className="bg-transparent">
              <CommandEmpty className="px-4 py-2 text-sm text-gray-500 admin-dark:text-gray-400 text-center">
                Không tìm thấy ngân hàng
              </CommandEmpty>
              <CommandGroup>
                {VIETNAMESE_BANKS.map((bank) => (
                  <CommandItem
                    key={bank.code}
                    value={`${bank.name} - ${bank.code}`}
                    onSelect={() => {
                      setFormData({
                        ...formData,
                        name_bank: bank.code,
                      });
                      setOpen(false);
                    }}
                    className={`
                      cursor-pointer px-2 py-1.5
                      text-black admin-dark:text-gray-100 admin-dark:hover:text-white
                      rounded-sm transition-all admin-dark:hover:bg-gray-700
                    `}
                  >
                    {bank.name} ({bank.code})
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export const VIETNAMESE_BANKS = [
  { code: "VCB", name: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)" },
  { code: "TCB", name: "Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)" },
  { code: "ACB", name: "Ngân hàng TMCP Á Châu (ACB)" },
  { code: "BIDV", name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)" },
  { code: "MB", name: "Ngân hàng TMCP Quân đội (MB Bank)" },
];

export default function BankDropdown({ formData, setFormData }) {
  const [open, setOpen] = useState(false);

  const selectedBank = VIETNAMESE_BANKS.find(
    (b) => b.code === formData.name_bank // lookup theo name_bank
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between border border-black/30 text-black admin-dark:text-gray-100 cursor-pointer"
        >
          {selectedBank
            ? `${selectedBank.name} (${selectedBank.code})`
            : "Chọn ngân hàng..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Tìm theo tên ngân hàng..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy ngân hàng</CommandEmpty>
            <CommandGroup>
              {VIETNAMESE_BANKS.map((bank) => (
                <CommandItem
                  key={bank.code}
                  value={`${bank.name} - ${bank.code}`}
                  onSelect={() => {
                    setFormData({
                      ...formData,
                      name_bank: bank.code, // gán vào formData.name_bank
                    });
                    setOpen(false);
                  }}
                >
                  {bank.name} ({bank.code})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

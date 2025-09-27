import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronsUpDown } from "lucide-react"
import { useState } from "react"

export default function CustomerCombobox({ customers, formData, setFormData }) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between border border-black/30 text-white admin-dark:text-gray-100 cursor-pointer"
                >
                    {formData.cusName && formData.cusPhone
                        ? `${formData.cusName} - ${formData.cusPhone}`
                        : "Chọn khách hàng..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
                <Command>
                    <CommandInput placeholder="Tìm theo tên hoặc số điện thoại..." />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy khách hàng</CommandEmpty>
                        <CommandGroup>
                            {customers.map((c) => (
                                <CommandItem
                                    key={c.id}
                                    value={`${c.name} - ${c.phone}`}
                                    onSelect={() => {
                                        setFormData({
                                            ...formData,
                                            customerId: c.id,
                                            cusName: c.name,
                                            cusPhone: c.phone,
                                            cusEmail: c.email,
                                            cusAddress: c.address,
                                        })
                                        setOpen(false)
                                    }}
                                >
                                    {c.name} - {c.phone}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

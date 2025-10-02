import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export default function ChildServiceSelector({
  services,
  valueSlug,
  setValueSlug,
  listServiceOfParent,
}) {
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    if (services?.length) {
      const result = services.filter((s) =>
        listServiceOfParent.includes(s.translation.slug)
      );
      setFilteredServices(result);
    }
  }, [services, listServiceOfParent, valueSlug]);

  return (
    <Select value={valueSlug || ""} onValueChange={(val) => setValueSlug(val)}>
      <SelectTrigger className="w-full sm:w-90 bg-white admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-900 admin-dark:text-gray-100 cursor-pointer">
        <SelectValue placeholder="Chọn một service..." />
      </SelectTrigger>
      <SelectContent>
        {filteredServices.map((s) => (
          <SelectItem key={s.id} value={s.translation.slug}>
            <span className="w-50 sm:w-full">{s.translation.ten_dich_vu}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

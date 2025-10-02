import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ChildServiceSelector({ services, valueSlug, setValueSlug, listServiceOfParent, usedServiceSlugs }) {


    const [filteredServices, setFilteredServices] = useState([]);

    useEffect(() => {
        if (services?.length) {
            const result = services.filter(
                (s) => listServiceOfParent.includes(s.translation.slug)
            );
            setFilteredServices(result);
        }
    }, [services, listServiceOfParent]);


    return (
        <Select
            value={valueSlug || ""}
            onValueChange={(val) => setValueSlug(val)}
        >
            <SelectTrigger className="w-full bg-white admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-900 admin-dark:text-gray-100">
                <SelectValue placeholder="Chọn một service..." />
            </SelectTrigger>
            <SelectContent>
                {filteredServices.map((s) => {
                    const slug = s.translation.slug;
                    const isUsed = usedServiceSlugs?.includes(slug) && slug !== valueSlug;
                    return (
                        <SelectItem key={s.id} value={slug} disabled={isUsed}>
                            {s.translation.ten_dich_vu}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    );
}
import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ChildServiceSelector({ services, valueSlug, setValueSlug }) {

    console.log("111111:", services);
    console.log("222222:", valueSlug);

    useEffect(() => {
        console.log(">>> valueSlug hiện tại:", valueSlug);
    }, [valueSlug]);


    return (
        <Select
            value={valueSlug || ""}
            onValueChange={(val) => setValueSlug(val)}
        >
            <SelectTrigger className="w-full bg-white admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-900 admin-dark:text-gray-100">
                <SelectValue placeholder="Chọn một service..." />
            </SelectTrigger>
            <SelectContent>
                {services.map((s) => (
                    <SelectItem key={s.id} value={s.translation.slug}>
                        {s.translation.ten_dich_vu}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
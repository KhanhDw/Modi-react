import React, { useEffect, useState } from "react";



export default function CategoryServiceSelector({ services, listIdServices, setListIdServices }) {
    console.log("d::", services);
    console.log("d::1", listIdServices);
    return (
        <div className="border admin-dark:bg-gray-800 bg-gray-200 py-2 rounded-md ">
            {services.map((s) => {
                const checked = listIdServices?.includes(s.translation.slug) || false;

                return (
                    <div
                        key={s.id}
                        className="flex items-center space-x-2 px-2 hover:bg-gray-800/50 admin-dark:hover:bg-gray-300/50"
                    >
                        <label
                            htmlFor={`service-${s.id}`}
                            className="text-gray-800 admin-dark:text-gray-200 py-2 w-full"
                        >
                            <input
                                type="checkbox"
                                id={`service-${s.id}`}
                                value={s.translation.slug}
                                checked={checked}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setListIdServices((prev) => [...(prev || []), s.translation.slug]);
                                    } else {
                                        setListIdServices((prev) =>
                                            (prev || []).filter((slug) => slug !== s.translation.slug)
                                        );
                                    }
                                }}
                                className="checkbox w-5 h-5 rounded border border-gray-400 bg-gray-100 accent-blue-600 checked:bg-blue-600"
                            />
                            <span> {s.translation.ten_dich_vu}</span>
                        </label>
                    </div>
                );
            })}
        </div>
    );
}



import React, { useEffect, useState } from "react";

export default function CategoryServiceSelector({
    services,
    listIdServices,
    setListIdServices,
    disableItemSelectedbyName_groupServices,
    dialog,
}) {


    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;
    const fetchGroupServiceByType = async (type) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/service-header-config/group-service/${type}`);
            if (!res.ok) throw new Error("Không thể tải danh sách group service");
            const data = await res.json();
            if (!data.success) throw new Error(data.error || "Không thể tải group service");
            return data.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    };


    const [groupServices, setGroupServices] = useState([]);
    const [dialogChildren, setDialogChildren] = useState([]);


    useEffect(() => {
        if (dialog && dialog.target && dialog.target.type) {

            setDialogChildren(dialog.target.children || []);


            fetchGroupServiceByType(dialog.target.type).then(data => {
                setGroupServices(data.map(item => item.groupServices));
            }).catch(err => {
                console.error("Error fetching group service data:", err)
            })
        }
    }, [dialog]);


    useEffect(() => {
        if (groupServices.length > 0 && dialogChildren.length > 0) {
            console.log("groupServices:", groupServices);
            console.log("dialogChildren:", dialogChildren);
        }
    }, [groupServices, dialogChildren]);




    const [localList, setLocalList] = useState(listIdServices || []);
    const [disabledSlugs, setDisabledSlugs] = useState([]);

    // lấy danh sách slug đã chọn ở group khác
    const getServiceSelectedByOtherGroupService = () => {
        const arrayServiceSelected = disableItemSelectedbyName_groupServices.flatMap(
            (item) => item.name.groupServices.split(",")
        );

        setDisabledSlugs(arrayServiceSelected); // lưu vào state

        if (listIdServices.length > 0) {
            const serviceIsSelected = arrayServiceSelected.filter(item => !listIdServices.includes(item));
            setDisabledSlugs(serviceIsSelected); // lưu vào state
        }

    };

    // sync prop khi mở dialog mới
    useEffect(() => {
        setLocalList(listIdServices || []);
        getServiceSelectedByOtherGroupService();
    }, [listIdServices, disableItemSelectedbyName_groupServices]);

    // gọi callback để update parent
    const toggleService = (slug, checked) => {
        const updated = checked
            ? [...localList, slug]
            : localList.filter((s) => s !== slug);
        setLocalList(updated);
        setListIdServices(updated); // đồng bộ với parent
    };

    return (
        <div className="border admin-dark:bg-gray-800 bg-gray-100 py-2 rounded-md">
            {services.map((s) => {
                const slug = s.translation.slug;
                const checked = localList.includes(slug);
                const disabled = disabledSlugs.includes(slug);
                const isUsedByChild = dialogChildren.some(child => child.description.en === slug);

                return (
                    <div
                        key={s.id}
                        className={`flex items-center space-x-2 px-2 ${!disabled
                            ? "hover:bg-gray-800/50 admin-dark:hover:bg-gray-300/50"
                            : "opacity-50 cursor-not-allowed"
                            }`}
                    >
                        <label
                            htmlFor={`service-${s.id}`}
                            className="text-gray-800 admin-dark:text-gray-200 py-2 w-full"
                        >
                            <input
                                type="checkbox"
                                id={`service-${s.id}`}
                                value={slug}
                                checked={checked}
                                disabled={disabled || isUsedByChild}
                                onChange={(e) => toggleService(slug, e.target.checked)}
                                className="checkbox w-5 h-5 rounded border border-gray-400 bg-gray-100 accent-blue-600 checked:bg-blue-600"
                            />
                            <span> {s.translation.ten_dich_vu}</span>
                            {isUsedByChild && <span className="text-red-500 text-xs ml-2">(mục con đang dùng)</span>}
                        </label>
                    </div>
                );
            })}
        </div>
    );
}

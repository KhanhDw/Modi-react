import { useEffect, useState } from "react";

export default function CategoryServiceSelector({
    services,
    listIdServices,
    setListIdServices,
    disableItemSelectedbyName_groupServices,
}) {


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
                                disabled={disabled} // 🔥 disable khi slug trùng
                                onChange={(e) => toggleService(slug, e.target.checked)}
                                className="checkbox w-5 h-5 rounded border border-gray-400 bg-gray-100 accent-blue-600 checked:bg-blue-600 cursor-pointer"
                            />
                            <span className="text-sm sm:text-base"> {s.translation.ten_dich_vu}</span>
                        </label>
                    </div>
                );
            })}
        </div>
    );
}

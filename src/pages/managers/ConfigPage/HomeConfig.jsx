import NotificationToast from "@/components/feature/notification-toast.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import RenderHomeConfig from "./renderSectionHomeConfig";

const sectionParsers = {
    banner: (data) =>
        data.map((item) => ({
            id: item.id,
            title: { vi: item.title?.vi || "", en: item.title?.en || "" },
            description: { vi: item.description?.vi || "", en: item.description?.en || "" },
            banner: item.image_url ? `${item.image_url}` : "",
        })),
    nenTang: (data) => Array.isArray(data) ? data : [],
    cards: (data) =>
        data.map((item) => ({
            id: item.id,
            title: { vi: item.title?.vi || "", en: item.title?.en || "" },
            description: { vi: item.description?.vi || "", en: item.description?.en || "" },
            image_url: item.image_url ? `${item.image_url}` : "",
        })),
    dichVu: (data) =>
        data.map((item) => ({
            id: item.id,
            title: { vi: item.title?.vi || "", en: item.title?.en || "" },
            description: { vi: item.description?.vi || "", en: item.description?.en || "" },
            image_url: item.image_url ? `${item.image_url}` : "",
        })),
    loiIch: (data) => Array.isArray(data) ? data : [],
    khauHieu: (data) => Array.isArray(data) ? data : [],
    khachHang: (data) => Array.isArray(data) ? data : [],
};


// sectionsConfig.js
export const sectionsConfig = [
    { key: "vitri", label: "Vị trí" },
    { key: "banner", label: "Banner" },
    { key: "nenTang", label: "Nền tảng" },
    { key: "cards", label: "3 Cards" },
    { key: "dichVu", label: "Dịch vụ" },
    { key: "chitietdichvu", label: "Chi tiết dịch vụ" },
    { key: "loiIch", label: "Lợi ích" },
    { key: "khauHieu", label: "Khẩu hiệu" },
    { key: "khachHang", label: "Khách hàng" },
];




export default function HomeConfigMultiLang() {
    const [activeLang, setActiveLang] = useState("vi");
    const [activeSection, setActiveSection] = useState(sectionsConfig[0].key);
    const [previewBanner, setPreviewBanner] = useState({});
    const [toast, setToast] = useState(null);

    const [homeData, setHomeData] = useState({
        vi: { banner: [], nenTang: [], cards: [], dichVu: [], loiIch: [], khauHieu: [], khachHang: [] },
        en: { banner: [], nenTang: [], cards: [], dichVu: [], loiIch: [], khauHieu: [], khachHang: [] },
    });

    const currentData = homeData[activeLang];

    const fetchSection = async (type) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/type/${type}?slug=home`
            );
            const data = await res.json();
            const parsed = sectionParsers[type]?.(data) || data;

            setHomeData((prev) => ({
                ...prev,
                [activeLang]: {
                    ...prev[activeLang],
                    [type]: parsed,
                },
            }));
        } catch (err) {
            console.error(`❌ Fetch ${type} failed:`, err);
        }
    };

    useEffect(() => {
        const sections = ["banner", "nenTang", "cards", "dichVu", "chitietdichvu", "loiIch", "khauHieu", "khachHang"];
        Promise.all(sections.map((type) => fetchSection(type)));
    }, [activeLang]);

    const handleChange = (section, id, field, value) => {
        setHomeData((prev) => {
            const copy = structuredClone(prev);
            if (Array.isArray(copy[activeLang][section])) {
                copy[activeLang][section] = copy[activeLang][section].map((item) =>
                    item.id === id
                        ? field === "title" || field === "description"
                            ? { ...item, [field]: { ...(item[field] || {}), [activeLang]: value } }
                            : { ...item, [field]: value }
                        : item
                );
            } else {
                copy[activeLang][section] = {
                    ...copy[activeLang][section],
                    [field]:
                        field === "title" || field === "description"
                            ? { ...(copy[activeLang][section][field] || {}), [activeLang]: value }
                            : value,
                };
            }
            return copy;
        });
    };

    const handleFileChange = (section, id, file) => {
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewBanner((prev) => ({ ...prev, [id]: previewUrl }));

            setHomeData((prev) => {
                const copy = { ...prev };
                copy[activeLang][section] = copy[activeLang][section].map((item) =>
                    item.id === id ? { ...item, file } : item
                );
                return copy;
            });
        }
    };

    const uploadImage = async (file, id, section, field = "image_url") => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", id);
        formData.append("field", field);
        formData.append("section", section);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/upload?field=${field}`,
                { method: "POST", body: formData }
            );
            const result = await res.json();
            return result?.data?.url || result?.url || null;
        } catch (err) {
            console.error("❌ Upload failed:", err);
            return null;
        }
    };

    function normalizeImageUrl(url) {
        if (!url) return "";
        try {
            const u = new URL(url, import.meta.env.VITE_MAIN_BE_URL);
            return u.pathname;
        } catch {
            return url;
        }
    }

    const handleSave = async (section) => {
        const data = homeData[activeLang][section];

        try {
            if (Array.isArray(data)) {
                await Promise.all(
                    data.map(async (item) => {
                        const resOld = await fetch(
                            `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${item.id}`
                        );
                        const oldItem = await resOld.json();

                        const mergedItem = {
                            ...oldItem,
                            ...item,
                            title: { ...(oldItem.title || {}), ...(item.title || {}) },
                            description: { ...(oldItem.description || {}), ...(item.description || {}) },
                        };

                        if (mergedItem.image_url) mergedItem.image_url = normalizeImageUrl(mergedItem.image_url);
                        if (mergedItem.banner) mergedItem.banner = normalizeImageUrl(mergedItem.banner);

                        await fetch(
                            `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${item.id}`,
                            {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(mergedItem),
                            }
                        );

                        if (item.file instanceof File) {
                            const url = await uploadImage(item.file, item.id, section);
                            if (url) {
                                setHomeData((prev) => {
                                    const copy = { ...prev };
                                    copy[activeLang][section] = copy[activeLang][section].map((x) =>
                                        x.id === item.id ? { ...x, banner: url, file: undefined } : x
                                    );
                                    return copy;
                                });
                            }
                        }
                    })
                );
            } else {
                const resOld = await fetch(
                    `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${data.id}`
                );
                const oldItem = await resOld.json();

                const mergedItem = {
                    ...oldItem,
                    ...data,
                    title: { ...(oldItem.title || {}), ...(data.title || {}) },
                    description: { ...(oldItem.description || {}), ...(data.description || {}) },
                };

                await fetch(
                    `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${data.id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(mergedItem),
                    }
                );
            }

            setToast({ message: `Đã lưu ${section} (${activeLang})`, type: "success" });
        } catch (err) {
            console.error("Save failed:", err);
            setToast({ message: "Lưu thất bại", type: "error" });
        }
    };

    return (
        <div className="md:p-2 max-w-6xl mx-auto ">
            {/* SECTION TABS */}
            <div className={`${activeSection === "vitri" ? "pb-3" : "pb-0"} gap-5 flex flex-col`}>
                <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:flex xl:justify-center">
                    {sectionsConfig.map((sec) => (
                        <motion.button
                            key={sec.key}
                            onClick={() => setActiveSection(sec.key)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 sm:px-4 cursor-pointer py-1 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition flex-1 sm:flex-none text-center
                                ${activeSection === sec.key
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 admin-dark:bg-gray-800 admin-dark:text-gray-200 admin-dark:hover:bg-gray-700"
                                }`}
                        >
                            {sec.label}
                        </motion.button>
                    ))}
                </div>

                {/* LANG TABS */}
                {activeSection !== "vitri" && activeSection !== "chitietdichvu" ?
                    (
                        <div className="relative flex flex-col gap-2 rounded-t-xl admin-dark:bg-gray-800 px-3 py-1 2xl:top-0 xs:w-full">
                            <div className="flex flex-col z-2 rounded-t-3xl xs:w-full xs:flex-row items-center justify-end gap-2 mt-2">
                                {/* Hiển thị ở md+ */}
                                <span className="hidden md:inline">
                                    {activeLang === "vi" ? "Đang thiết lập nội dung cho tiếng Việt" : "Đang thiết lập nội dung cho tiếng Anh"}
                                </span>
                                {/* Hiển thị ở xs */}
                                <span className="inline md:hidden">
                                    {activeLang === "vi" ? "Ngôn ngữ Việt" : "Ngôn ngữ Anh"}
                                </span>
                                <Switch checked={activeLang === "en"} onClick={() => setActiveLang((pre) => pre === "vi" ? "en" : "vi")} />
                            </div>
                        </div>
                    ) : null
                }

                <RenderHomeConfig
                    activeSection={activeSection}
                    currentData={currentData}
                    activeLang={activeLang}
                    handleChange={handleChange}
                    handleFileChange={handleFileChange}
                    handleSave={handleSave}
                    previewBanner={previewBanner}
                />
            </div>

            {
                toast && (
                    <NotificationToast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )
            }
        </div >
    );
}

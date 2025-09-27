import boCongThuongBanner from "@/assets/images/boCongThuong/bocongthuong.png";
import NotificationToast from "@/components/feature/notification-toast.jsx";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch.jsx";
import useLenisLocal from '@/hook/useLenisLocal';
import FooterView from "@/pages/managers/ConfigPage/FooterView";
import { useEffect, useState } from "react";


export default function FooterConfigMultiLang() {
    useLenisLocal(".lenis-local")
    const [activeLang, setActiveLang] = useState("vi");
    const [companyInfo, setCompanyInfo] = useState([]);
    const [services, setServices] = useState([]);
    const [socials, setSocials] = useState([]);
    const [thongBaoBoCongThuong, setThongBaoBoCongThuong] = useState([]);
    const [logoItem, setLogoItem] = useState(null);
    const [preview, setPreview] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState("company");
    const [enableBoCongThuong, setEnableBoCongThuong] = useState(false);
    const [urlBoCongThuong, setUrlBoCongThuong] = useState("");

    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

    const fetchFooter = async () => {
        try {
            setLoading(true);
            const logoRes = await fetch(
                `${API_BASE_URL}/api/section-items/type/logo?slug=header`
            );
            const logoData = await logoRes.json();
            if (logoData.length > 0) {
                setLogoItem(logoData[0]);
                setPreview(
                    logoData[0].image_url
                        ? `${API_BASE_URL}${logoData[0].image_url}`
                        : ""
                );
            }

            const infoRes = await fetch(
                `${API_BASE_URL}/api/section-items/type/company_info?slug=footer`
            );
            setCompanyInfo(await infoRes.json());

            const serviceRes = await fetch(
                `${API_BASE_URL}/api/section-items/type/services?slug=footer`
            );
            setServices(await serviceRes.json());

            const socialRes = await fetch(
                `${API_BASE_URL}/api/section-items/type/social?slug=footer`
            );
            setSocials(await socialRes.json());

            const bctRes = await fetch(
                `${API_BASE_URL}/api/section-items/type/ThongBaoBoCongThuong?slug=footer`
            );
            const bctData = await bctRes.json();
            setThongBaoBoCongThuong(bctData);

            if (bctData.length > 0) {
                const item = bctData[0];
                setEnableBoCongThuong(item.title?.vi === "true");
                setUrlBoCongThuong(item.description?.vi || "");
            }
        } catch (err) {
            console.error("Lỗi tải footer:", err);
            setToast({ message: "Lỗi tải dữ liệu footer", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFooter();
    }, [activeLang]);

    const updateSocial = (id, field, value, bothLang = false) => {
        setSocials((prev) =>
            prev.map((s) =>
                s.id === id
                    ? {
                        ...s,
                        [field]: bothLang
                            ? { vi: value, en: value }
                            : { ...s[field], [activeLang]: value },
                    }
                    : s
            )
        );
    };

    const handleChangeInfo = (id, field, value) => {
        setCompanyInfo((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        [field]: {
                            ...item[field],
                            [activeLang]: value,
                        },
                    }
                    : item
            )
        );
    };

    const updateService = (id, field, value, bothLang = false) => {
        setServices((prev) =>
            prev.map((s) =>
                s.id === id
                    ? {
                        ...s,
                        [field]: bothLang
                            ? { vi: value, en: value }
                            : { ...s[field], [activeLang]: value },
                    }
                    : s
            )
        );
    };

    const updateThongBao = (id, field, value, bothLang = false) => {
        setThongBaoBoCongThuong((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        [field]: bothLang
                            ? { vi: value, en: value }
                            : { ...item[field], [activeLang]: value },
                    }
                    : item
            )
        );
        setUrlBoCongThuong(value);
    };

    const toggleThongBaoBoCongThuong = () => {
        setEnableBoCongThuong((prev) => !prev);
    };

    const handleLogoChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const uploadImage = async (file, id, section = "logo") => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", id);
        formData.append("field", "image_url");
        formData.append("section", section);

        const res = await fetch(
            `${API_BASE_URL}/api/upload?field=image_url`,
            {
                method: "POST",
                body: formData,
            }
        );
        const result = await res.json();
        return result?.data?.url || result?.url || null;
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            if (logoItem) {
                let updatedLogo = { ...logoItem };
                if (file) {
                    const url = await uploadImage(file, logoItem.id, "logo");
                    if (url) updatedLogo.image_url = url;
                }
                await fetch(`${API_BASE_URL}/api/section-items/${logoItem.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedLogo),
                });
            }

            for (const info of companyInfo) {
                await fetch(`${API_BASE_URL}/api/section-items/${info.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(info),
                });
            }

            for (const srv of services) {
                await fetch(`${API_BASE_URL}/api/section-items/${srv.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(srv),
                });
            }

            for (const soc of socials) {
                await fetch(`${API_BASE_URL}/api/section-items/${soc.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(soc),
                });
            }

            for (const bct of thongBaoBoCongThuong) {
                const updatedBct = {
                    ...bct,
                    title: {
                        vi: String(enableBoCongThuong),
                        en: String(enableBoCongThuong),
                    },
                    description: {
                        vi: urlBoCongThuong,
                        en: urlBoCongThuong,
                    },
                };
                await fetch(`${API_BASE_URL}/api/section-items/${bct.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedBct),
                });
            }

            setToast({ message: "Lưu thành công!", type: "success" });
            setFile(null);
            fetchFooter();
        } catch (err) {
            console.error("Lỗi lưu footer:", err);
            setToast({
                message: "Lỗi khi lưu: " + err.message,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center text-xs sm:text-sm text-gray-700 admin-dark:text-gray-300 py-6">⏳ Đang tải...</p>;

    return (
        <div className="p-2 sm:p-4 md:p-6 mx-auto space-y-6 sm:space-y-8">
            <FooterView
                data={{
                    [activeLang]: {
                        logo: preview,
                        name_company:
                            companyInfo.find((f) => f.position === 2)?.description?.[activeLang] || "",
                        content_about_us:
                            companyInfo.find((f) => f.position === 6)?.description?.[activeLang] || "",
                        address_company:
                            companyInfo.find((f) => f.position === 3)?.description?.[activeLang] || "",
                        phone:
                            companyInfo.find((f) => f.position === 4)?.description?.[activeLang] || "",
                        email:
                            companyInfo.find((f) => f.position === 5)?.description?.[activeLang] || "",
                    },
                }}
                services={services.map((s) => ({
                    title: s.title?.[activeLang],
                    slug: s.description?.[activeLang],
                }))}
                socials={socials.map((s) => ({
                    title: s.title?.[activeLang],
                    url: s.description?.[activeLang],
                }))}
                privacy={[]}
                boCongThuong={{
                    enable: enableBoCongThuong && urlBoCongThuong !== "",
                    url: urlBoCongThuong,
                }}
                lang={activeLang}
            />
            <div className="border-t border-gray-300 admin-dark:border-gray-600"></div>
            <div className="space-y-6 sm:space-y-8 max-w-5xl w-full mx-auto px-2 sm:px-4">
                <div className="flex w-full xs:flex-col md:flex-row md:justify-between items-center gap-3 sm:gap-4">
                    <div className=" flex items-center justify-center  gap-2 xs:gap-3 ">
                        <div className="border border-gray-500 flex flex-col z-2 rounded-lg p-3 xs:w-full xs:flex-row items-center justify-end gap-2">
                            {/* Hiển thị ở md+ */}
                            <span >
                                {activeLang === "vi" ? "Đang thiết lập nội dung cho tiếng Việt" : "Đang thiết lập nội dung cho tiếng Anh"}
                            </span>

                            <Switch checked={activeLang === "en"} onClick={() => setActiveLang((pre) => pre === "vi" ? "en" : "vi")} />
                        </div>
                    </div>

                    <div className="flex items-center flex-wrap justify-center gap-2 xs:gap-3 border p-2  rounded-lg xs:rounded-xl bg-gray-400 admin-dark:bg-slate-900 ">
                        {[
                            { key: "company", label: "Thông tin công ty" },
                            { key: "services", label: "Dịch vụ" },
                            { key: "social", label: "Mạng xã hội" },
                            { key: "thongBaoBoCongThuong", label: "Bộ công thương" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-2 xs:text-xs cursor-pointer sm:px-3 py-1 xs:py-2 rounded-lg font-medium transition sm:flex-none text-center
                                    ${activeTab === tab.key
                                        ? "bg-indigo-500 text-white"
                                        : "bg-gray-200 admin-dark:bg-gray-700 admin-dark:text-gray-200 hover:bg-gray-300 admin-dark:hover:bg-gray-600"
                                    }`}
                            >
                                <p className="text-xs sm:text-sm">{tab.label}</p>
                            </button>
                        ))}
                    </div>

                    <Button
                        type="button"
                        onClick={handleSave}
                        className="w-full sm:w-auto px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer"
                    >
                        Lưu Cập Nhật
                    </Button>
                </div>

                {activeTab === "company" && (
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white admin-dark:bg-gray-800 shadow space-y-3 sm:space-y-4 border border-gray-300 admin-dark:border-gray-600 transition">
                        <h4 className="font-bold text-base sm:text-lg">Thông tin công ty</h4>
                        {companyInfo.map((info) => {
                            if (info.position === 1) return null;
                            const value = info.description?.[activeLang] || "";
                            const isLongText = value.length > 80;
                            return (
                                <div key={info.id} className="space-y-1 sm:space-y-2">
                                    <label className="block text-xs sm:text-sm text-gray-600 admin-dark:text-gray-300">
                                        {info.title?.[activeLang] || "Field"}
                                    </label>
                                    {isLongText ? (
                                        <textarea
                                            data-lenis-prevent
                                            value={value}
                                            onChange={(e) => handleChangeInfo(info.id, "description", e.target.value)}
                                            rows={8}
                                            className="lenis-local w-full px-3 sm:px-4 py-4 sm:py-6 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-y text-xs sm:text-sm"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => handleChangeInfo(info.id, "description", e.target.value)}
                                            className="w-full p-2 sm:p-3 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-xs sm:text-sm"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === "services" && (
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white admin-dark:bg-gray-800 shadow space-y-3 sm:space-y-4 border border-gray-300 admin-dark:border-gray-600 transition">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                            <h4 className="font-bold text-base sm:text-lg">Dịch vụ</h4>
                            <p className="text-xs sm:text-sm text-gray-500 admin-dark:text-gray-400">Không có tiêu đề dịch vụ đó sẽ không hiển thị</p>
                        </div>
                        {services.map((s) => (
                            <div key={s.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="flex flex-col gap-1 sm:gap-2">
                                    <p className="text-xs sm:text-sm text-gray-500 admin-dark:text-gray-400 whitespace-nowrap">Tiêu đề</p>
                                    <input
                                        type="text"
                                        className="w-full p-2 sm:p-3 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-xs sm:text-sm"
                                        placeholder="Tên dịch vụ"
                                        value={s.title?.[activeLang] || ""}
                                        onChange={(e) => updateService(s.id, "title", e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-2">
                                    <p className="text-xs sm:text-sm text-gray-500 admin-dark:text-gray-400 whitespace-nowrap">URL</p>
                                    {s.description?.[activeLang]?.length > 70 ? (
                                        <textarea
                                            className="w-full p-2 sm:p-3 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-y text-xs sm:text-sm"
                                            placeholder="URL"
                                            value={s.description?.[activeLang] || ""}
                                            onChange={(e) => updateService(s.id, "description", e.target.value, true)}
                                            rows={4}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="w-full p-2 sm:p-3 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-xs sm:text-sm"
                                            placeholder="URL"
                                            value={s.description?.[activeLang] || ""}
                                            onChange={(e) => updateService(s.id, "description", e.target.value, true)}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "social" && (
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white admin-dark:bg-gray-800 shadow space-y-3 sm:space-y-4 border border-gray-300 admin-dark:border-gray-600 transition">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                            <h4 className="font-bold text-base sm:text-lg">Mạng xã hội</h4>
                            <p className="text-xs sm:text-sm text-gray-500 admin-dark:text-gray-400">Không có URL mạng xã hội đó sẽ không được hiển thị</p>
                        </div>
                        {socials.map((s) => (
                            <div key={s.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <input
                                    type="text"
                                    readOnly={true}
                                    className="w-full p-2 sm:p-3 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-none transition text-xs sm:text-sm"
                                    placeholder="Tên MXH"
                                    value={s.title?.[activeLang] || ""}
                                    onChange={(e) => updateSocial(s.id, "title", e.target.value)}
                                />
                                {s.description?.[activeLang]?.length > 70 ? (
                                    <textarea
                                        className="w-full p-2 sm:p-3 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-y text-xs sm:text-sm"
                                        placeholder="URL"
                                        value={s.description?.[activeLang] || ""}
                                        onChange={(e) => updateSocial(s.id, "description", e.target.value, true)}
                                        rows={4}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full p-2 sm:p-3 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-xs sm:text-sm"
                                        placeholder="URL"
                                        value={s.description?.[activeLang] || ""}
                                        onChange={(e) => updateSocial(s.id, "description", e.target.value, true)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "thongBaoBoCongThuong" && (
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white admin-dark:bg-gray-800 shadow space-y-3 sm:space-y-4 border border-gray-300 admin-dark:border-gray-600 transition">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                            <h4 className="font-bold text-base sm:text-lg">Thông báo bộ công thương</h4>
                            <button
                                type="button"
                                onClick={toggleThongBaoBoCongThuong}
                                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold ${!enableBoCongThuong ? "bg-red-700" : "bg-green-600"
                                    } border border-gray-600 text-white`}
                            >
                                <p>{enableBoCongThuong ? "Đã" : "Chưa"}</p>
                                <span>thông báo cho bộ công thương</span>
                            </button>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {thongBaoBoCongThuong.map((bct) => (
                                <div key={bct.id} className="space-y-3 sm:space-y-4">
                                    <div className="flex flex-col gap-1 sm:gap-2">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                                            <h1 className="text-xs sm:text-sm font-semibold text-gray-600 admin-dark:text-gray-300">
                                                Đường dẫn xác thực web của bộ công thương
                                            </h1>
                                            <p className="text-xs sm:text-sm text-gray-500 admin-dark:text-gray-400">
                                                Không để đường dẫn ảnh sẽ không hiển thị
                                            </p>
                                        </div>
                                        <input
                                            type="text"
                                            disabled={!enableBoCongThuong}
                                            className={`w-full p-2 sm:p-3 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-xs sm:text-sm ${!enableBoCongThuong ? "text-gray-400 admin-dark:text-gray-600" : "text-gray-800 admin-dark:text-gray-200"
                                                }`}
                                            placeholder="URL"
                                            value={bct.description?.[activeLang] || ""}
                                            onChange={(e) => updateThongBao(bct.id, "description", e.target.value, true)}
                                        />
                                    </div>
                                    <div
                                        className={`flex justify-center ${!enableBoCongThuong ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"
                                            } select-none`}
                                    >
                                        <a
                                            href={API_BASE_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={boCongThuongBanner}
                                                alt="bộ công thương xác nhận"
                                                className="w-full max-w-[150px] sm:max-w-[200px]"
                                            />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {toast && (
                <NotificationToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

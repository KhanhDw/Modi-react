import React, { useEffect, useState } from "react";
import NotificationToast from "@/components/feature/notification-toast.jsx";
import FooterView from "@/pages/managers/ConfigPage/FooterView";
import { Button } from "@/components/ui/button";
import boCongThuongBanner from "@/assets/images/boCongThuong/bocongthuong.png";

export default function FooterConfigMultiLang() {
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
            // Logo
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

            // Company Info
            const infoRes = await fetch(
                `${API_BASE_URL}/api/section-items/type/company_info?slug=footer`
            );
            setCompanyInfo(await infoRes.json());

            // Services
            const serviceRes = await fetch(
                `${API_BASE_URL}/api/section-items/type/services?slug=footer`
            );
            setServices(await serviceRes.json());

            // Socials
            const socialRes = await fetch(
                `${API_BASE_URL}/api/section-items/type/social?slug=footer`
            );
            setSocials(await socialRes.json());

            // Bộ Công Thương
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
            setToast({ message: "❌ Lỗi tải dữ liệu footer", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFooter();
    }, [activeLang]);

    // --- Helpers update ---
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

            // Save logo
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

            // Save company info
            for (const info of companyInfo) {
                await fetch(`${API_BASE_URL}/api/section-items/${info.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(info),
                });
            }

            // Save services
            for (const srv of services) {
                await fetch(`${API_BASE_URL}/api/section-items/${srv.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(srv),
                });
            }

            // Save socials
            for (const soc of socials) {
                await fetch(`${API_BASE_URL}/api/section-items/${soc.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(soc),
                });
            }

            // Save Bộ Công Thương
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

            setToast({ message: "✅ Lưu footer thành công!", type: "success" });
            setFile(null);
            fetchFooter();
        } catch (err) {
            console.error("Lỗi lưu footer:", err);
            setToast({
                message: "❌ Lỗi khi lưu: " + err.message,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center">⏳ Đang tải...</p>;

    return (
        <div className="p-6 mx-auto space-y-12">
            {/* Preview */}
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

            {/* Config */}
            <div className="space-y-8 max-w-6xl w-full mx-auto px-4 mt-6">
                {/* Lang Tabs */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                        {["vi", "en"].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setActiveLang(lang)}
                                className={`px-5 py-2 rounded-full font-semibold shadow transition text-sm sm:text-base
                ${activeLang === lang
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 admin-dark:bg-gray-700 admin-dark:text-gray-200 hover:bg-gray-300 admin-dark:hover:bg-gray-600"
                                    }`}
                            >
                                {lang === "vi" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
                            </button>
                        ))}
                    </div>

                    {/* 3 tên tab sẽ đạt ở đây */}
                    {/* Tabs */}
                    <div className="flex gap-3 border px-2 py-1 rounded-xl bg-gray-400 admin-dark:bg-amber-600"  >
                        {[
                            { key: "company", label: "Thông tin công ty" },
                            { key: "services", label: "Dịch vụ" },
                            { key: "social", label: "Mạng xã hội" },
                            { key: "thongBaoBoCongThuong", label: "Bộ công thương" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 rounded-lg font-medium transition text-sm sm:text-base
          ${activeTab === tab.key
                                        ? "bg-indigo-500 text-white"
                                        : "bg-gray-200 admin-dark:bg-gray-700 admin-dark:text-gray-200 hover:bg-gray-300 admin-dark:hover:bg-gray-600"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <Button type="button" className=""
                        onClick={handleSave}>
                        <p className="font-semibold text-sm sm:text-base">Lưu Nội Dung</p>
                    </Button>
                </div>

                {/* Company Info */}
                {activeTab === "company" && (
                    <div className="p-4 rounded-xl bg-white admin-dark:bg-gray-800 shadow space-y-4 border border-gray-300 admin-dark:border-gray-600 transition">
                        <h4 className="font-bold text-lg">Thông tin công ty</h4>
                        {companyInfo.map((info) => {
                            if (info.position === 1) return null;
                            const value = info.description?.[activeLang] || "";
                            const isLongText = value.length > 80; // 👈 nếu dài quá thì dùng textarea
                            return (
                                <div key={info.id}>
                                    <label className="block text-sm mb-1 text-gray-600 admin-dark:text-gray-300">
                                        {info.title?.[activeLang] || "Field"}
                                    </label>
                                    {isLongText ? (
                                        <textarea
                                            value={value}
                                            onChange={(e) => handleChangeInfo(info.id, "description", e.target.value)}
                                            rows={3}
                                            className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-y"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => handleChangeInfo(info.id, "description", e.target.value)}
                                            className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* Services */}
                {activeTab === "services" && (
                    <div className="p-4 rounded-xl bg-white admin-dark:bg-gray-800 shadow space-y-4 border border-gray-300 admin-dark:border-gray-600 transition">
                        <div className="flex items-center justify-between gap-2"><h4 className="font-bold text-lg">Dịch vụ</h4>
                            <p className="text-gray-500 admin-dark:text-gray-400">Không có tiêu đề dịch vụ đó sẽ không hiển thị</p>
                        </div>
                        {services.map((s) => (
                            <div key={s.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <p className="flex flex-nowrap text-gray-500 whitespace-nowrap">Tiêu đề</p>
                                    <input
                                        type="text"
                                        className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                                        placeholder="Tên dịch vụ"
                                        value={s.title?.[activeLang] || ""}
                                        onChange={(e) => updateService(s.id, "title", e.target.value)}
                                    />
                                </div>
                                {/* nếu URL dài quá thì textarea */}
                                <div className="flex items-center gap-3">
                                    <p className="flex flex-nowrap text-gray-500 whitespace-nowrap">URL</p>
                                    {s.description?.[activeLang]?.length > 70 ? (
                                        <textarea
                                            className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-y"
                                            placeholder="URL"
                                            value={s.description?.[activeLang] || ""}
                                            onChange={(e) => updateService(s.id, "description", e.target.value, true)}
                                            rows={5}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
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
                {/* ✅ Social */}
                {activeTab === "social" && (
                    <div className="p-4 rounded-xl bg-white admin-dark:bg-gray-800 shadow space-y-4 border border-gray-300 admin-dark:border-gray-600 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h4 className="font-bold text-lg">Mạng xã hội</h4>
                            <p className="text-sm text-gray-500 admin-dark:text-gray-400">
                                Không có URL mạng xã hội đó sẽ không được hiển thị
                            </p>
                        </div>
                        {socials.map((s) => (
                            <div key={s.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    readOnly={true}
                                    className="w-full p-2 rounded border focus:outline-none focus:ring-none focus:ring-blue-300 border-gray-300 admin-dark:border-gray-600  transition"
                                    placeholder="Tên MXH"
                                    value={s.title?.[activeLang] || ""}
                                    onChange={(e) => updateSocial(s.id, "title", e.target.value)}
                                />
                                {/* textarea nếu URL quá dài */}
                                {s.description?.[activeLang]?.length > 70 ? (
                                    <textarea
                                        className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-y"
                                        placeholder="URL"
                                        value={s.description?.[activeLang] || ""}
                                        onChange={(e) => updateSocial(s.id, "description", e.target.value, true)}
                                        rows={5}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
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
                    <>
                        <div className="border border-gray-300 admin-dark:border-gray-600 p-4 rounded-xl bg-white admin-dark:bg-gray-800 shadow space-y-4 transition">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="font-bold text-lg">Thông báo bộ công thương</h4>
                                <button type="button"
                                    onClick={toggleThongBaoBoCongThuong}
                                    className={`flex ${!enableBoCongThuong ? "bg-red-700" : "bg-green-700"} border-2 border-gray-600 px-3 py-2 rounded-xl text-gray-300`}
                                >
                                    <p className="font-semibold">{enableBoCongThuong ? "Đã" : "Chưa"}</p> <span className="ml-1 font-semibold">thông báo cho bộ công thương</span>
                                </button>
                            </div>

                            <div className="flex items-center justify-center">
                                {thongBaoBoCongThuong.map((bct) => {
                                    return (<>
                                        <div className="">
                                            <div>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <h1 className="">
                                                        Đường dẫn xác thực web của bộ công thương
                                                    </h1>
                                                    <h1 className="text-gray-500 admin-dark:text-gray-400">
                                                        Không để đường dẫn ảnh sẽ không hiển thị
                                                    </h1>
                                                </div>
                                                <input
                                                    type="text"
                                                    disabled={!enableBoCongThuong}
                                                    className={`${!enableBoCongThuong ? "text-gray-400 admin-dark:text-gray-600" : "text-gray-800 admin-dark:text-gray-200"} w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition`}
                                                    placeholder="URL"
                                                    value={bct.description?.[activeLang] || ""}
                                                    onChange={(e) => updateThongBao(bct.id, "description", e.target.value, true)}
                                                />
                                            </div>
                                            <div
                                                className={`
                                                    ${!enableBoCongThuong ? "pointer-events-none cursor-not-allowed" : "cursor-pointer"
                                                    } select-none`}
                                            >
                                                <a
                                                    href={API_BASE_URL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img src={boCongThuongBanner} alt="bộ công thương xác nhận" />
                                                </a>
                                            </div>

                                        </div>
                                    </>)
                                }
                                )}
                            </div>
                        </div>
                    </>
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

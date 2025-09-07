import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NotificationToast from "@/components/feature/notification-toast.jsx";
import FooterView from "@/pages/managers/ConfigPage/FooterView";

export default function FooterConfigMultiLang() {
    const [activeLang, setActiveLang] = useState("vi");
    const [companyInfo, setCompanyInfo] = useState([]);
    const [services, setServices] = useState([]);
    const [socials, setSocials] = useState([]); // ✅ Thêm state cho social
    const [logoItem, setLogoItem] = useState(null);
    const [preview, setPreview] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

    const fetchFooter = async () => {
        try {
            setLoading(true);
            const logoRes = await fetch(`${API_BASE_URL}/api/section-items/type/logo?slug=header`);
            const logoData = await logoRes.json();
            if (logoData.length > 0) {
                setLogoItem(logoData[0]);
                setPreview(logoData[0].image_url ? `${API_BASE_URL}${logoData[0].image_url}` : "");
            }

            const infoRes = await fetch(`${API_BASE_URL}/api/section-items/type/company_info?slug=footer`);
            setCompanyInfo(await infoRes.json());

            const serviceRes = await fetch(`${API_BASE_URL}/api/section-items/type/services?slug=footer`);
            setServices(await serviceRes.json());

            // ✅ Fetch social
            const socialRes = await fetch(`${API_BASE_URL}/api/section-items/type/social?slug=footer`);
            setSocials(await socialRes.json());
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

    // ✅ Update Social
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

        const res = await fetch(`${API_BASE_URL}/api/upload?field=image_url`, {
            method: "POST",
            body: formData,
        });
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

            // ✅ Save socials
            for (const soc of socials) {
                await fetch(`${API_BASE_URL}/api/section-items/${soc.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(soc),
                });
            }

            setToast({ message: "✅ Lưu footer thành công!", type: "success" });
            setFile(null);
            fetchFooter();
        } catch (err) {
            console.error("Lỗi lưu footer:", err);
            setToast({ message: "❌ Lỗi khi lưu: " + err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center">⏳ Đang tải...</p>;

    return (
        <div className="p-6  mx-auto space-y-12">
            {/* Preview */}
            <FooterView
                data={{
                    [activeLang]: {
                        logo: preview,
                        name_company: companyInfo.find(f => f.section_type === "company_info" && f.position === 2)?.description?.[activeLang] || "",
                        content_about_us: companyInfo.find(f => f.section_type === "company_info" && f.position === 6)?.description?.[activeLang] || "",
                        address_company: companyInfo.find(f => f.section_type === "company_info" && f.position === 3)?.description?.[activeLang] || "",
                        phone: companyInfo.find(f => f.section_type === "company_info" && f.position === 4)?.description?.[activeLang] || "",
                        email: companyInfo.find(f => f.section_type === "company_info" && f.position === 5)?.description?.[activeLang] || ""
                    }
                }}
                services={services.map(s => ({ title: s.title?.[activeLang], slug: s.description?.[activeLang] }))}
                socials={socials.map(s => ({ title: s.title?.[activeLang], url: s.description?.[activeLang] }))}

                privacy={[]}
                lang={activeLang}
            />

            {/* Config */}
            <div className="space-y-8 w-6xl mx-auto">
                {/* Lang Tabs */}
                <div className="flex gap-4">
                    {["vi", "en"].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            className={`px-5 py-2 rounded-full font-semibold shadow ${activeLang === lang ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {lang === "vi" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
                        </button>
                    ))}
                </div>

                {/* Logo
                <div className="p-4 border rounded-xl bg-white shadow">
                    <label className="block mb-2 font-semibold">Logo</label>
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="w-full" />
                </div> */}

                {/* Company Info */}
                <div className="p-4 border rounded-xl bg-white shadow space-y-4">
                    <h4 className="font-bold">Thông tin công ty</h4>
                    {companyInfo.map((info) => {
                        if (info.position === 1) { return }
                        return (
                            <div key={info.id}>
                                <label className="block text-sm mb-1 text-gray-600">{info.title?.[activeLang] || "Field"}</label>
                                <input
                                    type="text"
                                    value={info.description?.[activeLang] || ""}
                                    onChange={(e) => handleChangeInfo(info.id, "description", e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                        )
                    })}
                </div>

                {/* Services */}
                <div className="p-4 border rounded-xl bg-white shadow space-y-4">
                    <h4 className="font-bold">Dịch vụ</h4>
                    {services.map((s) => (
                        <div key={s.id} className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                                placeholder="Tên dịch vụ"
                                value={s.title?.[activeLang] || ""}
                                onChange={(e) => updateService(s.id, "title", e.target.value)}
                            />
                            <input
                                type="text"
                                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                                placeholder="URL"
                                value={s.description?.[activeLang] || ""}
                                onChange={(e) => updateService(s.id, "description", e.target.value, true)}
                            />
                        </div>
                    ))}
                </div>

                {/* ✅ Social */}
                <div className="p-4 border rounded-xl bg-white shadow space-y-4">
                    <div className="w-full items-center justify-between flex">
                        <h4 className="font-bold">Mạng xã hội </h4>
                        <h4 className="font-light">Không có URL mạng xã hội đó sẽ không được hiển thị</h4>

                    </div>
                    {socials.map((s) => (
                        <div key={s.id} className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                                placeholder="Tên MXH"
                                value={s.title?.[activeLang] || ""}
                                onChange={(e) => updateSocial(s.id, "title", e.target.value)}
                            />
                            <input
                                type="text"
                                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                                placeholder="URL"
                                value={s.description?.[activeLang] || ""}
                                onChange={(e) => updateSocial(s.id, "description", e.target.value, true)}
                            />
                        </div>
                    ))}
                </div>

                {/* Save */}
                <button
                    onClick={handleSave}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl shadow hover:bg-indigo-700 transition"
                >
                    Lưu cấu hình
                </button>
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

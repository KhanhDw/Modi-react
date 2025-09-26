import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import useLenisLocal from '@/hook/useLenisLocal';

function BannerPreview({ banner, lang }) {
    return (
        <motion.div
            className="relative h-48 sm:h-56 md:h-64 flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-2xl shadow-xl"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg text-center px-2">{banner?.title?.[lang] || "Chưa có tiêu đề"}</h1>
            <p className="mt-1 sm:mt-2 p-1 sm:p-2 text-sm sm:text-base md:text-lg italic opacity-90 text-center">{banner?.slogan?.[lang] || "Chưa có slogan"}</p>
        </motion.div>
    );
}

function AboutPreview({ about, lang }) {
    return (
        <motion.div
            className="p-4 sm:p-6 bg-white admin-dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-lg space-y-3 sm:space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600 admin-dark:text-white">{about?.title?.[lang] || "Chưa có tiêu đề"}</h2>
            <p className="text-gray-600 admin-dark:text-gray-300 text-sm sm:text-base">{about?.description?.[lang] || "Chưa có mô tả"}</p>
        </motion.div>
    );
}

function VisionMissionPreview({ visionMission, lang }) {
    return (
        <motion.div
            className="p-4 sm:p-6 bg-white admin-dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-lg space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600 text-center admin-dark:text-white">
                {lang === "vi" ? "Tầm nhìn & Sứ mệnh" : "Vision & Mission"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {(visionMission || []).map((item, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center text-center p-3 sm:p-4 bg-gray-50 admin-dark:bg-gray-900 rounded-lg sm:rounded-xl shadow hover:shadow-xl transition"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                    >
                        {item.img && (
                            <img
                                src={item.img}
                                alt={item.title?.[lang]}
                                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full mb-3 sm:mb-4 shadow-lg"
                            />
                        )}
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-indigo-600 admin-dark:text-white">{item.title?.[lang]}</h3>
                        <p className="mt-1 sm:mt-2 text-gray-600 admin-dark:text-gray-300 text-sm sm:text-base">{item.description?.[lang]}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

const TextEditor = forwardRef(
    ({ label, fields, data, onChange, lang, haveImage = false }, ref) => {
        const [preview, setPreview] = useState("");
        const [isImageError, setIsImageError] = useState(false);
        useLenisLocal(".lenis-local");


        useEffect(() => {
            return () => {
                if (preview) URL.revokeObjectURL(preview);
            };
        }, [preview]);

        const handleChange = (field, value) => {
            onChange({
                ...data,
                [field]:
                    typeof data[field] === "object"
                        ? { ...data[field], [lang]: value }
                        : value,
            });
        };

        const handleFileChange = (field, file) => {
            if (!file) return;

            const tempUrl = URL.createObjectURL(file);
            setPreview(tempUrl);
            setIsImageError(false);

            handleChange(field, file);
        };

        useImperativeHandle(ref, () => ({
            async uploadImage() {
                if (data?.image_url instanceof File) {
                    const fieldName = "image_url";
                    const formData = new FormData();

                    formData.append("file", data.image_url);
                    formData.append("id", data.id);
                    formData.append("field", "image_url");
                    formData.append("section", "about");

                    try {
                        const res = await fetch(
                            `${import.meta.env.VITE_MAIN_BE_URL}/api/upload?field=${fieldName}`,
                            {
                                method: "POST",
                                body: formData,
                            }
                        );

                        const result = await res.json();
                        if (result?.url) {
                            handleChange("image_url", result.data?.url || result.url);
                            setPreview("");
                            setIsImageError(false);
                        }
                    } catch (err) {
                        console.error("Upload failed:", err);
                    }
                }
            },
        }));

        const renderImage = () => {
            if (preview) {
                return (
                    <img
                        src={preview}
                        alt="Ảnh tạm thời"
                        className="mt-2 w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg shadow border-2 border-indigo-400"
                        onError={() => setIsImageError(true)}
                    />
                );
            } else if (typeof data?.image_url === "string") {
                if (isImageError) {
                    return (
                        <div className="mt-2 w-full h-32 sm:h-40 md:h-48 flex items-center justify-center border-2 border-dashed border-red-400 rounded-lg text-red-500 text-xs sm:text-sm">
                            Ảnh lỗi
                        </div>
                    );
                }
                return (
                    <img
                        src={
                            data?.image_url
                                ? `${import.meta.env.VITE_MAIN_BE_URL}${data.image_url}`
                                : "/no-image.png"
                        }
                        alt="Ảnh fetch từ server"
                        className="mt-2 w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg shadow"
                        onError={() => setIsImageError(true)}
                    />
                );
            } else {
                if (haveImage) {
                    return (
                        <div className="mt-2 w-full h-32 sm:h-40 md:h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-xs sm:text-sm">
                            Chưa có ảnh xem trước
                        </div>
                    );
                }
            }
        };

        return (
            <div className="p-3 sm:p-4 bg-gray-50 admin-dark:bg-gray-800 rounded-lg sm:rounded-xl shadow space-y-2 sm:space-y-3">
                <h3 className="font-bold text-base sm:text-lg">{label}</h3>

                {fields.map((field) =>
                    field.name === "image_url" ? (
                        <div key={field.name} className="space-y-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleFileChange(field.name, e.target.files[0])
                                }
                                className="block w-full text-xs sm:text-sm text-gray-500 file:mr-3 sm:mr-4 file:py-1 sm:py-2 file:px-3 sm:px-4 file:rounded-full file:border-0 file:text-xs sm:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                    ) : (
                        <textarea
                            key={field.name}
                            type="text"
                            rows={5}
                            placeholder={field.placeholder}
                            value={
                                typeof data?.[field.name] === "object"
                                    ? data?.[field.name]?.[lang] || ""
                                    : data?.[field.name] || ""
                            }
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-slate-300 admin-dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs sm:text-sm"
                        />
                    )
                )}

                {renderImage()}
            </div>
        );
    }
);

function ListEditor({ section, data, onChange, lang }) {
    useLenisLocal(".lenis-local");

    const handleChange = (index, field, value) => {
        const updated = [...data];
        updated[index][field] = {
            ...updated[index][field],
            [lang]: value,
        };
        onChange(updated);
    };

    const removeItem = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    };

    const handleImageUpload = (index, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const updated = [...data];
            updated[index].img = reader.result;
            onChange(updated);
        };
        if (file) reader.readAsDataURL(file);
    };

    return (
        <div className="p-3 sm:p-4 bg-gray-50 admin-dark:bg-gray-800 rounded-lg sm:rounded-xl shadow space-y-3 sm:space-y-4">
            <h3 className="font-bold text-base sm:text-lg">{section}</h3>
            {data.map((item, index) => (
                <div key={index} className="p-2 sm:p-3 bg-white admin-dark:bg-gray-800 rounded-lg sm:rounded-xl shadow space-y-2 sm:space-y-3">
                    <input
                        type="text"
                        placeholder="Tiêu đề..."
                        value={item.title?.[lang] || ""}
                        onChange={(e) => handleChange(index, "title", e.target.value)}
                        className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-slate-300 admin-dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs sm:text-sm"
                    />
                    <textarea
                        placeholder="Mô tả..."
                        value={item.description?.[lang] || ""}
                        onChange={(e) => handleChange(index, "description", e.target.value)}
                        rows={4}
                        data-lenis-prevent
                        className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-slate-300 admin-dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs sm:text-sm"
                    />
                </div>
            ))}
        </div>
    );
}

export default function AboutConfig() {
    const aboutRef = useRef();
    const [lang, setLang] = useState("vi");

    const DEFAULT_BANNER = { title: { vi: "", en: "" }, slogan: { vi: "", en: "" } };
    const DEFAULT_ABOUT = { title: { vi: "", en: "" }, description: { vi: "", en: "" }, image_url: "" };
    const DEFAULT_VISION_MISSION = [{ title: { vi: "", en: "" }, description: { vi: "", en: "" }, img: "" }];

    const [config, setConfig] = useState({
        banner: DEFAULT_BANNER,
        about: DEFAULT_ABOUT,
        visionMission: DEFAULT_VISION_MISSION,
    });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/section-items`)
            .then((res) => res.json())
            .then((data) => {
                const banner = data.find((item) => item.section_id === 1) || {};
                const about = data.find((item) => item.section_id === 2) || {};
                const visionMission = data.filter((item) => item.section_id === 3) || [];

                setConfig({
                    banner: {
                        id: banner.id,
                        title: banner.title || { vi: "", en: "" },
                        slogan: banner.description || { vi: "", en: "" },
                    },
                    about: {
                        id: about.id,
                        title: about.title || { vi: "", en: "" },
                        description: about.description || { vi: "", en: "" },
                        image_url: about.image_url || "",
                    },
                    visionMission: visionMission.map((vm) => ({
                        id: vm.id,
                        title: vm.title || { vi: "", en: "" },
                        description: vm.description || { vi: "", en: "" },
                        img: vm.image_url || "",
                        position: vm.position || 0,
                    })),
                });
            })
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    const handleChange = (section, updated) => {
        setConfig((prev) => ({ ...prev, [section]: updated }));
    };

    const handleSave = async () => {
        try {
            if (config.banner?.id) {
                await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${config.banner.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: config.banner.title,
                        description: config.banner.slogan,
                        image_url: config.banner.image_url || "",
                        position: 0,
                    }),
                });
            }

            if (config.about?.id) {
                await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${config.about.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: config.about.title,
                        description: config.about.description,
                        image_url: typeof config.about.image_url === "string"
                            ? config.about.image_url
                            : null,
                        position: 0,
                    }),
                });
            }

            for (let i = 0; i < config.visionMission.length; i++) {
                const vm = config.visionMission[i];
                if (vm.id) {
                    await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${vm.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            title: vm.title,
                            description: vm.description,
                            image_url: typeof vm.img === "string" ? vm.img : null,
                            position: vm.position ?? i,
                        }),
                    });
                }
            }

            await aboutRef.current?.uploadImage();

            alert("Đã lưu cấu hình thành công!");
        } catch (err) {
            console.error("Save error:", err);
            alert("Có lỗi khi lưu cấu hình!");
        }
    };

    return (
        <div className="grid xs:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-2 sm:p-4 md:p-6 items-start">
            <div className="flex flex-col space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
                    <button
                        onClick={handleSave}
                        className="w-full sm:w-auto py-1 sm:py-2 px-2 sm:px-3 bg-indigo-600 text-white rounded-lg sm:rounded-xl shadow hover:bg-indigo-700 transition text-xs sm:text-sm"
                    >
                        Lưu cấu hình
                    </button>
                    <button
                        onClick={() => setLang(lang === "vi" ? "en" : "vi")}
                        className="w-full sm:w-auto py-1 sm:py-2 px-2 sm:px-3 bg-gray-900 admin-dark:bg-transparent admin-dark:border admin-dark:border-gray-600 text-white rounded-lg sm:rounded-xl shadow hover:bg-gray-700 transition text-xs sm:text-sm"
                    >
                        {lang === "vi" ? "Tiếng Việt" : "English"}
                    </button>
                </div>

                <TextEditor
                    label="Banner"
                    fields={[
                        { name: "title", placeholder: "Tiêu đề banner..." },
                        { name: "slogan", placeholder: "Slogan..." },
                    ]}
                    data={config.banner}
                    onChange={(updated) => handleChange("banner", updated)}
                    lang={lang}
                />

                <TextEditor
                    ref={aboutRef}
                    label="Giới thiệu"
                    fields={[
                        { name: "title", placeholder: "Tiêu đề..." },
                        { name: "description", placeholder: "Mô tả..." },
                        { name: "image_url", placeholder: "Link ảnh..." },
                    ]}
                    data={config.about}
                    onChange={(updated) => handleChange("about", updated)}
                    lang={lang}
                    haveImage={true}
                />

                <ListEditor
                    section="Tầm nhìn & Sứ mệnh"
                    data={config.visionMission}
                    onChange={(updated) => handleChange("visionMission", updated)}
                    lang={lang}
                />
            </div>

            <div className="space-y-4 sm:space-y-6">
                <BannerPreview banner={config.banner} lang={lang} />
                <AboutPreview about={config.about} lang={lang} />
                <VisionMissionPreview visionMission={config.visionMission} lang={lang} />
            </div>
        </div>
    );
}
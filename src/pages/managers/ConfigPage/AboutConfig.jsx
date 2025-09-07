import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import useLenisLocal from '@/hook/useLenisLocal';



// =================== COMPONENT: BANNER PREVIEW ===================
function BannerPreview({ banner, lang }) {
    return (
        <motion.div
            className="relative h-64 flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-4xl font-bold drop-shadow-lg">{banner?.title?.[lang] || "Chưa có tiêu đề"}</h1>
            <p className="mt-2 text-lg italic opacity-90">{banner?.slogan?.[lang] || "Chưa có slogan"}</p>
        </motion.div>
    );
}

// =================== COMPONENT: ABOUT PREVIEW ===================
function AboutPreview({ about, lang }) {
    return (
        <motion.div
            className="p-6 bg-white admin-dark:bg-gray-800 rounded-2xl shadow-lg space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-center text-3xl font-bold text-indigo-600">{about?.title?.[lang] || "Chưa có tiêu đề"}</h2>
            <p className="text-gray-600 admin-dark:text-gray-300">{about?.description?.[lang] || "Chưa có mô tả"}</p>
        </motion.div>
    );
}

// =================== COMPONENT: VISION & MISSION PREVIEW ===================
function VisionMissionPreview({ visionMission, lang }) {
    return (
        <motion.div
            className="p-6 bg-white admin-dark:bg-gray-800 rounded-2xl shadow-lg space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-3xl font-bold text-indigo-600 text-center">
                {lang === "vi" ? "Tầm nhìn & Sứ mệnh" : "Vision & Mission"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(visionMission || []).map((item, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center text-center p-4 bg-gray-50 admin-dark:bg-gray-900 rounded-xl shadow hover:shadow-xl transition"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                    >
                        {item.img && (
                            <img
                                src={item.img}
                                alt={item.title?.[lang]}
                                className="w-28 h-28 object-cover rounded-full mb-4 shadow-lg"
                            />
                        )}
                        <h3 className="text-xl font-semibold text-indigo-600">{item.title?.[lang]}</h3>
                        <p className="mt-2 text-gray-600 admin-dark:text-gray-300">{item.description?.[lang]}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

// =================== COMPONENT: TEXT EDITOR ===================
const TextEditor = forwardRef(
    ({ label, fields, data, onChange, lang, haveImage = false }, ref) => {
        const [preview, setPreview] = useState("");
        const [isImageError, setIsImageError] = useState(false);

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

            // tạo preview
            const tempUrl = URL.createObjectURL(file);
            setPreview(tempUrl);
            setIsImageError(false);

            // lưu file trực tiếp vào state (chưa upload)
            handleChange(field, file);
        };

        // expose upload cho parent
        useImperativeHandle(ref, () => ({
            async uploadImage() {
                if (data?.image_url instanceof File) {
                    const fieldName = "image_url"; // 👈 field động trùng với backend
                    const formData = new FormData();

                    // gửi file
                    formData.append("file", data.image_url);

                    // gửi kèm metadata
                    formData.append("id", data.id);            // id của section_item
                    formData.append("field", "image_url");     // tên field ảnh
                    formData.append("section", "about");       // tuỳ section nào


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
                            handleChange("image_url", result.data?.url || result.url); // thay file bằng url
                            setPreview(""); // bỏ preview → dùng ảnh server
                            setIsImageError(false);
                        }
                    } catch (err) {
                        console.error("Upload failed:", err);
                    }
                }
            },
        }));

        // =============== Render ảnh theo logic ưu tiên ===============
        const renderImage = () => {
            if (preview) {
                return (
                    <img
                        src={preview}
                        alt="Ảnh tạm thời"
                        className="mt-2 w-150 h-100 object-cover rounded-lg shadow border-2 border-indigo-400"
                        onError={() => setIsImageError(true)}
                    />
                );
            } else if (typeof data?.image_url === "string") {
                if (isImageError) {
                    return (
                        <div className="mt-2 w-full h-48 flex items-center justify-center border-2 border-dashed border-red-400 rounded-lg text-red-500">
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
                        className="mt-2 w-full h-48 object-cover rounded-lg shadow"
                        onError={() => setIsImageError(true)}
                    />

                );
            } else {
                if (haveImage) {
                    return (
                        <div className="mt-2 w-full h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
                            Chưa có ảnh xem trước
                        </div>
                    );
                }
            }
        };

        return (
            <div className="p-4 bg-gray-50 admin-dark:bg-gray-900 rounded-xl shadow space-y-2">
                <h3 className="font-bold text-lg">{label}</h3>

                {fields.map((field) =>
                    field.name === "image_url" ? (
                        <div key={field.name} className="space-y-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleFileChange(field.name, e.target.files[0])
                                }
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-indigo-50 file:text-indigo-700
                           hover:file:bg-indigo-100"
                            />
                        </div>
                    ) : (
                        <input
                            key={field.name}
                            type="text"
                            placeholder={field.placeholder}
                            value={
                                typeof data?.[field.name] === "object"
                                    ? data?.[field.name]?.[lang] || ""
                                    : data?.[field.name] || ""
                            }
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 admin-dark:border-slate-700 
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    )
                )}

                {renderImage()}
            </div>
        );
    }
);




// =================== COMPONENT: LIST EDITOR ===================
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
        <div className="p-4 bg-gray-50 admin-dark:bg-gray-900 rounded-xl shadow space-y-4">
            <h3 className="font-bold text-lg ">{section}</h3>
            {data.map((item, index) => (
                <div key={index} className=" p-3 bg-white admin-dark:bg-gray-800 rounded-xl shadow space-y-2">
                    <input
                        type="text"
                        placeholder="Tiêu đề..."
                        value={item.title?.[lang] || ""}
                        onChange={(e) => handleChange(index, "title", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 admin-dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <textarea
                        placeholder="Mô tả..."
                        value={item.description?.[lang] || ""}
                        onChange={(e) => handleChange(index, "description", e.target.value)}
                        rows={6}
                        data-lenis-prevent
                        className=" w-full px-3 py-2 border border-slate-300 admin-dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    {/* <div className="flex items-center gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e.target.files[0])}
                            className="flex-1 px-3 py-2 border border-slate-300 admin-dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <button
                            onClick={() => removeItem(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            <FaTrash />
                        </button>
                    </div> */}
                    {/* {item.img && (
                        <img src={item.img} alt="Preview" className="w-full h-40 object-cover rounded-lg mt-2" />
                    )} */}
                </div>
            ))}
        </div>
    );
}

// =================== MAIN CONFIG ABOUT PAGE ===================
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

    // Load config từ API
    useEffect(() => {
        fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/section-items`)
            .then((res) => res.json())
            .then((data) => {
                // lấy section_id = 1 -> banner
                const banner = data.find((item) => item.section_id === 1) || {};

                // lấy section_id = 2 -> about
                const about = data.find((item) => item.section_id === 2) || {};

                // lấy section_id = 3 -> vision + mission
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





            // Banner
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

            // About
            if (config.about?.id) {
                await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${config.about.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: config.about.title,
                        description: config.about.description,
                        // image_url: config.about.image_url || "",
                        image_url: typeof config.about.image_url === "string"
                            ? config.about.image_url
                            : null,
                        position: 0,
                    }),
                });
            }

            // Vision & Mission (nhiều item)
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
            // để ở đây để tránh bị ghe đè dữ liệu  bên server, 
            // do tách thành 2 function update và update ảnh, 
            // nêu ảnh được update đầu tiên thì lần update tiếp theo sẽ không có ảnh,
            // mà chỉ là thông tin nên ảnh cập nhật trước đó sẽ bị mất
            await aboutRef.current?.uploadImage();

            alert("Đã lưu cấu hình thành công!");
        } catch (err) {
            console.error("Save error:", err);
            alert("Có lỗi khi lưu cấu hình!");
        }
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 items-start">
            {/* Form chỉnh sửa */}
            <div className="flex flex-col  overflow-auto space-y-6">
                <div className="flex justify-between">
                    <button
                        onClick={handleSave}
                        className="py-3 px-6 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
                    >
                        Lưu cấu hình
                    </button>
                    <button
                        onClick={() => setLang(lang === "vi" ? "en" : "vi")}
                        className="py-3 px-6 bg-gray-900 admin-dark:bg-transparent admin-dark:border-2 text-white rounded-xl shadow hover:bg-gray-700 transition"
                    >
                        <p className="font-semibold">{lang === "vi" ? "Tiếng Việt" : "English"}</p>
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

            {/* Preview */}
            <div className="space-y-8">
                <BannerPreview banner={config.banner} lang={lang} />
                <AboutPreview about={config.about} lang={lang} />
                <VisionMissionPreview visionMission={config.visionMission} lang={lang} />
            </div>
        </div>
    );
}

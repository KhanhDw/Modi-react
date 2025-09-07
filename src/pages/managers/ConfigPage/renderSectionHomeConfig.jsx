import React, { useState } from "react";
import { motion } from "framer-motion";
import { InputField, TextareaField, SafeImage } from "./componentHomeConfig";

export default function RenderHomeConfig({
    activeSection,
    currentData,
    activeLang,
    handleChange,
    handleFileChange,
    handleSave,
    previewBanner,
}) {
    const renderSection = () => {
        switch (activeSection) {
            // ========================= BANNER =========================
            case "banner":
                return (
                    <div className="space-y-6">
                        {(currentData.banner || []).map((b, i) => (
                            <div
                                key={b.id ?? `banner-${i}`}
                                className="grid md:grid-cols-2 gap-6 items-center"
                            >
                                <div className="space-y-4">
                                    <InputField
                                        label="Tiêu đề"
                                        value={b.title?.[activeLang] || ""}
                                        onChange={(e) =>
                                            handleChange("banner", b.id, "title", e.target.value)
                                        }
                                    />
                                    <TextareaField
                                        label="Mô tả"
                                        value={b.description?.[activeLang] || ""}
                                        onChange={(e) =>
                                            handleChange("banner", b.id, "description", e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <InputField
                                        label="Chọn ảnh"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleFileChange("banner", b.id, e.target.files[0])
                                        }
                                    />
                                    <SafeImage
                                        src={previewBanner?.[b.id] || `${import.meta.env.VITE_MAIN_BE_URL}${b.banner}`}
                                        alt={`banner-${b.id}`}
                                        className="rounded-xl shadow-md w-full h-60 object-cover"
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="text-right">
                            <button
                                onClick={() => handleSave("banner")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
                            >
                                Lưu Banner
                            </button>
                        </div>
                    </div>
                );

            // ========================= NỀN TẢNG =========================
            case "nenTang":
                return (
                    <div className="space-y-4">
                        {(currentData.nenTang || []).map((n, i) => {
                            return <div key={n.id ?? `nenTang-${i}`}>
                                <InputField
                                    label="Tiêu đề"
                                    value={n?.title?.[activeLang] || ""}
                                    onChange={(e) =>
                                        handleChange("nenTang", n?.id, "title", e.target.value)
                                    }
                                />
                                <TextareaField
                                    label="Mô tả"
                                    value={n?.description?.[activeLang] || ""}
                                    onChange={(e) =>
                                        handleChange("nenTang", n?.id, "description", e.target.value)
                                    }
                                />
                                {n?.banner && (
                                    <SafeImage
                                        src={n.banner}
                                        alt="nenTang-banner"
                                        className="rounded-xl shadow-md w-full h-60 object-cover"
                                    />
                                )}
                            </div>
                        })}
                        <div className="text-right">
                            <button
                                onClick={() => handleSave("nenTang")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
                            >
                                Lưu Nền tảng
                            </button>
                        </div>
                    </div>
                );

            // ========================= CARDS =========================
            case "cards":
                return (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            {(currentData.cards || []).map((c, i) => (
                                <div
                                    key={c.id ?? `card-${i}`}
                                    className="p-4 rounded-xl border shadow space-y-2"
                                >
                                    <InputField
                                        label="Tiêu đề"
                                        value={c.title?.[activeLang] || ""}
                                        onChange={(e) =>
                                            handleChange("cards", c.id, "title", e.target.value)
                                        }
                                    />
                                    <TextareaField
                                        label="Mô tả"
                                        value={c.description?.[activeLang] || ""}
                                        onChange={(e) =>
                                            handleChange("cards", c.id, "description", e.target.value)
                                        }
                                    />
                                    <div className="flex w-full items-center justify-center">
                                        <div>
                                            <InputField
                                                label="Chọn ảnh"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange("cards", c.id, e.target.files[0])
                                                }
                                            />
                                            <SafeImage
                                                src={previewBanner?.[c.id] || `${import.meta.env.VITE_MAIN_BE_URL}${c.image_url}`}
                                                alt={`image_url_customer-${c.id}`}
                                                className="rounded-xl shadow-md w-full h-50 object-cover"
                                            />
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                        <div className="text-right">
                            <button
                                onClick={() => handleSave("cards")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
                            >
                                Lưu Cards
                            </button>
                        </div>
                    </div>
                );

            // ========================= DỊCH VỤ =========================
            case "dichVu":
                return (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {(currentData.dichVu || []).map((d, i) => (
                                <div
                                    key={d.id ?? `dv-${i}`}
                                    className="border rounded-xl p-4 shadow space-y-2"
                                >
                                    <InputField
                                        label="Tiêu đề"
                                        value={d.title?.[activeLang] || ""}
                                        onChange={(e) =>
                                            handleChange("dichVu", d.id, "title", e.target.value)
                                        }
                                    />
                                    <TextareaField
                                        label="Mô tả"
                                        value={d.description?.[activeLang] || ""}
                                        onChange={(e) =>
                                            handleChange("dichVu", d.id, "description", e.target.value)
                                        }
                                    />
                                    <div className="flex w-full items-center justify-center">
                                        <div>
                                            <InputField
                                                label="Chọn ảnh"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange("dichVu", d.id, e.target.files[0])
                                                }
                                            />
                                            <SafeImage
                                                src={previewBanner?.[d.id] || `${import.meta.env.VITE_MAIN_BE_URL}${d.image_url}`}
                                                alt={`image_url_dichvu-${d.id}`}
                                                className="rounded-xl shadow-md w-full h-50 object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-right">
                            <button
                                onClick={() => handleSave("dichVu")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
                            >
                                Lưu Dịch vụ
                            </button>
                        </div>
                    </div>
                );

            // ========================= LỢI ÍCH =========================
            case "loiIch":
                return (
                    <div className="space-y-6">
                        {(currentData?.loiIch || []).map((item, i) => (
                            <div
                                key={item.id ?? `li-${i}`}
                                className="p-4 rounded-xl border shadow space-y-2"
                            >
                                <InputField
                                    label="Tiêu đề"
                                    value={item.title?.[activeLang] || ""}
                                    onChange={(e) =>
                                        handleChange("loiIch", item.id, "title", e.target.value)
                                    }
                                />
                                <TextareaField
                                    label="Mô tả (cách dòng = xuống hàng)"
                                    value={item.description?.[activeLang] || ""}
                                    onChange={(e) =>
                                        handleChange("loiIch", item.id, "description", e.target.value)
                                    }
                                />
                            </div>
                        ))}
                        <div className="text-right">
                            <button
                                onClick={() => handleSave("loiIch")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
                            >
                                Lưu Lợi ích
                            </button>
                        </div>
                    </div>
                );

            // ========================= KHẨU HIỆU =========================
            case "khauHieu":
                return (
                    <div className="space-y-6">
                        {(currentData?.khauHieu || []).map((k, i) => (
                            <div key={k.id ?? `kh-${i}`} className="space-y-4">
                                <InputField
                                    label="Slogan"
                                    value={k.title?.[activeLang] || ""}
                                    onChange={(e) =>
                                        handleChange("khauHieu", k.id, "title", e.target.value)
                                    }
                                />

                                <div className="overflow-hidden whitespace-nowrap mt-4 bg-gray-100 p-3 rounded-lg">
                                    <motion.div
                                        animate={{ x: ["100%", "-100%"] }}
                                        transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
                                        className="inline-block w-full font-semibold text-indigo-600"
                                    >
                                        {k.title?.[activeLang] || ""}
                                    </motion.div>
                                </div>
                            </div>
                        ))}

                        <div className="text-right">
                            <button
                                onClick={() => handleSave("khauHieu")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
                            >
                                Lưu Khẩu hiệu
                            </button>
                        </div>
                    </div>
                );


            // ========================= KHÁCH HÀNG =========================
            case "khachHang":
                return (
                    <div className="space-y-6">
                        {(currentData?.khachHang || []).map((k, i) => (
                            <div key={k.id ?? `kh-${i}`} className="space-y-4 border p-4 rounded-lg shadow-sm">
                                <TextareaField
                                    label="Mô tả"
                                    value={k?.description?.[activeLang] || ""}
                                    onChange={(e) =>
                                        handleChange("khachHang", k.id, "description", e.target.value)
                                    }
                                />
                                
                                {/* không có chọn ảnh */}
                                <div hidden className="flex w-full items-center justify-center">
                                    <div>
                                        <InputField
                                            label="Chọn ảnh"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleFileChange("khachHang", k.id, e.target.files[0])
                                            }
                                        />
                                        <SafeImage
                                            src={previewBanner?.[k.id] || `${import.meta.env.VITE_MAIN_BE_URL}${k.image_url}`}
                                            alt={`image_url_customer-${k.id}`}
                                            className="rounded-xl shadow-md w-200 h-100 object-cover"
                                        />
                                    </div>
                                </div>

                            </div>
                        ))}

                        <div className="text-right">
                            <button
                                onClick={() => handleSave("khachHang")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
                            >
                                Lưu Khách hàng
                            </button>
                        </div>
                    </div>
                );


            default:
                return null;
        }
    };

    return renderSection();
}

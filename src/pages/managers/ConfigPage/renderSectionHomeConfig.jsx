import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { InputField, TextareaField, SafeImage } from "./componentHomeConfig";
import VitriTable from "@/pages/managers/ConfigPage/homeConfig/PositionConfig.jsx";
import { IoMdInformationCircleOutline } from "react-icons/io";
import NotificationToast from "@/components/feature/notification-toast.jsx";
import { Eye } from "lucide-react";
import ChitietdichvuSection from "@/pages/managers/ConfigPage/renderSections/chitietdichvuSection.jsx";
import PricingPage from "@/components/home/PricingSlider.jsx";



export default function RenderHomeConfig({
    activeSection,
    currentData,
    activeLang,
    handleChange,
    handleFileChange,
    handleSave,
    previewBanner,
}) {


    // ========== vị trí ====================
    const [vitri, setVitri] = useState([]);
    const [defaultVitri, setDefaultVitri] = useState([]); // giữ mặc định
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [positionsDefault, setPositionsDefault] = useState([]);
    const [toast, setToast] = useState(null);


    const FetchResetPositions = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/service-header-config/positions/default`,
            );

            if (!res.ok) {
                throw new Error(`Lỗi HTTP: ${res.status}`);
            }
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Reset positions thất bại");
            }
            setPositionsDefault(data.data);
        } catch (err) {
            console.error("❌ Fetch reset positions error:", err);
        }
    };

    const FetchPositionComponentHome = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/sections?slug=home`
            );
            if (!res.ok) {
                throw new Error(`Lỗi HTTP: ${res.status}`);
            }
            const data = await res.json();
            // Kiểm tra dữ liệu hợp lệ
            if (!data.data || !Array.isArray(data.data)) {
                throw new Error('Dữ liệu không đúng định dạng hoặc rỗng');
            }
            const clonedData = JSON.parse(JSON.stringify(data.data));
            setVitri(clonedData);
            setDefaultVitri(clonedData);
        } catch (err) {
            console.error('Fetch vitri error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isVitriSameAsDefault = (vitri) => {
        if (!vitri || vitri.length !== positionsDefault.length) return false;

        return positionsDefault.every((item) => {
            const dbItem = vitri.find((v) => v.type === item.key);
            return dbItem && dbItem.position === item.position;
        });
    };

    useEffect(() => {
        FetchResetPositions();
        FetchPositionComponentHome();
    }, []);


    const handleResetDefault = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/service-header-config/positions/reset`,
                {
                    method: "POST",
                }
            );
            if (!res.ok) {
                throw new Error(`Lỗi HTTP: ${res.status}`);
            }
            await FetchPositionComponentHome();
            setToast({ message: "Khôi phục vị trí thành công", type: "success" });
        } catch (err) {
            console.error('Fetch vitri error:', err);
            setError(err.message);
            setToast({ message: "Khôi phục vị trí thất bại", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // FIX: Callback để nhận dữ liệu từ VitriTable
    const handleVitriChange = (newVitri) => {
        setVitri(newVitri);
    };


    const savePositions = async (vitriUpdate) => {
        try {
            // chỉ gửi key cần thiết
            const positions = vitriUpdate.map((s) => ({
                key: s.type,
                position: s.position,
            }));

            const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/service-header-config/positions/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ positions }),
            });

            if (!res.ok) throw new Error("Lỗi khi gọi API");

            const data = await res.json();
            console.log(data.message);
            setToast({ message: "Lưu vị trí thành công", type: "success" });
            await FetchPositionComponentHome();
            isVitriSameAsDefault(defaultVitri);
        } catch (error) {
            console.error("❌ Lỗi khi lưu vị trí:", error);
            setToast({ message: "Lưu vị trí thất bại", type: "error" });
        }
    };
    // ========== kết thúc vị trí ====================

    ///////////////////////////////////////////////

    // ========== chi tiết dịch vụ ===================

    const [isViewTable, setIsViewTable] = useState(false);


    // ========== kết thúc chi tiết dịch vụ ===================

    ///////////////////////////////////////////////

    const renderSection = () => {
        switch (activeSection) {
            // ========================= vị trí =========================
            case "vitri":
                return (
                    <div className="space-y-4">
                        <div>
                            <h1 className="font-bold text-base md:text-xl mb-4 text-center uppercase">
                                Cấu hình vị trí cho các mục tại trang chủ
                            </h1>
                        </div>

                        <div>
                            {loading ? (
                                <div className="text-center py-6 text-gray-500">
                                    Đang tải dữ liệu...
                                </div>
                            ) : vitri.length > 0 ? (
                                <VitriTable
                                    initialVitri={vitri}
                                    onChangeVitri={handleVitriChange}
                                />
                            ) : (
                                <div className="text-center py-6 text-red-500">
                                    Không có dữ liệu
                                </div>
                            )}
                        </div>

                        {!loading && (
                            <div className="flex flex-col md:flex-col xl:flex-row justify-between items-center">
                                <div className="flex items-center w-full justify-center xl:w-100 xl:justify-start gap-2 text-gray-500">
                                    <IoMdInformationCircleOutline />
                                    <span>Kéo thả để thay đổi vị trí</span>
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
                                <div className="flex flex-col items-center md:flex-row justify-end gap-3 w-full mt-5">
                                    {/* Nút khôi phục (chỉ restore lại vitri chưa lưu) */}
                                    <button
                                        onClick={() => setVitri(defaultVitri)} // khôi phục lại vitri gốc từ DB
                                        disabled={JSON.stringify(vitri) === JSON.stringify(defaultVitri)}
                                        className={`font-bold w-full sm:w-60 md:w-90 xl:w-60 py-2 cursor-pointer px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105
                                        ${JSON.stringify(vitri) === JSON.stringify(defaultVitri)
                                                ? "bg-gray-200 hover:bg-gray-300 cursor-not-allowed admin-dark:bg-gray-500"
                                                : "bg-blue-500 hover:bg-blue-700 text-white"
                                            }`}
                                    >
                                        <span className="text-sm sm:text-base font-semibold">Khôi phục</span>
                                    </button>

                                    {/* Nút khôi phục mặc định (reset DB về positionsDefault) */}
                                    <button
                                        onClick={handleResetDefault}
                                        disabled={isVitriSameAsDefault(defaultVitri)} // nếu DB đã đúng mặc định thì disable
                                        className={`font-bold w-full sm:w-60 md:w-full xl:w-60 cursor-pointer py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105
                                        ${isVitriSameAsDefault(defaultVitri)
                                                ? "bg-gray-200 hover:bg-gray-300 cursor-not-allowed admin-dark:bg-gray-500"
                                                : "bg-blue-500 hover:bg-blue-700 text-white"
                                            }`}
                                    >
                                        <span className="text-sm sm:text-base font-semibold">Khôi phục lại mặc định</span>
                                    </button>

                                    <button
                                        onClick={() => savePositions(vitri)}
                                        disabled={JSON.stringify(vitri) === JSON.stringify(defaultVitri)}
                                        className={`font-bold w-full sm:w-60 md:w-90 xl:w-60 py-2 px-6 cursor-pointer rounded-full transition duration-300 ease-in-out transform hover:scale-105
                                        ${JSON.stringify(vitri) === JSON.stringify(defaultVitri)
                                                ? "bg-gray-200 hover:bg-gray-300 cursor-not-allowed admin-dark:bg-gray-500"
                                                : "bg-green-500 hover:bg-green-700 text-white"
                                            }`}

                                    >
                                        <span className="text-sm sm:text-base font-semibold">Lưu vị trí</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            // ========================= BANNER =========================
            case "banner":
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">Cấu hình thông tin và ảnh banner</h1>
                        </div>
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
                                        className="rounded-xl shadow-md w-full h-60 object-cover mt-4"
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="text-center md:text-right">
                            <button
                                onClick={() => handleSave("banner")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
                            >
                                <span className="font-semibold text-sm sm:text-base">Lưu Banner</span>
                            </button>
                        </div>
                    </div>
                );

            // ========================= NỀN TẢNG =========================
            case "nenTang":
                return (
                    <div className="space-y-4">
                        <div><h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">Cấu hình thông tin nền tảng</h1></div>
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
                                        className="rounded-xl shadow-md w-full h-60 object-cover mt-4"
                                    />
                                )}
                            </div>
                        })}
                        <div className="text-center md:text-right">
                            <button
                                onClick={() => handleSave("nenTang")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
                            >
                                <span className="font-semibold text-sm sm:text-base">Lưu Nền tảng</span>
                            </button>
                        </div>
                    </div>
                );

            // ========================= CARDS =========================
            case "cards":
                return (
                    <div className="space-y-6">
                        <div><h1 className="uppercase font-bold text-base md:text-xl text-center border-b-2 pb-6">Cấu hình thông tin cho 3 thẻ nội dung</h1></div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {(currentData.cards || []).map((c, i) => (
                                <div
                                    key={c.id ?? `card-${i}`}
                                    className="p-2 sm:p-3 rounded-lg border shadow space-y-2"
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
                                    <div className="flex w-full items-center justify-start">
                                        <div className="w-full">
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
                                                className="rounded-xl shadow-md w-full h-50 object-cover mt-4"
                                            />
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                        <div className="text-center md:text-right">
                            <button
                                onClick={() => handleSave("cards")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
                            >
                                <span className="font-semibold text-sm sm:text-base">Lưu Cards</span>
                            </button>
                        </div>
                    </div>
                );

            // ========================= DỊCH VỤ =========================
            case "dichVu":
                return (
                    <div className="space-y-6">
                        <div><h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">Cấu hình thông tin cho 6 nhóm dịch vụ chính</h1></div>
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
                                        <div className="w-full">
                                            <InputField
                                                label="Chọn ảnh"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange("dichVu", d.id, e.target.files[0])}
                                                className="w-full"
                                            />
                                            <SafeImage
                                                src={
                                                    previewBanner?.[d.id] ||
                                                    `${import.meta.env.VITE_MAIN_BE_URL}${d.image_url}`
                                                }
                                                alt={`image_url_dichvu-${d.id}`}
                                                className="rounded-xl shadow-md w-full h-52 object-cover mt-4"
                                            />
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                        <div className="text-center md:text-right">
                            <button
                                onClick={() => handleSave("dichVu")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
                            >
                                <span className="font-semibold text-sm sm:text-base">Lưu Dịch vụ</span>
                            </button>
                        </div>
                    </div>
                );

            // ========================= CHI TIẾT DỊCH VỤ =========================
            case "chitietdichvu":
                return (
                    <div className="space-y-6">
                        {/* header */}
                        <div className="flex items-center justify-between border-b-2 pb-2">
                            <h1 className="uppercase font-bold text-2xl mb-4 text-center ">CẤU HÌNH NỘI DUNG CHI TIẾT DỊCH VỤ</h1>
                            <div>
                                <button onClick={() => setIsViewTable((pre) => !pre)} className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300">

                                    {!isViewTable && <div className="flex items-center gap-2"><Eye className="w-5 h-5" /><span>Xem thử giao diện</span></div>}
                                    {isViewTable && <span>Quay lại</span>}
                                </button>
                            </div>
                        </div>
                        {/* body */}
                        <div className="">
                            {!isViewTable && <div>
                                <ChitietdichvuSection />
                            </div>}
                            {isViewTable && <div>
                                <PricingPage />
                            </div>}
                        </div>
                    </div>
                );

            // ========================= LỢI ÍCH =========================
            case "loiIch":
                return (
                    <div className="space-y-6">
                        <div><h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">CẤU HÌNH NỘI DUNG lợi ích của công ty mang đến cho khách hàng</h1></div>

                        {(currentData?.loiIch || []).map((item, i) => (
                            <div
                                key={item.id ?? `li-${i}`}
                                className="rounded-xl shadow space-y-2"
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
                        <div className="text-center md:text-right">
                            <button
                                onClick={() => handleSave("loiIch")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
                            >
                                <span className="font-semibold text-sm sm:text-base">Lưu Lợi ích</span>
                            </button>
                        </div>
                    </div>
                );

            // ========================= KHẨU HIỆU =========================
            case "khauHieu":
                return (
                    <div className="space-y-6">
                        <div><h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">CẤU HÌNH NỘI DUNG khẩu hiệu của công ty</h1></div>

                        {(currentData?.khauHieu || []).map((k, i) => (
                            <div key={k.id ?? `kh-${i}`} className="space-y-4">
                                <InputField
                                    label="Slogan"
                                    value={k.title?.[activeLang] || ""}
                                    onChange={(e) =>
                                        handleChange("khauHieu", k.id, "title", e.target.value)
                                    }
                                />

                                <div className="overflow-hidden whitespace-nowrap mt-4 bg-gray-100 p-3 rounded-lg admin-dark:bg-gray-900">
                                    <motion.div
                                        animate={{ x: ["100%", "-100%"] }}
                                        transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
                                        className="inline-block w-full font-semibold text-indigo-600 admin-dark:text-white"
                                    >
                                        {k.title?.[activeLang] || ""}
                                    </motion.div>
                                </div>
                            </div>
                        ))}

                        <div className="text-center md:text-right">
                            <button
                                onClick={() => handleSave("khauHieu")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
                            >
                                <span className="font-semibold text-sm sm:text-base">Lưu Khẩu hiệu</span>
                            </button>
                        </div>
                    </div>
                );


            // ========================= KHÁCH HÀNG =========================
            case "khachHang":
                return (
                    <div className="space-y-6">
                        <div><h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">CẤU HÌNH NỘI DUNG cam kết với khách hàng</h1></div>

                        {(currentData?.khachHang || []).map((k, i) => (
                            <div key={k.id ?? `kh-${i}`} className="space-y-4 rounded-lg shadow-sm">
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
                                            className="rounded-xl shadow-md w-200 h-100 object-cover mt-2"
                                        />
                                    </div>
                                </div>

                            </div>
                        ))}

                        <div className="text-center md:text-right">
                            <button
                                onClick={() => handleSave("khachHang")}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
                            >
                                <span className="font-semibold text-sm sm:text-base">Lưu Khách hàng</span>
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

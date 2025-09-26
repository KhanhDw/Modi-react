import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Globe, CheckCircle, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import React, { useState, useEffect } from "react";

export default function ReaderDetailService() {
    const { slug } = useParams();
    const { initDataService } = useOutletContext();
    const navigate = useNavigate();

    const [isEnglish, setIsEnglish] = useState(false);
    const [fetchData, setFetchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const serviceInit = initDataService.find((s) => s.translation?.slug === slug);

    const FetchDataServicesALL = async (lang = "vi") => {
        if (!serviceInit) return;
        setLoading(true);
        setError(null);
        try {
            const lang_api = lang === "vi" ? "" : "/en";
            const res = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}${lang_api}/api/services`
            );
            if (!res.ok) throw new Error("Không thể tải dữ liệu");
            const data = await res.json();
            if (data.success) {
                const matched = data.data.find((s) => s.id === serviceInit.id);
                setFetchData(matched || null);
            } else {
                setError("Dữ liệu không hợp lệ từ API");
            }
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (serviceInit) {
            FetchDataServicesALL(isEnglish ? "en" : "vi");
        }
    }, [slug, isEnglish]);

    const toggleLanguage = () => setIsEnglish((prev) => !prev);

    if (!serviceInit) {
        return (
            <p className="text-red-500 admin-dark:text-red-400 text-center mt-10 text-lg font-medium">
                Không tìm thấy dịch vụ
            </p>
        );
    }

    const service = fetchData || serviceInit;

    const features = service.translation?.features
        ? service.translation.features.split("#").map((f) => f.trim()).filter(Boolean)
        : [];

    const details = service.translation?.details
        ? service.translation.details.split("#").map((d) => d.trim()).filter(Boolean)
        : [];

    const imageUrl = service.image_url?.startsWith("http")
        ? service.image_url
        : `${import.meta.env.VITE_MAIN_BE_URL}${service.image_url}`;

    return (
        <div className="container mx-auto py-8 w-full">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6">
                <div className="w-full flex items-center gap-2 justify-between">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-gray-900 admin-dark:text-gray-300 admin-dark:hover:text-white transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Quay lại danh sách
                    </Button>

                    <div className="flex items-center justify-between gap-5 font-semibold text-gray-800 admin-dark:text-gray-200">
                        {isEnglish ? "Tiếng Anh" : "Tiếng Việt"}
                        <Switch
                            onClick={toggleLanguage}
                            checked={isEnglish}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <p className="text-center text-gray-500 admin-dark:text-gray-400 mt-10">
                    Đang tải dữ liệu...
                </p>
            )}

            {/* Error */}
            {error && (
                <p className="text-center text-red-500 admin-dark:text-red-400 mt-10 font-medium">
                    {error}
                </p>
            )}

            {/* Nội dung */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start animate-fade-in-up">
                    {/* Cột trái: Hình ảnh */}
                    {service.image_url && (
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl group transition-transform duration-500">
                            <div
                                className="w-full h-[400px] md:h-[600px] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url('${imageUrl}')` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white z-10">
                                <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
                                    {service.translation?.ten_dich_vu || "Chưa có tên"}
                                </h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {service.totalLanguages?.map((lang, index) => (
                                        <Badge
                                            key={index}
                                            className={`flex items-center gap-1 font-semibold ${lang === "vi"
                                                ? "bg-red-500 hover:bg-red-600"
                                                : "bg-blue-500 hover:bg-blue-600"
                                                } transition-colors`}
                                        >
                                            <Globe size={14} />
                                            {lang.toUpperCase()}
                                        </Badge>
                                    ))}
                                    <Badge
                                        className={`flex items-center gap-1 font-semibold ${service.status === "Active"
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-gray-500 hover:bg-gray-600"
                                            } transition-colors`}
                                    >
                                        {service.status === "Active" ? (
                                            <>
                                                <CheckCircle size={14} /> Hoạt động
                                            </>
                                        ) : (
                                            <>
                                                <XCircle size={14} /> Không hoạt động
                                            </>
                                        )}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cột phải: Thông tin chi tiết */}
                    <div className="space-y-8 animate-fade-in-up delay-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Giá */}
                            <Card className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] admin-dark:bg-gray-800">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <DollarSign className="text-green-500 flex-shrink-0 w-8 h-8" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 admin-dark:text-gray-400">
                                            Giá khởi điểm
                                        </p>
                                        <p className="text-xl font-bold text-green-600 admin-dark:text-green-400">
                                            {service.floor_price
                                                ? `₫${Number(service.floor_price).toLocaleString()}`
                                                : "Chưa có"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Lượt đặt */}
                            <Card className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] admin-dark:bg-gray-800">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-blue-500 flex-shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 admin-dark:text-gray-400">
                                            Số lần đặt
                                        </p>
                                        <p className="text-xl font-bold text-gray-900 admin-dark:text-white ">
                                            {service.booking_count || 0}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Mô tả */}
                        <div className="space-y-4 pt-4 border-t border-gray-200 admin-dark:border-gray-700">
                            <h3 className="text-2xl font-bold text-gray-900 admin-dark:text-white">
                                Mô tả dịch vụ
                            </h3>
                            <p className="leading-relaxed text-gray-700 admin-dark:text-gray-300">
                                {service.translation?.mo_ta || "Chưa có mô tả chi tiết."}
                            </p>
                        </div>

                        {/* Features */}
                        {features.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-gray-200 admin-dark:border-gray-700">
                                <h3 className="text-2xl font-bold text-gray-900 admin-dark:text-white">
                                    Điểm nổi bật
                                </h3>
                                <ul className="list-none space-y-3">
                                    {features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle
                                                size={20}
                                                className="text-green-500 flex-shrink-0 mt-1"
                                            />
                                            <p className="text-gray-700 admin-dark:text-gray-300">{f}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Details */}
                        {details.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-gray-200 admin-dark:border-gray-700">
                                <h3 className="text-2xl font-bold text-gray-900 admin-dark:text-white">
                                    Chi tiết dịch vụ
                                </h3>
                                <div className="space-y-4 text-gray-700 admin-dark:text-gray-300">
                                    {details.map((d, i) => (
                                        <p key={i} className="leading-relaxed">
                                            {d}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

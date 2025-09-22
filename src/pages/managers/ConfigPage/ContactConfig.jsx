import React, { useState, useEffect } from "react";

export default function ContactConfig() {
    const [companyName, setCompanyName] = useState("");
    const [mapUrl, setMapUrl] = useState("");            // URL đang nhập
    const [savedMapUrl, setSavedMapUrl] = useState("");  // URL sau khi lưu
    const [companyInfo, setCompanyInfo] = useState([]);
    const [activeLang, setActiveLang] = useState("vi");

    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

    const fetchNameCompanyFooter = async () => {
        try {
            const infoRes = await fetch(
                `${API_BASE_URL}/api/section-items/type/company_info?slug=footer`
            );
            const data = await infoRes.json();
            setCompanyInfo(data);

            // Tìm title tên công ty
            const nameItem = data.find(item => item?.title?.vi === "Tên công ty");

            if (nameItem) {
                // Lấy tên theo ngôn ngữ activeLang, fallback về vi
                setCompanyName(nameItem.description?.[activeLang] || nameItem.description?.vi || "");
            }
        } catch (err) {
            alert("Lỗi tải dữ liệu công ty");
        }
    };

    // Khi activeLang thay đổi, cập nhật lại companyName nếu có data
    useEffect(() => {
        if (companyInfo.length > 0) {
            const nameItem = companyInfo.find(item => item?.title?.vi === "Tên công ty");
            if (nameItem) {
                setCompanyName(nameItem.description?.[activeLang] || nameItem.description?.vi || "");
            }
        }
    }, [activeLang, companyInfo]);

    useEffect(() => {
        fetchNameCompanyFooter(activeLang);
    }, [activeLang]);

    const handleSaveName = async () => {
        const nameItem = companyInfo.find(item => item?.title?.vi === "Tên công ty");

        // Cập nhật tên công ty
        nameItem.description[activeLang] = companyName;

        const response = await fetch(`${API_BASE_URL}/api/section-items/${nameItem.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nameItem),
        });

        if (response.ok) {
            alert("Đã lưu tên công ty thành công");
            fetchNameCompanyFooter(activeLang);
        } else {
            alert("Lưu thất bại");
        }
    };

    const handleSave = () => {
        setSavedMapUrl(mapUrl); // Lưu URL
        console.log("Saved Map URL:", mapUrl);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4 md:p-3 lg:p-2 items-start min-h-screen">
            {/* Left: thông tin và lưu địa chỉ map */}
            <div className="lg:col-span-2 col-span-1 space-y-4">

                {/* Nút chuyển ngôn ngữ */}
                {/* <div className="flex space-x-2 mb-6">
                    {['vi', 'en'].map((lang) => (
                        <button
                            key={lang}
                            className={`px-4 py-2 rounded-md shadow-md cursor-pointer font-medium transition ${activeLang === lang
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                                }`}
                            onClick={() => setActiveLang(lang)}
                        >
                            {lang === "vi" ? "Tiếng Việt" : "English"}
                        </button>
                    ))}
                </div> */}

                <div className="flex items-center justify-end space-x-3 mb-6">
                    <span className="text-base font-medium admin-dark:text-white text-gray-900">
                        {activeLang === 'vi' ? 'Tiếng Việt' : 'English'}
                    </span>

                    <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 cursor-pointer">
                        <input
                            type="checkbox"
                            id="language-switch"
                            className="peer sr-only"
                            checked={activeLang === 'en'}
                            onChange={(e) => setActiveLang(e.target.checked ? 'en' : 'vi')}
                        />
                        <label
                            htmlFor="language-switch"
                            className="block h-6 bg-gray-400 rounded-full peer-checked:bg-blue-600 transition duration-300 ease-in-out cursor-pointer"
                        ></label>
                        <span
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out peer-checked:translate-x-6 cursor-pointer"
                        ></span>
                    </div>
                </div>

                {/* Tên công ty */}
                <div>
                    <label className="block text-sm md:text-[18px] lg:text-[20px] font-medium mb-3 admin-dark:text-white text-gray-900">
                        {activeLang === "vi" ? "Tên công ty" : "Company Name"}
                    </label>
                    <input
                        type="text"
                        placeholder={activeLang === "vi" ? "Nhập tên công ty..." : "Enter company name..."}
                        className="w-full border-2 shadow-sm border-slate-300 admin-dark:border-slate-700 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>

                {/* Nút lưu */}
                <button
                    className="inline-flex shadow-md h-10 items-center justify-center rounded bg-blue-600 px-6 text-sm font-medium text-white transition active:scale-110 hover:bg-blue-700 cursor-pointer"
                    onClick={handleSaveName}
                >
                    {activeLang === "vi" ? "Lưu" : "Save"}
                </button>

                {/* URL Google Map */}
                <div>
                    <label className="block text-sm md:text-[18px] lg:text-[20px] font-medium mb-3 admin-dark:text-white text-gray-900">
                        {activeLang === "vi" ? "Địa chỉ Google Map" : "Google Map URL"}
                    </label>
                    <textarea
                        placeholder={
                            activeLang === "vi"
                                ? "Nhập URL Google Maps vào đây..."
                                : "Enter Google Maps URL..."
                        }
                        className="w-full border-2 shadow-sm border-slate-300 admin-dark:border-slate-700 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none"
                        value={mapUrl}
                        onChange={(e) => setMapUrl(e.target.value)}
                        rows={4}
                    />
                </div>

                {/* Nút lưu */}
                <button
                    className="inline-flex h-10 shadow-md items-center justify-center rounded bg-blue-600 px-6 text-sm font-medium text-white transition active:scale-110 hover:bg-blue-700 cursor-pointer"
                    onClick={handleSave}
                >
                    {activeLang === "vi" ? "Lưu" : "Save"}
                </button>

                {/* Hiển thị URL đã lưu */}
                {savedMapUrl && (
                    <span className="block text-sm text-gray-900 font-medium admin-dark:text-gray-300">
                        {activeLang === "vi" ? "Địa chỉ Url Google Map:" : "Saved Google Map URL:"} <br />
                        <span className="text-blue-600 break-all">{savedMapUrl}</span>
                    </span>
                )}
            </div>

            {/* Right: Preview bản đồ */}
            <div className="lg:col-span-3 shadow-sm h-[700px] border border-slate-300 rounded-md overflow-hidden admin-dark:border-slate-700">
                {savedMapUrl ? (
                    <iframe
                        src={savedMapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                ) : (
                    <div className="w-full h-full shadow-sm flex items-center justify-center text-gray-400 italic">
                        {activeLang === "vi"
                            ? 'Nhập URL bản đồ Google và bấm "Lưu địa chỉ" để xem trước tại đây'
                            : 'Enter Google Map URL and click "Save" to preview here'}
                    </div>
                )}
            </div>
        </div>
    );
}

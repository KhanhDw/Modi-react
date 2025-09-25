import React, { useState } from "react";
import * as XLSX from "xlsx";
import useLenisLocal from '@/hook/useLenisLocal';

function ExcelDataUploader({ openDialogImportCustomer, setOpenDialogImportCustomer }) {
    useLenisLocal(".lenis-local");

    const [excelData, setExcelData] = useState(null);
    const [fileName, setFileName] = useState("");

    const columnHeaders = {
        name: "Họ và tên",
        phone: "Số điện thoại",
        email: "Email",
        address: "Địa chỉ",
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const text = event.target.result;
                // Đọc file CSV với mã hóa UTF-8
                const workbook = XLSX.read(text, { type: "string", codepage: 65001 });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                const normalized = json.map((row) => ({
                    name: row.name || "",
                    phone: row.phone || "",
                    email: row.email || "",
                    address: row.address || "",
                    type: "new",
                    status: "active",
                    total_spent: "0",
                    booking_count: "0",
                }));

                setExcelData(normalized);
            } catch (error) {
                console.error("Lỗi khi đọc file CSV:", error);
                setExcelData(null);
                alert("Lỗi khi đọc file CSV. Vui lòng kiểm tra lại định dạng hoặc mã hóa.");
            }
        };

        // Đọc file dưới dạng text với UTF-8
        reader.readAsText(file, "UTF-8");
    };

    const handleDownloadTemplate = () => {
        const templateData = [
            ["name", "phone", "email", "address"],
            ["Nguyễn Văn A", "0912345678", "nguyenvana@example.com", "123 Đường ABC, Quận 1"],
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(templateData);
        const csvOutput = XLSX.utils.sheet_to_csv(worksheet, { FS: "," });

        // Thêm BOM cho UTF-8
        const bom = "\uFEFF"; // Byte Order Mark
        const blob = new Blob([bom + csvOutput], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mau_khach_hang.csv"; // Lưu dưới dạng .csv thay vì .xlsx
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleClearData = () => {
        setFileName("");
        setExcelData(null);
        const fileInput = document.getElementById("file-upload");
        if (fileInput) fileInput.value = "";
    };

    const UploadIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14 text-gray-400 admin-dark:text-gray-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
        </svg>
    );

    const handleImportData = async () => {
        if (!excelData || excelData.length === 0) {
            alert("Vui lòng tải lên một file Excel hợp lệ trước khi nhập.");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/customers/bulk`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customers: excelData }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Nếu có trùng (409) thì hiển thị duplicates
                if (res.status === 409 && data.duplicates) {
                    console.warn("Khách hàng bị trùng:", data.duplicates);
                    alert(
                        `Có ${data.duplicates.length} khách hàng bị trùng (số điện thoại/email). Vui lòng xử lý.`
                    );
                } else {
                    alert(`Lỗi: ${data.error || data.message}`);
                }
                return;
            }

            // Thành công
            alert(`Đã import thành công ${data.insertedCount} khách hàng.`);
            setExcelData(null);
            setFileName("");
        } catch (err) {
            console.error("Import error:", err);
            alert("Không thể kết nối server. Vui lòng thử lại sau.");
        }
    };


    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 admin-dark:bg-black min-h-screen">
            <div className="bg-white admin-dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-7xl mx-auto">
                {/* Header with Close Button */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 admin-dark:text-gray-100">
                        Nhập dữ liệu khách hàng từ Excel
                    </h2>
                    <button
                        onClick={() => setOpenDialogImportCustomer(false)}
                        className="p-2 text-gray-400 admin-dark:text-gray-500 hover:text-gray-600 admin-dark:hover:text-gray-300 hover:bg-gray-100 admin-dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        title="Đóng"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Main Upload Section */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Upload Zone */}
                    <div className="flex-1">
                        <div className="border-2 border-dashed border-gray-300 admin-dark:border-gray-600 rounded-lg p-6 hover:border-blue-500 admin-dark:hover:border-blue-400 transition-colors duration-300">
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileUpload}
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex items-center gap-4"
                            >
                                <UploadIcon />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-600 admin-dark:text-gray-300">
                                        Kéo & thả file hoặc{" "}
                                        <span className="text-blue-600 admin-dark:text-blue-400 hover:underline">
                                            nhấn để tải lên
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 admin-dark:text-gray-400">
                                        Hỗ trợ Excel (.xlsx, .xls) hoặc CSV
                                    </p>
                                    {fileName && (
                                        <div className="mt-3 p-2 bg-blue-50 admin-dark:bg-gray-700 rounded-md">
                                            <div className="text-sm text-gray-700 admin-dark:text-gray-200 font-medium">
                                                📂 Đã chọn file:
                                            </div>
                                            <div className="text-sm text-blue-600 admin-dark:text-blue-400 truncate">
                                                {fileName}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[200px]">
                        <button
                            onClick={handleDownloadTemplate}
                            className="px-6 py-3 border border-blue-600 admin-dark:border-blue-400 text-blue-600 admin-dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 admin-dark:hover:bg-gray-700 transition-colors duration-300"
                        >
                            Tải File Excel Mẫu
                        </button>
                        <button
                            onClick={handleImportData}
                            disabled={!excelData}
                            className="px-6 py-3 bg-blue-600 admin-dark:bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 admin-dark:hover:bg-blue-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                        >
                            Nhập dữ liệu vào hệ thống
                        </button>
                    </div>
                </div>

                {/* Preview Table */}
                {excelData && excelData.length > 0 && (
                    <div className="mt-8 border border-gray-200 admin-dark:border-gray-600 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 flex items-center justify-between bg-gray-50 admin-dark:bg-gray-700 border-b border-gray-200 admin-dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-800 admin-dark:text-gray-100">
                                Xem trước dữ liệu ({excelData.length} dòng)
                            </h3>
                            <button
                                onClick={handleClearData}
                                className="px-4 py-2 text-sm bg-red-500 admin-dark:bg-red-600 text-white rounded-md hover:bg-red-600 admin-dark:hover:bg-red-700 transition-colors duration-200"
                            >
                                Hủy xem / Xóa file
                            </button>
                        </div>

                        <div className="max-h-96 overflow-auto">
                            <table className="min-w-full divide-y divide-gray-200 admin-dark:divide-gray-600">
                                <thead className="bg-gray-100 admin-dark:bg-gray-700 sticky top-0 z-10">
                                    <tr>
                                        {Object.keys(columnHeaders).map((header) => (
                                            <th
                                                key={header}
                                                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 admin-dark:text-gray-300"
                                            >
                                                {columnHeaders[header]}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white admin-dark:bg-gray-800 divide-y divide-gray-200 admin-dark:divide-gray-600">
                                    {excelData.map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            className="hover:bg-gray-50 admin-dark:hover:bg-gray-700 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 admin-dark:text-gray-100">
                                                {row.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 admin-dark:text-gray-100">
                                                {row.phone}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 admin-dark:text-gray-100">
                                                {row.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 admin-dark:text-gray-100">
                                                {row.address}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExcelDataUploader;
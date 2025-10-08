import useLenisLocal from '@/hook/useLenisLocal';
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import * as XLSX from "xlsx";


function ExcelDataUploader({ openDialogImportCustomer, setOpenDialogImportCustomer }) {
    useLenisLocal(".lenis-local");

    const { handleRefetchCustomer } =
        useOutletContext(); // Lấy dữ liệu và hàm từ context cha: src\pages\managers\ServicesPage.jsx

    const [excelData, setExcelData] = useState(null);
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState(null);

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
                const workbook = XLSX.read(text, { type: "string", codepage: 65001 });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Get headers from the first row
                const headerRow = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] || [];
                const headers = headerRow.map(h => String(h).trim());

                const expectedHeaders = Object.keys(columnHeaders); // ["name", "phone", "email", "address"]

                // Check for missing headers
                const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));

                if (missingHeaders.length > 0) {
                    setError(`Tệp không hợp lệ. Thiếu các cột bắt buộc: ${missingHeaders.map(h => columnHeaders[h]).join(", ")}. Vui lòng tải file mẫu để xem định dạng đúng.`);
                    handleClearData();
                    return;
                }

                // If headers are valid, proceed to read data
                const json = XLSX.utils.sheet_to_json(worksheet, {
                    defval: "",
                    raw: false,
                    cellText: true,
                });

                const normalized = json.map((row) => {
                    let phone = row.phone ? String(row.phone).trim() : "";
                    if (phone && !phone.startsWith("0") && phone.length === 9) {
                        phone = "0" + phone;
                    } else if (!phone) {
                        phone = "";
                    }

                    return {
                        name: row.name || "",
                        phone: phone,
                        email: row.email || "",
                        address: row.address || "",
                        type: "new",
                        status: "active",
                        total_spent: "0",
                        booking_count: "0",
                    };
                });

                setExcelData(normalized);
            } catch (error) {
                console.error("Error reading file:", error);
                setExcelData(null);
                setError("Lỗi khi đọc file. Vui lòng kiểm tra lại định dạng file hoặc mã hóa UTF-8.");
                handleClearData();
            }
        };

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

            handleRefetchCustomer();
            // Thành công
            alert(`Đã cập nhật ${data.insertedCount} dữ liệu khách hàng thành công .`);
            setExcelData(null);
            setFileName("");
        } catch (err) {
            console.error("Import error:", err);
            alert("Không thể kết nối server. Vui lòng thử lại sau.");
        }
    };


    return (
        <div className="container mx-auto p-2 md:p-2 max-h-screen">
            <div className="admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 p-6 sm:p-3 md:p-4 rounded-2xl shadow-xl max-w-7xl mx-auto">
                {/* Header with Close Button */}
                <div className="flex xs:flex-col-reverse items-end sm:flex-row sm:items-center justify-between mb-6">
                    <h2 className="text-base sm:text-base md:text-xl font-bold text-gray-800 admin-dark:text-gray-100">
                        Nhập dữ liệu khách hàng từ Excel
                    </h2>
                    <button
                        onClick={() => setOpenDialogImportCustomer(false)}
                        className="p-2 text-gray-400 admin-dark:text-gray-500 hover:text-gray-600 admin-dark:hover:text-gray-300 hover:bg-gray-100 admin-dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 cursor-pointer"
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
                <div className="flex flex-col justify-center md:flex-row lg:flex-row gap-6 items-center">
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
                    <div className="flex flex-col md:w-auto gap-3 w-full lg:w-auto lg:min-w-[200px]">
                        <button
                            onClick={handleDownloadTemplate}
                            className="px-6 py-3 border border-blue-600 admin-dark:border-blue-400 text-blue-600 admin-dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 admin-dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
                        >
                            <span className='text-base sm:text-base'>Tải File Excel Mẫu</span>
                        </button>
                        <button
                            onClick={handleImportData}
                            disabled={!excelData}
                            className="px-6 py-3 bg-blue-600 admin-dark:bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 admin-dark:hover:bg-blue-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 cursor-pointer"
                        >
                            <span className='text-base sm:text-base'>Nhập dữ liệu vào hệ thống</span>
                        </button>
                    </div>
                </div>

                {/* Preview Table */}
                {excelData && excelData.length > 0 && (
                    <div className="mt-8 border border-gray-200 admin-dark:border-gray-600 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 flex flex-col gap-4 md:flex-row items-center justify-between bg-gray-50 admin-dark:bg-gray-800 border-b border-gray-200 admin-dark:border-gray-600">
                            <h3 className="text-sm sm:text-base md:text-[18px] font-semibold text-gray-800 admin-dark:text-gray-100">
                                Xem trước dữ liệu ({excelData.length} dòng)
                            </h3>
                            <button
                                onClick={handleClearData}
                                className="px-4 py-2 text-sm bg-red-500 admin-dark:bg-red-600 text-white rounded-md hover:bg-red-600 admin-dark:hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                            >
                                <span className='text-sm sm:text-base'>Hủy xem / Xóa file</span>
                            </button>
                        </div>

                        <div className="max-h-96 overflow-auto w-full overflow-x-auto">
                            <table className="min-w-[600px] md:min-w-full lg:min-w-full divide-y divide-gray-200 admin-dark:divide-gray-600">
                                <thead className="bg-gray-100 admin-dark:bg-gray-700 sticky top-0 z-10">
                                    <tr>
                                        {Object.keys(columnHeaders).map((header) => (
                                            <th
                                                key={header}
                                                className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 admin-dark:text-gray-300"
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
                                            <td className="px-3 py-3 text-sm text-gray-900 admin-dark:text-gray-100">{row.name}</td>
                                            <td className="px-3 py-3 text-sm text-gray-900 admin-dark:text-gray-100">{row.phone}</td>
                                            <td className="px-3 py-3 text-sm text-gray-900 admin-dark:text-gray-100">{row.email}</td>
                                            <td className="px-3 py-3 text-sm text-gray-900 admin-dark:text-gray-100">{row.address}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            {error && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
                        <h3 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4">
                            Lỗi Nhập Dữ Liệu
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            {error}
                        </p>
                        <button
                            onClick={() => setError(null)}
                            className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExcelDataUploader;

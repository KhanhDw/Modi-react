import React, { useState } from "react";
import * as XLSX from "xlsx"; // Cài đặt: npm install xlsx

function ExcelDataUploader() {
    const [excelData, setExcelData] = useState(null);
    const [fileName, setFileName] = useState("");

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    setExcelData(json);
                } catch (error) {
                    console.error("Lỗi khi đọc file Excel:", error);
                    setExcelData(null);
                    alert("Lỗi khi đọc file Excel. Vui lòng kiểm tra lại định dạng.");
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleDownloadTemplate = () => {
        const data = [
            ["name", "phone", "email", "address", "type", "status", "total_spent", "booking_count"],
            ["Nguyễn Văn A", "0912345678", "nguyenvana@example.com", "123 Đường ABC, Quận 1", "new", "active", "500000", "2"],
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Khách hàng");
        XLSX.writeFile(wb, "mau_khach_hang.xlsx");
    };

    const handleImportData = () => {
        if (!excelData || excelData.length === 0) {
            alert("Vui lòng tải lên một file Excel hợp lệ trước khi nhập.");
            return;
        }
        // Logic để xử lý và gửi dữ liệu `excelData` lên backend
        console.log("Dữ liệu đã sẵn sàng để nhập:", excelData);
        alert("Dữ liệu đã được gửi đi. Vui lòng kiểm tra console.");
        // Ví dụ: axios.post('/api/customers/import', excelData);
    };

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 ">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Nhập dữ liệu khách hàng từ Excel</h2>

                {/* Vùng Tải File */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6 hover:border-blue-500 transition-colors duration-300 ease-in-out">
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto h-12 w-12 text-gray-400"
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
                        <span className="mt-2 block text-sm font-medium text-gray-600">
                            Kéo và thả file hoặc <span className="text-blue-600 hover:underline">nhấn để tải lên</span>
                        </span>
                        <p className="mt-1 text-xs text-gray-500">
                            Hỗ trợ file Excel (.xlsx, .xls) hoặc CSV.
                        </p>
                        {fileName && (
                            <p className="mt-2 text-sm text-gray-700 font-semibold">
                                Đã chọn file: {fileName}
                            </p>
                        )}
                    </label>
                </div>

                {/* Nút Tải File Mẫu & Nút Nhập Dữ liệu */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
                    <button
                        onClick={handleDownloadTemplate}
                        className="w-full md:w-auto px-6 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors duration-300 ease-in-out"
                    >
                        Tải File Excel Mẫu
                    </button>
                    <button
                        onClick={handleImportData}
                        className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!excelData}
                    >
                        Nhập dữ liệu vào hệ thống
                    </button>
                </div>

                {/* Bảng Xem Trước Dữ Liệu */}
                {excelData && excelData.length > 0 && (
                    <div className="mt-6 overflow-x-auto border rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800 p-4 border-b">
                            Xem trước dữ liệu ({excelData.length - 1} dòng)
                        </h3>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {excelData[0].map((header, index) => (
                                        <th
                                            key={index}
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {excelData.slice(1).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExcelDataUploader;
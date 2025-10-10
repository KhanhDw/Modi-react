import React from 'react';
import * as XLSX from 'xlsx';

const ExportCustomerData = ({ data, fileName }) => {
  const exportToExcel = () => {
    // 1. Filter and map data to the required format and headers
    const dataToExport = data.map((customer) => ({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      cccd: customer.cccd,
      number_bank: customer.number_bank,
      name_bank: customer.name_bank,
    }));

    // 2. Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "KhachHang"); // Sheet name

    // 3. Set column widths for better readability
    const colWidths = [
      { wch: 30 }, // name
      { wch: 15 }, // phone
      { wch: 30 }, // email
      { wch: 40 }, // address
      { wch: 20 }, // cccd
      { wch: 20 }, // number_bank
      { wch: 15 }, // name_bank
    ];
    worksheet["!cols"] = colWidths;

    // 4. Trigger download
    XLSX.writeFile(workbook, fileName || 'danh-sach-khach-hang.xlsx');
  };

  return (
    <button
      onClick={exportToExcel}
      className="bg-green-600 hover:bg-green-700 admin-dark:bg-green-500 admin-dark:hover:bg-green-600 text-white font-bold py-1.5 px-2 rounded-md shadow-lg transform transition-all duration-200 ease-in-out cursor-pointer"
    >
      <span className="text-sm lg:text-base">
        Xuất dữ liệu
      </span>
    </button>
  );
};

export default ExportCustomerData;

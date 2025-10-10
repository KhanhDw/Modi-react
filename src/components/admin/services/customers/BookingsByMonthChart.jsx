import useLenisLocal from "@/hook/useLenisLocal";

export default function TopSpendingCustomers({ initDataCustomer }) {
  useLenisLocal(".lenis-local-top-customers");

  const topCustomers = [...initDataCustomer]
    .filter((customer) => (customer.total_spent || 0) > 0)
    .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
    .slice(0, 20); // Display top 20 customers

  return (
    <div className="bg-white rounded-xl shadow-md shadow-gray-300/50 border border-[#e5e7eb] admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200 admin-dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 admin-dark:text-gray-100">
          Khách hàng chi tiêu hàng đầu
        </h3>
        <p className="text-sm text-[#5ea25e] admin-dark:text-green-400 mt-1">
          Danh sách khách hàng có tổng chi tiêu cao nhất.
        </p>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div
          data-lenis-prevent
          className="max-h-96 overflow-y-auto scrollbar-hide overscroll-y-auto lenis-local-top-customers"
        >
          <table className="w-full">
            {/* Table Header */}
            <thead className="sticky top-0 bg-white admin-dark:bg-gray-800 z-10">
              <tr className="border-b border-gray-200 admin-dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-black admin-dark:text-white">
                  STT
                </th>
                <th className="text-left py-3 px-4 font-semibold text-black admin-dark:text-white">
                  Tên
                </th>
                <th className="text-left py-3 px-4 font-semibold text-black admin-dark:text-white">
                  SĐT
                </th>
                <th className="text-right py-3 px-4 font-semibold text-black admin-dark:text-white">
                  Đã chi
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-100 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4 text-gray-700 admin-dark:text-gray-300">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 admin-dark:text-gray-100">
                    {customer.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700 admin-dark:text-gray-300">
                    {customer.phone || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900 admin-dark:text-gray-100">
                    {Number(customer.total_spent || 0).toLocaleString("vi-VN")}{" "}
                    ₫
                  </td>
                </tr>
              ))}

              {topCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-6 text-center text-gray-500 admin-dark:text-gray-400"
                  >
                    Chưa có dữ liệu chi tiêu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


import useLenisLocal from "@/hook/useLenisLocal";
import { Badge } from "@/components/ui/badge";
import { CardContent, Card } from "@/components/ui/card";

export default function TopSpendingCustomers({ initDataCustomer }) {
  useLenisLocal(".lenis-local-top-customers");

  const topCustomers = [...initDataCustomer]
    .filter((customer) => (customer.total_spent || 0) > 0)
    .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
    .slice(0, 20); // Display top 20 customers

  return (
    <Card className="bg-white rounded-xl shadow-md shadow-gray-300/50 border border-[#e5e7eb] admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50">
      {/* Card Header */}
      <div className="px-2 sm:px-5">
        <h3 className="text-base font-semibold text-gray-900 admin-dark:text-gray-100">
          Khách hàng chi tiêu hàng đầu
        </h3>
        <p className="text-sm text-[#5ea25e] admin-dark:text-green-400">
          Danh sách khách hàng có tổng chi tiêu cao nhất.
        </p>
      </div>

      <CardContent>
        <div
          data-lenis-prevent
          className="space-y-2 scrollbar-hide max-h-100 overflow-y-auto  overscroll-y-auto lenis-local-top-customers"
        >
          {topCustomers.map((customer, index) => (
            <div
              key={customer.id}
              className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50 admin-dark:bg-gray-700 admin-dark:border-gray-600"
            >
              <div className="flex items-center gap-5 w-full">
                <p className="text-xs lg:text-sm text-black admin-dark:text-gray-200">
                  {index + 1}
                </p>

                {/* Name + Phone */}
                <div className="w-full flex flex-wrap md:flex-col items-start space-y-0.5 justify-between">
                  <p className="font-medium text-xs lg:text-sm text-black admin-dark:text-gray-200">
                    {customer.name}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500 admin-dark:text-gray-400">
                    {customer.phone || "N/A"}
                  </p>
                </div>

                {/* Total Spent */}
                <div className="flex items-center justify-end">
                  <Badge
                    variant="secondary"
                    className="bg-green-200 shadow text-green-700 px-2 py-1 admin-dark:bg-green-800 admin-dark:text-gray-200"
                  >
                    {Number(customer.total_spent || 0).toLocaleString("vi-VN")} ₫
                  </Badge>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {topCustomers.length === 0 && (
            <p className="text-sm text-gray-500 admin-dark:text-gray-400 text-center py-4">
              Chưa có dữ liệu chi tiêu
            </p>
          )}
        </div>
      </CardContent>

    </Card>
  );
}

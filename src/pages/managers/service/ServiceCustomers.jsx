import FormAddCustomer from "@/components/admin/services/customers/formAddCustomer";
import ServiceCustomerAnalytics from "@/components/admin/services/customers/service-customer-analystics";
import ServiceCustomerTable from "@/components/admin/services/customers/ServiceCustomerTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Star, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import DialogShowForm_Service from "./DialogShowFormService";

export default function ServiceCustomers() {
  const { initDataCustomer, initDataBooking, handleRefetchCustomer } =
    useOutletContext();
  const [openAddCustomer, setOpenAddCustomer] = useState(false);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const newCustomersThisMonth = initDataCustomer.filter((cus) => {
    const created = new Date(cus.created_at);
    return (
      created.getMonth() === currentMonth &&
      created.getFullYear() === currentYear
    );
  });

  // Lấy danh sách customer_id từ các booking chưa hoàn thành
  const activeCustomerIds = new Set(
    initDataBooking
      .filter((b) => b.status !== "completed") // chỉ lấy booking đang xử lý
      .map((b) => b.customer_id) // lấy id khách
  );

  // Đếm số lượng khách hàng duy nhất đang có booking
  const customersOrderingService = initDataCustomer.filter((c) =>
    activeCustomerIds.has(c.id)
  );

  const handleOpenAddCustomer = () => {
    setOpenAddCustomer(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl md:text-[22px] font-bold text-center md:text-start admin-dark:text-gray-100">
            Quản lý khách hàng
          </h2>
          <p className="text-xs text-center md:text-base md:text-start xs:text-sm admin-dark:text-gray-400">
            Quản lý thông tin khách hàng, lịch sử dịch vụ và tương tác với khách
            hàng.
          </p>
        </div>
        <button
          className="bg-blue-500 mt-4
          hover:bg-blue-600
          rounded-lg
          px-4 py-1.5
          shadow-lg
          hover:shadow-xl
          transition-all
          duration-300
          ease-in-out cursor-pointer"
          onClick={handleOpenAddCustomer}
        >
          <span className="text-white admin-dark:text-gray-200 font-semibold text-sm sm:text-base">
            Thêm khách hàng
          </span>
        </button>
      </div>
      <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <Card className="bg-white admin-dark:bg-[#374151] rounded-xl shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]">
          <CardHeader className="flex flex-row xl:flex-row sm:flex-col-reverse lg:flex-col-reverse  md:flex-row items-start justify-between">
            <CardTitle className="text-sm font-medium admin-dark:text-gray-300">
              Số lượng khách hàng
            </CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl px-2 font-bold text-black admin-dark:text-white">
              {initDataCustomer.length}
            </div>
            {/* <p className="text-xs text-[#5ea25e]">+3 từ tháng trước</p> */}
          </CardContent>
        </Card>

        <Card className="bg-white admin-dark:bg-[#374151] rounded-xl shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]">
          <CardHeader className="flex flex-row xl:flex-row sm:flex-col-reverse lg:flex-col-reverse md:flex-row items-start justify-between">
            <CardTitle className="text-sm font-medium admin-dark:text-gray-300">
              Khách hàng mới trong tháng
            </CardTitle>
            <UserPlus className="h-4 w-4 md:h-5 md:w-5 sm:h-6 sm:w-6 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl px-2 font-bold text-black admin-dark:text-white">
              {newCustomersThisMonth.length}
            </div>
            {/* <p className="text-xs text-[#5ea25e]">+3 từ tháng trước</p> */}
          </CardContent>
        </Card>

        <Card className="bg-white admin-dark:bg-[#374151] rounded-xl shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]">
          <CardHeader className="flex flex-row xl:flex-row sm:flex-col-reverse lg:flex-col-reverse md:flex-row items-start justify-between">
            <CardTitle className="text-sm font-medium admin-dark:text-gray-300">
              Khách hàng đang xử lý
            </CardTitle>
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl px-2 font-bold text-black admin-dark:text-white">
              {customersOrderingService.length}
            </div>
            {/* <p className="text-xs text-[#ac9a00]">+2 từ tháng trước</p> */}
          </CardContent>
        </Card>

        <Card className="bg-white admin-dark:bg-[#374151] rounded-xl shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]">
          <CardHeader className="flex flex-row xl:flex-row sm:flex-col-reverse lg:flex-col-reverse md:flex-row items-start justify-between">
            <CardTitle className="text-sm font-medium admin-dark:text-gray-300">
              Khách hàng VIP
            </CardTitle>
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl px-2 font-bold text-black admin-dark:text-white">
              {initDataCustomer.filter((c) => c.isVIP).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <ServiceCustomerTable />
      <DialogShowForm_Service />
      <ServiceCustomerAnalytics />

      {openAddCustomer && (
        <div className="fixed inset-0 bg-black/50 admin-dark:bg-black/70 flex items-center justify-center z-50">
          {/* Nội dung form */}
          <FormAddCustomer
            onCancel={() => setOpenAddCustomer(false)}
            onSuccess={handleRefetchCustomer}
          />
        </div>
      )}
    </div>
  );
}

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

  const cardData = [
    {
      title: "Số lượng",
      icon: Users,
      value: initDataCustomer.length,
      iconSize: "h-4 w-4",
    },
    {
      title: "Khách hàng mới",
      icon: UserPlus,
      value: newCustomersThisMonth.length,
      iconSize: "h-4 w-4",
    },
    {
      title: "Đang xử lý",
      icon: Clock,
      value: customersOrderingService.length,
      iconSize: "h-4 w-4",
    },
    {
      title: "Khách hàng VIP",
      icon: Star,
      value: initDataCustomer.filter((c) => c.isVIP).length,
      iconSize: "h-4 w-4",
    },
  ];

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
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        {cardData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card
              key={index}
              className="bg-white admin-dark:bg-[#374151] rounded-lg sm:rounded-xl shadow-sm sm:shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563] p-2 sm:p-4"
            >
              <CardHeader className="flex flex-row items-center justify-between p-0 sm:p-0 mb-1 sm:mb-0">
                <CardTitle className="text-xs sm:text-base md:text-sm xl:text-base font-medium admin-dark:text-gray-300 line-clamp-2">
                  {item.title}
                </CardTitle>
                <IconComponent
                  className={`${item.iconSize} text-muted-foreground admin-dark:text-gray-400 flex-shrink-0 ml-1`}
                />
              </CardHeader>
              <CardContent className="p-0 sm:p-0">
                <div className="text-lg sm:text-xl font-bold text-black admin-dark:text-white px-1">
                  {item.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
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

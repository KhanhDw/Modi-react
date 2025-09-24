import { Button } from "@/components/ui/button";
import { Clock, Star, UserPlus, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ServiceCustomerAnalytics from "@/components/admin/services/customers/service-customer-analystics";
import ServiceCustomerTable from "@/components/admin/services/customers/ServiceCustomerTable";
import { useOutletContext } from "react-router-dom";
import DialogShowForm_Service from "./DialogShowFormService";
import React, { useState } from "react";
import FormAddCustomer from "@/components/admin/services/customers/formAddCustomer";

export default function ServiceCustomers() {
  const { initDataCustomer, initDataBooking, handleRefetchCustomer } = useOutletContext();
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


  const handleOpenAddCustomer = () => {
    setOpenAddCustomer(true);
  };



  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold admin-dark:text-gray-100">
            Quản lý khách hàng
          </h2>
          <p className="text-muted-foreground admin-dark:text-gray-400">
            Quản lý thông tin khách hàng, lịch sử dịch vụ và tương tác với khách
            hàng.
          </p>
        </div>
        <button
          className="bg-primary text-primary-foreground 
          hover:bg-primary/90 
          rounded-lg 
          px-4 py-2 
          shadow-lg 
          hover:shadow-xl 
          transition-all 
          duration-300 
          ease-in-out"
          onClick={handleOpenAddCustomer}
        >
          Thêm khách hàng
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white admin-dark:bg-[#374151] rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium admin-dark:text-gray-300">
              Số lượng khách hàng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black admin-dark:text-white">
              {initDataCustomer.length}
            </div>
            {/* <p className="text-xs text-[#5ea25e]">+3 từ tháng trước</p> */}
          </CardContent>
        </Card>

        <Card className="bg-white admin-dark:bg-[#374151] rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium admin-dark:text-gray-300">
              Khách hàng mới trong tháng
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black admin-dark:text-white">
              {newCustomersThisMonth.length}
            </div>
            {/* <p className="text-xs text-[#5ea25e]">+3 từ tháng trước</p> */}
          </CardContent>
        </Card>

        <Card className="bg-white admin-dark:bg-[#374151] rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium admin-dark:text-gray-300">
              Khách hàng đang xử lý
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black admin-dark:text-white">
              {initDataBooking.filter((c) => c.status !== "completed").length}
            </div>
            {/* <p className="text-xs text-[#ac9a00]">+2 từ tháng trước</p> */}
          </CardContent>
        </Card>

        <Card className="bg-white admin-dark:bg-[#374151] rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium admin-dark:text-gray-300">
              Khách hàng VIP
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black admin-dark:text-white">
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
          <div className="bg-white admin-dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-3xl relative border border-gray-200 admin-dark:border-gray-700 animate-in fade-in-0 zoom-in-95">

            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 admin-dark:text-gray-400 admin-dark:hover:text-gray-200 text-2xl font-bold leading-none"
              onClick={() => setOpenAddCustomer(false)}
            >
              &times;
            </button>

            {/* Nội dung form */}
            <FormAddCustomer onSuccess={handleRefetchCustomer} />
          </div>
        </div>
      )}

    </div>
  )
}
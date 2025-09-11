import { Button } from "@/components/ui/button";
import { Clock, Star, UserPlus, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ServiceCustomerAnalytics from "@/components/admin/services/customers/service-customer-analystics";
import ServiceCustomerTable from "@/components/admin/services/customers/ServiceCustomerTable";
import { useOutletContext } from "react-router-dom";
import DialogShowForm_Service from "./DialogShowFormService";

export default function ServiceCustomers() {
  const { initDataCustomer, initDataBooking } = useOutletContext();

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

  return (
    <div className="space-y-6">
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
              Khách hàng trung thành
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black admin-dark:text-white">
              {initDataCustomer.filter((c) => c.booking_count > 3).length}
            </div>
            {/* <p className="text-xs text-[#5ea25e]">+1 từ tháng trước</p> */}
          </CardContent>
        </Card>
      </div>

      <ServiceCustomerTable />
      <DialogShowForm_Service />
      <ServiceCustomerAnalytics />
    </div>
  );
}
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceBookingTable from "@/components/admin/services/booking/ServiceBookingTable";
import ServiceBookingAnalytics from "@/components/admin/services/booking/service-booking-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, BadgeCheck, Trash2, Package } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import DialogShowForm_Service from "./DialogShowFormService";

export default function ServiceBooking() {
  const { initDataService, initDataBooking, handleOpen } = useOutletContext();

  const completedCount = initDataBooking.filter(
    (booking) => booking.status === "completed"
  ).length;

  const pendingCount = initDataBooking.filter(
    (booking) => booking.status === "pending"
  ).length;

  const cancelled = initDataBooking.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 admin-dark:text-white">
            Quản lý đơn
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground admin-dark:text-gray-400 mt-1">
            Quản lý và theo dõi đơn đặt dịch vụ hiệu quả.
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4 py-2 w-full sm:w-auto"
          onClick={() => {
            handleOpen("booking");
          }}
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
          Tạo đơn mới
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white admin-dark:bg-[#374151] rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]">
          <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium admin-dark:text-gray-300">
              Số lượng đơn đặt
            </CardTitle>
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-black admin-dark:text-white">
              {initDataBooking.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white admin-dark:bg-[#374151] rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]">
          <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium admin-dark:text-gray-300">
              Đã hoàn thành
            </CardTitle>
            <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-black admin-dark:text-white">
              {completedCount}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white admin-dark:bg-[#374151] rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]">
          <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium admin-dark:text-gray-300">
              Chưa hoàn thành
            </CardTitle>
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-black admin-dark:text-white">
              {pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white admin-dark:bg-[#374151] rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]">
          <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium admin-dark:text-gray-300">
              Đơn bị hủy
            </CardTitle>
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-black admin-dark:text-white">
              {cancelled}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 admin-dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <ServiceBookingTable />
      </div>
      <DialogShowForm_Service />
      <ServiceBookingAnalytics services={initDataService} />
    </div>
  );
}
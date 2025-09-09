import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceBookingTable from "@/components/admin/services/booking/ServiceBookingTable";
import ServiceBookingAnalytics from "@/components/admin/services/booking/service-booking-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, BadgeCheck, Trash2, Package } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import DialogShowForm_Service from "./DialogShowForm.-service";

export default function ServiceBooking() {
  const { initDataService, initDataBooking } = useOutletContext();

  const completedCount = initDataBooking.filter(
    (booking) => booking.status === "completed"
  ).length;

  const pendingCount = initDataBooking.filter(
    (booking) => booking.status === "pending"
  ).length;

  const cancelled = initDataBooking.filter(
    (booking) => booking.status === "cancelled"
  ).length;
  const { handleOpen } = useOutletContext();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý đơn</h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi đơn đặt dịch vụ hiệu quả.
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            handleOpen("booking");
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo đơn mới
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Số lượng đơn đặt
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {initDataBooking.length}
            </div>
            {/* <p className="text-xs text-[#5ea25e]">+3 từ tháng trước</p> */}
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {completedCount}
            </div>
            {/* <p className="text-xs text-[#5ea25e]">+3 từ tháng trước</p> */}
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Chưa hoàn thành
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{pendingCount}</div>
            <p className="text-xs text-[#ac9a00]">
              {/* +{initDataService.length} từ tháng trước */}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Đơn bị hủy</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{cancelled}</div>
            <p className="text-xs text-[#d62727]">
              {/* +{initDataService.length} từ tháng trước */}
            </p>
          </CardContent>
        </Card>
      </div>
      <ServiceBookingTable />
      <DialogShowForm_Service />
      <ServiceBookingAnalytics services={initDataService} />
    </div>
  );
}

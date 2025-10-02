import ServiceBookingTable from "@/components/admin/services/booking/ServiceBookingTable";
import ServiceBookingAnalytics from "@/components/admin/services/booking/service-booking-analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, CheckCircle, Loader2, Package, Plus, Target, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import DialogShowForm_Service from "./DialogShowFormService";

export default function ServiceBooking() {


  const { initDataService, initDataBooking, handleOpen } = useOutletContext();

  const completedCount = initDataBooking.filter(b => b.status === "completed").length;
  const pendingCount = initDataBooking.filter(b => b.status === "pending").length;
  const cancelled = initDataBooking.filter(b => b.status === "cancelled").length;
  const processingCount = initDataBooking.filter(b => b.status === "processing").length;
  const confirmedCount = initDataBooking.filter(b => b.status === "confirmed").length;

  // Config UI cho từng trạng thái
  const cards = [
    {
      key: "total",
      title: "Số lượng đơn đặt",
      value: initDataBooking.length,
      icon: <Package className="h-4 w-4 text-gray-400" />,
      color: "text-black admin-dark:text-white",
    },
    {
      key: "completed",
      title: "Hoàn thành",
      value: completedCount,
      icon: <BadgeCheck className="h-4 w-4 text-green-500" />,
      color: "text-green-600 admin-dark:text-green-400",
    },
    {
      key: "pending",
      title: "Chờ xác nhận",
      value: pendingCount,
      icon: <Target className="h-4 w-4 text-yellow-500" />,
      color: "text-yellow-600 admin-dark:text-yellow-400",
    },
    {
      key: "processing",
      title: "Đang xử lý",
      value: processingCount,
      icon: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
      color: "text-blue-600 admin-dark:text-blue-400",
    },
    {
      key: "confirmed",
      title: "Đã xác nhận",
      value: confirmedCount,
      icon: <CheckCircle className="h-4 w-4 text-purple-500" />,
      color: "text-purple-600 admin-dark:text-purple-400",
    },
    {
      key: "cancelled",
      title: "Đơn bị hủy",
      value: cancelled,
      icon: <Trash2 className="h-4 w-4 text-red-500" />,
      color: "text-red-600 admin-dark:text-red-400",
    },
  ];

  return (

    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-[22px] font-bold text-gray-900 admin-dark:text-white">
            Quản lý đơn
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground admin-dark:text-gray-400 mt-1">
            Quản lý và theo dõi đơn đặt dịch vụ hiệu quả.
          </p>
        </div>
        <Button
          className="bg-primary cursor-pointer hover:bg-primary/90 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700"
          onClick={() => handleOpen("booking")}
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
          Tạo đơn mới
        </Button>
      </div>

      {/* Cards */}
      <div className="grid gap-2 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map(card => (
          <Card
            key={card.key}
            className="bg-white admin-dark:bg-[#374151] rounded-xl shadow-md shadow-gray-300/50 admin-dark:shadow-gray-900/30 border border-[#e5e7eb] admin-dark:border-[#4b5563]"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium admin-dark:text-gray-300">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ServiceBookingTable />
      <DialogShowForm_Service />
      <ServiceBookingAnalytics bookings={initDataBooking} />
    </div>
  );
}

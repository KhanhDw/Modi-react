import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceBookingTable from "@/components/admin/services/booking/ServiceBookingTable";
import ServiceBookingAnalytics from "@/components/admin/services/booking/service-booking-analytics";
export default function ServiceBooking() {
  const serviceBookings = [
    {
      id: 1,
      customerName: "Nguyễn Văn A",
      serviceName: "Thiết kế Website",
      status: "completed", // pending | processing | completed | canceled
      amount: 15000000,
      bookingDate: "2025-08-01",
      completedDate: "2025-08-05",
      isRepeatCustomer: false,
    },
    {
      id: 2,
      customerName: "Trần Thị B",
      serviceName: "Chạy quảng cáo Facebook",
      status: "processing",
      amount: 8000000,
      bookingDate: "2025-08-10",
      completedDate: null,
      isRepeatCustomer: true,
    },
    {
      id: 3,
      customerName: "Lê Văn C",
      serviceName: "SEO Website",
      status: "pending",
      amount: 12000000,
      bookingDate: "2025-08-12",
      completedDate: null,
      isRepeatCustomer: false,
    },
    {
      id: 4,
      customerName: "Phạm Thị D",
      serviceName: "Thiết kế Logo",
      status: "completed",
      amount: 3000000,
      bookingDate: "2025-07-28",
      completedDate: "2025-07-30",
      isRepeatCustomer: true,
    },
    {
      id: 5,
      customerName: "Hoàng Văn E",
      serviceName: "Tư vấn Marketing",
      status: "canceled",
      amount: 5000000,
      bookingDate: "2025-08-03",
      completedDate: null,
      isRepeatCustomer: false,
    },
  ];
  const services = [
    {
      id: 1,
      name: "Thiết kế website",
      price: 5000000,
      orders_count: 12,
      revenue: 60000000,
      status: "Hoạt động",
      created_at: "2025-07-01",
    },
    {
      id: 2,
      name: "Quản lý quảng cáo Facebook",
      price: 3000000,
      orders_count: 20,
      revenue: 60000000,
      status: "Hoạt động",
      created_at: "2025-07-05",
    },
    {
      id: 3,
      name: "SEO tổng thể",
      price: 7000000,
      orders_count: 8,
      revenue: 56000000,
      status: "Hoạt động",
      created_at: "2025-07-10",
    },
    {
      id: 4,
      name: "Thiết kế logo",
      price: 1500000,
      orders_count: 15,
      revenue: 22500000,
      status: "Ngừng cung cấp",
      created_at: "2025-06-20",
    },
    {
      id: 5,
      name: "Chạy quảng cáo Google Ads",
      price: 4000000,
      orders_count: 10,
      revenue: 40000000,
      status: "Hoạt động",
      created_at: "2025-07-15",
    },
  ];

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
          onClick={() => setShowCampaignForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo đơn mới
        </Button>
      </div>
      <ServiceBookingTable bookings={serviceBookings} />
      <ServiceBookingAnalytics services={services} />
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6"></div>
      </div>
    </div>
  );
}

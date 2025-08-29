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
export default function ServiceCustomers() {
  const serviceCustomers = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      status: "active",
      created_at: "2025-08-01", // tháng 8
      orders: [
        {
          order_id: 101,
          service: "Thiết kế website",
          status: "completed",
          created_at: "2025-08-01",
        },
        {
          order_id: 102,
          service: "SEO Marketing",
          status: "cancelled",
          created_at: "2025-08-05",
        },
      ],
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0912345678",
      status: "inactive",
      created_at: "2025-07-15", // tháng 7
      orders: [
        {
          order_id: 103,
          service: "Thiết kế logo",
          status: "cancelled",
          created_at: "2025-07-20",
        },
      ],
    },
    {
      id: 3,
      name: "Phạm Văn C",
      email: "phamvanc@example.com",
      phone: "0923456789",
      status: "active",
      created_at: "2025-07-25", // tháng 7
      orders: [
        {
          order_id: 104,
          service: "Quản lý fanpage",
          status: "completed",
          created_at: "2025-07-28",
        },
        {
          order_id: 105,
          service: "Chạy quảng cáo Facebook",
          status: "completed",
          created_at: "2025-08-10",
        },
      ],
    },
    {
      id: 4,
      name: "Lê Thị D",
      email: "led@example.com",
      phone: "0934567890",
      status: "active",
      created_at: "2025-06-10", // tháng 6
      orders: [
        {
          order_id: 106,
          service: "Thiết kế banner",
          status: "completed",
          created_at: "2025-06-12",
        },
      ],
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoange@example.com",
      phone: "0945678901",
      status: "active",
      created_at: "2025-08-05", // tháng 9
      orders: [
        {
          order_id: 107,
          service: "SEO Website",
          status: "pending",
          created_at: "2025-09-06",
        },
        {
          order_id: 108,
          service: "Chạy quảng cáo Google",
          status: "completed",
          created_at: "2025-09-10",
        },
      ],
    },
    {
      id: 6,
      name: "Vũ Thị F",
      email: "vutf@example.com",
      phone: "0956789012",
      status: "active",
      created_at: "2025-08-15", // tháng 8
      orders: [
        {
          order_id: 109,
          service: "Thiết kế landing page",
          status: "cancelled",
          created_at: "2025-08-16",
        },
      ],
    },
    {
      id: 7,
      name: "Vũ Thị F1",
      email: "vutf1@example.com",
      phone: "0956789112",
      status: "active",
      created_at: "2025-08-17", // tháng 8
      orders: [
        {
          order_id: 109,
          service: "Thiết kế landing page",
          status: "completed",
          created_at: "2025-08-16",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Số lượng khách hàng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {serviceCustomers.length}
            </div>
            <p className="text-xs text-[#5ea25e]">+3 từ tháng trước</p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Khách hàng mới trong tháng
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {serviceCustomers.length}
            </div>
            <p className="text-xs text-[#5ea25e]">+3 từ tháng trước</p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Khách hàng đang xử lý
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {serviceCustomers.length}
            </div>
            <p className="text-xs text-[#ac9a00]">+2 từ tháng trước</p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Khách hàng trung thành
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {serviceCustomers.length}
            </div>
            <p className="text-xs text-[#5ea25e]">+1 từ tháng trước</p>
          </CardContent>
        </Card>
      </div>
      <ServiceCustomerTable customers={serviceCustomers} />
      <ServiceCustomerAnalytics customers={serviceCustomers} />
    </div>
  );
}

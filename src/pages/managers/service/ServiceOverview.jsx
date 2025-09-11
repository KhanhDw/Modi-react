import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, DollarSign, Star, Layers } from "lucide-react";
import SaleAnalytics from "@/components/admin/services/sales/sale-analytics";
import { useOutletContext } from "react-router-dom";

export default function ServiceOverview() {
  const { initDataService, initDataBooking, initDataCustomer } =
    useOutletContext();
  return (
    <div className="text-black admin-dark:text-white">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white admin-dark:bg-gray-800 rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-700/50 border border-[#e5e7eb] admin-dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium admin-dark:text-white">
                Tổng dịch vụ
              </CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black admin-dark:text-white">
                {initDataService.length}
              </div>
              {/* <p className="text-xs text-[#5ea25e]">+3 từ tháng trước</p> */}
            </CardContent>
          </Card>
          <Card className="bg-white admin-dark:bg-gray-800 rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-700/50 border border-[#e5e7eb] admin-dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium admin-dark:text-white">
                Tổng doanh thu
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black admin-dark:text-white">
                ₫
                {initDataService
                  ?.reduce(
                    (total, service) => total + Number(service.revenue ?? 0),
                    0
                  )
                  .toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
              </div>
              {/* <p className="text-xs text-[#5ea25e]">+20.1% từ tháng trước</p> */}
            </CardContent>
          </Card>
          <Card className="bg-white admin-dark:bg-gray-800 rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-700/50 border border-[#e5e7eb] admin-dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium admin-dark:text-white">
                Đơn đặt
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black admin-dark:text-white">
                {initDataBooking.length}
              </div>
              {/* <p className="text-xs text-[#5ea25e]">
                +{initDataService.length} từ tháng trước
              </p> */}
            </CardContent>
          </Card>
          <Card className="bg-white admin-dark:bg-gray-800 rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-700/50 border border-[#e5e7eb] admin-dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium admin-dark:text-white">
                Khách hàng
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black admin-dark:text-white">
                {initDataCustomer.filter((c) => c.status === "active").length}
              </div>
              {/* <p className="text-xs text-[#5ea25e]">
                +{initDataService.length} từ tháng trước
              </p> */}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white admin-dark:bg-gray-800 rounded-xl p-2 shadow-md shadow-gray-300/50 admin-dark:shadow-gray-700/50 border border-[#e5e7eb] admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="admin-dark:text-white">
                Dịch vụ hot
              </CardTitle>
              <CardDescription className="text-[#5ea25e] admin-dark:text-green-400">
                Các dịch vụ có đơn đặt nhiều nhất
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {initDataService
                .filter((service) => service.order >= 10)
                .map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-100 admin-dark:bg-gray-700 admin-dark:border-gray-600"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-black admin-dark:text-white">
                        {service.name}
                      </p>
                      <p className="text-sm text-muted-foreground admin-dark:text-gray-400">
                        {service.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 admin-dark:bg-gray-600 text-gray-800 admin-dark:text-gray-200"
                      >
                        {service.order} đơn
                      </Badge>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground admin-dark:text-gray-400">
                          Giá dịch vụ
                        </p>
                        <p className="text-sm font-medium text-[#5ea25e] admin-dark:text-green-400">
                          ₫{service.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
          <SaleAnalytics />
        </div>
      </div>
    </div>
  );
}
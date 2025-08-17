import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  DollarSign,
  Users,
  Star,
  FileText,
  Layers,
} from "lucide-react";
import SaleAnalytics from "@/components/admin/services/sales/sale-analytics";

export default function ServiceOverview() {
  const location = useLocation();
  const { data } = location.state || {};

  const services = data.map((item) => ({
    id: item.id,
    name: item.ten_dich_vu,
    desc: item.mo_ta,
    price: 10000000,
    order: "10",
  }));

  return (
    <div className="text-black">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Tổng dịch vụ
              </CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">
                {services.length}
              </div>
              <p className="text-xs text-[#5ea25e]">+3 từ tháng trước</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Tổng doanh thu
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">
                ₫
                {services
                  ?.reduce((total, service) => total + (service.price ?? 0), 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-[#5ea25e]">+20.1% từ tháng trước</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Đơn đặt</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">
                {services.length}
              </div>
              <p className="text-xs text-[#5ea25e]">
                +{services.length} từ tháng trước
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">
                {services.length}
              </div>
              <p className="text-xs text-[#5ea25e]">
                +{services.length} từ tháng trước
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white rounded-xl p-2 shadow-md shadow-gray-300/50 border border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="admin-dark:text-primary">
                Dịch vụ hot
              </CardTitle>
              <CardDescription className="text-[#5ea25e]">
                Các dịch vụ có đơn đặt nhiều nhất
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {services
                .filter((service) => service.order >= 10)
                .map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-100"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-black">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-gray-800"
                      >
                        {service.order} đơn
                      </Badge>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Giá dịch vụ
                        </p>
                        <p className="text-sm font-medium text-[#5ea25e]">
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

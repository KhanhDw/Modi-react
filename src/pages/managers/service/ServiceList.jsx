import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceTable from "@/components/admin/services/ServiceTable";
import { useLocation } from "react-router-dom";

export default function ServiceList() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý dịch vụ</h2>
          <p className="text-muted-foreground">
            Theo dõi và quản lý các dịch vụ
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowCampaignForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo dịch vụ mới
        </Button>
      </div>
      <ServiceTable services={services} />
    </div>
  );
}

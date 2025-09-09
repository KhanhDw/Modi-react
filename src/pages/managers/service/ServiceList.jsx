import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceTable from "@/components/admin/services/ServiceTable";
import { useOutletContext } from "react-router-dom";
import DialogShowForm_Service from "./DialogShowForm.-service";
export default function ServiceList() {
  const { handleOpen } = useOutletContext();

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
          className="bg-primary hover:bg-gray-500/90"
          onClick={() => {
            handleOpen("service");
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo dịch vụ mới
        </Button>
      </div>
      <ServiceTable />
      <DialogShowForm_Service />
    </div>
  );
}

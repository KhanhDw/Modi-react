import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceTable from "@/components/admin/services/ServiceTable";
import { useOutletContext } from "react-router-dom";
import DialogShowForm_Service from "./DialogShowFormService";

export default function ServiceList() {
  const { handleOpen } = useOutletContext();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 admin-dark:text-gray-100">
            Quản lý dịch vụ
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Theo dõi và quản lý các dịch vụ
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-gray-500/90 text-xs sm:text-sm px-3 sm:px-4 py-2 w-full sm:w-auto"
          onClick={() => {
            handleOpen("service");
          }}
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
          Tạo dịch vụ mới
        </Button>
      </div>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 admin-dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <ServiceTable />
      </div>
      <DialogShowForm_Service />
    </div>
  );
}
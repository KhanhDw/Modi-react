import ServiceTable from "@/components/admin/services/ServiceTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Outlet, useOutletContext } from "react-router-dom";
import DialogShowForm_Service from "./DialogShowFormService";

export default function ServiceList() {
  const { handleOpen } = useOutletContext();

  return (
    <div className="space-y-4 xs:space-y-6">
      <div className="flex flex-col xs:flex-col sm:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3 sm:gap-4">
        <div>
          <h2 className="text-base text-center md:text-[22px] sm:text-start xs:text-lg sm:text-xl font-bold text-gray-900 admin-dark:text-gray-100">
            Quản lý dịch vụ
          </h2>
          <p className="text-xs text-center md:text-base sm:text-start xs:text-sm text-muted-foreground mt-0.5 xs:mt-1">
            Theo dõi và quản lý các dịch vụ
          </p>
        </div>
        <Button
          className="admin-dark:bg-blue-500 admin-dark:hover:bg-blue-600 hover:bg-gray-300 text-xs xs:text-sm px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 w-full xs:w-auto cursor-pointer"
          onClick={() => {
            handleOpen("service");
          }}
        >
          <Plus className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 mr-1 xs:mr-1.5 sm:mr-2" />
          Tạo dịch vụ mới
        </Button>
      </div>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 admin-dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <ServiceTable />
      </div>
      <DialogShowForm_Service />
      <Outlet />
    </div>
  );
}

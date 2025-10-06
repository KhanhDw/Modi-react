import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

const ServiceManager = ({
  stageMaster,
  currentStage,
  servicesStage,
  setIsModalOpen,
}) => {
  const getCurrentStageServices = () => servicesStage[currentStage] || [];

  return (
    <Card className="bg-white admin-dark:bg-gray-900 text-gray-900 admin-dark:text-gray-200 border-gray-200 admin-dark:border-gray-700">
      <CardHeader className="w-full gap-2 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4">
        <div className="flex flex-col items-center sm:items-start">
          <CardTitle className="text-gray-900 admin-dark:text-white text-sm sm:text-base">
            Dịch Vụ
          </CardTitle>
          <CardDescription className="text-gray-500 admin-dark:text-gray-400 text-sm font-normal mt-1 sm:text-base">
            Chọn dịch vụ cho giai đoạn{" "}
            <span className="font-semibold">
              {stageMaster[currentStage - 1]?.title_vi || "[chưa có dữ liệu]"}
            </span>
          </CardDescription>
        </div>
        <div className="flex-shrink-0">
          <Button
            theme="admin"
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            size="default"
            className="cursor-pointer"
            disabled={stageMaster.length === 0}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm sm:text-base font-semibold text-gray-700 admin-dark:text-gray-300">
              Chọn dịch vụ
            </span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-gray-800 admin-dark:text-gray-200 text-sm sm:text-base">
            Dịch vụ đã chọn cho giai đoạn{" "}
            <span className="font-semibold text-blue-600 admin-dark:text-sky-400 text-sm sm:text-base">
              {stageMaster[currentStage - 1]?.title_vi}
            </span>
          </Label>
          <div className="space-y-2 p-3 bg-gray-50 admin-dark:bg-gray-800 rounded-lg min-h-[100px] border border-gray-200 admin-dark:border-gray-700">
            {getCurrentStageServices().length === 0 ? (
              <p className="text-center text-gray-500 admin-dark:text-gray-500 py-4 text-sm sm:text-base">
                Chưa có dịch vụ nào được chọn cho giai đoạn này
              </p>
            ) : (
              getCurrentStageServices().map((service, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 border border-gray-200 rounded bg-white admin-dark:bg-slate-900/50 admin-dark:border-gray-600"
                >
                  <div className="text-sm font-medium text-blue-700 admin-dark:text-sky-400">
                    {service.translation?.ten_dich_vu}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceManager;

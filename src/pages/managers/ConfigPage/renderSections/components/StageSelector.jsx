import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { LogOut, PencilLine } from "lucide-react";

const StageSelector = ({
  stageMaster,
  currentStage,
  setCurrentStage,
  isEditStage,
  setIsEditStage,
}) => {
  return (
    <Card className="bg-white border-gray-300 admin-dark:bg-gray-900 admin-dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 admin-dark:text-white">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between w-full">
            <span className="text-sm sm:text-base">Chọn Giai Đoạn</span>
            <Button
              theme="admin"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditStage(!isEditStage)}
              className="font-medium bg-gray-100 admin-dark:bg-gray-800 shadow text-gray-700 admin-dark:text-gray-300 admin-dark:hover:text-white cursor-pointer"
            >
              {isEditStage ? (
                <span className="flex items-center gap-2 text-sm sm:text-base">
                  Hủy thay đổi <LogOut className="w-4 h-4" />
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm sm:text-base">
                  <PencilLine className="w-4 h-4" /> Điều chỉnh giai đoạn{" "}
                </span>
              )}
            </Button>
          </div>
        </CardTitle>
        <CardDescription className="text-gray-500 admin-dark:text-gray-400 text-sm sm:text-base">
          Sử dụng thanh trượt để chuyển đổi giữa các giai đoạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Slider
            value={[currentStage]}
            onValueChange={(value) => setCurrentStage(value[0])}
            max={stageMaster.length}
            min={1}
            step={1}
            className="w-full"
          />

          <div className="flex justify-between text-sm text-gray-600 admin-dark:text-gray-300 mt-2">
            {stageMaster.map((st) => (
              <span key={st.id}>{st.title_vi}</span>
            ))}
          </div>
        </div>
        <div className="text-center pt-2">
          {stageMaster[currentStage - 1] && (
            <div className="inline-flex flex-col justify-center items-center gap-2 rounded-lg bg-gray-100 admin-dark:bg-gray-800 px-4 py-2 border border-gray-200 admin-dark:border-gray-700">
              <span className="text-xl font-bold text-blue-600 admin-dark:text-sky-400">
                {stageMaster[currentStage - 1].title_vi}
              </span>
              <span className="text-base text-gray-500 admin-dark:text-gray-400">
                {stageMaster[currentStage - 1].title_en}
              </span>
            </div>
          )}
          {!stageMaster[currentStage - 1] && (
            <div className="inline-flex flex-col justify-center items-center gap-2 rounded-lg bg-gray-100 admin-dark:bg-gray-800 px-4 py-2 border border-gray-200 admin-dark:border-gray-700">
              <span className="text-xl font-bold text-blue-600 admin-dark:text-sky-400">
                Chưa có dữ liệu giai đoạn, vui lòng cập nhật!
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StageSelector;

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Crosshair, Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import EditServiceGroupForm from "./EditServiceGroupForm.jsx";
import {
  createMiniService,
  deleteMiniService,
  getAllMiniServices,
} from "../hook/use_list_mini_service.jsx";

const MiniServiceManager = ({
  showToast,
  triggerDelete,
  setSelectedServiceMini,
  setIsGroupServiceModalOpen,
}) => {
  const [listServiceMini, setListServiceMini] = useState([]);
  const [newLineVi, setNewLineVi] = useState("");
  const [newLineEn, setNewLineEn] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const FetchListMiniService = async () => {
    try {
      const stageResult = await getAllMiniServices();
      setListServiceMini(stageResult);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    FetchListMiniService();
  }, []);

  const HandlePostSelectMiniServiceForServiceStage = async () => {
    try {
      await createMiniService({ title_vi: newLineVi, title_en: newLineEn });
      await FetchListMiniService();
      setNewLineVi("");
      setNewLineEn("");
      showToast("Thêm hạng mục thành công!");
    } catch (error) {
      console.log(error);
      showToast("Thêm hạng mục thất bại.", "error");
    }
  };

  const triggerDeleteMiniService = (item) => {
    triggerDelete(item, () => handleDeleteMiniService(item.id));
  };

  const handleDeleteMiniService = async (id) => {
    try {
      await deleteMiniService(id);
      await FetchListMiniService();
      showToast("Đã xóa hạng mục thành công.");
    } catch (error) {
      console.log(error);
      showToast("Xóa hạng mục thất bại.", "error");
    }
  };

  return (
    <Card className="bg-white admin-dark:bg-gray-900 duration-300 transition-all text-gray-900 admin-dark:text-gray-200 border-gray-200 admin-dark:border-gray-700">
      <CardHeader className={"px-2 sm:px-4"}>
        <CardTitle className="text-gray-900 admin-dark:text-white text-sm sm:text-base">
          Quản Lý Mục
        </CardTitle>
        <CardDescription className="text-gray-500 admin-dark:text-gray-400 text-sm sm:text-base">
          Thêm và chỉnh sửa các hạng mục cho các gói dịch vụ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new ServiceGroup Line */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 admin-dark:bg-gray-800/50 admin-dark:border-gray-700">
          <h4 className="font-medium text-gray-900 admin-dark:text-white text-sm sm:text-base">
            Thêm hạng mục cho các gói dịch vụ
          </h4>
          <div className="flex flex-col md:flex-row md:gap-2 w-full space-y-3">
            <Input
              placeholder="Tên hạng mục (Việt)"
              value={newLineVi}
              onChange={(e) => setNewLineVi(e.target.value)}
            />
            <Input
              placeholder="Tên hạng mục (English)"
              value={newLineEn}
              onChange={(e) => setNewLineEn(e.target.value)}
            />
          </div>
          <Button
            theme="admin"
            onClick={HandlePostSelectMiniServiceForServiceStage}
            className="w-full md:w-50 flex md:mx-auto shadow bg-blue-500 hover:bg-blue-600 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2 text-white" />
            <span className="text-sm sm:text-base font-semibold text-white">
              Thêm hạng mục mới
            </span>
          </Button>
        </div>

        {/* Items List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          <h4 className="font-medium text-gray-900 admin-dark:text-white text-sm sm:text-base">
            Danh Sách Hạng Mục
          </h4>
          {listServiceMini.length === 0 ? (
            <p className="text-gray-500 admin-dark:text-gray-500 text-center py-4 text-sm sm:text-base">
              Chưa có mục nào. Hãy thêm mục đầu tiên!
            </p>
          ) : (
            listServiceMini.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white",
                  "admin-dark:bg-gray-800 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-700/50"
                )}
              >
                {editingItem === item.id ? (
                  <EditServiceGroupForm
                    item={item}
                    onCancel={() => setEditingItem(null)}
                    onReload={FetchListMiniService}
                  />
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-blue-600 admin-dark:text-sky-400">
                        <span className="font-medium text-sm sm:text-base">
                          {item.title_vi}
                        </span>
                      </div>
                      <p className="text-gray-500 admin-dark:text-gray-400 text-sm sm:text-base">
                        {item.title_en}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        theme="admin"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedServiceMini(item);
                          setIsGroupServiceModalOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Crosshair className="w-4 h-4" />
                      </Button>

                      <Button
                        theme="admin"
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingItem(item.id)}
                        className="cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        theme="admin"
                        size="sm"
                        variant="outline"
                        onClick={() => triggerDeleteMiniService(item)}
                        className="cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniServiceManager;

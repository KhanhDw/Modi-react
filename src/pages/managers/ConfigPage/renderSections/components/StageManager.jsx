import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import SortableStageItem from "./SortableStageItem.jsx";
import {
  bulkUpdateStageCodes,
  createStage,
  deleteStage,
  getAllStages,
  updateStage,
} from "../hook/use_stage_master.jsx";

const StageManager = ({
  showToast,
  triggerDelete,
  stageMaster,
  setStageMaster,
  fetchStages,
}) => {
  const [newStageVi, setNewStageVi] = useState("");
  const [newStageEn, setNewStageEn] = useState("");
  const [editingStage, setEditingStage] = useState(null);
  const [isOrderChanged, setIsOrderChanged] = useState(false);

  // handle thêm
  const handleAddStage = async () => {
    try {
      await createStage({
        title_vi: newStageVi,
        title_en: newStageEn,
      });
      setNewStageVi("");
      setNewStageEn("");
      await fetchStages();
      showToast("Thêm giai đoạn thành công!");
    } catch (err) {
      console.error(err);
      showToast("Thêm giai đoạn thất bại.", "error");
    }
  };

  // handle update
  const handleUpdateStage = async (id, stageData) => {
    try {
      await updateStage(id, stageData);
      setEditingStage(null);
      await fetchStages();
      showToast("Cập nhật giai đoạn thành công!");
    } catch (err) {
      console.error(err);
      showToast("Cập nhật giai đoạn thất bại.", "error");
    }
  };

  // ===== DND LOGIC =====
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setStageMaster((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Cập nhật lại 'code' (vị trí)
        return newOrder.map((item, index) => ({
          ...item,
          code: String(index + 1),
        }));
      });
      setIsOrderChanged(true);
    }
  }

  const handleSaveOrder = async () => {
    try {
      // Chuẩn bị dữ liệu để gửi đi: một mảng các object {id, code}
      const stagesToUpdate = stageMaster.map(({ id, code }) => ({ id, code }));

      // Gọi API cập nhật hàng loạt
      await bulkUpdateStageCodes(stagesToUpdate);

      await fetchStages(); // Fetch lại để đảm bảo dữ liệu đồng bộ và reset isOrderChanged
      showToast("Đã lưu thứ tự giai đoạn.");
      setIsOrderChanged(false);
    } catch (err) {
      console.error("Lỗi khi lưu thứ tự:", err);
      showToast("Lưu thứ tự thất bại.", "error");
    }
  };

  const handleCancelOrder = () => {
    fetchStages();
    setIsOrderChanged(false);
  };

  return (
    <Card className="bg-white admin-dark:bg-gray-900 border border-gray-300 admin-dark:border-gray-600">
      <CardHeader className={"px-2 sm:px-4"}>
        <CardTitle className="text-gray-900 admin-dark:text-white text-sm sm:text-base">
          Quản lý giai đoạn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-end">
          <Input
            placeholder="Tiếng Việt"
            value={newStageVi}
            onChange={(e) => setNewStageVi(e.target.value)}
            className={"text-gray-700 admin-dark:text-gray-100"}
          />
          <Input
            placeholder="English"
            value={newStageEn}
            onChange={(e) => setNewStageEn(e.target.value)}
            className={"text-gray-700 admin-dark:text-gray-100"}
          />
          <Button
            theme="admin"
            onClick={handleAddStage}
            disabled={!newStageVi.trim() || !newStageEn.trim()}
            className="cursor-pointer shadow bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-1 cursor-pointer text-xs sm:text-base text-white" />{" "}
            <span className="text-sm sm:text-base font-semibold text-white">
              Thêm
            </span>
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={stageMaster.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {stageMaster.map((st) => (
                <SortableStageItem
                  key={st.id}
                  stage={st}
                  isEditing={editingStage === st.id}
                  onEdit={setEditingStage}
                  onDelete={() => triggerDelete(st)}
                  onUpdate={handleUpdateStage}
                  onCancelEdit={() => setEditingStage(null)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {isOrderChanged && (
          <div className="flex justify-end gap-2 pt-4">
            <Button
              theme="admin"
              variant="ghost"
              onClick={handleCancelOrder}
              className="cursor-pointer"
            >
              <span className="text-sm sm:text-base font-semibold text-white">
                Hủy sắp xếp
              </span>
            </Button>
            <Button
              theme="admin"
              onClick={handleSaveOrder}
              className="cursor-pointer"
            >
              <Save className="w-4 h-4 mr-2" />
              <span className="text-sm sm:text-base font-semibold text-white">
                Lưu thứ tự
              </span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StageManager;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Save, X, Edit2, Trash2 } from "lucide-react";

const SortableStageItem = ({
  stage,
  onEdit,
  onDelete,
  isEditing,
  onUpdate,
  onCancelEdit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between border rounded-lg p-3 transition-shadow border-gray-200 admin-dark:border-gray-700",
        isDragging
          ? "shadow-xl bg-gray-50 z-10 admin-dark:bg-gray-800"
          : "bg-white admin-dark:bg-gray-800/50",
        isEditing ? "ring-2 ring-blue-500/50" : ""
      )}
    >
      {isEditing ? (
        <div className="flex gap-2 w-full items-center">
          <Input
            defaultValue={stage.code}
            onChange={(e) => (stage.code = e.target.value)}
            className="w-20"
            placeholder="Code"
          />
          <Input
            defaultValue={stage.title_vi}
            onChange={(e) => (stage.title_vi = e.target.value)}
            placeholder="Tiếng Việt"
          />
          <Input
            defaultValue={stage.title_en}
            onChange={(e) => (stage.title_en = e.target.value)}
            placeholder="English"
          />
          <Button
            theme="admin"
            size="sm"
            onClick={() => onUpdate(stage.id, stage)}
            className="cursor-pointer shadow"
          >
            <Save className="w-4 h-4" />
          </Button>
          <Button
            theme="admin"
            size="sm"
            variant="outline"
            onClick={onCancelEdit}
            className="cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab focus:cursor-grabbing p-1 text-gray-400 hover:text-gray-800 admin-dark:text-gray-500 admin-dark:hover:text-gray-200"
            >
              <GripVertical className="w-5 h-5" />
            </div>
            <Badge
              variant="secondary"
              className="font-mono text-xs"
            >
              {stage.code}
            </Badge>
            <div>
              <span className="font-medium text-sm text-gray-900 admin-dark:text-white">
                {stage.title_vi}
              </span>
              <span className="text-sm text-gray-500 ml-2 admin-dark:text-gray-400">
                / {stage.title_en}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              theme="admin"
              size="icon"
              variant="ghost"
              onClick={() => onEdit(stage.id)}
              className="cursor-pointer"
            >
              <Edit2 className="w-4 h-4 text-gray-400" />
            </Button>
            <Button
              theme="admin"
              size="icon"
              variant="ghost"
              className="text-red-600 hover:text-red-700 admin-dark:text-red-500 admin-dark:hover:text-red-400 cursor-pointer"
              onClick={() => onDelete(stage)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SortableStageItem;

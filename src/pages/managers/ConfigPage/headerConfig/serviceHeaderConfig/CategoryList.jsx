import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useLenisLocal from "@/hook/useLenisLocal";
import { cn } from "@/lib/utils";
import { Folder, GripVertical, Pencil, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import EmptyState from "./EmptyState";

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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableCategoryItem({
  cat,
  selectedCategory,
  lang,
  onSelect,
  onEdit,
  onDelete,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-2 rounded-lg shadow text-gray-900 admin-dark:text-white font-semibold border flex items-center justify-between cursor-pointer transition-colors",
        selectedCategory?.id === cat.id
          ? "bg-primary border-primary"
          : "bg-gray-50 hover:bg-gray-100 border-gray-200 admin-dark:bg-gray-800 admin-dark:hover:bg-gray-700 admin-dark:border-gray-600"
      )}
      onClick={() => onSelect(cat)}
    >
      <div className="flex items-center gap-2 flex-1">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600 admin-dark:hover:text-gray-200"
        >
          <GripVertical className="h-4 w-4" />
        </span>
        {/* <span className="truncate">{cat.name?.[lang] || cat.name}</span> */}
        <span className="">{cat.name?.[lang] || cat.name}</span>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(cat);
          }}
          className="cursor-pointer"
        >
          <Pencil className="h-4 w-4 text-xs sm:text-sm" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(cat);
          }}
          className="cursor-pointer"
        >
          <span className="text-xs sm:text-sm font-semibold">Xóa</span>
        </Button>
      </div>
    </div>
  );
}

export default function CategoryList({
  categories = [],
  selectedCategory,
  lang,
  onSelect,
  onAdd,
  onDelete,
  onEdit,
  onReorder, // callback khi lưu thay đổi
}) {
  useLenisLocal(".lenis-local");

  const [items, setItems] = useState(categories);

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((c) => c.id === active.id);
      const newIndex = items.findIndex((c) => c.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
    }
  };

  // so sánh items hiện tại với categories ban đầu
  const isChanged = useMemo(() => {
    if (items.length !== categories.length) return true;
    return items.some((item, idx) => item.id !== categories[idx].id);
  }, [items, categories]);

  const handleCancel = () => {
    setItems(categories); // reset lại thứ tự ban đầu
  };

  const handleSave = () => {
    onReorder?.(updatePositionsMintoMax(items)); // gửi lên parent
  };

  function updatePositionsMintoMax(items) {
    // Tìm min position ban đầu
    const minPosition = Math.min(...items.map((i) => i.postion));

    // Gán lại position dựa trên index trong array
    return items.map((item, index) => ({
      ...item,
      postion: minPosition + index,
    }));
  }

  return (
    <Card className="bg-white admin-dark:bg-gray-900 shadow-md border border-gray-200 admin-dark:border-gray-700">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-gray-700 admin-dark:text-gray-300" />
          <CardTitle className="text-gray-800 admin-dark:text-gray-100 font-semibold">
            Danh mục cha
          </CardTitle>
        </div>
        {isChanged ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              size="sm"
              className="bg-primary text-black/80 admin-dark:text-white hover:bg-primary/90 cursor-pointer"
              onClick={handleSave}
            >
              Lưu
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            className="bg-primary shadow text-black/80 admin-dark:text-white hover:bg-primary/90 transition-colors cursor-pointer"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4 mr-1" /> Thêm
          </Button>
        )}
      </CardHeader>

      <CardContent
        data-lenis-prevent
        className="lenis-local space-y-2 max-h-[480px] overflow-y-auto pr-3"
      >
        {items?.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((cat) => (
                <SortableCategoryItem
                  key={cat.id}
                  cat={cat}
                  selectedCategory={selectedCategory}
                  lang={lang}
                  onSelect={onSelect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <EmptyState text="Chưa có danh mục cha" />
        )}
      </CardContent>
    </Card>
  );
}

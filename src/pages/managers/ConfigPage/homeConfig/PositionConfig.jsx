import {
  closestCenter,
  DndContext,
  KeyboardSensor,
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
import { useEffect, useState } from "react";
import { sectionsConfig } from "../HomeConfig.jsx";
import ConfirmModal from "./ConfirmModal.jsx";

// ====================== Row có thể kéo ======================
function SortableRow({ v, i, onAskToggle }) {
  const [disableDrag, setDisableDrag] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: v.id ?? `vitri-${i}`,
      disabled: disableDrag,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const section = sectionsConfig.find(
    (sec) => sec.key.toLowerCase() === v.type.toLowerCase()
  );
  const displayType = section ? section.label : v.type;

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      // Kích hoạt lắng nghe sự kiện kéo thả khi không bị vô hiệu hóa
      {...(!disableDrag ? listeners : {})}
      // Thêm các lớp giao diện
      className="
      group
      cursor-grab
      focus:cursor-grabbing
      transition-all duration-200 ease-in-out
      border-b border-gray-200 admin-dark:border-gray-700
      hover:bg-indigo-50 admin-dark:hover:bg-gray-800
    "
    >
      {/* Cột 1: STT (Số thứ tự) */}
      <td className="px-4 py-3 text-sm font-medium text-gray-500 admin-dark:text-gray-400">
        {i + 1}
      </td>

      {/* Cột 2: displayType (Loại hiển thị) */}
      <td className="px-4 py-3 text-sm text-gray-700 admin-dark:text-gray-300">
        {displayType}
      </td>

      {/* Cột 3: v.type (Loại dữ liệu) */}
      <td className="px-4 py-3 text-sm text-gray-700 admin-dark:text-gray-300">
        {v.type}
      </td>

      {/* Cột 4: v.position (Vị trí) */}
      <td className="px-4 py-3 text-sm text-gray-700 admin-dark:text-gray-300">
        {v.position}
      </td>

      {/* Cột 5: Nút Trạng thái/Toggle */}
      <td className="px-4 py-3 text-center">
        <button
          // Vô hiệu hóa kéo thả khi hover nút
          onMouseEnter={() => setDisableDrag(true)}
          onMouseLeave={() => setDisableDrag(false)}
          onClick={() => onAskToggle(v.id ?? `vitri-${i}`)}
          // Nút trạng thái trực quan hơn (Pill/Badge)
          className={`
          inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
          transition-colors duration-200 shadow-sm
          ${v.status === 1
              ? "bg-green-100 text-green-800 hover:bg-green-200 admin-dark:bg-green-900 admin-dark:text-green-300 admin-dark:hover:bg-green-800"
              : "bg-red-100 text-red-800 hover:bg-red-200 admin-dark:bg-red-900 admin-dark:text-red-300 admin-dark:hover:bg-red-800"
            }
        `}
        >
          {/* Thêm biểu tượng (Icon) để trực quan hơn */}
          <span className="text-xs font-semibold">{v.status === 1 ? "Hoạt động" : "Tạm dừng"}</span>
        </button>
      </td>
    </tr>
  );
}

// ====================== Bảng chính ======================
export default function VitriTable({ initialVitri = [], onChangeVitri }) {
  const [vitri, setVitri] = useState([]);
  const [pendingId, setPendingId] = useState(null); // lưu id item muốn đổi trạng thái

  useEffect(() => {
    if (initialVitri && initialVitri.length > 0) {
      setVitri(initialVitri);
    }
  }, [initialVitri]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Hàm update BE + state
  const handleToggleStatus = async (id) => {
    const updatedItems = vitri.map((item, index) =>
      (item.id ?? `vitri-${index}`) === id
        ? { ...item, status: item.status === 1 ? 0 : 1 }
        : item
    );

    setVitri(updatedItems);
    if (onChangeVitri) {
      onChangeVitri(updatedItems);
    }

    const changedItem = updatedItems.find(
      (item, index) => (item.id ?? `vitri-${index}`) === id
    );

    try {
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/status-position-home-page`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sections_type: changedItem.type,
            status: changedItem.status,
          }),
        }
      );
      const data = await res.json();
      console.log(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = vitri.findIndex(
        (item, i) => (item.id ?? `vitri-${i}`) === active.id
      );
      const newIndex = vitri.findIndex(
        (item, i) => (item.id ?? `vitri-${i}`) === over.id
      );

      const newItems = arrayMove(vitri, oldIndex, newIndex);

      const updatedItems = newItems.map((item, index) => ({
        ...item,
        position: index + 1,
      }));

      setVitri(updatedItems);

      if (onChangeVitri) {
        onChangeVitri(updatedItems);
      }
    }
  };

  if (!Array.isArray(vitri) || vitri.length === 0) {
    return (
      <div className="p-4 text-gray-500 w-full flex items-center justify-center">
        <p>Không có dữ liệu vị trí</p>
      </div>
    );
  }

  const columnName = ["STT", "Tên", "Loại", "Vị trí", "Trạng thái"];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-md admin-dark:border-gray-700">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={vitri.map((v, i) => v.id ?? `vitri-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <table className="min-w-full border-collapse shadow-sm">
            <thead className="bg-gray-200 admin-dark:bg-gray-700">
              <tr>
                {columnName.map((c, i) => (
                  <th
                    key={i}
                    className={`px-4 py-3 text-sm sm:text-base text-left font-semibold text-gray-700
                      admin-dark:text-gray-200 ${c === "Trạng thái"
                        ? "flex items-center justify-center text-center "
                        : ""
                      }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 admin-dark:divide-gray-700 ">
              {vitri.map((v, i) => (
                <SortableRow
                  key={v.id ?? `vitri-${i}`}
                  v={v}
                  i={i}
                  onAskToggle={(id) => setPendingId(id)} // mở modal trước
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>

      {/* Modal xác nhận */}
      <ConfirmModal
        open={!!pendingId}
        onClose={() => setPendingId(null)}
        onConfirm={() => {
          if (pendingId) handleToggleStatus(pendingId);
        }}
      />
    </div>
  );
}

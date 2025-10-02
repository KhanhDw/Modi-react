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


// Component Row có thể kéo
function SortableRow({ v, i }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: v.id ?? `vitri-${i}` });

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
            {...listeners}
            className="cursor-move transition-colors duration-300 hover:bg-indigo-50 admin-dark:hover:bg-indigo-900"
        >
            <td className="px-4 py-2">{i + 1}</td>
            <td className="px-4 py-2">{displayType}</td>
            <td className="px-4 py-2">{v.type}</td>
            <td className="px-4 py-2">{v.position}</td>
        </tr>


    );
}

export default function VitriTable({ initialVitri = [], onChangeVitri }) {

    const [vitri, setVitri] = useState([]);


    useEffect(() => {
        if (initialVitri && initialVitri.length > 0) {
            setVitri(initialVitri);
        }
    }, [initialVitri]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

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

            // FIX: Cập nhật position cho từng item
            const updatedItems = newItems.map((item, index) => ({
                ...item,
                position: index + 1
            }));

            setVitri(updatedItems);

            // FIX: Gửi dữ liệu về parent component
            if (onChangeVitri) {
                onChangeVitri(updatedItems);
            }
        }
    };

    if (!Array.isArray(vitri) || vitri.length === 0) {
        return <div className="p-4 text-gray-500 w-full flex items-center justify-center">
            <p>Không có dữ liệu vị trí</p>
        </div>;
    }

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
                    <table className="min-w-full  border-collapse  shadow-md ">
                        <thead className="bg-gray-200 admin-dark:bg-gray-700">
                            <tr className="">
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b admin-dark:text-gray-200 admin-dark:border-gray-600">
                                    STT
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b admin-dark:text-gray-200 admin-dark:border-gray-600">
                                    Tên
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b admin-dark:text-gray-200 admin-dark:border-gray-600">
                                    Loại
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b admin-dark:text-gray-200 admin-dark:border-gray-600">
                                    Vị trí
                                </th>
                            </tr>
                        </thead>
                        <tbody className=" divide-y divide-gray-100 admin-dark:divide-gray-700 ">
                            {vitri.map((v, i) => (
                                <SortableRow key={v.id ?? `vitri-${i}`} v={v} i={i} />
                            ))}
                        </tbody>
                    </table>
                </SortableContext>
            </DndContext>
        </div>
    );

}

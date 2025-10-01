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
import { useEffect, useState } from "react";

// Giả định các imports UI cơ bản
import { FileText, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

// --- Thay thế các imports không giải quyết được và cải thiện UI Mock ---
const Card = ({ className, children }) => <div className={`rounded-xl border border-gray-200 admin-dark:border-gray-700 shadow-lg ${className}`}>{children}</div>;
const CardHeader = ({ className, children }) => <div className={`p-4 border-b border-gray-200 admin-dark:border-gray-700 ${className}`}>{children}</div>;
const CardTitle = ({ className, children }) => <h2 className={`text-xl font-extrabold ${className}`}>{children}</h2>;
const CardContent = ({ className, children }) => <div className={`p-4 ${className}`}>{children}</div>;
const Button = ({ size, variant = "default", className, onClick, children, disabled }) => {
    let baseStyles = "px-4 py-2 text-sm rounded-lg transition-colors duration-150 font-semibold shadow-sm";
    let variantStyles = "";

    switch (variant) {
        case "destructive":
            variantStyles = "bg-red-600 text-white hover:bg-red-700 active:bg-red-800";
            break;
        case "outline":
            variantStyles = "border border-gray-300 text-gray-700 hover:bg-gray-100 admin-dark:border-gray-600 admin-dark:text-gray-300 admin-dark:hover:bg-gray-700";
            break;
        case "primary":
        case "default":
        default:
            variantStyles = "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800";
            break;
    }

    if (disabled) {
        variantStyles = "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none";
    }

    // Nút Lưu thay đổi (màu xanh lá)
    if (className?.includes("bg-green-500")) {
        variantStyles = "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-md";
    }


    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles} ${className} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

// EmptyState component
const EmptyState = ({ text }) => (
    <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300 admin-dark:bg-gray-800 admin-dark:border-gray-600">
        <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-lg font-medium text-gray-500 admin-dark:text-gray-400">
            {text}
        </p>
    </div>
);

/**
 * Component để hiển thị từng mục con có thể kéo thả.
 * Đã áp dụng animation kéo thả mượt mà hơn.
 */
const SortableChildItem = ({ child, lang, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging, // Sử dụng isDragging
    } = useSortable({ id: child.id });

    // 1. Đơn giản hóa style: Chỉ giữ lại transform và transition
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        // Loại bỏ zIndex, opacity, boxShadow khỏi inline style
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            // 2. Tăng cường className để tạo hiệu ứng "nhấc lên"
            className={`flex items-center justify-between admin-dark:text-white text-gray-900 gap-4 p-3 pr-4 rounded-xl border transition-all duration-200
                ${isDragging
                    ? 'ring-2 ring-blue-500 bg-white admin-dark:bg-gray-800 shadow-xl scale-[1.01] z-50' // Thêm shadow-xl, scale nhẹ, z-index cao
                    : 'bg-white hover:bg-gray-50 border-gray-200 admin-dark:bg-gray-900 admin-dark:hover:bg-gray-800 admin-dark:border-gray-700'
                }
                ${isDragging ? 'cursor-grabbing' : 'cursor-default'}
            `}
        >
            {/* Vùng kéo (Drag Handle) */}
            <div
                className="p-1 -ml-1 mr-3 shrink-0 cursor-grab text-gray-400 hover:text-gray-600 admin-dark:hover:text-gray-300 transition-colors"
                // Gán listeners và attributes vào icon kéo thả
                {...attributes}
                {...listeners}
                aria-label="Kéo để sắp xếp lại"
            >
                <GripVertical className="h-5 w-5" />
            </div>

            {/* Tiêu đề mục */}
            <span className="font-medium truncate flex-grow text-base">
                {child.title?.[lang] || "Không có tên"}
            </span>

            {/* Các nút hành động */}
            <div className="flex gap-2 shrink-0">
                <Button
                    size="icon"
                    variant="outline"
                    className="p-0 " // Nút nhỏ hơn, chỉ có icon
                    onClick={() => onEdit(child)}
                    aria-label="Sửa mục con"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    size="icon"
                    variant="destructive"
                    className="p-0" // Nút nhỏ hơn, chỉ có icon
                    onClick={() => onDelete(child)}
                    aria-label="Xóa mục con"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};


export default function ChildList({ selectedCategory, lang, onAdd, onDelete, onEdit, onSortEnd }) {
    // State cục bộ để quản lý thứ tự các mục con cho việc kéo thả
    const [childrenItems, setChildrenItems] = useState(selectedCategory?.children || []);
    // State mới để theo dõi xem có thay đổi thứ tự chưa được lưu không
    const [isSortingPending, setIsSortingPending] = useState(false);

    // Đồng bộ hóa state cục bộ khi prop selectedCategory thay đổi
    useEffect(() => {
        // Reset childrenItems về trạng thái ban đầu từ prop
        setChildrenItems(selectedCategory?.children || []);
        // Reset pending status mỗi khi prop được cập nhật (ví dụ: sau khi lưu)
        setIsSortingPending(false);
    }, [selectedCategory]);

    // Thiết lập sensors cho phép kéo thả bằng con trỏ (chuột, chạm)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Kéo chuột 8px mới bắt đầu kéo thả
            },
        })
    );

    // Hàm xử lý khi kết thúc kéo thả
    function handleDragEnd(event) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        setChildrenItems((items) => {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);

            const newOrder = arrayMove(items, oldIndex, newIndex);

            // Kiểm tra xem thứ tự đã thực sự thay đổi so với prop gốc chưa
            const originalChildren = selectedCategory?.children || [];
            const originalIds = originalChildren.map(c => c.id).join(',');
            const newOrderIds = newOrder.map(c => c.id).join(',');

            // Cập nhật trạng thái chờ lưu
            setIsSortingPending(originalIds !== newOrderIds);

            return newOrder;
        });
    }

    // Hàm xử lý khi nhấn nút Hủy
    const handleCancelSort = () => {
        // Hủy: Đặt lại danh sách về trạng thái ban đầu từ prop
        setChildrenItems(selectedCategory?.children || []);
        setIsSortingPending(false);
    };

    // Hàm xử lý khi nhấn nút Lưu
    const handleSaveSort = () => {
        // Lưu: Gọi hàm onSortEnd với thứ tự hiện tại (và gán lại position)
        if (onSortEnd) {
            onSortEnd(updatePositionsMintoMax(childrenItems));
        }
        // Giả sử component cha sẽ xử lý việc lưu và cập nhật prop
        // Không reset isSortingPending ở đây, mà để useEffect theo dõi prop selectedCategory xử lý sau khi lưu thành công
    };

    // Hàm phụ để cập nhật thuộc tính 'postion' dựa trên thứ tự mảng mới
    function updatePositionsMintoMax(items) {
        // Tìm min position ban đầu để duy trì khoảng cách nếu cần (hoặc mặc định là 0 nếu không có)
        // Lưu ý: Nếu muốn position bắt đầu từ 0 hoặc 1, bạn có thể đơn giản là dùng index + 1
        const minPosition = items.length > 0 ? Math.min(...items.map(i => i.postion || 0)) : 0;

        // Gán lại position dựa trên index trong array
        return items.map((item, index) => ({
            ...item,
            postion: minPosition + index,
        }));
    }

    // Lấy danh sách ID của các mục con để cung cấp cho SortableContext
    const itemsIds = childrenItems.map(item => item.id);

    // Chỉ hiển thị nội dung nếu có danh mục cha được chọn
    const hasSelectedCategory = !!selectedCategory;
    const hasChildren = childrenItems.length > 0;

    return (
        <Card className="bg-white admin-dark:bg-gray-900">
            {/* Bắt đầu CardHeader: Bao bọc tiêu đề và các nút điều khiển */}
            <CardHeader className="pb-4 flex flex-col sm:flex-row md:flex-col justify-between items-center">
                {/* CardTitle đã được thêm 'min-w-0' để đảm bảo co lại bên trong flex container */}
                <CardTitle className="flex items-center gap-2 text-gray-800 admin-dark:text-gray-100 font-semibold text-sm md:text-base">
                    <FileText className="text-blue-500" /> {/* Icon nổi bật hơn */}
                    {/* Thẻ p được thêm 'truncate' và 'min-w-0' để xử lý nội dung quá dài */}
                    <p className="text-sm font-medium text-gray-800 admin-dark:text-gray-100 truncate min-w-0">
                        {selectedCategory
                            ? `Mục con của "${selectedCategory.name?.[lang] || selectedCategory.name}"`
                            : "Chọn danh mục cha"}
                    </p>
                </CardTitle>

                {selectedCategory && (
                    <div className="flex gap-3 whitespace-nowrap">
                        {isSortingPending ? (
                            <>
                                {/* Nút Hủy (Outline) */}
                                <button
                                    onClick={handleCancelSort}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700
hover:bg-gray-100 admin-dark:border-gray-600 admin-dark:text-gray-100 admin-dark:hover:bg-gray-800
text-sm font-medium transition-colors"
                                >
                                    Hủy
                                </button>

                                {/* Nút Lưu (Primary Green) */}
                                <button
                                    onClick={handleSaveSort}
                                    className="px-4 py-2 rounded-lg bg-green-600 text-white
hover:bg-green-700 active:scale-95
text-sm font-medium shadow-md transition-transform"
                                >
                                    Lưu
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onAdd}
                                className="whitespace-nowrap flex items-center px-3 py-2 rounded-lg
bg-blue-600 text-white text-sm font-medium
hover:bg-blue-700 active:scale-95 transition-transform shadow-md"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                <span>Thêm</span>
                            </button>
                        )}

                    </div>
                )}
            </CardHeader> {/* Kết thúc CardHeader */}

            <CardContent
                className="space-y-3 max-h-[480px] overflow-y-auto pr-2"
            >
                {hasSelectedCategory ? (
                    hasChildren ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={itemsIds} // Phải là một mảng ID
                                strategy={verticalListSortingStrategy}
                            >
                                {childrenItems.map((child) => (
                                    <SortableChildItem
                                        key={child.id}
                                        child={child}
                                        lang={lang}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <EmptyState text="Chưa có mục con nào. Hãy thêm một mục mới!" />
                    )
                ) : (
                    <EmptyState text="Chọn danh mục cha để xem mục con" />
                )}
            </CardContent>
        </Card>

    );
}

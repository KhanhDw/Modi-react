import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useLenisLocal from "@/hook/useLenisLocal";
import { FileText, Pencil, Plus } from "lucide-react";
import EmptyState from "./EmptyState";

export default function ChildList({ selectedCategory, lang, onAdd, onDelete, onEdit }) {
    useLenisLocal(".lenis-local");
    return (
        <Card className="bg-white admin-dark:bg-gray-900 shadow-md border border-gray-200 admin-dark:border-gray-700">
            <CardHeader className="pb-4 flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-gray-800 admin-dark:text-gray-100 font-semibold">
                    <FileText className="h-5 w-5 text-gray-700 admin-dark:text-gray-300" />
                    {selectedCategory
                        ? `Mục con của "${selectedCategory.name?.[lang] || selectedCategory.name}"`
                        : "Chọn danh mục cha"}
                </CardTitle>

                {selectedCategory && (
                    <Button
                        size="sm"
                        className="bg-primary text-gray-900 admin-dark:text-white hover:bg-primary/90 transition-colors cursor-pointer"
                        onClick={onAdd}
                    >
                        <Plus className="h-4 w-4 mr-1" /> Thêm
                    </Button>
                )}
            </CardHeader>

            <CardContent
                data-lenis-prevent
                className="lenis-local space-y-2 max-h-[480px] overflow-y-auto pr-1"
            >
                {selectedCategory ? (
                    selectedCategory.children?.length > 0 ? (
                        selectedCategory.children.map((child) => (
                            <div
                                key={child.id}
                                className="flex items-center justify-between admin-dark:text-white text-gray-900 gap-4 p-3 rounded-lg border transition-colors
                           bg-gray-50 hover:bg-gray-100 border-gray-200
                           admin-dark:bg-gray-800 admin-dark:hover:bg-gray-700 admin-dark:border-gray-600"
                            >
                                <span className="font-medium truncate">
                                    {child.title?.[lang] || "Không có tên"}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(child)}
                                        className="cursor-pointer"
                                    >
                                        <Pencil className="h-4 w-4 mr-1" /> Sửa
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => onDelete(child)}
                                        className="cursor-pointer"
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyState text="Chưa có mục con nào" />
                    )
                ) : (
                    <EmptyState text="Chọn danh mục cha để xem mục con" />
                )}
            </CardContent>
        </Card>
    );
}

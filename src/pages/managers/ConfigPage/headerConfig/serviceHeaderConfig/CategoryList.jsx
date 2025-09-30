import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useLenisLocal from "@/hook/useLenisLocal";
import { cn } from "@/lib/utils";
import { Folder, Pencil, Plus } from "lucide-react";
import EmptyState from "./EmptyState";

export default function CategoryList({
    categories,
    selectedCategory,
    lang,
    onSelect,
    onAdd,
    onDelete,
    onEdit,
}) {
    useLenisLocal(".lenis-local");

    return (
        <Card className="bg-white admin-dark:bg-gray-900 shadow-md border border-gray-200 admin-dark:border-gray-700">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-gray-700 admin-dark:text-gray-300" />
                    <CardTitle className="text-gray-800 admin-dark:text-gray-100 font-semibold">
                        Danh mục cha
                    </CardTitle>
                </div>
                <Button
                    size="sm"
                    className="bg-primary text-black/80 admin-dark:text-white hover:bg-primary/90 transition-colors cursor-pointer"
                    onClick={onAdd}
                >
                    <Plus className="h-4 w-4 mr-1" /> Thêm
                </Button>
            </CardHeader>

            <CardContent
                data-lenis-prevent
                className="lenis-local space-y-2 max-h-[480px] overflow-y-auto pr-3"
            >
                {categories?.length > 0 ? (
                    categories.map((cat) => (
                        <div
                            key={cat.id}
                            className={cn(
                                "p-2 rounded-lg text-gray-900 admin-dark:text-white font-semibold border flex items-center justify-between cursor-pointer transition-colors",
                                selectedCategory?.id === cat.id
                                    ? "bg-primary border-primary"
                                    : "bg-gray-50 hover:bg-gray-100 border-gray-200 admin-dark:bg-gray-800 admin-dark:hover:bg-gray-700 admin-dark:border-gray-600"
                            )}
                            onClick={() => onSelect(cat)}
                        >
                            <span className="truncate text-sm sm:text-base">{cat.name?.[lang] || cat.name}</span>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(cat); // 👈 gọi hàm edit
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Pencil className="h-4 w-4" />
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
                                    <span className="text-xs sm:text-base">Xóa</span>
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState text="Chưa có danh mục cha" />
                )}
            </CardContent>
        </Card>
    );
}

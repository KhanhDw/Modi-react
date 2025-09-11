import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Folder, FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// DialogForm reusable
function DialogForm({ open, setOpen, title, value, setValue, onSubmit }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="input-name">Tên</Label>
                        <Input
                            id="input-name"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Nhập tên..."
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                onSubmit();
                                setValue("");
                                setOpen(false);
                            }}
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        >
                            Lưu
                        </Button>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Hủy
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Empty state reusable
function EmptyState({ text }) {
    return (
        <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{text}</p>
        </div>
    );
}

export default function HierarchicalMenu({ menu, setMenu, lang }) {
    const [menuData, setMenuData] = useState(menu || []);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [dialog, setDialog] = useState({
        open: false,
        type: "category", // "category" | "child"
        value: "",
    });

    // ----- CRUD helper -----
    const addCategory = (name) => {
        const newCat = { id: Date.now().toString(), name: { [lang]: name }, children: [] };
        const updated = [...menuData, newCat];
        setMenuData(updated);
        setMenu && setMenu(updated);
        setSelectedCategory(newCat);
    };

    const addChild = (name) => {
        if (!selectedCategory) return;
        const newChild = { id: `${selectedCategory.id}-${Date.now()}`, name };
        const updatedCat = {
            ...selectedCategory,
            children: [...(selectedCategory.children || []), newChild],
        };
        const updatedMenu = menuData.map((cat) =>
            cat.id === selectedCategory.id ? updatedCat : cat
        );
        setMenuData(updatedMenu);
        setMenu && setMenu(updatedMenu);
        setSelectedCategory(updatedCat);
    };

    const handleSubmitDialog = () => {
        if (!dialog.value.trim()) return;
        if (dialog.type === "category") {
            addCategory(dialog.value);
        } else if (dialog.type === "child") {
            addChild(dialog.value);
        }
    };

    useEffect(() => {
        if (!menuData || menuData.length === 0) return;
    }, [menuData, lang]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
            {/* Parent Categories */}
            <Card className="bg-card">
                <CardHeader className="pb-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Folder className="h-5 w-5" />
                        <CardTitle className="text-card-foreground">Danh mục cha</CardTitle>
                    </div>
                    <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() =>
                            setDialog({ open: true, type: "category", value: "" })
                        }
                    >
                        <Plus className="h-4 w-4 mr-1" /> Thêm
                    </Button>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[480px] overflow-y-auto">
                    {menuData && menuData.length > 0 ? (
                        menuData.map((cat) => (
                            <div
                                key={cat.id}
                                className={cn(
                                    "p-3 rounded-lg border cursor-pointer transition-colors",
                                    selectedCategory?.id === cat.id
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background hover:bg-muted border-border"
                                )}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat.name?.[lang]}
                            </div>
                        ))
                    ) : (
                        <EmptyState text="Chưa có danh mục cha" />
                    )}
                </CardContent>
            </Card>

            {/* Child Items */}
            <Card className="bg-card">
                <CardHeader className="pb-4 flex justify-between items-center">
                    <CardTitle className="text-card-foreground flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {selectedCategory
                            ? `Mục con của "${selectedCategory.name?.[lang]}"`
                            : "Chọn danh mục cha"}
                    </CardTitle>
                    {selectedCategory && (
                        <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() =>
                                setDialog({ open: true, type: "child", value: "" })
                            }
                        >
                            <Plus className="h-4 w-4 mr-1" /> Thêm
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-2 max-h-[480px] overflow-y-auto">
                    {selectedCategory ? (
                        selectedCategory.children && selectedCategory.children.length > 0 ? (
                            selectedCategory.children.map((child) => (
                                <div
                                    key={child.id}
                                    className="flex items-center gap-4 p-3 rounded-lg border bg-background hover:bg-muted border-border transition-colors"
                                >
                                    <span className="font-medium">{child.name}</span>
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

            {/* Dialog */}
            {dialog.open && (
                <DialogForm
                    open={dialog.open}
                    setOpen={(val) => setDialog((s) => ({ ...s, open: val }))}
                    title={dialog.type === "category" ? "Thêm danh mục cha" : "Thêm mục con"}
                    value={dialog.value}
                    setValue={(val) => setDialog((s) => ({ ...s, value: val }))}
                    onSubmit={handleSubmitDialog}
                />
            )}
        </div>
    );
}

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CategoryServiceSelector from "@/pages/managers/ConfigPage/headerConfig/serviceHeaderConfig/DialogForm/CategoryServiceSelector";
import ChildServiceSelector from "@/pages/managers/ConfigPage/headerConfig/serviceHeaderConfig/DialogForm/ChildServiceSelector";
import { useEffect, useState } from "react";


// Hàm remove dấu tiếng Việt
const removeVietnameseTones = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
};

// thêm hoặc sửa
export default function DialogForm({
    open,
    dialog,
    setOpen,
    title,
    isTitleGroupService,
    valueSlug,
    setValueSlug,
    valueEn,
    setValueEn,
    valueVi,
    setValueVi,
    listIdServices,
    setListIdServices,
    listServiceOfParent,
    disableItemSelectedbyName_groupServices,
    onSubmit,
}) {

    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;
    const [services, setServices] = useState([]);

    const isCategory = dialog?.type === "category";
    const isChild = dialog?.type === "child";
    const isEditing = !!dialog?.target;
    const isAdding = !dialog?.target;

    useEffect(() => {
        if (!open) return;

        if (isCategory && isEditing) {
            const newList = dialog.target?.title?.groupServices?.split(",") || [];
            setListIdServices(prev =>
                JSON.stringify(prev) === JSON.stringify(newList) ? prev : newList
            );
        } else if (isChild && isEditing) {
            const newSlug = dialog.target?.description?.en || "";
            if (valueSlug !== newSlug) {
                setValueSlug(newSlug);
            }
        } else if (isAdding) {
            // reset khi thêm mới
            setListIdServices([]);
            setValueSlug("");
            setValueEn("");
            setValueVi("");
        }
    }, [open, dialog?.target]);

    // fetch services một lần
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/services`);
                if (!res.ok) throw new Error("Không thể tải danh sách dịch vụ");
                const data = await res.json();
                if (!data.success) throw new Error(data.error || "Không thể tải dịch vụ");
                setServices(data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchServices();
    }, [API_BASE_URL]);

    const canSave = valueEn.trim() !== "" && valueVi.trim() !== "";

    const handleSave = () => {
        onSubmit();
        // reset sau khi lưu
        setValueSlug("");
        setValueEn("");
        setValueVi("");
        setListIdServices([]);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-75 sm:w-100 bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 admin-dark:text-gray-100">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    {/* Input Vietnamese */}
                    <div className="space-y-2">
                        <Label htmlFor="input-vi" className="text-gray-800 admin-dark:text-gray-200">
                            Tên (Tiếng Việt)
                        </Label>
                        <Input
                            id="input-vi"
                            value={valueVi}
                            onChange={(e) => setValueVi(e.target.value)}
                            placeholder="Nhập tên tiếng Việt..."
                            className="bg-white admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-900 admin-dark:text-gray-100 placeholder:text-sm placeholder:sm:text-base"
                        />
                    </div>

                    {/* Input English */}
                    <div className="space-y-2">
                        <Label htmlFor="input-en" className="text-gray-800 admin-dark:text-gray-200">
                            Tên (English)
                        </Label>
                        <Input
                            id="input-en"
                            value={valueEn}
                            onBeforeInput={(e) => {
                                const clean = removeVietnameseTones(e.data || "");
                                if (e.data && clean !== e.data) {
                                    e.preventDefault();
                                    e.target.setRangeText(
                                        clean,
                                        e.target.selectionStart,
                                        e.target.selectionEnd,
                                        "end"
                                    );
                                }
                            }}
                            onChange={(e) => setValueEn(e.target.value)}
                            placeholder="Enter English name..."
                            className="bg-white admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-900 admin-dark:text-gray-100 placeholder:text-sm placeholder:sm:text-base"
                        />
                    </div>

                    {/* Selector */}
                    <div className="space-y-2 w-full">
                        <Label className="text-gray-800 admin-dark:text-gray-200">
                            {isTitleGroupService}
                        </Label>
                        {isCategory ? (
                            <CategoryServiceSelector
                                services={services}
                                listIdServices={listIdServices}
                                setListIdServices={setListIdServices}
                                disableItemSelectedbyName_groupServices={disableItemSelectedbyName_groupServices}
                            />
                        ) : (
                            <ChildServiceSelector
                                listServiceOfParent={listServiceOfParent}
                                services={services}
                                valueSlug={valueSlug}
                                setValueSlug={setValueSlug}
                            />
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end pt-2">
                        <Button
                            disabled={!canSave}
                            onClick={handleSave}
                            className="bg-blue-500 admin-dark:hover:bg-blue-600 text-white hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
                        >
                            Lưu
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="border-gray-300 text-white
                                admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:hover:bg-gray-800 cursor-pointer"
                        >
                            Hủy
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

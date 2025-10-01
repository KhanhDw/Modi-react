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
    const [loadingServices, setLoadingServices] = useState(false);

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
            setLoadingServices(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/services`);
                if (!res.ok) throw new Error("Không thể tải danh sách dịch vụ");
                const data = await res.json();
                if (!data.success) throw new Error(data.error || "Không thể tải dịch vụ");
                setServices(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingServices(false);
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
            <DialogContent className="max-w-lg w-lg bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700 shadow-lg">
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
                            className="bg-white admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-900 admin-dark:text-gray-100"
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
                            className="bg-white admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-900 admin-dark:text-gray-100"
                        />
                    </div>

                    {/* Selector */}
                    <div className="space-y-2 w-full">
                        <Label className="text-gray-800 admin-dark:text-gray-200">
                            {isTitleGroupService}
                        </Label>
                        {isCategory ? (
                            loadingServices ? (
                                <div>Loading...</div>
                            ) : (
                                <CategoryServiceSelector
                                    services={services}
                                    listIdServices={listIdServices}
                                    setListIdServices={setListIdServices}
                                    disableItemSelectedbyName_groupServices={disableItemSelectedbyName_groupServices}
                                    dialog={dialog} // mặc dù hơi thừa dữ liệu nhưng không sao, sẽ fix lại

                                />
                            )
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
                            className="bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-50 cursor-pointer"
                        >
                            Lưu
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-100
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

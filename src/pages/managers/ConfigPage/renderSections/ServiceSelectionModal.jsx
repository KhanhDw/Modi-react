import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from "@/components/ui/dialog";
import useLenisLocal from "@/hook/useLenisLocal";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createServiceStage, deleteServiceStage, getAllServices, getAllServiceStages } from "./hook/use_services_stage.jsx";

export default function ServiceSelectionModal({ isOpen, onClose, currentStage, onSaved }) {
    useLenisLocal(".lenis-local");
    const [serviceFetch, setServiceFetch] = useState([]);
    const [serviceStageFetch, setServiceStageFetch] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    const fetchDataService = async () => {
        try {
            const serviceResult = await getAllServices();
            const serviceStageResult = await getAllServiceStages();
            setServiceFetch(serviceResult)
            setServiceStageFetch(serviceStageResult)

            // lọc ra danh sách service nào đã có trong stage hiện tại
            const preSelected = serviceResult.filter((s) =>
                serviceStageResult.some(
                    (st) => st.service_id === s.id && String(st.stage_id) === String(currentStage)
                )
            );

            // đánh dấu service nào đã nằm trong stage khác
            const withOtherStageFlag = serviceResult.map((s) => ({
                ...s,
                inOtherStage: serviceStageResult.some(
                    (st) => st.service_id === s.id && String(st.stage_id) !== String(currentStage)
                ),
            }));


            setServiceFetch(withOtherStageFlag);
            setSelectedServices(preSelected);
        } catch (err) {
            console.error("Lỗi load service stages:", err);
        }
    };



    useEffect(() => {
        fetchDataService();
    }, [currentStage]);


    const handleSelectService = (serviceId) => {
        // tìm service theo id trong serviceFetch
        const service = serviceFetch.find(s => s.id === serviceId);
        if (!service) return;

        setSelectedServices(prev => {
            // nếu service đã có trong danh sách => bỏ ra
            const exists = prev.some(s => s.id === serviceId);
            if (exists) {
                return prev.filter(s => s.id !== serviceId);
            } else {
                return [...prev, service];
            }
        });
    };

    const [isSaving, setIsSaving] = useState(false);
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const existingStageServices = serviceStageFetch.filter(
                (st) => String(st.stage_id) === String(currentStage)
            );

            const existingIds = existingStageServices.map((st) => st.service_id);
            const selectedIds = selectedServices.map((s) => s.id);

            // thêm mới
            const toAdd = selectedIds.filter((id) => !existingIds.includes(id));
            for (const service_id of toAdd) {
                await createServiceStage({ service_id, stage_id: currentStage });
            }

            // xóa bỏ
            const toRemove = existingStageServices.filter(
                (st) => !selectedIds.includes(st.service_id)
            );
            for (const item of toRemove) {
                await deleteServiceStage(item.id);
            }


            await fetchDataService(); // ✅ load lại state sau khi lưu
            onSaved();
            onClose();
        } catch (err) {
            console.error("Lỗi khi lưu dịch vụ:", err);
        } finally {
            setIsSaving(false);
        }
    };



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
            <DialogContent className="admin-dark:bg-gray-900/95 bg-gray-100 border-none admin-dark:backdrop-blur-lg admin-dark:border-gray-700 w-full max-w-2xl">
                <DialogHeader className="pr-6">
                    <DialogTitle className="text-xl text-gray-900 admin-dark:text-white">Chọn dịch vụ cho Giai đoạn {currentStage}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <div
                        data-lenis-prevent
                        className="lenis-local grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2"
                    >
                        {serviceFetch
                            .filter((service) => service.status === "Active")
                            .map((service) => {
                                // kiểm tra service có nằm trong selectedServices không
                                const isSelected = selectedServices.some((s) => s.id === service.id);
                                const inOtherStage = service.inOtherStage; // giả định backend trả về
                                const isDisabled = inOtherStage && !isSelected;

                                return (
                                    <div
                                        key={service.id}
                                        onClick={() => !isDisabled && handleSelectService(service.id)}
                                        className={cn(
                                            "p-3 border rounded-lg text-center relative transition-colors cursor-pointer",
                                            isSelected
                                                ? "bg-primary/5 border-primary/40 ring-2 ring-primary/20 text-primary font-semibold"
                                                : isDisabled
                                                    ? "bg-gray-100 text-gray-400 border-dashed cursor-not-allowed admin-dark:bg-muted/50 admin-dark:text-muted-foreground/50"
                                                    : "bg-background hover:bg-gray-50 hover:border-primary/30 admin-dark:bg-gray-800 admin-dark:hover:bg-gray-700/50"
                                        )}
                                    >
                                        <button
                                            type="button"
                                            disabled={isDisabled}
                                            className="text-sm font-medium"
                                        >
                                            <p>{service.translation.ten_dich_vu}</p>
                                        </button>
                                        {inOtherStage && !isSelected && (
                                            <div className="text-xs text-muted-foreground/60 mt-1">
                                                Đã được chọn ở stage khác
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>

                <DialogFooter className="pt-4 border-t admin-dark:border-gray-700">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                Đã chọn: {selectedServices.length} dịch vụ
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <DialogClose >
                                <span className="rounded-lg px-3 py-2 text-sm sm:text-base font-semibold bg-gray-200 hover:bg-gray-300 admin-dark:bg-gray-800 admin-dark:hover:bg-gray-700 cursor-pointer">Đóng</span>
                            </DialogClose>
                            <Button onClick={handleSave} disabled={isSaving} className="cursor-pointer bg-blue-500 hover:bg-blue-600">
                                <span className="text-sm sm:text-base font-semibold text-white">{isSaving ? "Đang lưu..." : "Lưu"}</span>
                            </Button>

                        </div>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { createBridge, deleteBridge, getAllBridge } from "./hook/use_bridge_services_stage_and_list_mini_service.jsx";

export default function ServiceSelectionForGroupServiceModal({
    isOpen,
    onClose,
    currentStage = 1,
    serviceGroup,
    lineActive,
    serviceMiniSelected,
    serviceGroupCurrentStage, // {1:[],2:[],3:[]}
    stageMaster, // Thêm stageMaster để lấy title_vi
}) {
    const [bridges, setBridges] = useState([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);
    const [initialSelectedIds, setInitialSelectedIds] = useState([]);

    // Lấy toàn bộ bridge từ BE
    const fetchBridgeData = async () => {
        try {
            const bridgeResult = await getAllBridge();
            setBridges(bridgeResult);

            if (lineActive) {
                const selected = bridgeResult
                    .filter(
                        (b) => Number(b.list_mini_service_id) === Number(lineActive.id) && Number(b.stage_id) === Number(currentStage)
                    )
                    .map((b) => b.service_id);

                setSelectedServiceIds(selected); // State để theo dõi lựa chọn hiện tại
                setInitialSelectedIds(selected); // State để so sánh sự thay đổi
            } else {
                setSelectedServiceIds([]);
                setInitialSelectedIds([]);
            }
        } catch (err) {
            console.log("Error fetchBridgeData:", err);
        }
    };



    useEffect(() => {
        if (isOpen) {
            fetchBridgeData();
        }
    }, [isOpen, lineActive, currentStage]); // 👈 thêm dependency để khi đổi stage cũng sync lại


    // ✅ Lấy dịch vụ của stage hiện tại
    const servicesInStage = serviceGroupCurrentStage?.[currentStage] || [];

    // Toggle chọn/bỏ chọn service
    const toggleSelectService = (serviceId) => {
        setSelectedServiceIds((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    // Save chọn/bỏ chọn
    const handleSaveSelectForMiniService = async () => {
        if (!lineActive) return;

        try {
            // So sánh `selectedServiceIds` (hiện tại) với `initialSelectedIds` (ban đầu)

            // Service mới chọn → cần tạo bridge
            const toCreate = selectedServiceIds.filter(
                (id) => !initialSelectedIds.includes(id)
            );

            // Service bỏ chọn → cần xóa bridge
            const toDelete = initialSelectedIds.filter(
                (id) => !selectedServiceIds.includes(id)
            );

            // Thực hiện các promise song song
            await Promise.all([
                ...toCreate.map(serviceId =>
                    createBridge({
                        service_id: serviceId,
                        list_mini_service_id: lineActive.id,
                        stage_id: currentStage,
                    })
                ),
                ...toDelete.map(serviceId =>
                    deleteBridge(serviceId, lineActive.id, currentStage)
                ),
            ]);

            onClose();
        } catch (error) {
            console.log("Error save bridge:", error);
        }
    };

    // Kiểm tra xem có thay đổi chưa lưu không
    const hasChanges = JSON.stringify([...selectedServiceIds].sort()) !== JSON.stringify([...initialSelectedIds].sort());

    const currentStageTitle = stageMaster.find(s => Number(s.id) === Number(currentStage))?.title_vi || `Giai đoạn ${currentStage}`;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
            <DialogContent className="admin-dark:bg-gray-900/95 bg-gray-100 admin-dark:backdrop-blur-lg admin-dark:border-gray-700 w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col">
                <DialogHeader className="space-y-3 pr-6">
                    <DialogTitle className="text-base md:text-lg text-gray-900 admin-dark:text-white">
                        Chọn hạng mục cho gói dịch vụ - {currentStageTitle}
                    </DialogTitle>

                    {lineActive && (
                        <div className="p-4 bg-gray-200 admin-dark:bg-primary/10 rounded-lg border border-primary/20 admin-dark:border-primary/30">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground admin-dark:text-gray-400">
                                        Đang chọn dịch vụ cho ServiceGroup:
                                    </p>
                                    <p className="font-semibold text admin-dark:text-primary">
                                        {lineActive.title_vi || "Line demo"}
                                    </p>
                                    <p className="text-sm text-muted-foreground admin-dark:text-gray-400">
                                        {lineActive.title_en || "Line EN demo"}
                                    </p>
                                </div>
                                <div className="flex gap-2 self-end sm:self-center">
                                    <Badge variant="outline" className="bg-gray-200 border border-gray-400 text-muted-foreground admin-dark:bg-gray-700 admin-dark:border-slate-600">
                                        <span className="admin-dark:text-gray-300">ID: {lineActive.id || "sg-demo"}</span>
                                    </Badge>
                                    <Badge variant="secondary">{currentStageTitle}</Badge>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogHeader>

                <div className="py-4 flex-1 overflow-y-auto pr-2">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary/10 admin-dark:text-primary border-primary/30">
                                Đã chọn: {selectedServiceIds.length} dịch vụ
                            </Badge>
                        </div>
                    </div>

                    {/* Danh sách dịch vụ stage hiện tại */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {servicesInStage.length === 0 ? (
                            <p className="text-center text-muted-foreground py-6">
                                Chưa có dịch vụ nào trong giai đoạn "{currentStageTitle}"
                            </p>
                        ) : (
                            servicesInStage.map((service) => {
                                const isSelected = selectedServiceIds.includes(service.id);


                                return (
                                    <div
                                        key={service.id}
                                        onClick={() => toggleSelectService(service.id)}
                                        className={cn(
                                            "p-4 border rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-4",
                                            isSelected
                                                ? "admin-dark:bg-primary/5 bg-gray-200 border-primary/40 ring-2 ring-primary/20"
                                                : "bg-gray-200 hover:bg-gray-300 border-gray-300 admin-dark:border-gray-700 admin-dark:bg-gray-800 admin-dark:hover:bg-gray-700/50 hover:border-primary/30"
                                        )}
                                    >
                                        {isSelected ? (
                                            <CheckCircle2 className="w-6 h-6 text-blue-700 admin-dark:text-primary flex-shrink-0" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-gray-400 admin-dark:text-muted-foreground flex-shrink-0" />
                                        )}
                                        <div className="space-y-1 flex-1">
                                            <div className="font-medium">{service.translation?.ten_dich_vu}</div>
                                            <div className="text-xs text-gray-500 admin-dark:text-gray-400">
                                                <span className="text-xs text-gray-500 admin-dark:text-gray-400">ID: {service.id}</span> | <span className="font-mono">{service.translation?.slug}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <DialogFooter className="pt-4 border-t admin-dark:border-gray-700">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-muted-foreground">
                                Đang chọn cho:
                                <span className="font-semibold text-blue-600 admin-dark:text-foreground ml-1">
                                    "{lineActive?.title_vi || "Line demo"}"
                                </span>
                            </div>
                            {hasChanges && (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 admin-dark:bg-yellow-900/40 admin-dark:text-yellow-300 admin-dark:border-yellow-700/60">
                                    Chưa lưu thay đổi
                                </Badge>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose}>
                                <span className="text-sm md:text-base font-semibold cursor-pointer">Hủy</span>
                            </Button>
                            <Button
                                className="bg-primary hover:bg-primary/90"
                                onClick={handleSaveSelectForMiniService}
                            >
                                <span className="text-sm md:text-base font-semibold cursor-pointer">Xác nhận lưu ({selectedServiceIds.length})</span>
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

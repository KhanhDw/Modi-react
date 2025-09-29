import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllBridge, createBridge, deleteBridge } from "./hook/use_bridge_services_stage_and_list_mini_service.jsx";

export default function ServiceSelectionForGroupServiceModal({
    isOpen,
    onClose,
    currentStage = 1,
    serviceGroup,
    lineActive,
    serviceMiniSelected,
    serviceGroupCurrentStage, // {1:[],2:[],3:[]}
}) {
    const [bridges, setBridges] = useState([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);

    // Lấy toàn bộ bridge từ BE
    const fetchBridgeData = async () => {
        try {
            const bridgeResult = await getAllBridge();
            setBridges(bridgeResult);

            // lọc ra những service đã gắn với lineActive hiện tại
            if (lineActive) {
                const selected = bridgeResult
                    .filter(
                        (b) =>
                            b.list_mini_service_id === lineActive.id &&
                            b.stage === String(currentStage)
                    )
                    .map((b) => b.services_stage_id);
                setSelectedServiceIds(selected);
            }
        } catch (err) {
            console.log("Error fetchBridgeData:", err);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchBridgeData();
        }
    }, [isOpen]);

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
            const currentBridges = bridges.filter(
                (b) =>
                    b.list_mini_service_id === lineActive.id &&
                    b.stage === String(currentStage)
            );
            const currentServiceIds = currentBridges.map((b) => b.services_stage_id);

            // Service mới chọn → cần tạo bridge
            const toCreate = selectedServiceIds.filter(
                (id) => !currentServiceIds.includes(id)
            );

            // Service bỏ chọn → cần xóa bridge
            const toDelete = currentServiceIds.filter(
                (id) => !selectedServiceIds.includes(id)
            );

            // Thực hiện tạo
            for (const serviceStageId of toCreate) {
                await createBridge({
                    list_mini_service_id: lineActive.id,
                    services_stage_id: serviceStageId, // 👈 đây phải là services_stage.id
                });
            }


            // Thực hiện xóa
            for (const serviceStageId of toDelete) {
                const bridgeToDelete = currentBridges.find(
                    (b) => b.services_stage_id === serviceStageId
                );
                if (bridgeToDelete) {
                    await deleteBridge(bridgeToDelete.id);
                }
            }


            await fetchBridgeData(); // reload lại state
            onClose(); // đóng modal
        } catch (error) {
            console.log("Error save bridge:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
            <DialogContent className="admin-dark:bg-gray-800 admin-dark:text-white w-4xl max-w-4xl">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl">
                        Chọn dịch vụ cho ServiceGroup - Giai đoạn {currentStage}
                    </DialogTitle>

                    {lineActive && (
                        <div className="p-4 bg-green-50 admin-dark:bg-green-900/20 rounded-lg border border-green-200 admin-dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-600 admin-dark:text-gray-400">
                                        Đang chọn dịch vụ cho ServiceGroup:
                                    </p>
                                    <p className="font-semibold text-green-700 admin-dark:text-green-300">
                                        {lineActive.title_vi || "Line demo"}
                                    </p>
                                    <p className="text-sm text-gray-500 admin-dark:text-gray-400">
                                        {lineActive.title_en || "Line EN demo"}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="bg-white admin-dark:bg-gray-800">
                                        ID: {lineActive.id || "sg-demo"}
                                    </Badge>
                                    <Badge variant="secondary">Giai đoạn {currentStage}</Badge>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogHeader>

                <div className="py-4">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary">Giai đoạn {currentStage}</Badge>
                            <Badge variant="outline" className="bg-green-100 text-green-700">
                                Đã chọn: {selectedServiceIds.length} dịch vụ
                            </Badge>
                        </div>
                        {lineActive && (
                            <Badge variant="outline" className="max-w-xs truncate">
                                {lineActive.title_vi || "Line demo"}
                            </Badge>
                        )}
                    </div>

                    {/* Danh sách dịch vụ stage hiện tại */}
                    <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto scrollbar-hide">
                        {servicesInStage.length === 0 ? (
                            <p className="text-center text-muted-foreground py-6">
                                Chưa có dịch vụ nào trong giai đoạn {currentStage}
                            </p>
                        ) : (
                            servicesInStage.map((service) => {
                                const isSelected = selectedServiceIds.includes(service.services_stage_id);

                                return (
                                    <div
                                        key={service.services_stage_id}
                                        onClick={() => toggleSelectService(service.services_stage_id)} // 👈 dùng services_stage_id
                                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected
                                            ? "bg-green-500 text-white border-green-500 ring-2 ring-green-200 admin-dark:bg-green-600 admin-dark:border-green-600"
                                            : "bg-card hover:bg-muted admin-dark:bg-card admin-dark:hover:bg-muted border-border hover:border-green-300"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1 flex-1">
                                                <div className="font-medium">{service.translation?.ten_dich_vu}</div>
                                                <div className="text-xs opacity-70">Slug: {service.translation?.slug}</div>
                                                <div className="text-xs opacity-70">
                                                    Service ID: {service.id} | StageRow ID: {service.services_stage_id}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className="flex-shrink-0 ml-3">
                                                    <div className="bg-white text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                                                        Đã chọn
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-muted-foreground">
                                Đã chọn: {selectedServiceIds.length} dịch vụ cho
                                <span className="font-medium ml-1">
                                    "{lineActive?.title_vi || "Line demo"}"
                                </span>
                            </div>
                            {bridges.length > 0 && (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                                    Có thay đổi chưa lưu
                                </Badge>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose}>
                                Hủy
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={handleSaveSelectForMiniService}
                            >
                                Xác nhận lưu ({selectedServiceIds.length})
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

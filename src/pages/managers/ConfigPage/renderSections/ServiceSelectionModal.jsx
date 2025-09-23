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
import { cn } from "@/lib/utils";
import useLenisLocal from "@/hook/useLenisLocal";

export default function ServiceSelectionModal({
    isOpen,
    onClose,
    onServiceToggle,
    currentStage,
    serviceOfStage1,
    serviceOfStage2,
    serviceOfStage3,
}) {
    useLenisLocal(".lenis-local");
    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;
    const [services, setServices] = useState([]);
    const [tempSelectedServices, setTempSelectedServices] = useState([]);

    // Fetch all services
    const FetchDataServicesALL = async (lang = "vi") => {
        try {
            const lang_api = lang === "vi" ? "" : "/en";
            const res = await fetch(`${API_BASE_URL}${lang_api}/api/services`);
            const data = await res.json();
            if (data.success) {
                setServices(data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        FetchDataServicesALL();
    }, []);

    // Lấy service của stage hiện tại (props từ cha)
    const getCurrentStageServices = () => {
        if (currentStage === 1) return serviceOfStage1;
        if (currentStage === 2) return serviceOfStage2;
        if (currentStage === 3) return serviceOfStage3;
        return [];
    };

    // Khi mở modal → copy service từ cha vào state tạm
    useEffect(() => {
        if (isOpen) {
            setTempSelectedServices(getCurrentStageServices());
        }
    }, [isOpen, currentStage]);

    // Check nếu service đã được chọn trong state tạm
    const isServiceSelected = (service) => {
        return tempSelectedServices.some(
            (s) => s.translation.slug === service.translation.slug
        );
    };

    // Check nếu service đang nằm ở stage khác
    const isServiceInOtherStage = (service) => {
        const allStages = [
            { stage: 1, services: serviceOfStage1 },
            { stage: 2, services: serviceOfStage2 },
            { stage: 3, services: serviceOfStage3 },
        ];

        return allStages.some(
            (stageData) =>
                stageData.stage !== currentStage &&
                stageData.services.some(
                    (s) => s.translation.slug === service.translation.slug
                )
        );
    };

    // Toggle chọn/bỏ chọn trong state tạm
    const handleServiceClick = (service) => {
        if (isServiceInOtherStage(service) && !isServiceSelected(service)) {
            return; // Không cho chọn nếu service đã ở stage khác
        }

        if (isServiceSelected(service)) {
            // Bỏ chọn
            setTempSelectedServices((prev) =>
                prev.filter((s) => s.translation.slug !== service.translation.slug)
            );
        } else {
            // Thêm chọn
            setTempSelectedServices((prev) => [...prev, service]);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
            <DialogContent className="admin-dark:bg-gray-800 admin-dark:text-white w-4xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Chọn dịch vụ cho Giai đoạn {currentStage}</DialogTitle>
                        <button
                            type="button"
                            className="mr-10 border px-2 py-1 rounded-lg hover:bg-muted admin-dark:hover:bg-muted">
                            <span className="text-sm text-foreground">Cập nhật dữ liệu dịch vụ</span>
                        </button>
                    </div>
                </DialogHeader>
                <div className="py-4">
                    <div
                        data-lenis-prevent
                        className="lenis-local grid grid-cols-1 gap-3 max-h-96 overflow-y-auto scrollbar-hide"
                    >
                        {/* Hiển thị tất cả services active */}
                        {services
                            .filter((service) => service.status === "Active")
                            .map((service) => {
                                const isSelected = isServiceSelected(service);
                                const inOtherStage = isServiceInOtherStage(service);
                                const isDisabled = inOtherStage && !isSelected;

                                return (
                                    <div
                                        key={service.id}
                                        className={cn(
                                            "p-3 border rounded-lg cursor-pointer transition-colors text-center relative",
                                            isSelected
                                                ? "bg-primary text-primary-foreground border-primary admin-dark:bg-primary admin-dark:text-primary-foreground admin-dark:border-primary"
                                                : isDisabled
                                                    ? "bg-muted/50 text-muted-foreground border-muted cursor-not-allowed admin-dark:bg-muted/30 admin-dark:text-muted-foreground"
                                                    : "bg-card hover:bg-muted admin-dark:bg-card admin-dark:hover:bg-muted"
                                        )}
                                        onClick={() => handleServiceClick(service)}
                                    >
                                        <div className="text-sm font-medium">
                                            {service.translation.ten_dich_vu}
                                        </div>
                                        {inOtherStage && !isSelected && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Đã được chọn ở stage khác
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        <div>
                            {tempSelectedServices.length > 0 && (
                                <div className="text-sm text-muted-foreground mt-4">
                                    Đã chọn: {tempSelectedServices.length} dịch vụ
                                </div>
                            )}
                            {services.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">
                                    Đang tải dịch vụ...
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={onClose} variant="outline">
                                Đóng
                            </Button>
                            <Button
                                onClick={() => {
                                    onServiceToggle(tempSelectedServices, currentStage);
                                    onClose();
                                }}
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

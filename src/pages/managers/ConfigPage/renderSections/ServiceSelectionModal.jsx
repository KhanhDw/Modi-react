import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useLenisLocal from '@/hook/useLenisLocal'

export default function ServiceSelectionModal({
    isOpen,
    onClose,
    servicesForStage,
    selectedServices,
    onServiceToggle,
    currentStage,
    serviceOfStage1,
    serviceOfStage2,
    serviceOfStage3,
}) {
    useLenisLocal(".lenis-local")
    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;
    const [services, setServices] = useState([]);
    const [serviceOfStageCurrent, setServiceOfStageCurrent] = useState([]);

    const FetchDataServicesALL = async (lang = "vi") => {
        try {
            const lang_api = lang === "vi" ? "" : "/en";
            const res = await fetch(`${API_BASE_URL}${lang_api}/api/services`);
            const data = await res.json();
            if (data.success) {
                setServices(data.data);
                console.log("Services loaded:", data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        FetchDataServicesALL();
    }, []);

    useEffect(() => {
        if (currentStage === 1) {
            const stage1Services = services.filter(service =>
                serviceOfStage1.some(s => s.translation.slug === service.translation.slug)
            );
            setServiceOfStageCurrent(stage1Services);
        }
        if (currentStage === 2) {
            const stage2Services = services.filter(service =>
                serviceOfStage2.some(s => s.translation.slug === service.translation.slug)
            );
            setServiceOfStageCurrent(stage2Services);
        }
        if (currentStage === 3) {
            const stage3Services = services.filter(service =>
                serviceOfStage3.some(s => s.translation.slug === service.translation.slug)
            );
            setServiceOfStageCurrent(stage3Services);
        }
    }, [currentStage, services, serviceOfStage1, serviceOfStage2, serviceOfStage3]);

    // Get current stage services for selection checking
    const getCurrentStageServices = () => {
        if (currentStage === 1) return serviceOfStage1;
        if (currentStage === 2) return serviceOfStage2;
        if (currentStage === 3) return serviceOfStage3;
        return [];
    };

    // Check if service is selected for current stage
    const isServiceSelected = (service) => {
        const currentStageServices = getCurrentStageServices();
        return currentStageServices.some(s => s.translation.slug === service.translation.slug);
    };

    // Check if service is selected in any other stage
    const isServiceInOtherStage = (service) => {
        const allStages = [
            { stage: 1, services: serviceOfStage1 },
            { stage: 2, services: serviceOfStage2 },
            { stage: 3, services: serviceOfStage3 }
        ];

        return allStages.some(stageData =>
            stageData.stage !== currentStage &&
            stageData.services.some(s => s.translation.slug === service.translation.slug)
        );
    };

    // Check if service can be selected (not in other stages)
    const canSelectService = (service) => {
        return !isServiceInOtherStage(service) || isServiceSelected(service);
    };

    // Handle service selection toggle
    const handleServiceClick = (service) => {
        // Don't allow selection if service is in another stage
        if (isServiceInOtherStage(service) && !isServiceSelected(service)) {
            return;
        }

        const currentStageServices = getCurrentStageServices();
        const isSelected = currentStageServices.some(s => s.translation.slug === service.translation.slug);

        let updatedServices;
        if (isSelected) {
            // Remove service
            updatedServices = currentStageServices.filter(s => s.translation.slug !== service.translation.slug);
        } else {
            // Add service
            updatedServices = [...currentStageServices, service];
        }

        // Send updated services to parent
        onServiceToggle(updatedServices, currentStage);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
            <DialogContent className="admin-dark:bg-gray-800 admin-dark:text-white w-4xl">
                <DialogHeader>
                    <DialogTitle>Chọn dịch vụ cho Giai đoạn {currentStage}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <div data-lenis-prevent className="lenis-local grid grid-cols-1 gap-3 max-h-96 overflow-y-auto scrollbar-hide">
                        {/* Hiển thị tất cả services active */}
                        {services.filter((service) => service.status === "Active").map((service) => {
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
                                                : "bg-card hover:bg-muted admin-dark:bg-card admin-dark:hover:bg-muted",
                                    )}
                                    onClick={() => handleServiceClick(service)}
                                >
                                    <div className="text-sm font-medium">{service.translation.ten_dich_vu}</div>
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
                            {getCurrentStageServices().length > 0 && (
                                <div className="text-sm text-muted-foreground mt-4">
                                    Đã chọn: {getCurrentStageServices().length} dịch vụ
                                </div>
                            )}
                            {services.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">
                                    Đang tải dịch vụ...
                                </p>
                            )}
                        </div>
                        <Button onClick={onClose}>Đóng</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
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
import { cn } from "@/lib/utils";
import useLenisLocal from "@/hook/useLenisLocal";




export default function ServiceSelectionForGroupServiceModal({
    isOpen,
    onClose,
    currentStage,
    serviceOfStage1,
    serviceOfStage2,
    serviceOfStage3,
    lineActive,
    serviceSelectedByServiceGroup
}) {
    // console.log("serviceSelectedByServiceGroup:", serviceSelectedByServiceGroup);
    // console.log("lineActive:", lineActive);

    useLenisLocal(".lenis-local");
    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

    // State riêng cho modal này
    const [selectedServicesForLine, setSelectedServicesForLine] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // Get services của stage hiện tại
    const getCurrentStageServices = () => {
        if (currentStage === 1) return serviceOfStage1;
        if (currentStage === 2) return serviceOfStage2;
        if (currentStage === 3) return serviceOfStage3;
        return [];
    };

    const availableServicesForStage = getCurrentStageServices();

    // Load selected services từ serviceSelectedByServiceGroup khi đổi line
    useEffect(() => {
        if (!isOpen || !lineActive || !serviceSelectedByServiceGroup || !availableServicesForStage.length) {
            setSelectedServicesForLine([]);
            return;
        }

        // Tìm services đã được chọn cho line này
        const lineKey = lineActive.id.replace("sg-", ""); // sg-Line1 -> Line1
        const currentStageKey = `stage${currentStage}`;

        console.log("Loading services for line:", {
            lineKey,
            currentStageKey,
            lineActive,
            availableServicesForStage: availableServicesForStage.length,
            serviceSelectedByServiceGroup
        });

        // Tìm các service đã được chọn cho line này từ availableServicesForStage
        const selectedServices = availableServicesForStage.filter(service => {
            // Kiểm tra trong serviceSelectedByServiceGroup
            const serviceSlug = service.translation.slug;
            const serviceData = serviceSelectedByServiceGroup?.en?.[serviceSlug];

            if (serviceData && serviceData[currentStageKey] && serviceData[currentStageKey][lineKey] === true) {
                return true;
            }
            return false;
        });

        console.log("Selected services for line:", {
            lineKey,
            currentStageKey,
            selectedServices: selectedServices.map(s => ({
                name: s.translation.ten_dich_vu,
                slug: s.translation.slug
            })),
            totalAvailableForStage: availableServicesForStage.length,
            totalSelected: selectedServices.length
        });

        setSelectedServicesForLine(selectedServices);

    }, [isOpen, lineActive, serviceSelectedByServiceGroup, currentStage, availableServicesForStage]);

    // Check service có được chọn không (từ state hoặc từ dữ liệu gốc)
    const isServiceSelectedInModal = (service) => {
        return selectedServicesForLine.some(
            (s) => s.translation.slug === service.translation.slug
        );
    };

    // Handle click service (chỉ cập nhật UI, chưa lưu vào DB)
    const handleServiceClickInModal = (service) => {
        const isSelected = isServiceSelectedInModal(service);
        const lineKey = lineActive?.id.replace("sg-", ""); // sg-Line1 -> Line1
        const currentStageKey = `stage${currentStage}`;

        let updatedServices;
        if (isSelected) {
            // Bỏ chọn service
            updatedServices = selectedServicesForLine.filter(
                (s) => s.translation.slug !== service.translation.slug
            );
            console.log("Bỏ chọn service (chưa lưu):", {
                serviceName: service.translation.ten_dich_vu,
                serviceSlug: service.translation.slug,
                lineKey: lineKey,
                currentStage: currentStageKey,
                action: "REMOVE",
                status: "PENDING_SAVE"
            });
        } else {
            // Chọn service
            updatedServices = [...selectedServicesForLine, service];
            console.log("Chọn service (chưa lưu):", {
                serviceName: service.translation.ten_dich_vu,
                serviceSlug: service.translation.slug,
                lineKey: lineKey,
                currentStage: currentStageKey,
                action: "ADD",
                status: "PENDING_SAVE"
            });
        }

        setSelectedServicesForLine(updatedServices);

        // Log trạng thái hiện tại (chưa lưu)
        console.log("Trạng thái chọn hiện tại (chưa lưu vào DB):", {
            lineKey: lineKey,
            lineName: lineActive?.nameVi,
            currentStage: currentStageKey,
            selectedServices: updatedServices.map(s => ({
                name: s.translation.ten_dich_vu,
                slug: s.translation.slug
            })),
            totalSelected: updatedServices.length,
            needsConfirm: true
        });
    };

    // Tính toán các thay đổi cần lưu với kiểu dữ liệu chính xác
    const getChangesToSave = () => {
        if (!lineActive || !serviceSelectedByServiceGroup) return [];

        const lineKey = lineActive.id.replace("sg-", "");
        const currentStageKey = `stage${currentStage}`;
        const changes = [];

        // Lấy trạng thái ban đầu từ serviceSelectedByServiceGroup
        const originalSelectedServices = availableServicesForStage.filter(service => {
            const serviceSlug = service.translation.slug;
            const serviceData = serviceSelectedByServiceGroup?.en?.[serviceSlug];
            return serviceData && serviceData[currentStageKey] && serviceData[currentStageKey][lineKey] === true;
        });

        // So sánh với trạng thái hiện tại
        const currentSlugs = selectedServicesForLine.map(s => s.translation.slug);
        const originalSlugs = originalSelectedServices.map(s => s.translation.slug);

        // Services được thêm mới
        const addedSlugs = currentSlugs.filter(slug => !originalSlugs.includes(slug));
        // Services bị xóa
        const removedSlugs = originalSlugs.filter(slug => !currentSlugs.includes(slug));

        // Tạo danh sách changes với kiểu dữ liệu chính xác
        addedSlugs.forEach(slug => {
            changes.push({
                slug: slug,
                stageKey: currentStageKey,
                lineKey: lineKey,
                value: true, // Boolean thật, không phải string
                action: "ADD" // Sẽ bị loại bỏ khi gửi API
            });
        });

        removedSlugs.forEach(slug => {
            changes.push({
                slug: slug,
                stageKey: currentStageKey,
                lineKey: lineKey,
                value: false, // Boolean thật, không phải string
                action: "REMOVE" // Sẽ bị loại bỏ khi gửi API
            });
        });

        return changes;
    };

    // Validation cho các required fields
    const validateRequiredData = () => {
        const errors = [];

        if (!lineActive) {
            errors.push("Không có line được chọn");
        }

        if (!lineActive?.idUseUpdate || isNaN(Number(lineActive.idUseUpdate))) {
            errors.push("ID section không hợp lệ");
        }

        if (!currentStage || ![1, 2, 3].includes(currentStage)) {
            errors.push("Stage không hợp lệ");
        }

        if (!API_BASE_URL) {
            errors.push("API URL không được cấu hình");
        }

        return errors;
    };

    // Handle save/confirm selection với các cải thiện
    const handleConfirmSelection = async () => {
        const lineKey = lineActive?.id.replace("sg-", "");
        const currentStageKey = `stage${currentStage}`;
        const sectionId = lineActive?.idUseUpdate;
        const changesToSave = getChangesToSave();

        // Validate dữ liệu trước khi gửi
        const validationErrors = validateRequiredData();
        if (validationErrors.length > 0) {
            console.error("Validation errors:", validationErrors);
            alert(`Lỗi dữ liệu: ${validationErrors.join(", ")}`);
            return;
        }

        if (changesToSave.length === 0) {
            console.log("Không có thay đổi nào để lưu");
            onClose();
            return;
        }

        console.log("Bắt đầu lưu các thay đổi:", {
            lineActive: lineActive,
            lineKey: lineKey,
            currentStage: currentStageKey,
            sectionId: sectionId,
            totalChanges: changesToSave.length,
            changes: changesToSave
        });

        setIsSaving(true);

        try {
            // Lưu từng thay đổi với payload đã được clean
            const savePromises = changesToSave.map(async (change, index) => {
                // Loại bỏ 'action' và đảm bảo kiểu dữ liệu đúng
                const { action, ...cleanPayload } = change;

                // Đảm bảo value là boolean thật
                const finalPayload = {
                    ...cleanPayload,
                    value: Boolean(cleanPayload.value) // Chuyển về boolean thật
                };

                console.log(`Đang lưu thay đổi ${index + 1}/${changesToSave.length}:`, {
                    endpoint: `${API_BASE_URL}/api/section-items-chi-tiet-dich-vu/${sectionId}/description/line`,
                    originalChange: change,
                    cleanedPayload: finalPayload
                });

                const response = await fetch(
                    `${API_BASE_URL}/api/section-items-chi-tiet-dich-vu/${sectionId}/description/line`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(finalPayload), // Gửi payload đã clean
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    const errorMsg = result.error || result.message || `HTTP ${response.status}`;
                    throw new Error(`API Error: ${errorMsg}`);
                }

                console.log(`Lưu thành công ${index + 1}/${changesToSave.length}:`, {
                    payload: finalPayload,
                    result: result
                });

                return { change: finalPayload, result };
            });

            // Đợi tất cả API calls hoàn thành
            const results = await Promise.all(savePromises);

            console.log("Lưu tất cả thay đổi thành công:", {
                lineKey: lineKey,
                lineName: lineActive?.nameVi,
                currentStage: currentStageKey,
                totalSaved: results.length,
                finalSelectedServices: selectedServicesForLine.map(s => ({
                    name: s.translation.ten_dich_vu,
                    slug: s.translation.slug
                })),
                results: results
            });

            // Có thể thêm toast notification thành công
            // toast.success(`Đã lưu thành công ${results.length} thay đổi cho "${lineActive?.nameVi}"`);

        } catch (error) {
            console.error("Lỗi khi lưu thay đổi:", {
                error: error.message,
                lineKey: lineKey,
                sectionId: sectionId,
                changesToSave: changesToSave
            });

            // Hiển thị thông báo lỗi chi tiết hơn
            alert(`Lỗi khi lưu thay đổi: ${error.message}. Vui lòng kiểm tra:\n- Kết nối mạng\n- ID section: ${sectionId}\n- Dữ liệu gửi đi`);
            return; // Không đóng modal nếu có lỗi
        } finally {
            setIsSaving(false);
        }

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
            <DialogContent className="admin-dark:bg-gray-800 admin-dark:text-white w-4xl max-w-4xl">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl">
                        Chọn dịch vụ cho ServiceGroup - Giai đoạn {currentStage}
                    </DialogTitle>

                    {/* Hiển thị thông tin line đang được chọn */}
                    {lineActive && (
                        <div className="p-4 bg-green-50 admin-dark:bg-green-900/20 rounded-lg border border-green-200 admin-dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-600 admin-dark:text-gray-400">
                                        Đang chọn dịch vụ cho ServiceGroup:
                                    </p>
                                    <p className="font-semibold text-green-700 admin-dark:text-green-300">
                                        {lineActive.nameVi}
                                    </p>
                                    <p className="text-sm text-gray-500 admin-dark:text-gray-400">
                                        {lineActive.nameEn}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="bg-white admin-dark:bg-gray-800">
                                        ID: {lineActive.id}
                                    </Badge>
                                    <Badge variant="secondary">
                                        Stage {currentStage}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogHeader>

                <div className="py-4">
                    {/* Thông tin tóm tắt */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary">
                                Giai đoạn {currentStage}
                            </Badge>
                            {selectedServicesForLine.length > 0 && (
                                <Badge variant="outline" className="bg-green-100 text-green-700">
                                    Đã chọn: {selectedServicesForLine.length} dịch vụ
                                </Badge>
                            )}
                        </div>
                        {lineActive && (
                            <Badge variant="outline" className="max-w-xs truncate">
                                {lineActive.nameVi}
                            </Badge>
                        )}
                    </div>

                    {/* Danh sách dịch vụ */}
                    <div
                        data-lenis-prevent
                        className="lenis-local grid grid-cols-1 gap-3 max-h-96 overflow-y-auto scrollbar-hide"
                    >
                        {availableServicesForStage.length > 0 ? (
                            availableServicesForStage.map((service) => {
                                const isSelected = isServiceSelectedInModal(service);

                                return (
                                    <div
                                        key={service.id}
                                        className={cn(
                                            "p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md",
                                            isSelected
                                                ? "bg-green-500 text-white border-green-500 ring-2 ring-green-200 admin-dark:bg-green-600 admin-dark:border-green-600"
                                                : "bg-card hover:bg-muted admin-dark:bg-card admin-dark:hover:bg-muted border-border hover:border-green-300"
                                        )}
                                        onClick={() => handleServiceClickInModal(service)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1 flex-1">
                                                <div className="font-medium">
                                                    {service.translation.ten_dich_vu}
                                                </div>
                                                <div className="text-xs opacity-70">
                                                    Slug: {service.translation.slug}
                                                </div>
                                                <div className="text-xs opacity-70">
                                                    ID: {service.id}
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
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-muted-foreground">
                                    Không có dịch vụ nào cho giai đoạn {currentStage}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            {selectedServicesForLine.length > 0 && (
                                <div className="text-sm text-muted-foreground">
                                    Đã chọn: {selectedServicesForLine.length} dịch vụ cho
                                    <span className="font-medium ml-1">"{lineActive?.nameVi}"</span>
                                </div>
                            )}
                            {getChangesToSave().length > 0 && (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                                    {getChangesToSave().length} thay đổi chưa lưu
                                </Badge>
                            )}
                            {/* Hiển thị lỗi validation nếu có */}
                            {validateRequiredData().length > 0 && (
                                <Badge variant="outline" className="bg-red-100 text-red-700">
                                    Dữ liệu không hợp lệ
                                </Badge>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={isSaving}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleConfirmSelection}
                                disabled={
                                    isSaving ||
                                    getChangesToSave().length === 0 ||
                                    validateRequiredData().length > 0
                                }
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang lưu...
                                    </>
                                ) : (
                                    `Xác nhận lưu (${getChangesToSave().length})`
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}   
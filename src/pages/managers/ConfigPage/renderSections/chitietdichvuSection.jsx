import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Plus, Edit2, Trash2, Save, X } from "lucide-react"
import { cn } from "@/lib/utils"
import ServiceSelectionModal from "./ServiceSelectionModal"
import useLenisLocal from '@/hook/useLenisLocal'
import { Crosshair } from 'lucide-react';
// import EditServiceGroupForm from "./components/EditServiceGroupForm"
import ServiceSelectionForGroupServiceModal from "./ServiceSelectionForGroupServiceModal"

export default function ChitietdichvuSection({ DataFeaturesOfGroupService }) {
    useLenisLocal(".lenis-local")
    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

    const [currentStage, setCurrentStage] = useState(1)
    const [editingItem, setEditingItem] = useState(null)
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
    const [isServiceSelectionForGroupServiceModal, setServiceSelectionForGroupServiceModal] = useState(false)

    // Thêm state để track line đang được chọn
    const [selectedLineItem, setSelectedLineItem] = useState(null)

    const [servicesFetch, setServicesFetch] = useState([]);
    const [serviceOfStage1, setServiceOfStage1] = useState([]);
    const [serviceOfStage2, setServiceOfStage2] = useState([]);
    const [serviceOfStage3, setServiceOfStage3] = useState([]);

    const FetchDataServicesALL = async (lang = "vi") => {
        try {
            const lang_api = lang === "vi" ? "" : "/en";
            const res = await fetch(`${API_BASE_URL}${lang_api}/api/services`);
            const data = await res.json();
            if (data.success) {
                setServicesFetch(data.data);
                // console.log("Services loaded:", data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getAllStageTitles = (data, lang = "en") => {
        console.log(data);
        const titles = data?.title?.[lang]?.title;
        if (!titles) return {};

        // chỉ lấy 3 stage cố định
        return {
            stage1: titles.stage1 || [],
            stage2: titles.stage2 || [],
            stage3: titles.stage3 || []
        };
    };

    function transformServiceGroup(id, serviceGroupEn, serviceGroupVi) {
        return Object.keys(serviceGroupEn).map((key, idx) => ({
            id: `sg-${key}`,
            idUseUpdate: id,
            nameEn: serviceGroupEn[key],
            nameVi: serviceGroupVi[key],
        }));
    }

    const [serviceGroupItems, setServiceGroupItems] = useState([]);

    useEffect(() => {
        FetchDataServicesALL();

        const id = DataFeaturesOfGroupService?.id;
        const en = DataFeaturesOfGroupService?.title?.en?.serviceGroup;
        const vi = DataFeaturesOfGroupService?.title?.vi?.serviceGroup;

        if (en && vi) {
            setServiceGroupItems(transformServiceGroup(id, en, vi));
        } else {
            setServiceGroupItems([]);
        }
    }, [DataFeaturesOfGroupService]);

    useEffect(() => {
        const allTitles = getAllStageTitles(DataFeaturesOfGroupService, "en");
        console.log("Stage titles:", allTitles);

        // lọc stage1
        const stage1Services = servicesFetch.filter(service =>
            allTitles.stage1.includes(service.translation.slug)
        );
        // lọc stage2
        const stage2Services = servicesFetch.filter(service =>
            allTitles.stage2.includes(service.translation.slug)
        );
        // lọc stage3
        const stage3Services = servicesFetch.filter(service =>
            allTitles.stage3.includes(service.translation.slug)
        );

        setServiceOfStage1(stage1Services);
        setServiceOfStage2(stage2Services);
        setServiceOfStage3(stage3Services);

        console.log("Services by stage:", { stage1Services, stage2Services, stage3Services });
    }, [servicesFetch, DataFeaturesOfGroupService]);

    // Handle service selection from modal
    const handleServiceToggle = (updatedServices, stage) => {
        console.log("Service toggle:", updatedServices, stage);

        if (stage === 1) {
            setServiceOfStage1(updatedServices);
        } else if (stage === 2) {
            setServiceOfStage2(updatedServices);
        } else if (stage === 3) {
            setServiceOfStage3(updatedServices);
        }

        // Optionally save to backend here
        // saveStageServices(updatedServices, stage);
        // Gọi API lưu backend
        saveStageServices(updatedServices, stage);
    };

    // Get current stage services for display
    const getCurrentStageServices = () => {
        if (currentStage === 1) return serviceOfStage1;
        if (currentStage === 2) return serviceOfStage2;
        if (currentStage === 3) return serviceOfStage3;
        return [];
    };

    // Hàm để handle click vào button Crosshair
    const handleLineSelection = (item) => {
        setSelectedLineItem(item);
        setServiceSelectionForGroupServiceModal(true);
        console.log("Selected line item:", item);
    };

    // Hàm để đóng modal và reset selected line
    const handleCloseServiceSelectionModal = () => {
        setServiceSelectionForGroupServiceModal(false);
        setSelectedLineItem(null);
    };

    const [newLineKey, setNewLineKey] = useState("");
    const [newLineEn, setNewLineEn] = useState("");
    const [newLineVi, setNewLineVi] = useState("");

    // thêm mới
    const addServiceGroupItem = async () => {
        try {
            const sectionId = DataFeaturesOfGroupService?.id;
            if (!sectionId || !newLineEn.trim() || !newLineVi.trim()) return;

            const newLineKey = `Line${serviceGroupItems.length + 1}`;

            const res = await fetch(
                `${API_BASE_URL}/api/section-items-chi-tiet-dich-vu/${sectionId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        lineKey: newLineKey,
                        valueEn: newLineEn,
                        valueVi: newLineVi,
                    }),
                }
            );

            const data = await res.json();
            if (res.ok) {
                setServiceGroupItems((prev) => [
                    ...prev,
                    {
                        id: `sg-${newLineKey}`,
                        idUseUpdate: sectionId,
                        lineKey: newLineKey,
                        nameEn: newLineEn,
                        nameVi: newLineVi,
                    },
                ]);
                setNewLineEn("");
                setNewLineVi("");
                console.log("✅ Added:", data);
            } else {
                console.error("❌ Add failed:", data.error);
            }
        } catch (err) {
            console.error("❌ Error adding serviceGroup line:", err);
        }
    };

    const updateServiceGroupItem = async (updatedItem) => {
        try {
            const lineKey = updatedItem.id.replace("sg-", "");
            const key = updatedItem.idUseUpdate

            const res = await fetch(`${API_BASE_URL}/api/section-items-chi-tiet-dich-vu/${key}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    key,
                    lineKey,
                    values: {
                        en: updatedItem.nameEn,
                        vi: updatedItem.nameVi,
                    },
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setServiceGroupItems((prev) =>
                    prev.map((it) => (it.id === updatedItem.id ? updatedItem : it))
                );
                setEditingItem(null);
                console.log("✅ Update success:", data);
            } else {
                console.error("❌ Update failed:", data.error);
            }
        } catch (err) {
            console.error("❌ Error updating serviceGroup line:", err);
        }
    };

    const deleteServiceGroupItem = async (item) => {
        try {
            const lineKey = item.id.replace("sg-", "");
            const key = item.idUseUpdate;

            const res = await fetch(`${API_BASE_URL}/api/section-items-chi-tiet-dich-vu/${key}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ lineKey }),
            });

            const data = await res.json();
            if (res.ok) {
                setServiceGroupItems((prev) => prev.filter((it) => it.id !== item.id));
                console.log("✅ Delete success:", data);
            } else {
                console.error("❌ Delete failed:", data.error);
            }
        } catch (err) {
            console.error("❌ Error deleting serviceGroup line:", err);
        }
    };

    // Hàm gọi API update stage
    const saveStageServices = async (updatedServices, stage) => {
        try {
            const sectionId = DataFeaturesOfGroupService?.id;
            if (!sectionId) return;

            const newStageKey = `stage${stage}`;

            for (const service of servicesFetch) {
                const serviceSlug = service.translation.slug;

                const wasInStage = [serviceOfStage1, serviceOfStage2, serviceOfStage3]
                    .some((stageServices, idx) =>
                        stageServices.some(s => s.translation.slug === serviceSlug && idx + 1 === stage)
                    );

                const isNowSelected = updatedServices.some(
                    s => s.translation.slug === serviceSlug
                );

                let bodyData = null;

                if (!wasInStage && isNowSelected) {
                    // ➕ Add service to current stage
                    bodyData = {
                        serviceSlug,
                        oldStage: "stage0",
                        newStage: newStageKey,
                    };
                } else if (wasInStage && !isNowSelected) {
                    // ➖ Remove service from current stage
                    bodyData = {
                        serviceSlug,
                        oldStage: newStageKey,
                        newStage: "stage0",
                    };
                }

                if (bodyData) {
                    const res = await fetch(
                        `${API_BASE_URL}/api/section-items-chi-tiet-dich-vu/${sectionId}/stage`,
                        {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(bodyData),
                        }
                    );

                    const data = await res.json();
                    if (res.ok) {
                        console.log(`✅ ${serviceSlug}: ${bodyData.oldStage} → ${bodyData.newStage}`);
                    } else {
                        console.error(`❌ Failed to update ${serviceSlug}:`, data.message);
                    }
                }
            }
        } catch (error) {
            console.error("❌ Error saving stage services:", error);
        }
    };





    const stageDescriptions = {
        1: "Giai đoạn 1: Nhóm dịch vụ 1, 2",
        2: "Giai đoạn 2: Bao gồm tất cả mục từ giai đoạn 1 + Nhóm dịch vụ 3, 4, 5",
        3: "Giai đoạn 3: Bao gồm tất cả mục từ giai đoạn 1, 2 + Nhóm dịch vụ 6, 7, 8",
    }

    return (
        <div className="space-y-6 ">
            {/* Stage Slider */}
            <Card theme="admin">
                <CardHeader theme="admin">
                    <CardTitle theme="admin">Chọn Giai Đoạn</CardTitle>
                    <CardDescription theme="admin">Sử dụng thanh trượt để chuyển đổi giữa các giai đoạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4" theme="admin">
                    <div className="px-4">
                        <Slider
                            theme="admin"
                            value={[currentStage]}
                            onValueChange={(value) => setCurrentStage(value[0])}
                            max={3}
                            min={1}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm admin-dark:text-muted-foreground mt-2">
                            <span>Giai đoạn 1</span>
                            <span>Giai đoạn 2</span>
                            <span>Giai đoạn 3</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <Badge variant="outline" className="text-lg px-4 py-2">
                            {stageDescriptions[currentStage]}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Services Selection */}
                <Card theme="admin" className={cn("admin-dark:bg-card admin-dark:text-card-foreground admin-dark:border-border/60")}>
                    <div className="flex items-center justify-between">
                        <CardHeader theme="admin" className="w-3/4">
                            <CardTitle theme="admin">Dịch Vụ</CardTitle>
                            <CardDescription theme="admin">Chọn dịch vụ cho giai đoạn {currentStage}</CardDescription>
                        </CardHeader>
                        <div className="w-1/4 px-4">
                            <button
                                onClick={() => setIsServiceModalOpen(true)}
                                className="border border-gray-500 px-3 py-2 rounded-2xl admin-dark:hover:bg-gray-800 admin-dark:hover:text-white duration-300 transition-all text-sm"
                            >
                                Chọn dịch vụ
                            </button>
                        </div>
                    </div>
                    <CardContent className="space-y-6" theme="admin">
                        {/* Services Display */}
                        <div className="space-y-3">
                            <Label>Dịch vụ đã chọn cho giai đoạn {currentStage}</Label>
                            <div className="space-y-2 p-3 admin-dark:bg-muted/50 rounded-lg min-h-[100px]">
                                {getCurrentStageServices().length === 0 ? (
                                    <p className="text-center text-muted-foreground py-4">
                                        Chưa có dịch vụ nào được chọn cho giai đoạn này
                                    </p>
                                ) : (
                                    getCurrentStageServices().map((service) => (
                                        <div
                                            key={service.id}
                                            className="flex items-center p-2 border rounded admin-dark:bg-slate-900/50"
                                        >
                                            <div className="text-sm font-medium text-primary">
                                                {service.translation.ten_dich_vu}
                                            </div>
                                        </div>
                                    ))
                                )}

                                {getCurrentStageServices().length > 0 && (
                                    <div className="text-sm admin-dark:text-muted-foreground mt-2">
                                        Đã chọn: {getCurrentStageServices().length} dịch vụ
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Items Management */}
                <Card theme="admin" className={cn("duration-300 transition-all admin-dark:bg-card admin-dark:text-card-foreground admin-dark:border-border/60")}>
                    <CardHeader theme="admin">
                        <CardTitle theme="admin">Quản Lý Mục</CardTitle>
                        <CardDescription theme="admin">Thêm và chỉnh sửa các mục cho giai đoạn {currentStage}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4" theme="admin">
                        {/* Add new ServiceGroup Line */}
                        <div className="space-y-3 p-4 border rounded-lg admin-dark:bg-muted/50 mt-4">
                            <h4 className="font-medium">Thêm ServiceGroup Line</h4>
                            <div className="flex flex-col w-full space-y-3">
                                <Input
                                    placeholder="English value"
                                    value={newLineEn}
                                    onChange={(e) => setNewLineEn(e.target.value)}
                                />
                                <Input
                                    placeholder="Tiếng Việt value"
                                    value={newLineVi}
                                    onChange={(e) => setNewLineVi(e.target.value)}
                                />
                            </div>
                            <Button onClick={addServiceGroupItem} className="w-full">
                                <Plus className="w-4 h-4 mr-2" /> Thêm Line
                            </Button>
                        </div>

                        {/* Items List */}
                        <div className="space-y-2">
                            <h4 className="font-medium">Danh Sách Hạng Mục</h4>
                            {serviceGroupItems.length === 0 ? (
                                <p className="admin-dark:text-muted-foreground text-center py-4">
                                    Chưa có mục nào. Hãy thêm mục đầu tiên!
                                </p>
                            ) : (
                                serviceGroupItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "flex items-center justify-between p-3 border rounded-lg",
                                            "admin-dark:bg-primary/5 admin-dark:border-primary/20"
                                        )}
                                    >
                                        {editingItem === item.id ? (
                                            <EditServiceGroupForm
                                                item={item}
                                                onSave={updateServiceGroupItem}
                                                onCancel={() => setEditingItem(null)}
                                            />
                                        ) : (
                                            <>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{item.nameVi}</span>
                                                    </div>
                                                    <p className="text-sm admin-dark:text-muted-foreground">
                                                        {item.nameEn}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {/* Updated button với function để track line được chọn */}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleLineSelection(item)}
                                                    >
                                                        <Crosshair className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => setEditingItem(item.id)}>
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => deleteServiceGroupItem(item)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Service Selection Modal */}
            <ServiceSelectionModal
                isOpen={isServiceModalOpen}
                onClose={() => setIsServiceModalOpen(false)}
                onServiceToggle={handleServiceToggle}
                currentStage={currentStage}
                serviceOfStage1={serviceOfStage1}
                serviceOfStage2={serviceOfStage2}
                serviceOfStage3={serviceOfStage3}
            />

            {/* Service Selection For Group Service Modal - Updated với selectedLineItem */}
            <ServiceSelectionForGroupServiceModal
                isOpen={isServiceSelectionForGroupServiceModal}
                onClose={handleCloseServiceSelectionModal}
                onServiceToggle={handleServiceToggle}
                currentStage={currentStage}
                serviceOfStage1={serviceOfStage1}
                serviceOfStage2={serviceOfStage2}
                serviceOfStage3={serviceOfStage3}
                lineActive={selectedLineItem} // Truyền line đang được chọn
                serviceSelectedByServiceGroup={DataFeaturesOfGroupService?.description}
            />
        </div>
    )
}

function EditServiceGroupForm({ item, onSave, onCancel }) {
    const [nameEn, setNameEn] = useState(item.nameEn);
    const [nameVi, setNameVi] = useState(item.nameVi);

    const handleSave = () => {
        if (nameEn.trim() && nameVi.trim()) {
            onSave({ ...item, nameEn: nameEn.trim(), nameVi: nameVi.trim() });
        }
    };

    return (
        <div className="flex-1 space-y-2">
            <div className="grid grid-cols-1 gap-2">
                <Input
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="English name"
                    className="text-sm"
                />
                <Input
                    value={nameVi}
                    onChange={(e) => setNameVi(e.target.value)}
                    placeholder="Tên tiếng Việt"
                    className="text-sm"
                />
            </div>
            <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                    <Save className="w-3 h-3 mr-1" />
                    Lưu
                </Button>
                <Button size="sm" variant="outline" onClick={onCancel}>
                    <X className="w-3 h-3 mr-1" />
                    Hủy
                </Button>
            </div>
        </div>
    );
}
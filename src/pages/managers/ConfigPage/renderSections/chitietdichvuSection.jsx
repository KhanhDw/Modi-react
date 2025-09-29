import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Plus, Edit2, Trash2, Save, X, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import EditServiceGroupForm from "./components/EditServiceGroupForm.jsx"
import ServiceSelectionModal from "./ServiceSelectionModal.jsx"
import { getAllServices, getAllServiceStages } from "./hook/use_services_stage.jsx"
import { getAllMiniServices, createMiniService, deleteMiniService } from "./hook/use_list_mini_service.jsx"
import ServiceSelectionForGroupServiceModal from "./ServiceSelectionForGroupServiceModal.jsx"


export default function ChitietdichvuSection() {


    const [listServiceMini, setListServiceMini] = useState([]);
    const [isGroupServiceModalOpen, setIsGroupServiceModalOpen] = useState(false);
    const [selectedServiceMini, setSelectedServiceMini] = useState(null);

    const fetchDataServiceStage = async () => {
        try {
            const stageResult = await getAllServiceStages(); // gọi BE trả danh sách services_stage
            const serviceResult = await getAllServices();    // gọi BE trả danh sách services

            // gom theo stage
            const grouped = { 1: [], 2: [], 3: [] };
            stageResult.forEach((st) => {
                const service = serviceResult.find((s) => s.id === st.service_id);
                if (service) {
                    grouped[st.stage] = [
                        ...(grouped[st.stage] || []),
                        {
                            services_stage_id: st.id, // 👈 id thật của bảng services_stage
                            stage: st.stage,
                            ...service,
                        },
                    ];
                }

            });

            setServicesStage(grouped); // ✅ set lại state để getCurrentStageServices dùng
        } catch (err) {
            console.error("Lỗi load service stages:", err);
        }
    };


    const FetchListMiniService = async () => {
        try {
            const stageResult = await getAllMiniServices();
            setListServiceMini(stageResult);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchDataServiceStage();
        FetchListMiniService();
    }, []);



    const HandlePostSelectMiniServiceForServiceStage = async () => {
        try {

            await createMiniService({ title_vi: newLineVi, title_en: newLineEn });
            await FetchListMiniService();
        } catch (error) {
            console.log(error);
        }
    }

    const HandleDeteletMiniService = async (id) => {
        try {
            await deleteMiniService(id);
            await FetchListMiniService();
        } catch (error) {
            console.log(error);
        }
    }





    const [currentStage, setCurrentStage] = useState(1);
    const [editingItem, setEditingItem] = useState(null);

    const [servicesStage, setServicesStage] = useState({
        1: [{ id: "s1", translation: { ten_dich_vu: "Cắt tóc" } }],
        2: [{ id: "s2", translation: { ten_dich_vu: "Gội đầu" } }],
        3: [{ id: "s3", translation: { ten_dich_vu: "Massage" } }],
    });
    const [newLineEn, setNewLineEn] = useState("");
    const [newLineVi, setNewLineVi] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMiniService, setIsEditMiniService] = useState(false);


    const stageDescriptions = {
        1: "Giai đoạn 1: Nhóm dịch vụ 1, 2",
        2: "Giai đoạn 2: Bao gồm thêm nhóm dịch vụ 3, 4, 5",
        3: "Giai đoạn 3: Bao gồm tất cả dịch vụ",
    };

    const getCurrentStageServices = () => servicesStage[currentStage] || [];



    return (
        <div className="space-y-6">
            {/* Stage Slider */}
            <Card theme="admin" className="admin-dark:bg-gray-900">
                <CardHeader theme="admin">
                    <CardTitle theme="admin" className="admin-dark:text-white">
                        Chọn Giai Đoạn
                    </CardTitle>
                    <CardDescription theme="admin" className="admin-dark:text-gray-500">
                        Sử dụng thanh trượt để chuyển đổi giữa các giai đoạn
                    </CardDescription>
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
                        <div className="flex justify-between text-sm admin-dark:text-white mt-2">
                            <span>Giai đoạn 1</span>
                            <span>Giai đoạn 2</span>
                            <span>Giai đoạn 3</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <Badge theme="admin" variant="outline" className="text-lg px-4 py-2">
                            {stageDescriptions[currentStage]}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Services Selection */}
                <Card
                    theme="admin"
                    className={cn(
                        "admin-dark:bg-gray-900 admin-dark:text-card-foreground admin-dark:border-border/60"
                    )}
                >
                    <div className="flex items-center justify-between">
                        <CardHeader theme="admin" className="w-3/4">
                            <CardTitle theme="admin" className="admin-dark:text-white">
                                Dịch Vụ
                            </CardTitle>
                            <CardDescription theme="admin" className="admin-dark:text-gray-500">
                                Chọn dịch vụ cho giai đoạn {currentStage}
                            </CardDescription>
                        </CardHeader>
                        <div className="w-1/4 px-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="border border-gray-500 px-3 py-2 rounded-2xl admin-dark:bg-indigo-900 admin-dark:hover:bg-indigo-800 admin-dark:hover:text-white duration-300 transition-all text-sm"
                            >
                                Chọn dịch vụ
                            </button>
                        </div>
                    </div>
                    <CardContent className="space-y-6" theme="admin">
                        <div className="space-y-3">
                            <Label>Dịch vụ đã chọn cho giai đoạn {currentStage}</Label>
                            <div className="space-y-2 p-3 admin-dark:bg-gray-800 rounded-lg min-h-[100px]">
                                {getCurrentStageServices().length === 0 ? (
                                    <p className="text-center text-muted-foreground py-4">
                                        Chưa có dịch vụ nào được chọn cho giai đoạn này
                                    </p>
                                ) : (
                                    getCurrentStageServices().map((service, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center p-2 border rounded admin-dark:bg-slate-900/50"
                                        >
                                            <div className="text-sm font-medium text-primary">
                                                {service.translation?.ten_dich_vu}
                                            </div>
                                        </div>
                                    ))
                                )}

                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Items Management */}
                <Card
                    theme="admin"
                    className={cn(
                        "admin-dark:bg-gray-900 duration-300 transition-all admin-dark:text-card-foreground admin-dark:border-border/60"
                    )}
                >
                    <CardHeader theme="admin">
                        <CardTitle theme="admin" className="admin-dark:text-white">
                            Quản Lý Mục
                        </CardTitle>
                        <CardDescription theme="admin" className="admin-dark:text-gray-500">
                            Thêm và chỉnh sửa các mục cho giai đoạn {currentStage}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4" theme="admin">
                        {/* Add new ServiceGroup Line */}
                        <div className="space-y-3 p-4 border rounded-lg admin-dark:bg-gray-800 mt-4">
                            <h4 className="font-medium">Thêm ServiceGroup Line</h4>
                            <div className="flex flex-col w-full space-y-3 admin-dark:text-white">
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
                            <Button theme="admin" onClick={HandlePostSelectMiniServiceForServiceStage} className="w-full">
                                <Plus className="w-4 h-4 mr-2" /> Thêm Line
                            </Button>
                        </div>

                        {/* Items List */}
                        <div className="space-y-2">
                            <h4 className="font-medium">Danh Sách Hạng Mục</h4>
                            {listServiceMini.length === 0 ? (
                                <p className="admin-dark:text-muted-foreground text-center py-4">
                                    Chưa có mục nào. Hãy thêm mục đầu tiên!
                                </p>
                            ) : (
                                listServiceMini.map((item) => (
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
                                                onCancel={() => setEditingItem(null)}
                                                onReload={FetchListMiniService}
                                            />
                                        ) : (
                                            <>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{item.title_vi}</span>
                                                    </div>
                                                    <p className="text-sm admin-dark:text-muted-foreground">
                                                        {item.title_en}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        theme="admin"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedServiceMini(item);          // truyền item đang chọn làm lineActive
                                                            setIsGroupServiceModalOpen(true);
                                                        }}
                                                    >
                                                        <Crosshair className="w-4 h-4" />
                                                    </Button>

                                                    <Button
                                                        theme="admin"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingItem(item.id)}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        theme="admin"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => HandleDeteletMiniService(item.id)}
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

            {isModalOpen &&
                <ServiceSelectionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    currentStage={currentStage}
                    onSaved={fetchDataServiceStage}
                />
            }

            {isGroupServiceModalOpen && (
                <ServiceSelectionForGroupServiceModal
                    isOpen={isGroupServiceModalOpen}
                    onClose={() => setIsGroupServiceModalOpen(false)}
                    currentStage={currentStage}
                    lineActive={selectedServiceMini}
                    serviceMiniSelected={selectedServiceMini}
                    serviceGroupCurrentStage={servicesStage}
                />
            )}

        </div>
    );
}

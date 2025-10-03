import NotificationToast from "@/components/feature/notification-toast.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
    closestCenter,
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Crosshair, Edit2, GripVertical, LogOut, PencilLine, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmationModal from "./components/ConfirmationModal.jsx";
import EditServiceGroupForm from "./components/EditServiceGroupForm.jsx";
import { getAllBridge } from "./hook/use_bridge_services_stage_and_list_mini_service.jsx";
import { createMiniService, deleteMiniService, getAllMiniServices } from "./hook/use_list_mini_service.jsx";
import { getAllServices, getAllServiceStages, } from "./hook/use_services_stage.jsx";
import { bulkUpdateStageCodes, createStage, deleteStage, getAllStages, updateStage } from "./hook/use_stage_master.jsx";
import ServiceSelectionForGroupServiceModal from "./ServiceSelectionForGroupServiceModal.jsx";
import ServiceSelectionModal from "./ServiceSelectionModal.jsx";


const SortableStageItem = ({ stage, onEdit, onDelete, isEditing, onUpdate, onCancelEdit }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: stage.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center justify-between border rounded-lg p-2 transition-shadow border-gray-200 admin-dark:border-gray-700",
                isDragging ? "shadow-xl bg-gray-50 z-10 admin-dark:bg-gray-800 focus:border-none" : "bg-white admin-dark:bg-gray-800/50",
                isEditing ? "ring-2 ring-blue-500/50" : ""
            )}
        >
            {isEditing ? (
                <div className="flex flex-col lg:flex-row lg:items-center items-start gap-2 w-full">
                    <Input defaultValue={stage.code} onChange={(e) => (stage.code = e.target.value)} className="placeholder:text-gray-500 text-gray-800 admin-dark:text-white w-20 lg:w-40" placeholder="Code" />
                    <Input defaultValue={stage.title_vi} onChange={(e) => (stage.title_vi = e.target.value)} placeholder="Tiếng Việt" className={'placeholder:text-gray-500 text-gray-800 admin-dark:text-white lg:w-full'} />
                    <Input defaultValue={stage.title_en} onChange={(e) => (stage.title_en = e.target.value)} placeholder="English" className={'placeholder:text-gray-500 text-gray-800 admin-dark:text-white lg:w-full'} />
                    <div className="flex w-full lg:w-fit gap-2 lg:items-center justify-end">
                        <Button theme="admin" size="sm" onClick={() => onUpdate(stage.id, stage)}
                            className="cursor-pointer shadow bg-blue-500 hover:bg-blue-600">
                            <Save className="w-4 h-4 text-white" />
                        </Button>
                        <Button theme="admin" size="sm" variant="outline" onClick={onCancelEdit} className="cursor-pointer shadow border-none bg-red-500 hover:bg-red-600 admin-dark:bg-red-500 admin-dark:hover:bg-red-600">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="w-full flex flex-col md:gap-3 md:flex-row">
                        <div className="flex items-center justify-start">
                            <div {...attributes} {...listeners} className="cursor-grab focus:cursor-grabbing p-1 text-gray-500 hover:text-gray-800 admin-dark:text-gray-400 admin-dark:hover:text-gray-200">
                                <GripVertical className="w-5 h-5" />
                            </div>
                            <Badge variant="secondary" className="font-mono text-xs">{stage.code}</Badge>
                        </div>
                        <div className="flex flex-col md:flex-row w-full gap-1 lg:gap-3 items-center">
                            <span className="font-medium text-sm text-gray-900 admin-dark:text-white">{stage.title_vi}</span>
                            <span className="hidden md:inline text-gray-400">/</span>
                            <span className="text-sm text-gray-500 admin-dark:text-gray-400"> {stage.title_en}</span>
                        </div>
                        <div className="flex gap-2 w-full justify-end md:w-fit mt-2 md:mt-0">
                            <Button theme="admin" size="sm" variant="ghost" onClick={() => onEdit(stage.id)}
                                className="cursor-pointer bg-gray-200 text-gray-500 hover:text-gray-500 hover:bg-gray-300 admin-dark:bg-gray-700 admin-dark:text-white admin-dark:hover:bg-gray-800">
                                <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button theme="admin" size="sm" variant="ghost" className="text-red-600 hover:text-red-700 admin-dark:text-red-500 admin-dark:hover:text-red-400 cursor-pointer bg-gray-200 hover:bg-gray-300 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800" onClick={() => onDelete(stage)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )
            }
        </div >
    );
};

export default function ChitietdichvuSection() {
    const [listServiceMini, setListServiceMini] = useState([]);
    const [isGroupServiceModalOpen, setIsGroupServiceModalOpen] = useState(false);
    const [selectedServiceMini, setSelectedServiceMini] = useState(null);

    const [stageMaster, setStageMaster] = useState([]);
    const [newStageVi, setNewStageVi] = useState("");
    const [newStageEn, setNewStageEn] = useState("");
    const [newStageCode, setNewStageCode] = useState("");
    const [editingStage, setEditingStage] = useState(null);
    const [isOrderChanged, setIsOrderChanged] = useState(false);

    // State for confirmation modal and toast
    const [confirmModalState, setConfirmModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });
    const [toastState, setToastState] = useState({
        isVisible: false,
        message: '',
        type: 'success',
    });

    // Helper to show toast
    const showToast = (message, type = 'success') => {
        setToastState({ isVisible: true, message, type });
    };


    const fetchDataServiceStage = async () => {
        try {
            const [stageResult, serviceResult, bridgeResult] = await Promise.all([
                getAllServiceStages(),
                getAllServices(),
                getAllBridge(),
            ]);

            // Gom service theo stage
            const grouped = {};
            stageResult.forEach((st) => {
                const service = serviceResult.find((s) => Number(s.id) === Number(st.service_id));
                if (service) {
                    grouped[st.stage_id] = [
                        ...(grouped[st.stage_id] || []),
                        {
                            services_stage_id: st.id,
                            stage_id: st.stage_id,
                            ...service,
                            minis: bridgeResult.filter(
                                (br) =>
                                    Number(br.service_id) === Number(service.id) &&
                                    Number(br.stage_id) === Number(st.stage_id)
                            ),
                        },
                    ];

                }
            });

            setServicesStage(grouped);
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
            showToast("Thêm hạng mục thành công!");
        } catch (error) {
            console.log(error);
            showToast("Thêm hạng mục thất bại.", "error");
        }
    }

    const triggerDeleteMiniService = (item) => {
        setConfirmModalState({
            isOpen: true,
            title: 'Xác nhận xóa hạng mục',
            message: `Bạn có chắc chắn muốn xóa hạng mục "${item.title_vi}"? Hành động này không thể hoàn tác.`,
            onConfirm: () => handleDeleteMiniService(item.id),
        });
    };

    const handleDeleteMiniService = async (id) => {
        try {
            await deleteMiniService(id);
            await FetchListMiniService();
            showToast("Đã xóa hạng mục thành công.");
        } catch (error) {
            console.log(error);
            showToast("Xóa hạng mục thất bại.", "error");
        }
    }


    // fetch stage_master
    const fetchStages = async () => {
        try {
            const data = await getAllStages();
            // Sắp xếp dữ liệu theo 'code' trước khi set state
            const sortedData = data.sort((a, b) => Number(a.code) - Number(b.code));
            setStageMaster(sortedData);
            setIsOrderChanged(false); // Reset khi fetch lại
        } catch (err) {
            console.error("Lỗi load stage_master:", err);
        }
    };

    useEffect(() => {
        fetchStages();
    }, []);

    // handle thêm
    const handleAddStage = async () => {
        try {
            await createStage({ code: newStageCode, title_vi: newStageVi, title_en: newStageEn });
            setNewStageCode("");
            setNewStageVi("");
            setNewStageEn("");
            await fetchStages();
            showToast("Thêm giai đoạn thành công!");
        } catch (err) {
            console.error(err);
            showToast("Thêm giai đoạn thất bại.", "error");
        }
    };

    // handle update
    const handleUpdateStage = async (id, stageData) => {
        try {
            await updateStage(id, stageData);
            setEditingStage(null);
            await fetchStages();
            showToast("Cập nhật giai đoạn thành công!");
        } catch (err) {
            console.error(err);
            showToast("Cập nhật giai đoạn thất bại.", "error");
        }
    };

    // handle delete
    const triggerDeleteStage = (stage) => {
        setConfirmModalState({
            isOpen: true,
            title: 'Xác nhận xóa giai đoạn',
            message: `Bạn có chắc chắn muốn xóa giai đoạn "${stage.title_vi}"? Tất cả dịch vụ và hạng mục con liên quan cũng sẽ bị ảnh hưởng.`,
            onConfirm: () => handleDeleteStage(stage.id),
        });
    };

    const handleDeleteStage = async (id) => {
        try {
            await deleteStage(id);
            await fetchStages();
            showToast("Đã xóa giai đoạn thành công.");
        } catch (err) {
            console.error(err);
            showToast("Xóa giai đoạn thất bại.", "error");
        }
    };

    // ===== DND LOGIC =====
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setStageMaster((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);

                // Cập nhật lại 'code' (vị trí)
                return newOrder.map((item, index) => ({ ...item, code: String(index + 1) }));
            });
            setIsOrderChanged(true);
        }
    }

    const handleSaveOrder = async () => {
        try {
            // Chuẩn bị dữ liệu để gửi đi: một mảng các object {id, code}
            const stagesToUpdate = stageMaster.map(({ id, code }) => ({ id, code }));

            // Gọi API cập nhật hàng loạt
            await bulkUpdateStageCodes(stagesToUpdate);

            await fetchStages(); // Fetch lại để đảm bảo dữ liệu đồng bộ và reset isOrderChanged
            showToast("Đã lưu thứ tự giai đoạn.");
        } catch (err) {
            console.error("Lỗi khi lưu thứ tự:", err);
            showToast("Lưu thứ tự thất bại.", "error");
        }
    };

    const handleCancelOrder = () => fetchStages(); // Chỉ cần fetch lại là được


    const stageDescriptions = stageMaster.reduce((acc, s) => {
        acc[s.id] = `${s.title_vi} / ${s.title_en}`;
        return acc;
    }, {});



    const [currentStage, setCurrentStage] = useState(1);
    const [editingItem, setEditingItem] = useState(null);

    const [servicesStage, setServicesStage] = useState({});
    const [newLineEn, setNewLineEn] = useState("");
    const [newLineVi, setNewLineVi] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditStage, setIsEditStage] = useState(false);




    const getCurrentStageServices = () => servicesStage[currentStage] || [];



    return (
        <div className="space-y-6">
            {toastState.isVisible && (
                <NotificationToast
                    message={toastState.message}
                    type={toastState.type}
                    onClose={() => setToastState({ ...toastState, isVisible: false })}
                />
            )}
            <ConfirmationModal
                isOpen={confirmModalState.isOpen}
                onClose={() => setConfirmModalState({ ...confirmModalState, isOpen: false })}
                onConfirm={confirmModalState.onConfirm}
                title={confirmModalState.title}
                message={confirmModalState.message}
            />

            <Card className="bg-white border border-gray-300 admin-dark:bg-gray-900 admin-dark:border-gray-700">
                <CardHeader>
                    <CardTitle className="text-gray-900 admin-dark:text-white">
                        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between w-full">
                            <span className="text-sm sm:text-base">Chọn Giai Đoạn</span>
                            <Button theme="admin"
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditStage(!isEditStage)}
                                className="font-medium bg-gray-100 admin-dark:bg-gray-800 shadow text-gray-700 admin-dark:text-gray-300 admin-dark:hover:text-white cursor-pointer"
                            >
                                {isEditStage ? (
                                    <span className="flex items-center gap-2 text-sm sm:text-base">Hủy thay đổi <LogOut className="w-4 h-4" /></span>
                                ) : (
                                    <span className="flex items-center gap-2 text-sm sm:text-base"><PencilLine className="w-4 h-4" /> Điều chỉnh giai đoạn </span>
                                )}
                            </Button>
                        </div>
                    </CardTitle>
                    <CardDescription className="text-gray-500 admin-dark:text-gray-400 text-xs md:text-sm lg:text-base">
                        Sử dụng thanh trượt để chuyển đổi giữa các giai đoạn
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Slider
                            value={[currentStage]}
                            onValueChange={(value) => setCurrentStage(value[0])}
                            max={stageMaster.length}
                            min={1}
                            step={1}
                            className="w-full"
                        />

                        <div className="flex justify-between text-xs md:text-sm text-gray-600 admin-dark:text-gray-300 mt-2">
                            {stageMaster.map((st) => (
                                <span key={st.id}>{st.title_vi}</span>
                            ))}
                        </div>
                    </div>
                    <div className="text-center pt-2">
                        {stageMaster[currentStage - 1] && (
                            <div className="inline-flex flex-col justify-center items-center rounded-sm bg-gray-100 admin-dark:bg-gray-800 px-1 py-1 md:px-3 border border-gray-200 admin-dark:border-gray-700 w-fit">
                                <span className="text-center text-sm md:text-base lg:text-lg font-bold text-blue-600 admin-dark:text-sky-500">
                                    {stageMaster[currentStage - 1].title_vi}
                                </span>
                                <span className="text-center text-xs md:text-sm lg:text-base text-gray-500 admin-dark:text-gray-400">
                                    {stageMaster[currentStage - 1].title_en}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {isEditStage && <Card className="bg-white admin-dark:bg-gray-900 border border-gray-300 admin-dark:border-gray-600">
                <CardHeader className={'px-2 sm:px-4'}>
                    <CardTitle className="text-gray-900 admin-dark:text-white text-sm sm:text-base">Quản lý giai đoạn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col lg:flex-row gap-2 items-end">
                        <Input placeholder="Vị trí giai đoạn" value={newStageCode} onChange={(e) => setNewStageCode(e.target.value)} className={'text-gray-700 admin-dark:text-gray-100'} />
                        <Input placeholder="Tiếng Việt" value={newStageVi} onChange={(e) => setNewStageVi(e.target.value)} className={'text-gray-700 admin-dark:text-gray-100'} />
                        <Input placeholder="English" value={newStageEn} onChange={(e) => setNewStageEn(e.target.value)} className={'text-gray-700 admin-dark:text-gray-100'} />
                        <Button theme="admin" onClick={handleAddStage} className="cursor-pointer shadow bg-blue-500 hover:bg-blue-600">
                            <Plus className="w-4 h-4 cursor-pointer text-xs sm:text-base text-white" /> <span className="text-xs sm:text-base font-semibold text-white">Thêm</span>
                        </Button>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={stageMaster.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {stageMaster.map((st) => (
                                    <SortableStageItem
                                        key={st.id}
                                        stage={st}
                                        isEditing={editingStage === st.id}
                                        onEdit={setEditingStage}
                                        onDelete={triggerDeleteStage}
                                        onUpdate={handleUpdateStage}
                                        onCancelEdit={() => setEditingStage(null)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {isOrderChanged && (
                        <div className="flex justify-end gap-2 pt-1">
                            <Button theme="admin" variant="ghost" onClick={handleCancelOrder} className="cursor-pointer bg-gray-200 hover:bg-gray-300 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800">
                                <span className="text-sm sm:text-base font-semibold text-gray-800 admin-dark:text-white">Hủy sắp xếp</span>
                            </Button>
                            <Button theme="admin" onClick={handleSaveOrder} className="cursor-pointer bg-blue-500 hover:bg-blue-600 admin-dark:bg-blue-500 admin-dark:hover:bg-blue-600">
                                <Save className="w-4 h-4 text-white" />
                                <span className="text-sm sm:text-base font-semibold text-white">Lưu thứ tự</span>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Services Selection */}
                <Card
                    className="bg-white admin-dark:bg-gray-900 text-gray-900 admin-dark:text-gray-200 border-gray-200 admin-dark:border-gray-700"
                >
                    <CardHeader className="w-full gap-2 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4">
                        <div className="flex flex-col items-center sm:items-start">
                            <CardTitle className="text-gray-900 admin-dark:text-white text-sm sm:text-base">Dịch Vụ</CardTitle>
                            <CardDescription className="text-gray-500 admin-dark:text-gray-400 text-xs md:text-base mt-1 font-normal">
                                Chọn dịch vụ cho giai đoạn <span className="font-semibold">{stageMaster[currentStage - 1]?.title_vi}</span>
                            </CardDescription>
                        </div>
                        <div className="flex-shrink-0">
                            <Button theme="admin"
                                onClick={() => setIsModalOpen(true)}
                                variant="outline"
                                size="default"
                                className="cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="text-xs md:text-base font-semibold text-white">Chọn dịch vụ</span>
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-gray-800 admin-dark:text-gray-200 text-xs md:text-base flex flex-col md:flex-row lg:flex-col w-full items-start">Dịch vụ đã chọn cho giai đoạn
                                <span className="font-semibold text-blue-600 admin-dark:text-sky-400 text-xs md:text-base">{stageMaster[currentStage - 1]?.title_vi}</span>
                            </Label>
                            <div className="space-y-2 p-3 bg-gray-50 admin-dark:bg-gray-800 rounded-lg min-h-[100px] border border-gray-200 admin-dark:border-gray-700">
                                {getCurrentStageServices().length === 0 ? (
                                    <p className="text-center text-gray-500 admin-dark:text-gray-500 py-4 text-xs md:text-base">
                                        Chưa có dịch vụ nào được chọn cho giai đoạn này
                                    </p>
                                ) : (
                                    getCurrentStageServices().map((service, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center p-2 border border-gray-200 rounded bg-white admin-dark:bg-slate-900/50 admin-dark:border-gray-600"
                                        >
                                            <div className="text-sm font-medium text-blue-700 admin-dark:text-sky-400">
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
                    className="bg-white admin-dark:bg-gray-900 duration-300 transition-all text-gray-900 admin-dark:text-gray-200 border-gray-200 admin-dark:border-gray-700"
                >
                    <CardHeader className={'px-2 sm:px-4'}>
                        <CardTitle className="text-gray-900 admin-dark:text-white text-sm sm:text-base">
                            Quản Lý Mục
                        </CardTitle>
                        <CardDescription className="text-gray-500 admin-dark:text-gray-400 text-xs md:text-base">
                            Thêm và chỉnh sửa các hạng mục cho các gói dịch vụ
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Add new ServiceGroup Line */}
                        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 admin-dark:bg-gray-800/50 admin-dark:border-gray-700">
                            <h4 className="font-medium text-gray-900 admin-dark:text-white text-sm sm:text-base">Thêm hạng mục cho các gói dịch vụ</h4>
                            <div className="flex flex-col md:flex-row md:gap-2 w-full space-y-3">
                                <Input
                                    placeholder="Tên hạng mục (Việt)"
                                    value={newLineVi}
                                    onChange={(e) => setNewLineVi(e.target.value)}
                                />
                                <Input
                                    placeholder="Tên hạng mục (English)"
                                    value={newLineEn}
                                    onChange={(e) => setNewLineEn(e.target.value)}
                                />
                            </div>
                            <Button theme="admin" onClick={HandlePostSelectMiniServiceForServiceStage} className="w-full md:w-50 flex md:mx-auto shadow bg-blue-500 hover:bg-blue-600 cursor-pointer">
                                <Plus className="w-4 h-4 mr-2 text-white" />
                                <span className="text-sm sm:text-base font-semibold text-white">Thêm hạng mục mới</span>
                            </Button>
                        </div>

                        {/* Items List */}
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            <h4 className="font-medium text-gray-900 admin-dark:text-white text-sm sm:text-base">Danh Sách Hạng Mục</h4>
                            {listServiceMini.length === 0 ? (
                                <p className="text-gray-500 admin-dark:text-gray-500 text-center py-4 text-sm sm:text-base">
                                    Chưa có mục nào. Hãy thêm mục đầu tiên!
                                </p>
                            ) : (
                                listServiceMini.map((item) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "flex flex-col w-full md:flex-row lg:flex-col xl:flex-row lg:items-start xl:items-center md:items-center md:justify-between items-start gap-2 p-3 border border-gray-200 rounded-lg bg-white",
                                            "admin-dark:bg-gray-800 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-700/50"
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
                                                    <div className="flex items-center gap-2 text-blue-600 admin-dark:text-sky-400">
                                                        <span className="font-medium text-xs sm:text-base">{item.title_vi}</span>
                                                    </div>
                                                    <p className="text-gray-500 admin-dark:text-gray-400 text-xs sm:text-base">
                                                        {item.title_en}
                                                    </p>
                                                </div>
                                                <div className="flex w-full md:w-fit lg:w-full xl:w-fit justify-end gap-2">
                                                    <Button theme="admin"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setSelectedServiceMini(item);
                                                            setIsGroupServiceModalOpen(true);
                                                        }}
                                                        className="cursor-pointer bg-gray-200 hover:bg-gray-300 shadow admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800"
                                                    >
                                                        <Crosshair className="w-4 h-4 text-gray-600 admin-dark:text-gray-100" />
                                                    </Button>

                                                    <Button theme="admin"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingItem(item.id)}
                                                        className="cursor-pointer shadow border-none bg-gray-200 hover:bg-gray-300 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800"
                                                    >
                                                        <Edit2 className="w-4 h-4 text-gray-600 admin-dark:text-gray-100" />
                                                    </Button>
                                                    <Button theme="admin"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => triggerDeleteMiniService(item)}
                                                        className="cursor-pointer shadow border-none bg-gray-200 hover:bg-gray-300 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600 hover:text-red-700 admin-dark:text-red-500 admin-dark:hover:text-red-400" />
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
                    serviceGroupCurrentStage={servicesStage}
                    stageMaster={stageMaster}
                />
            )}
        </div>
    );
}

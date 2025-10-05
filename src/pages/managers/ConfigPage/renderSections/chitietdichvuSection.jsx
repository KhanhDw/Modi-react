import NotificationToast from "@/components/feature/notification-toast.jsx";
import { useEffect, useState } from "react";
import ConfirmationModal from "./components/ConfirmationModal.jsx";
import { getAllBridge } from "./hook/use_bridge_services_stage_and_list_mini_service.jsx";
import {
  deleteMiniService,
} from "./hook/use_list_mini_service.jsx";
import {
  getAllServices,
  getAllServiceStages,
} from "./hook/use_services_stage.jsx";
import {
  deleteStage,
  getAllStages,
} from "./hook/use_stage_master.jsx";
import ServiceSelectionForGroupServiceModal from "./ServiceSelectionForGroupServiceModal.jsx";
import ServiceSelectionModal from "./ServiceSelectionModal.jsx";
import StageSelector from "./components/StageSelector.jsx";
import StageManager from "./components/StageManager.jsx";
import ServiceManager from "./components/ServiceManager.jsx";
import MiniServiceManager from "./components/MiniServiceManager.jsx";

export default function ChitietdichvuSection() {
  const [selectedServiceMini, setSelectedServiceMini] = useState(null);
  const [stageMaster, setStageMaster] = useState([]);
  const [isEditStage, setIsEditStage] = useState(false);

  // State for confirmation modal and toast
  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [toastState, setToastState] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  // Helper to show toast
  const showToast = (message, type = "success") => {
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
        const service = serviceResult.find(
          (s) => Number(s.id) === Number(st.service_id)
        );
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

  useEffect(() => {
    fetchDataServiceStage();
  }, []);

  const triggerDeleteMiniService = (item, onConfirmAction) => {
    setConfirmModalState({
      isOpen: true,
      title: "Xác nhận xóa hạng mục",
      message: `Bạn có chắc chắn muốn xóa hạng mục \"${item.title_vi}\"? Hành động này không thể hoàn tác.`, // Corrected escaping for double quotes within template literal
      onConfirm: onConfirmAction,
    });
  };

  // fetch stage_master
  const fetchStages = async () => {
    try {
      const data = await getAllStages();
      // Sắp xếp dữ liệu theo 'code' trước khi set state
      const sortedData = data.sort((a, b) => Number(a.code) - Number(b.code));
      setStageMaster(sortedData);
    } catch (err) {
      console.error("Lỗi load stage_master:", err);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  // handle delete
  const triggerDeleteStage = (stage) => {
    setConfirmModalState({
      isOpen: true,
      title: "Xác nhận xóa giai đoạn",
      message: `Bạn có chắc chắn muốn xóa giai đoạn \"${stage.title_vi}\"? Tất cả dịch vụ và hạng mục con liên quan cũng sẽ bị ảnh hưởng.`, // Corrected escaping for double quotes within template literal
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

  const [currentStage, setCurrentStage] = useState(1);
  const [servicesStage, setServicesStage] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupServiceModalOpen, setIsGroupServiceModalOpen] = useState(false);

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
        onClose={() =>
          setConfirmModalState({ ...confirmModalState, isOpen: false })
        }
        onConfirm={() => {
          confirmModalState.onConfirm();
          setConfirmModalState({ ...confirmModalState, isOpen: false });
        }}
        title={confirmModalState.title}
        message={confirmModalState.message}
      />

      <StageSelector
        stageMaster={stageMaster}
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
        isEditStage={isEditStage}
        setIsEditStage={setIsEditStage}
      />

      {isEditStage && (
        <StageManager
            showToast={showToast}
            triggerDelete={triggerDeleteStage}
            stageMaster={stageMaster}
            setStageMaster={setStageMaster}
            fetchStages={fetchStages}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ServiceManager
            stageMaster={stageMaster}
            currentStage={currentStage}
            servicesStage={servicesStage}
            setIsModalOpen={setIsModalOpen}
        />
        <MiniServiceManager
            showToast={showToast}
            triggerDelete={triggerDeleteMiniService}
            setSelectedServiceMini={setSelectedServiceMini}
            setIsGroupServiceModalOpen={setIsGroupServiceModalOpen}
        />
      </div>

      {isModalOpen && (
        <ServiceSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentStage={currentStage}
          onSaved={fetchDataServiceStage}
        />
      )}

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
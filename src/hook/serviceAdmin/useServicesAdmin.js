// src/hook/serviceAdmin/useServicesAdmin.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ServiceAPI } from "@/api/serviceAPI";

export const useServicesAdmin = (onActionComplete) => {
  const queryClient = useQueryClient();

  // Query để fetch services
  const {
    data: services = [],
    isLoading: loadingServices,
    error: servicesError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch(ServiceAPI.getALL());
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : [];
    },
  });

  // Mutation để tạo service mới
  const createMutation = useMutation({
    mutationFn: async (formData) => {
      let bodyData = formData;
      let headers = {};

      if (formData instanceof FormData) {
        bodyData = formData;
      } else {
        bodyData = JSON.stringify(formData);
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/services`,
        {
          method: "POST",
          body: bodyData,
          headers,
        }
      );

      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      onActionComplete?.();
    },
    onError: (error) => {
      console.error("Lỗi khi tạo service:", error);
    },
  });

  // Mutation để tạo service translation
  const createTranslationMutation = useMutation({
    mutationFn: async ({ formData, id }) => {
      const payload = {
        service_id: id,
        lang: formData.get("lang"),
        ten_dich_vu: formData.get("ten_dich_vu"),
        slug: formData.get("slug"),
        mo_ta: formData.get("mo_ta"),
        features: formData.get("features"),
        details: formData.get("details"),
      };

      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/services/service-translations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Có lỗi xảy ra khi tạo bản dịch");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      onActionComplete?.();
    },
    onError: (error) => {
      console.error("Lỗi khi tạo bản dịch:", error);
    },
  });

  // Mutation để update service
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const dataServiceUpdate = services.find((s) => s.id === id);
      const getTotalLang = dataServiceUpdate?.totalLanguages?.includes(
        formData.get("lang")
      );

      // Nếu không có ngôn ngữ này, tạo bản dịch mới
      if (!getTotalLang) {
        await createTranslationMutation.mutateAsync({ formData, id });
        return { type: "translation" };
      }

      // Nếu có, update service
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/services/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Cập nhật thất bại");
      return { type: "update", data: result };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      onActionComplete?.();
    },
    onError: (error) => {
      console.error("❌ Lỗi khi update service:", error);
    },
  });

  // Mutation để delete service
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/services/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Error when delete service");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
    onError: (error) => {
      console.error("Error deleting service:", error);
    },
  });

  return {
    errorsMessage: servicesError?.message,
    services,
    editingService: null, // Bạn có thể quản lý state này riêng nếu cần
    setEditingService: () => {}, // Placeholder - bạn có thể quản lý state này trong component
    loadingServices,
    handleCreateService: createMutation.mutate,
    handleEditService: (formData, id) =>
      updateMutation.mutate({ id, formData }),
    handleDeleteService: deleteMutation.mutate,
    handleRefetchService: () => queryClient.invalidateQueries(["services"]),

    // Thêm các states mutation nếu cần
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

import { useState, useEffect, useCallback } from "react";
import { ServiceAPI } from "@/api/serviceAPI";

export const useServicesAdmin = (onActionComplete) => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [loadingServices, setLoadingServices] = useState(true);

  const fetchServices = useCallback(async () => {
    setLoadingServices(true);
    try {
      const res = await fetch(ServiceAPI.getALL());
      const data = await res.json();
      setServices(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleCreateService = async (formData) => {
    try {
      console.log("Dữ liệu nhận từ form:", formData);

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
      console.log("Tạo dịch vụ thành công:", result);
      await fetchServices();
      onActionComplete();
    } catch (err) {
      console.error("Lỗi khi tạo dịch vụ:", err);
    }
  };

  const handleCreateServiceTranslation = async (formData, id) => {
    try {
      console.log("Dữ liệu nhận từ form (translation):", formData);

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

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

      console.log("Tạo bản dịch thành công:", result);
      await fetchServices();
      onActionComplete();
    } catch (err) {
      console.error("Lỗi khi tạo bản dịch:", err);
    }
  };

  const handleEditService = async (formData, id) => {
    try {
      const dataServiceUpdate = services.find((s) => s.id === id);
      const getTotalLang = dataServiceUpdate.totalLanguages.includes(
        formData.get("lang")
      );

      if (!getTotalLang) {
        await handleCreateServiceTranslation(formData, id);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/services/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Cập nhật thất bại");
      console.log("✅ Update thành công:", result);
      await fetchServices();
      onActionComplete();
    } catch (error) {
      console.error("❌ Lỗi khi update service:", error.message);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const res = await fetch(ServiceAPI.delete(id), {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error when delete service");
      }
      await fetchServices();
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return {
    services,
    editingService,
    setEditingService,
    loadingServices,
    handleCreateService,
    handleEditService,
    handleDeleteService,
    handleRefetchService: fetchServices,
  };
};

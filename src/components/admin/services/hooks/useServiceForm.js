import { useState, useEffect } from "react";

// Custom hook quản lý logic của form Service
export const useServiceForm = (
  editingService,
  handleCreateService,
  handleEditService,
  formData,
  setFormData
) => {
  const [lang, setLang] = useState("vi");
  const [errors, setErrors] = useState({});

  // Khi edit thì set lại dữ liệu form
  useEffect(() => {
    if (editingService?.id) {
      setFormData({
        ten_dich_vu: editingService.ten_dich_vu || "",
        mo_ta: editingService.mo_ta || "",
        floor_price: editingService.floor_price || "",
        slug: editingService.slug || "",
        image_url: editingService.image_url || "",
        features: editingService.features || "",
        details: editingService.details || "",
      });
    }
  }, [editingService?.id, setFormData]);

  // Validate dữ liệu form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.ten_dich_vu?.trim()) {
      newErrors.ten_dich_vu = "Tên dịch vụ không được bỏ trống";
    }

    if (!formData.slug?.trim()) {
      newErrors.slug = "Đoạn định danh URL (slug) không được bỏ trống";
    }

    if (!formData.mo_ta?.trim()) {
      newErrors.mo_ta = "Mô tả không được bỏ trống";
    }

    const priceRaw = formData.floor_price
      ? String(formData.floor_price).replace(/[^0-9]/g, "")
      : "";
    if (priceRaw === "" || isNaN(Number(priceRaw)) || Number(priceRaw) < 0) {
      newErrors.floor_price = "Giá phải là số và không âm";
    }

    if (formData.image_url) {
      if (typeof formData.image_url === "string") {
        if (!formData.image_url.trim()) {
          newErrors.image_url = "Ảnh dịch vụ không hợp lệ";
        }
      } else if (formData.image_url instanceof File) {
        // ✅ Check dung lượng file
        if (formData.image_url.size > 10 * 1024 * 1024) {
          newErrors.image_url = "Ảnh không được lớn hơn 10MB";
        }
      } else {
        newErrors.image_url = "Ảnh dịch vụ không hợp lệ";
      }
    }

    if (formData.features && typeof formData.features !== "string") {
      newErrors.features = "Features phải là chuỗi (ngăn bằng '#')";
    }

    if (formData.details && typeof formData.details !== "string") {
      newErrors.details = "Details phải là chuỗi (ngăn bằng '#')";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update dữ liệu trong form
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const priceRaw = formData.floor_price
      ? String(formData.floor_price).replace(/[^0-9]/g, "")
      : "";

    const submitData = new FormData();
    submitData.append("ten_dich_vu", formData.ten_dich_vu);
    submitData.append("slug", formData.slug);
    submitData.append("lang", lang);
    submitData.append("mo_ta", formData.mo_ta);
    submitData.append("features", formData.features || "");
    submitData.append("details", formData.details || "");
    submitData.append("floor_price", priceRaw ? Number(priceRaw) : 0);
    submitData.append("booking_count", 0);
    submitData.append("status", formData.status || "Active");

    // 👉 Nếu user upload file thì append file, nếu không thì append string
    if (formData.image_url instanceof File) {
      submitData.append("image_url", formData.image_url);
    } else if (
      typeof formData.image_url === "string" &&
      formData.image_url.trim()
    ) {
      submitData.append("image_url", formData.image_url);
    }

    // ✅ log FormData an toàn
    for (let [key, value] of submitData.entries()) {
      console.log(key, value);
    }

    console.log("editingService::", editingService);
    if (!editingService) {
      handleCreateService(submitData);
    } else {
      console.log("-----", editingService.id);
      handleEditService(submitData, editingService.id);
    }
  };

  return {
    lang,
    errors,
    handleChange,
    handleSubmit,
    setLang,
  };
};

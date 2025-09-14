import { useState, useEffect } from "react";
import { UploadAPI } from "@/api/serviceAPI";
import { processExcelFile } from "../utils/fileProcessor";

// Custom hook quản lý toàn bộ logic của form
export const useServiceForm = (
  editingService,
  handleCreateService,
  handleEditService
) => {
  // Tất cả các state được chuyển vào đây
  const [formData, setFormData] = useState({});
  const [dataArticle, setDataArticle] = useState(null);
  const [partOfArticle, setPartOfArticle] = useState({});
  const [selectedType, setSelectedType] = useState("content");
  const [isAddingParagraph, setIsAddingParagraph] = useState(false);
  const [isEditingParagraph, setIsEditingParagraph] = useState(false);
  const [editKey, setEditKey] = useState(null);
  const [lang, setLang] = useState("vi");
  const [errors, setErrors] = useState({});
  const [paraErrors, setParaErrors] = useState({});
  const [counters, setCounters] = useState({
    content: 1,
    img: 1,
    tbl: 1,
    link: 1,
  });

  useEffect(() => {
    if (editingService) {
      setFormData({
        serviceName: editingService.ten_dich_vu || "",
        desc: editingService.mo_ta || "",
        price: editingService.price || "",
        header: editingService.headerTitle || "",
        content: editingService.content || "",
      });
    } else {
      setFormData({});
      setDataArticle(null);
    }
  }, [editingService]);

  // Lỗi 2: Xóa dấu `/` thừa và sửa lại comment
  const validateForm = () => {
    const newErrors = {};
    // 🔹 Tên dịch vụ
    if (
      typeof formData.serviceName !== "string" ||
      !formData.serviceName.trim()
    ) {
      newErrors.serviceName = "Tên dịch vụ không được bỏ trống";
    }

    // 🔹 Mô tả
    if (typeof formData.desc !== "string" || !formData.desc.trim()) {
      newErrors.desc = "Mô tả không được bỏ trống";
    }

    // 🔹 Giá
    if (
      formData.price === null ||
      formData.price === undefined ||
      formData.price === "" ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      newErrors.price = "Giá phải là số và không âm";
    }

    // 🔹 Trường chỉ check khi thêm mới (không phải edit)
    if (!editingService) {
      if (typeof formData.header !== "string" || !formData.header.trim()) {
        newErrors.header = "Tiêu đề bài viết không được bỏ trống";
      }

      if (
        !dataArticle ||
        typeof dataArticle !== "object" ||
        Object.keys(dataArticle).length === 0
      ) {
        newErrors.dataArticle = "Bài viết phải có ít nhất một phần nội dung";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateParagraph = (type, part) => {
    const newErrors = {};

    if (type === "content") {
      if (!part.paraTitle?.trim())
        newErrors.paraTitle = "Tiêu đề đoạn văn không được bỏ trống";
      if (!part.paragraph?.trim())
        newErrors.paragraph = "Nội dung đoạn văn không được bỏ trống";
      if (!part.subPara?.trim())
        newErrors.subPara = "Nội dung nhỏ không được bỏ trống";
    }

    if (type === "img") {
      if (!part.imgTitle?.trim())
        newErrors.imgTitle = "Tiêu đề ảnh không được bỏ trống";
      if (!part.img) newErrors.img = "Phải chọn ảnh";
      if (!part.imgPara?.trim())
        newErrors.imgPara = "Nội dung ảnh không được bỏ trống";
      if (!part.imgSubPara?.trim())
        newErrors.imgSubPara = "Nội dung nhỏ không được bỏ trống";
    }

    if (type === "tbl") {
      if (!part.tblTitle?.trim())
        newErrors.tblTitle = "Tiêu đề bảng không được bỏ trống";
      if (
        !part.tbl ||
        (!(part.tbl instanceof File) && !Array.isArray(part.tbl))
      ) {
        newErrors.tbl = "Phải chọn file dữ liệu hợp lệ";
      }
      if (!part.tblPara?.trim())
        newErrors.tblPara = "Nội dung bảng không được bỏ trống";
      if (!part.tblSubPara?.trim())
        newErrors.tblSubPara = "Nội dung nhỏ không được bỏ trống";
    }

    if (type === "link") {
      if (!part.linkTitle?.trim())
        newErrors.linkTitle = "Tiêu đề liên kết không được bỏ trống";
      if (!part.link?.trim() || !/^https?:\/\/.+/.test(part.link))
        newErrors.link = "URL không hợp lệ";
      if (!part.linkPara?.trim())
        newErrors.linkPara = "Nội dung liên kết không được bỏ trống";
      if (!part.linkSubPara?.trim())
        newErrors.linkSubPara = "Nội dung nhỏ không được bỏ trống";
    }

    setParaErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeForArticle = (field, value) => {
    setPartOfArticle((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitParagraph = async () => {
    if (!validateParagraph(selectedType, partOfArticle)) return;

    let updatedArticle = { ...partOfArticle };
    let key = isEditingParagraph
      ? editKey
      : `${selectedType}${counters[selectedType]}`;

    try {
      if (selectedType === "img" && updatedArticle.img instanceof File) {
        const data = new FormData();
        data.append("image", updatedArticle.img);
        const res = await fetch(UploadAPI.uploadImg(), {
          method: "POST",
          body: data,
        });
        if (!res.ok) throw new Error("Upload failed");
        const result = await res.json();
        if (result.success) updatedArticle.img = result.data.url;
      }
    } catch (err) {
      console.error("Error processing file:", err);
      return;
    }

    const newData = { ...dataArticle, [key]: updatedArticle };
    setDataArticle(newData);
    if (!isEditingParagraph) {
      setCounters((prev) => ({
        ...prev,
        [selectedType]: prev[selectedType] + 1,
      }));
    }

    setIsAddingParagraph(false);
    setIsEditingParagraph(false);
    setEditKey(null);
    setPartOfArticle({});
    setSelectedType("content");
    setParaErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log(formData);
    const priceRaw = formData.price
      ? formData.price.replace(/[^0-9]/g, "")
      : "";
    const submitData = {
      ...formData,
      price: priceRaw ? Number(priceRaw) : 0,
      lg: lang,
      content: dataArticle,
    };
    console.log("submit: ", submitData);

    if (!editingService) {
      handleCreateService(submitData);
    } else {
      handleEditService(submitData, editingService.service_id);
    }

    setDataArticle(null);
    setPartOfArticle({});
  };

  // Lỗi 1: Các hàm này phải được định nghĩa ở ngoài hàm `handleSubmit`
  const openAddParagraph = () => setIsAddingParagraph(true);

  const handleCancelAddParagraph = () => {
    setIsAddingParagraph(false);
    setIsEditingParagraph(false);
    setEditKey(null);
    setPartOfArticle({});
    setSelectedType("content");
  };

  const handleEditParagraph = (key, value) => {
    const type = key.replace(/[0-9]/g, "");
    setEditKey(key);
    setPartOfArticle(value);
    setSelectedType(type);
    setIsEditingParagraph(true);
    setIsAddingParagraph(true);
  };

  const handleDeleteParagraph = (key) => {
    setDataArticle((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // Lỗi 1: Câu lệnh `return` phải nằm ở cấp cao nhất của hook
  return {
    formData,
    dataArticle,
    partOfArticle,
    selectedType,
    isAddingParagraph,
    isEditingParagraph,
    lang,
    errors,
    paraErrors,
    handleChange,
    handleChangeForArticle,
    handleSubmit,
    handleSubmitParagraph,
    openAddParagraph,
    handleCancelAddParagraph,
    handleEditParagraph,
    handleDeleteParagraph,
    setSelectedType,
    setPartOfArticle,
    setLang,
  };
};

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOutletContext } from "react-router-dom";
import NotificationToast from "@/components/feature/notification-toast.jsx";
import { X, Upload, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLenisLocal from "@/hook/useLenisLocal";
import CustomSelect from "./CustomSelect";
import BankDropdown from "@/components/feature/SelectBank";

// options cho type
const typeOptions = [
  { value: "new", label: "Khách mới" },
  { value: "regular", label: "Khách thường xuyên" },
  { value: "vip", label: "Khách VIP" },
  { value: "old", label: "Khách cũ" }
];

// options cho status
const statusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

export default function CustomerForm() {
  const {
    handleClose,
    editingCustomer,
    handleEditingCustomer,
    initDataCustomer,
  } = useOutletContext();

  useLenisLocal(".lenis-local");


  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    type: "new",
    cccd: "",
    img_cccd_top: null,
    img_cccd_bottom: null,
    img_cccd_top_file: null, // temp to save file image
    img_cccd_bottom_file: null, // temp to save file image
    number_bank: "",
    name_bank: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingCustomer) {
      setFormData((prev) => ({
        ...prev,
        name: editingCustomer.name ?? "",
        phone: editingCustomer.phone ?? "",
        email: editingCustomer.email ?? "",
        address: editingCustomer.address ?? "",
        cccd: editingCustomer.cccd ?? "",
        img_cccd_top: editingCustomer.img_cccd_top ?? "",
        img_cccd_bottom: editingCustomer.img_cccd_bottom ?? "",
        number_bank: editingCustomer.number_bank ?? "",
        name_bank: editingCustomer.name_bank ?? editingCustomer.bank_code ?? "",
        type: editingCustomer.type ?? "new",
        status: editingCustomer.status ?? "active",
      }));
    }
  }, [editingCustomer]);

  const inputClass =
    "mt-1 block w-full px-3 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-600 shadow-sm bg-white admin-dark:bg-gray-700 text-gray-900 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors";
  const labelClass =
    "block text-sm font-medium text-gray-700 admin-dark:text-gray-300";

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        (type === "number" ||
          ["total_spent", "booking_count"].includes(name)) &&
          value !== ""
          ? Number(value)
          : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (file) {
      if (!file.type.startsWith("image/")) {
        setToast({
          message: "File không hợp lệ. Vui lòng chọn file ảnh.",
          type: "error",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setToast({ message: "Ảnh quá lớn (tối đa 10MB)", type: "error" });
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        [name]: previewUrl, // dùng để preview UI
        [`${name}_file`]: file, // dùng để gửi lên server
      }));
    }
  };

  const handleRemoveImage = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: "",
      [`${name}_file`]: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Tên khách hàng là bắt buộc.";

    if (!formData.phone?.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc.";
    } else if (!/^0\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại phải bắt đầu bằng 0 và gồm 10 số.";
    } else if (
      initDataCustomer?.some(
        (c) => c.phone === formData.phone.trim() && c.id !== editingCustomer?.id
      )
    ) {
      newErrors.phone = "Số điện thoại đã tồn tại.";
    }

    if (formData.email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Email không hợp lệ.";
      } else if (
        initDataCustomer?.some(
          (c) =>
            c.email === formData.email.trim() && c.id !== editingCustomer?.id
        )
      ) {
        newErrors.email = "Email đã tồn tại.";
      }
    }

    if (!formData.address?.trim()) newErrors.address = "Địa chỉ là bắt buộc.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("phone", formData.phone);
      payload.append("email", formData.email);
      payload.append("address", formData.address);
      payload.append("type", formData.type);
      payload.append("cccd", formData.cccd);
      payload.append("img_cccd_bottom", formData.img_cccd_bottom);
      payload.append("number_bank", formData.number_bank);
      payload.append("name_bank", formData.name_bank);
      payload.append("status", formData.status);

      // append file gốc, nếu có
      if (formData.img_cccd_top_file) {
        payload.append("img_cccd_top", formData.img_cccd_top_file);
      }
      if (formData.img_cccd_bottom_file) {
        payload.append("img_cccd_bottom", formData.img_cccd_bottom_file);
      }

      if (editingCustomer) {
        await handleEditingCustomer(payload, editingCustomer?.id);
      }

      setToast({ message: "Cập nhật khách hàng thành công!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({
        message: err?.message ? `Lỗi: ${err.message}` : "Cập nhật thất bại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const ImageUploadField = ({ name, label, imageUrl, onChange, onRemove }) => {
    const getImageUrl = (url) => {
      if (!url) return null;
      if (
        url.startsWith("blob:") ||
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("data:image")
      ) {
        return url;
      }
      return `${import.meta.env.VITE_MAIN_BE_URL}${url}`;
    };

    const finalUrl = getImageUrl(imageUrl);

    return (
      <div className="space-y-2">
        <Label
          htmlFor={name}
          className="block text-sm font-medium"
        >
          {label}
        </Label>

        {!finalUrl ? (
          <label
            htmlFor={name}
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 admin-dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 admin-dark:bg-gray-700 hover:bg-gray-100 admin-dark:hover:bg-gray-600 transition-colors"
          >
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 admin-dark:text-gray-400">
              <span className="font-semibold">Click để tải ảnh</span> hoặc kéo
              thả
            </p>
            <p className="text-xs text-gray-500 admin-dark:text-gray-400">
              PNG, JPG (Tối đa 10MB)
            </p>
          </label>
        ) : (
          <div className="relative group">
            <img
              src={finalUrl}
              alt={name}
              className="w-full max-h-48 object-contain rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-gray-50 admin-dark:bg-gray-700"
              onError={(e) => {
                console.error("Error loading image:", finalUrl);
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3ELỗi tải ảnh%3C/text%3E%3C/svg%3E";
              }}
            />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <label
                htmlFor={name}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer shadow-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
              </label>
              <button
                type="button"
                onClick={() => onRemove(name)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* input file chung, trigger bằng label */}
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
      </div>
    );
  };

  return (
    <ScrollArea className="lenis-local w-full h-full" data-lenis-prevent>
      <div className="bg-white admin-dark:bg-gray-800 w-full h-full mx-auto p-3 md:p-5">
        <div className="relative w-full">
          <div className="flex flex-col items-start sm:items-center w-full mb-8 mt-2">
            <span className="text-base sm:text-lg md:text-xl font-bold uppercase text-gray-900 admin-dark:text-gray-100">
              Chỉnh sửa người dùng
            </span>
          </div>
          <button
            aria-label="Đóng"
            onClick={handleClose}
            className="absolute -top-1 right-0 rounded-full p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 admin-dark:hover:bg-gray-700 admin-dark:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="bg-white admin-dark:bg-gray-800 w-full h-full mx-auto mt-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-semibold border-b border-gray-300 admin-dark:border-gray-700 pb-2 text-blue-600 admin-dark:text-blue-400">
                    Thông Tin Liên Hệ
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        className={labelClass}
                        htmlFor="name"
                      >
                        Tên khách hàng *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Nguyễn Văn A"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <Label
                        className={labelClass}
                        htmlFor="phone"
                      >
                        Số điện thoại *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="0901234567"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <Label
                        className={labelClass}
                        htmlFor="email"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="tenkhach@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <Label
                        className={labelClass}
                        htmlFor="address"
                      >
                        Địa chỉ *
                      </Label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        className={inputClass}
                        placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-base md:text-lg font-semibold border-b border-gray-300 admin-dark:border-gray-700 pb-2 text-blue-600 admin-dark:text-blue-400">
                    Thông Tin Ngân Hàng
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label
                        className={labelClass}
                        htmlFor="number_bank"
                      >
                        Số tài khoản ngân hàng
                      </Label>
                      <Input
                        id="number_bank"
                        name="number_bank"
                        value={formData.number_bank}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="101010xxxxxx"
                      />
                    </div>

                    <div>
                      <Label
                        className={labelClass}
                        htmlFor="name_bank"
                      >
                        Tên ngân hàng
                      </Label>
                      <BankDropdown
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className={labelClass}>Loại khách hàng</Label>
                    <CustomSelect
                      value={formData.type}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, type: val }))}
                      placeholder="Chọn loại khách hàng"
                      options={typeOptions}
                      openUp={true}
                    />
                  </div>

                  <div>
                    <Label className={labelClass}>Trạng thái</Label>
                    <CustomSelect
                      value={formData.status}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                      placeholder="Chọn trạng thái"
                      options={statusOptions}
                      openUp={true}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-semibold border-b border-gray-300 admin-dark:border-gray-700 pb-2 text-blue-600 admin-dark:text-blue-400">
                    Thông Tin Định Danh & Ảnh
                  </h3>

                  <div>
                    <Label
                      className={labelClass}
                      htmlFor="cccd"
                    >
                      Số CCCD/CMND
                    </Label>
                    <Input
                      id="cccd"
                      name="cccd"
                      value={formData.cccd}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="001200xxxxxx"
                    />
                  </div>

                  <ImageUploadField
                    name="img_cccd_top"
                    label="Ảnh CCCD (Mặt trước)"
                    imageUrl={formData.img_cccd_top}
                    onChange={handleImageUpload}
                    onRemove={handleRemoveImage}
                  />

                  <ImageUploadField
                    name="img_cccd_bottom"
                    label="Ảnh CCCD (Mặt sau)"
                    imageUrl={formData.img_cccd_bottom}
                    onChange={handleImageUpload}
                    onRemove={handleRemoveImage}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-3 mt-4 w-full">
              <Button
                type="submit"
                className="w-fit text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
                disabled={loading}
              >
                <span className="text-sm md:text-base font-semibold">{loading ? "Đang cập nhật..." : "Cập nhật người dùng"}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-fit sm:w-40 cursor-pointer bg-black hover:bg-black/80 admin-dark:hover:bg-black/70"
                onClick={handleClose}
              >
                <span className="text-sm md:text-base font-semibold text-white">Thoát</span>
              </Button>
            </div>
          </form>

          {toast && (
            <NotificationToast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </div>
    </ScrollArea>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

// Hàm chuyển text thành slug
const toSlug = (str) => {
  return str
    .normalize("NFD") // chuẩn unicode
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/đ/gi, "d") // chuyển đ hoặc Đ thành d
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-"); // khoảng trắng -> -
};


export default function ServiceDetailsForm({
  formData,
  errors,
  handleChange,
}) {
  const [preview, setPreview] = useState(null);

  const handleNameChange = (value) => {
    handleChange("ten_dich_vu", value);
    handleChange("slug", toSlug(value));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 👉 Chỉ tạo preview local, không upload
    setPreview(URL.createObjectURL(file));

    // Nếu bạn vẫn muốn lưu file gốc vào formData:
    handleChange("image_url", file);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
      {/* Tên dịch vụ */}
      <div className="space-y-2">
        <Label className="text-black admin-dark:text-gray-100" htmlFor="ten_dich_vu">
          Tên dịch vụ *
        </Label>
        <Input
          className="text-black border border-black/30 admin-dark:text-gray-100"
          id="ten_dich_vu"
          value={formData.ten_dich_vu || ""}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Nhập tên dịch vụ"
        />
        {errors.ten_dich_vu && (
          <p className="text-red-500 text-sm">{errors.ten_dich_vu}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label className="text-black admin-dark:text-gray-100" htmlFor="slug">
          Đoạn định danh URL *
        </Label>
        <Input
          className="text-black border border-black/30 bg-gray-100 cursor-not-allowed admin-dark:text-gray-100"
          id="slug"
          value={formData.slug || ""}
          readOnly
        />
        {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
      </div>

      {/* Giá */}
      <div className="space-y-2">
        <Label className="text-black admin-dark:text-gray-100" htmlFor="floor_price">
          Giá thấp nhất có thể chấp nhận (VND) *
        </Label>
        <Input
          className="text-black border border-black/30 admin-dark:text-gray-100"
          id="floor_price"
          type="text"
          value={formData.floor_price ? Number(formData.floor_price).toLocaleString("vi-VN") : ""}

          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            handleChange("floor_price", raw);
          }}
          placeholder="Nhập giá của dịch vụ"
        />
        {errors.floor_price && <p className="text-red-500 text-sm">{errors.floor_price}</p>}
      </div>

      {/* Mô tả */}
      <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
        <Label className="text-black admin-dark:text-gray-100" htmlFor="mo_ta">
          Mô tả *
        </Label>
        <Textarea
          className="text-black border border-black/30 focus:border-none admin-dark:text-gray-100"
          id="mo_ta"
          value={formData.mo_ta || ""}
          onChange={(e) => handleChange("mo_ta", e.target.value)}
          placeholder="Nhập mô tả dịch vụ"
        />
        {errors.mo_ta && <p className="text-red-500 text-sm">{errors.mo_ta}</p>}
      </div>

      {/* Ảnh dịch vụ */}
      <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-2 w-full">
        <Label className="text-black admin-dark:text-gray-100" htmlFor="image_url">
          Ảnh dịch vụ
        </Label>
        <div className="flex flex-col items-start gap-4 w-full">
          <Input
            className="text-black border border-black/30 w-full admin-dark:text-gray-100"
            id="image_url"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {/* Nếu có preview thì ưu tiên hiển thị, không thì lấy từ server */}
          {(preview || formData.image_url) && (
            <img
              src={
                preview ||
                (formData.image_url?.startsWith("http")
                  ? formData.image_url
                  : `${import.meta.env.VITE_MAIN_BE_URL}${formData.image_url}`)
              }
              alt="Ảnh dịch vụ"
              className="max-h-42 rounded w-full object-contain border"
              style={{ minWidth: "120px" }}
            />
          )}
        </div>
        {errors.image_url && (
          <p className="text-red-500 text-sm">{errors.image_url}</p>
        )}
      </div>

      {/* Features */}
      <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
        <Label className="text-black admin-dark:text-gray-100" htmlFor="features">
          Tính năng nổi bật
        </Label>
        <Textarea
          className="text-black border border-black/30 focus:border-none admin-dark:text-gray-100"
          id="features"
          value={formData.features || ""}
          onChange={(e) => handleChange("features", e.target.value)}
          placeholder="Nhập các tính năng nổi bật, cách nhau bởi dấu #"
        />
        {errors.features && (
          <p className="text-red-500 text-sm">{errors.features}</p>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
        <Label className="text-black admin-dark:text-gray-100" htmlFor="details">
          Chi tiết dịch vụ
        </Label>
        <Textarea
          className="text-black border border-black/30 focus:border-none admin-dark:text-gray-100"
          id="details"
          value={formData.details || ""}
          onChange={(e) => handleChange("details", e.target.value)}
          placeholder="Nhập chi tiết dịch vụ, cách nhau bởi dấu #"
        />
        {errors.details && (
          <p className="text-red-500 text-sm">{errors.details}</p>
        )}
      </div>
    </div>
  );
}

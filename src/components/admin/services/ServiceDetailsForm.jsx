import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, parseCurrency } from "./utils/formatters";
import { UploadAPI } from "@/api/serviceAPI";

export default function ServiceDetailsForm({
  formData,
  errors,
  handleChange,
  editingService,
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
      {/* Tên dịch vụ */}
      <div className="space-y-2">
        <Label className="text-black" htmlFor="serviceName">
          Tên dịch vụ *
        </Label>
        <Input
          className="text-black border border-black/30"
          id="serviceName"
          value={formData.serviceName || ""}
          onChange={(e) => handleChange("serviceName", e.target.value)}
          placeholder="Nhập tên dịch vụ"
        />
        {errors.serviceName && (
          <p className="text-red-500 text-sm">{errors.serviceName}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label className="text-black" htmlFor="slug">
          Slug *
        </Label>
        <Input
          className="text-black border border-black/30"
          id="slug"
          value={formData.slug || ""}
          onChange={(e) => handleChange("slug", e.target.value)}
          placeholder="Nhập slug cho dịch vụ"
        />
        {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
      </div>

      {/* Giá */}
      <div className="space-y-2">
        <Label className="text-black" htmlFor="price">
          Giá
        </Label>
        <Input
          className="text-black border border-black/30"
          id="price"
          type="text"
          value={
            formData.price
              ? Number(formData.price).toLocaleString("vi-VN")
              : "0"
          }
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            handleChange("price", raw);
          }}
          placeholder="Nhập giá của dịch vụ"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>

      {/* Mô tả */}
      <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
        <Label className="text-black" htmlFor="description">
          Mô tả *
        </Label>
        <Textarea
          className="text-black border border-black/30"
          id="description"
          value={formData.desc || ""}
          onChange={(e) => handleChange("desc", e.target.value)}
          placeholder="Nhập mô tả dịch vụ"
        />
        {errors.desc && <p className="text-red-500 text-sm">{errors.desc}</p>}
      </div>

      {/* Ảnh dịch vụ */}
      <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3 w-full">
        <Label className="text-black" htmlFor="image_url">
          Ảnh dịch vụ
        </Label>
        <div className="flex items-center gap-4 w-full">
          <Input
            className="text-black border border-black/30 w-1/2"
            id="image_url"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              const formDataUpload = new FormData();
              formDataUpload.append("image", file);
              try {
                const res = await fetch(UploadAPI.uploadImg(), {
                  method: "POST",
                  body: formDataUpload,
                });
                const result = await res.json();
                if (result.success && result.data?.url) {
                  handleChange("image_url", result.data.url);
                } else {
                  handleChange("image_url", "");
                  alert("Upload ảnh thất bại");
                }
              } catch (err) {
                handleChange("image_url", "");
                alert("Lỗi upload ảnh");
              }
            }}
          />
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt="Ảnh dịch vụ"
              className="max-h-32 rounded w-1/2 object-contain border"
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
        <Label className="text-black" htmlFor="features">
          Tính năng nổi bật
        </Label>
        <Textarea
          className="text-black border border-black/30"
          id="features"
          value={formData.features || ""}
          onChange={(e) => handleChange("features", e.target.value)}
          placeholder="Nhập các tính năng nổi bật, cách nhau bởi dấu phẩy hoặc xuống dòng"
        />
        {errors.features && (
          <p className="text-red-500 text-sm">{errors.features}</p>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
        <Label className="text-black" htmlFor="details">
          Chi tiết dịch vụ
        </Label>
        <Textarea
          className="text-black border border-black/30"
          id="details"
          value={formData.details || ""}
          onChange={(e) => handleChange("details", e.target.value)}
          placeholder="Nhập chi tiết dịch vụ"
        />
        {errors.details && (
          <p className="text-red-500 text-sm">{errors.details}</p>
        )}
      </div>
    </div>
  );
}

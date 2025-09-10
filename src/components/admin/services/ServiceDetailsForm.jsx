import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, parseCurrency } from "./utils/formatters";

export default function ServiceDetailsForm({
  formData,
  errors,
  handleChange,
  editingService,
}) {
  return (
    <div
      className={`flex ${editingService ? `flex-col` : ""
        } justify-between gap-6`}
    >
      <div className="space-y-2 flex-1/3">
        <Label className="text-black" htmlFor="serviceName">Tên dịch vụ *</Label>
        <Input
          className="text-black border border-black/30"
          id="serviceName"
          value={formData.serviceName || ""}
          onChange={(e) => handleChange("serviceName", e.target.value)}
          placeholder="Nhập tên dịch vụ"
        />
        {errors.serviceName && (<p className="text-red-500 text-sm">{errors.serviceName}</p>)}
      </div>

      <div className="space-y-2 flex-1/3">
        <Label className="text-black" htmlFor="description">Mô tả *</Label>
        <Textarea
          className="text-black border border-black/30"
          id="description"
          value={formData.desc || ""}
          onChange={(e) => handleChange("desc", e.target.value)}
          placeholder="Nhập mô tả dịch vụ"
        />
        {errors.desc && <p className="text-red-500 text-sm">{errors.desc}</p>}
      </div>

      <div className="space-y-2 flex-1/3">
        <Label className="text-black" htmlFor="price">Giá</Label>
        <Input
          className="text-black border border-black/30"
          id="price"
          type="text"
          value={formatCurrency(formData.price)}
          onChange={(e) => handleChange("price", parseCurrency(e.target.value))}
          placeholder="Nhập giá của dịch vụ"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>
    </div>
  );
}
import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, Target, DollarSign } from "lucide-react";

export default function CampaignForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    budget: initialData?.budget || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    status: initialData?.status || "planned",
    targetAudience: initialData?.targetAudience || "",
    objectives: initialData?.objectives || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 admin-dark:text-gray-100">
          <Target className="h-5 w-5" />
          {initialData ? "Chỉnh sửa chiến dịch" : "Tạo chiến dịch mới"}
        </CardTitle>
        <CardDescription>
          {initialData
            ? "Cập nhật thông tin chiến dịch"
            : "Điền thông tin để tạo chiến dịch marketing mới"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên chiến dịch *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="VD: Summer Sale 2024"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Ngân sách (VNĐ) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                  placeholder="5000000"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả chiến dịch</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Mô tả mục tiêu và nội dung chiến dịch..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu *</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc *</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Đang lên kế hoạch</SelectItem>
                  <SelectItem value="running">Đang chạy</SelectItem>
                  <SelectItem value="paused">Tạm dừng</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Đối tượng mục tiêu</Label>
              <Input
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => handleChange("targetAudience", e.target.value)}
                placeholder="VD: Nam 25-35 tuổi, thu nhập cao"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">Mục tiêu chiến dịch</Label>
            <Textarea
              id="objectives"
              value={formData.objectives}
              onChange={(e) => handleChange("objectives", e.target.value)}
              placeholder="VD: Tăng 20% doanh số, thu hút 1000 khách hàng mới..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? "Cập nhật chiến dịch" : "Tạo chiến dịch"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent"
            >
              Hủy
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

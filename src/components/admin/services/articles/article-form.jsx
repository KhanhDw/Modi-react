import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function ArticleServiceForm() {
  const {
    editingService,
    handleEditService,
    handleClose,
    handleCreateService,
  } = useOutletContext();

  const [formData, setFormData] = useState({
    serviceName: editingService?.serviceName || "",
    decs: editingService?.desc || "",
    price: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateService(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  if (editingService) {
    console.log(editingService);
  }
  return (
    <>
      <Card className="bg-white w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Target className="h-5 w-5" />
            {editingService ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}
          </CardTitle>
          <CardDescription className="text-black/50">
            {editingService
              ? "Cập nhật thông tin dịch vụ"
              : "Điền thông tin để tạo dịch vụ mới"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 hover:bg-gray-500/25">
                {editingService ? "Cập nhật chiến dịch" : "Tạo chiến dịch"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

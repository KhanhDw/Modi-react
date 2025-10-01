import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLenisLocal from "@/hook/useLenisLocal";
import { Globe, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

// Import hooks và components con
import { useServiceForm } from "./hooks/useServiceForm";
import ServiceDetailsForm from "./ServiceDetailsForm";

export default function ServiceForm() {
  useLenisLocal(".lenis-local");
  const {
    editingService,
    handleEditService,
    handleClose,
    handleCreateService,
  } = useOutletContext();

  const [formData, setFormData] = useState({
    ten_dich_vu: "",
    slug: "",
    lang: "",
    mo_ta: "",
    floor_price: "",
    image_url: null,
    features: "",
    details: "",
    status: "Active"
  });

  const {
    lang,
    errors,
    handleChange,
    handleSubmit,
    setLang,
  } = useServiceForm(
    editingService,
    handleCreateService,
    handleEditService,
    formData,
    setFormData
  );

  useEffect(() => {
    if (editingService) {
      console.log("editingService:::::", editingService);
      // Ưu tiên tiếng Việt, nếu không có thì lấy tiếng Anh
      let translation = editingService.translations?.find((t) => t.lang === lang);

      if (!translation) {
        if (lang === "vi") {
          // Nếu không có tiếng Việt thì lấy tiếng Anh
          translation = editingService.translations?.find((t) => t.lang === "en");
        } else {
          // Nếu đang ở tiếng Anh mà không có thì fallback về tiếng Việt
          translation = editingService.translations?.find((t) => t.lang === "vi");
        }
      }

      setFormData({
        ten_dich_vu: editingService.translation?.ten_dich_vu || "",
        mo_ta: editingService.translation?.mo_ta || "",
        features: editingService.translation?.features || "",
        details: editingService.translation?.details || "",
        slug: editingService.translation?.slug || "",
        lang: lang || "vi",
        // Dữ liệu bảng chính services
        floor_price: editingService.floor_price || "",
        image_url: editingService.image_url || "",
        status: editingService.status || "Active",
      });
    }
  }, [editingService, lang]);



  const handleChangeLang = () => {
    setLang(lang === "vi" ? "en" : "vi");
  };

  return (
    <ScrollArea className="lenis-local w-full h-full" data-lenis-prevent>
      <div className="max-h-screen overflow-y-auto admin-dark:bg-gray-800 rounded-xl">
        <Card Card className="bg-white admin-dark:bg-gray-800 w-full mx-auto" >
          <CardHeader className="relative">
            <CardTitle className="flex gap-2 items-center admin-dark:text-gray-100">
              <Target className="h-5 w-5" />
              {editingService ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}
            </CardTitle>
            <CardDescription className="text-black/50 admin-dark:text-gray-100">
              {editingService
                ? "Cập nhật thông tin dịch vụ"
                : "Điền thông tin để tạo dịch vụ mới"}
            </CardDescription>

            <div className="absolute right-0 top-0 text-black mr-4 rounded-4xl cursor-pointer hover:scale-110">
              <Button
                onClick={handleChangeLang}
                className="flex flex-row gap-2 cursor-pointer bg-green-500/90 hover:bg-green-600/90"
              >
                <Globe className="w-4 h-4 text-white" />
                {lang === "vi" ? (
                  <span className="text-xs font-bold text-white">VI</span>
                ) : (
                  <span className="text-xs font-bold text-white">EN</span>
                )}
              </Button>
            </div>

          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ServiceDetailsForm
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                editingService={editingService}
              />

              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" className="flex-1 hover:bg-gray-500/25 cursor-pointer">
                  {editingService ? "Cập nhật dịch vụ" : "Tạo dịch vụ"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 cursor-pointer"
                >
                  Thoát
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div >
    </ScrollArea>
  );
}

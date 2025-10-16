import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    errorsMessage,
  } = useOutletContext(); //

  const [formData, setFormData] = useState({
    ten_dich_vu: "",
    slug: "",
    lang: "",
    mo_ta: "",
    floor_price: "",
    image_url: null,
    features: "",
    details: "",
    status: "Active",
  });

  const { lang, errors, handleChange, handleSubmit, setLang } = useServiceForm(
    editingService,
    handleCreateService,
    handleEditService,
    formData,
    setFormData
  );

  useEffect(() => {
    if (editingService) {
      // Ưu tiên tiếng Việt, nếu không có thì lấy tiếng Anh
      let translation = editingService.translations?.find(
        (t) => t.lang === lang
      );

      if (!translation) {
        if (lang === "vi") {
          // Nếu không có tiếng Việt thì lấy tiếng Anh
          translation = editingService.translations?.find(
            (t) => t.lang === "en"
          );
        } else {
          // Nếu đang ở tiếng Anh mà không có thì fallback về tiếng Việt
          translation = editingService.translations?.find(
            (t) => t.lang === "vi"
          );
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
    <ScrollArea
      scrollarea={"true"}
      className="lenis-local w-full h-full"
      data-lenis-prevent
    >
      <div className="bg-white admin-dark:bg-gray-800 w-full h-full mx-auto p-3 md:p-5">
        <div className="relative mb-3">
          <div className="flex gap-2 text-base sm:text-lg md:text-lg font-semibold items-center text-gray-800 admin-dark:text-gray-100">
            <Target className="h-5 w-5" />
            {editingService ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}
          </div>
          <span className="text-black/50 text-sm sm:text-base admin-dark:text-gray-100">
            {editingService
              ? "Cập nhật thông tin dịch vụ"
              : "Điền thông tin để tạo dịch vụ mới"}
          </span>

          <div className="absolute right-0 top-0 text-black rounded-md cursor-pointer hover:scale-110">
            <Button
              onClick={handleChangeLang}
              className="flex flex-row gap-2 cursor-pointer bg-green-500/90 hover:bg-green-600/90"
            >
              <Globe className="w-4 h-4 text-white" />
              {lang === "vi" ? (
                <>
                  {/* Kích thước xs: Chỉ hiển thị "vi" */}
                  <span className="text-xs font-bold text-white sm:hidden">
                    vi
                  </span>
                  {/* Kích thước sm trở lên: Hiển thị "Thiết lập Tiếng Việt" */}
                  <span className="text-xs font-bold text-white hidden sm:inline">
                    Thiết lập Tiếng Việt
                  </span>
                </>
              ) : (
                <>
                  {/* Kích thước xs: Chỉ hiển thị "en" */}
                  <span className="text-xs font-bold text-white sm:hidden">
                    en
                  </span>
                  {/* Kích thước sm trở lên: Hiển thị "Thiết lập Tiếng Anh" */}
                  <span className="text-xs font-bold text-white hidden sm:inline">
                    Thiết lập Tiếng Anh
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <ServiceDetailsForm
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              editingService={editingService}
            />
            {errorsMessage && (
              <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center"
                role="alert"
              >
                <svg
                  class="h-6 w-6 text-red-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p class="font-medium">{errorsMessage}</p>
              </div>
            )}

            <div className="flex flex-wrap flex-row items-center justify-center gap-5 pt-2 w-full">
              <Button
                type="submit"
                className="w-fit md:w-50 text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
              >
                <span className="text-sm sm:text-base font-semibold">
                  {editingService ? "Cập nhật dịch vụ" : "Tạo dịch vụ"}
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-fit md:w-50 cursor-pointer bg-black hover:bg-black/80 admin-dark:hover:bg-black/70"
              >
                <span className="text-sm sm:text-base font-semibold text-white">
                  Thoát
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ScrollArea>
  );
}

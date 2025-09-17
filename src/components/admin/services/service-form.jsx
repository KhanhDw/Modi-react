import { useOutletContext } from "react-router-dom";
import { Globe, Target } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // <-- Thêm import Input
import { Label } from "@/components/ui/label"; // <-- Thêm import Label
import { useEffect, useState } from "react";

// Import các hooks và components con
import { useServiceForm } from "./hooks/useServiceForm";
import ServiceDetailsForm from "./ServiceDetailsForm";
import ParagraphForm from "./ParagraphForm";
import ArticleDetailModal from "./articles/article_modal_detail";

export default function ServiceForm() {
  const {
    editingService,
    handleEditService,
    handleClose,
    handleCreateService,
  } = useOutletContext();
  const [openDetailModal, setOpenDetailModal] = useState(false);
  // Gọi custom hook để lấy tất cả state và logic
  const {
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
    setLang,
  } = useServiceForm(editingService, handleCreateService, handleEditService);

  const handleChangeLang = () => {
    setLang(lang === "vi" ? "en" : "vi");
    console.log(lang);
  };

  // Hàm trung gian để xử lý việc sửa đoạn văn từ modal
  const onEditParagraph = (key, value) => {
    handleEditParagraph(key, value);
    setOpenDetailModal(false); // Đóng modal sau khi chọn sửa
  };

  return (
    <>
      <div className="max-h-[80vh] overflow-y-auto p-2">
        <Card className="bg-white w-full mx-auto">
          <CardHeader className="relative">
            <CardTitle className="flex gap-2 items-center">
              <Target className="h-5 w-5" />
              {editingService ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}
            </CardTitle>
            <CardDescription className="text-black/50">
              {editingService
                ? "Cập nhật thông tin dịch vụ"
                : "Điền thông tin để tạo dịch vụ mới"}
            </CardDescription>
            {!editingService && (
              <>
                <div className="absolute right-0 top-0 text-black mr-4 rounded-4xl cursor-pointer hover:scale-110">
                  <Button
                    onClick={handleChangeLang}
                    className="flex flex-row gap-2 bg-green-500/90 hover:bg-green-600/90"
                  >
                    <Globe className="w-4 h-4 text-white space-x-2" />
                    {!editingService &&
                      (lang === "vi" ? (
                        <span className="text-xs font-bold text-white">VI</span>
                      ) : (
                        lang === "en" && (
                          <span className="text-xs font-bold text-white">
                            EN
                          </span>
                        )
                      ))}
                  </Button>
                </div>
              </>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phần 1: Form thông tin dịch vụ (đã tách) */}
              <ServiceDetailsForm
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                editingService={editingService}
              />

              {/* Phần 2: Form bài viết */}
              <div className="space-y-4">
                {/* === BỔ SUNG PHẦN CÒN THIẾU TẠI ĐÂY === */}
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="header">
                    Tiêu đề của bài viết *
                  </Label>
                  <Input
                    className="text-black border border-black/30"
                    id="header"
                    value={formData.header || ""}
                    onChange={(e) => handleChange("header", e.target.value)}
                    placeholder="Nhập tiêu đề bài viết"
                  />
                  {errors.header && (
                    <p className="text-red-500 text-sm">{errors.header}</p>
                  )}
                </div>
                {/* ======================================= */}

                {isAddingParagraph ? (
                  <ParagraphForm
                    partOfArticle={partOfArticle}
                    paraErrors={paraErrors}
                    selectedType={selectedType}
                    isEditingParagraph={isEditingParagraph}
                    setSelectedType={setSelectedType}
                    handleChangeForArticle={handleChangeForArticle}
                    handleSubmitParagraph={handleSubmitParagraph}
                    handleCancelAddParagraph={handleCancelAddParagraph}
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      {!editingService && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={openAddParagraph}
                        >
                          Thêm đoạn văn
                        </Button>
                      )}
                      {(!!dataArticle ||
                        (editingService && editingService.content)) && (
                          <Button
                            type="button"
                            className="ml-2"
                            onClick={() => setOpenDetailModal(true)}
                          >
                            Xem chi tiết
                          </Button>
                        )}
                    </div>
                    {/* Hiển thị lỗi nếu chưa có nội dung */}
                    {errors.dataArticle && (
                      <p className="text-red-500 text-sm">
                        {errors.dataArticle}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Phần 3: Nút submit chính */}
              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" className="flex-1 hover:bg-gray-500/25">
                  {editingService ? "Cập nhật dịch vụ" : "Tạo dịch vụ"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Thoát
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Modal xem chi tiết */}
      <ArticleDetailModal
        open={openDetailModal}
        onOpenChange={setOpenDetailModal}
        dataArticle={
          dataArticle ? dataArticle : editingService && editingService.content
        }
        onEdit={onEditParagraph}
        onDelete={handleDeleteParagraph}
      />
    </>
  );
}

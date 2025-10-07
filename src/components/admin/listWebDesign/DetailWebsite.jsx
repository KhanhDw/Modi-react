import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AppWindow, ArrowLeft, Calendar, Folder, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import ConfirmDeleteDialog from "./DeleteAlertDialog";

export default function WebsiteTemplatesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleDelete, handleSave } = useOutletContext();

  const [template, setTemplate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState("vi");
  const [isToggling, setIsToggling] = useState(false);
  const [localExportState, setLocalExportState] = useState(0);


  const fetchTemplate = async (id, lang) => {
    setLoading(true);
    try {
      const prefix = lang === "en" ? "/en" : "";
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}${prefix}/api/web-samples/${id}`
      );

      if (!res.ok) throw new Error("Không thể tải dữ liệu");
      let result = await res.json();

      setTemplate(result);
      setLocalExportState(result.export_state || 0);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      setError("Không thể tải mẫu website. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTemplate(id, activeLang);
  }, [id, activeLang]);

  const toggleExportState = async () => {
    if (isToggling || !template) return;
    setIsToggling(true);

    try {
      const newState = template.export_state === 1 ? 0 : 1;
      setLocalExportState(newState);

      const formData = new FormData();
      for (const key in template) {
        formData.append(key, template[key]);
      }
      formData.set("export_state", newState);
      formData.set(
        "updated_at",
        new Date().toISOString().slice(0, 19).replace("T", " ")
      );

      await handleSave(formData, template.id);
    } catch (error) {
      console.error("Error toggling export state:", error);
      setLocalExportState(template.export_state);
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-900 admin-dark:text-gray-100">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!template) return <div className="text-center py-8 text-gray-900 admin-dark:text-gray-100">Không tìm thấy mẫu website</div>;

  return (
    <div className="mx-auto py-4 max-w-7xl">
      {/* header */}
      <div className="flex flex-col xl:flex-row xl:items-end items-start justify-between gap-4 sm:gap-6 mb-6">
        <div className="flex flex-col items-start gap-2 sm:gap-4 w-full">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900 admin-dark:hover:text-gray-100 admin-dark:text-gray-200 hover:bg-gray-100 admin-dark:hover:bg-gray-800 cursor-pointer"
          >
            <ArrowLeft className="h-3 w-3 text-gray-900 admin-dark:text-gray-100" />
            <span className="text-xs sm:text-base font-semibold">Quay lại</span>
          </Button>
          <h1 className="text-base sm:text-lg md:text-xl md:mx-auto xl:mx-0 text-center font-bold text-gray-900 admin-dark:text-gray-100">
            {template.name}
          </h1>
        </div>
        <div className="flex flex-row items-center justify-center xl:justify-end gap-2 sm:gap-4 w-full xl:w-fit">
          <Button
            onClick={() => navigate("/products/" + template.id)}
            className="flex items-center shadow gap-2 bg-primary hover:bg-violet-400 hover:text-white admin-dark:bg-violet-700 admin-dark:hover:bg-violet-900 cursor-pointer"
          >
            <AppWindow className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-base font-semibold">Xem mẫu website</span>
          </Button>
          <Button
            onClick={toggleExportState}
            className={`flex items-center shadow cursor-pointer gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${localExportState == 1
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 hover:bg-gray-500"
              } text-white`}
            disabled={isToggling}
          >
            <span className="text-xs sm:text-base font-semibold">{localExportState == 1 ? "Đã xuất bản" : "Chưa xuất bản"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* nội dung */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 w-full">
          <Card className="py-0 bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardContent className="p-0 sm:px-0">
              <div className="relative overflow-hidden rounded-lg w-full">
                {template.image_url ? (
                  <img
                    src={`${import.meta.env.VITE_MAIN_BE_URL}${template.image_url}`}
                    alt={template.name}
                    className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-center bg-gray-100 admin-dark:bg-gray-700">
                    <span className="text-gray-500 admin-dark:text-gray-400 text-xs sm:text-sm">
                      Không cập nhật được hình ảnh
                    </span>
                  </div>
                )}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                  <Badge
                    variant="secondary"
                    className="text-xs sm:text-sm admin-dark:bg-gray-700 admin-dark:text-gray-300"
                  >
                    {template.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* mô tả */}
          <div className="bg-white w-full rounded-lg shadow px-2 py-3 md:px-3 admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <span className="text-sm sm:text-base md:text-lg text-gray-900 admin-dark:text-gray-100 w-full text-start font-semibold">
              Mô tả chi tiết
            </span>
            <p className="mt-2 text-xs sm:text-sm text-gray-700 admin-dark:text-gray-300 leading-relaxed wrap-anywhere">
              {template.description}
            </p>
          </div>

          {/* tính năng */}
          <div className="bg-white w-full rounded-lg shadow px-2 py-3 md:px-3 admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <span className="text-sm sm:text-base md:text-lg text-gray-900 admin-dark:text-gray-100 w-full text-start font-semibold">
              Tính năng nổi bật
            </span>
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
              {template?.top_features?.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center justify-center shadow gap-1 sm:gap-2 p-2 bg-gray-100 admin-dark:bg-gray-800 rounded-lg w-fit"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                  <span className="font-semibold px-1 text-xs sm:text-sm text-gray-700 admin-dark:text-gray-200">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* xóa */}
          <ConfirmDeleteDialog
            name={template.name}
            id={template.id}
            handleDelete={handleDelete}
            className="shadow-lg mx-auto"
            isDetail={true}
          />

        </div>

        {/* cột bên phải */}
        <div className="space-y-4 sm:space-y-6">
          {/* info */}
          <div className="bg-white w-full rounded-lg shadow px-2 py-3 md:px-3 admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <span className="text-sm sm:text-base md:text-lg text-gray-900 admin-dark:text-gray-100 w-full text-start font-semibold">
              Thông tin mẫu
            </span>
            <div className="space-y-3 sm:space-y-4 mt-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <Folder className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground admin-dark:text-gray-400" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 admin-dark:text-gray-200">
                    Danh mục:
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground admin-dark:text-gray-400">
                    {template.category}
                  </p>
                </div>
              </div>

              <Separator className="admin-dark:bg-gray-700 bg-gray-300" />

              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground admin-dark:text-gray-400" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 admin-dark:text-gray-200">
                    Ngày tạo:
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground admin-dark:text-gray-400">
                    {new Date(template.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <Separator className="admin-dark:bg-gray-700 bg-gray-300" />

              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground admin-dark:text-gray-400" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 admin-dark:text-gray-200">
                    Cập nhật lần cuối:
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground admin-dark:text-gray-400">
                    {new Date(template.updated_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* tags */}
          <div className="bg-white w-full rounded-lg shadow px-2 py-3 md:px-3 admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <div className="flex items-center gap-1 sm:gap-2 text-base sm:text-lg md:text-xl text-gray-900 admin-dark:text-gray-100">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-gray-800 admin-dark:text-gray-100" />
              <span className="text-sm sm:text-base md:text-lg text-gray-900 admin-dark:text-gray-100 w-full text-start font-semibold">Tags</span>
            </div>
            <div>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                {template?.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs sm:text-sm border-2 text-gray-700 admin-dark:text-gray-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="bg-white w-full rounded-lg shadow px-2 py-3 md:px-3 admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <div className="text-sm sm:text-base md:text-lg text-gray-900 admin-dark:text-gray-100 w-full text-start font-semibold">
              Hành động
            </div>
            <div className="space-y-3 sm:space-y-4 mt-2 w-full">
              <div className="flex justify-between items-center px-2 py-1 text-sm sm:text-base admin-dark:bg-gray-700 text-gray-700 admin-dark:text-gray-100 bg-gray-200 rounded-lg">
                <h1>Ngôn ngữ bài viết: {activeLang === "vi" ? "Tiếng Việt" : "Tiếng Anh"}</h1>
                <Switch onClick={() => setActiveLang(activeLang === "vi" ? "en" : "vi")} checked={activeLang === "en"} />
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col sm:justify-center md:justify-end md:gap-5 lg:gap-3 gap-3">
                <Button
                  onClick={() => navigate(`edit`)}
                  className="w-full sm:w-fit lg:w-full px-2 sm:px-3 py-1 sm:py-2 bg-blue-400 hover:bg-blue-500 admin-dark:bg-gray-600 admin-dark:hover:bg-gray-500 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">Chỉnh sửa mẫu</span>
                </Button>
                <Link to={template.url_github}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-fit lg:w-full px-2 sm:px-3 py-1 sm:py-2 bg-black/90 hover:bg-black/80 admin-dark:text-gray-100 admin-dark:bg-gray-800 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-semibold text-white">Github dự án</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* stats */}
          <div className="bg-white w-full rounded-lg shadow px-2 py-3 md:px-3 admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <div className="text-sm sm:text-base md:text-lg text-gray-900 admin-dark:text-gray-100 w-full text-start font-semibold">
              Thống kê
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-start gap-3 items-center">
                <span className="text-xs sm:text-sm text-muted-foreground admin-dark:text-gray-400">
                  Lượt xem mẫu website hiện tại:
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-800 admin-dark:text-gray-100">
                  {template.views}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

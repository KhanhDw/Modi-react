import { Trash2, AppWindow, ArrowLeft, Calendar, Tag, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOutletContext, useNavigate, useParams, Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";

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
    <div className="mx-auto px-2 sm:px-4 py-6 max-w-6xl">
      {/* header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900 admin-dark:hover:text-gray-100 admin-dark:text-gray-200 hover:bg-gray-100 admin-dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 text-gray-900 admin-dark:text-gray-100" />
            Quay lại
          </Button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 admin-dark:text-gray-100">
            {template.name}
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Button
            onClick={() => navigate("edit")}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-primary hover:bg-violet-400 hover:text-white admin-dark:bg-violet-700 admin-dark:hover:bg-violet-900"
          >
            <AppWindow className="h-3 w-3 sm:h-4 sm:w-4" />
            Xem mẫu website
          </Button>
          <Button
            onClick={toggleExportState}
            className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${
              localExportState == 1
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 hover:bg-gray-500"
            } text-white`}
            disabled={isToggling}
          >
            {localExportState == 1 ? "Đã xuất bản" : "Chưa xuất bản"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* nội dung */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card className="py-0 bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-lg">
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
          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl text-gray-900 admin-dark:text-gray-100">
                Mô tả chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-700 admin-dark:text-gray-300 leading-relaxed wrap-anywhere">
                {template.description}
              </p>
            </CardContent>
          </Card>

          {/* tính năng */}
          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl text-gray-900 admin-dark:text-gray-100">
                Tính năng nổi bật
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {template?.top_features?.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/20 admin-dark:bg-gray-800 rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"></div>
                    <span className="text-xs sm:text-sm text-gray-800 admin-dark:text-gray-200">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* xóa */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                theme="admin"
                size="sm"
                variant="outline"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-primary hover:text-white hover:bg-black admin-dark:bg-red-700 admin-dark:hover:bg-red-900"
                title="Xóa"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                Xóa mẫu Website này
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base sm:text-lg text-gray-900 admin-dark:text-gray-100">Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-gray-600 admin-dark:text-gray-400">
                  Bạn có chắc chắn muốn xóa mẫu "{template.name}"? Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-xs sm:text-sm border border-gray-200 admin-dark:border-gray-700 text-gray-900 admin-dark:text-gray-100">Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleDelete(template.id);
                    navigate(-1);
                  }}
                  className="text-xs sm:text-sm bg-red-600 text-white hover:bg-red-700"
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* cột bên phải */}
        <div className="space-y-4 sm:space-y-6">
          {/* info */}
          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl text-gray-900 admin-dark:text-gray-100">
                Thông tin mẫu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Folder className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground admin-dark:text-gray-400" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 admin-dark:text-gray-200">
                    Danh mục
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground admin-dark:text-gray-400">
                    {template.category}
                  </p>
                </div>
              </div>

              <Separator className="admin-dark:bg-gray-700" />

              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground admin-dark:text-gray-400" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 admin-dark:text-gray-200">
                    Ngày tạo
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground admin-dark:text-gray-400">
                    {new Date(template.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <Separator className="admin-dark:bg-gray-700" />

              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground admin-dark:text-gray-400" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 admin-dark:text-gray-200">
                    Cập nhật lần cuối
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground admin-dark:text-gray-400">
                    {new Date(template.updated_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* tags */}
          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-1 sm:gap-2 text-base sm:text-lg md:text-xl text-gray-900 admin-dark:text-gray-100">
                <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {template?.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs sm:text-sm admin-dark:bg-gray-700 admin-dark:text-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* actions */}
          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl text-gray-900 admin-dark:text-gray-100">
                Hành động
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex justify-center items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setActiveLang("vi")}
                  className={`flex px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm ${
                    activeLang === "vi"
                      ? "admin-dark:bg-blue-500 bg-slate-600 admin-dark:text-gray-100 text-gray-200"
                      : "admin-dark:bg-slate-200 bg-slate-600 admin-dark:text-gray-800 text-gray-200"
                  }`}
                >
                  <span className="font-semibold">Tiếng Việt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLang("en")}
                  className={`flex px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm ${
                    activeLang === "en"
                      ? "admin-dark:bg-blue-500 bg-slate-600 admin-dark:text-gray-100 text-gray-200"
                      : "admin-dark:bg-slate-200 bg-slate-600 admin-dark:text-gray-800 text-gray-200"
                  }`}
                >
                  <span className="font-semibold">Tiếng Anh</span>
                </button>
              </div>
              <Button
                onClick={() => navigate(`edit`)}
                className="w-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-primary hover:bg-primary/90 admin-dark:bg-gray-600 admin-dark:hover:bg-gray-500"
              >
                Chỉnh sửa mẫu
              </Button>
              <Link to={template.url_github}>
                <Button
                  variant="outline"
                  className="w-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-transparent text-gray-800 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 admin-dark:bg-gray-800"
                >
                  Github dự án
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* stats */}
          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl text-gray-900 admin-dark:text-gray-100">
                Thống kê
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground admin-dark:text-gray-400">
                  Lượt xem
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 admin-dark:text-gray-100">
                  {template.views}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
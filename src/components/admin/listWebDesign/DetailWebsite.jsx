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
import { useState } from "react";

export default function WebsiteTemplatesDetail() {
  const { id } = useParams();
  const { templates, handleDelete, handleSave } = useOutletContext();
  const template = templates.find(t => String(t.id) === id);
  const navigate = useNavigate();
  const [localExportState, setLocalExportState] = useState(template ? !!template.export_state : false);
  const [isToggling, setIsToggling] = useState(false);

  const toggleExportState = async () => {
    if (isToggling) return;
    setIsToggling(true);
    const newExportState = !localExportState;
    setLocalExportState(newExportState);
    if (template) {
      try {
        await handleSave({
          ...template,
          export_state: newExportState,
          updated_at: new Date().toISOString().split("T")[0],
        });
      } catch (error) {
        console.error("Error toggling export state:", error);
        setLocalExportState(!newExportState); // Revert on error
      } finally {
        setIsToggling(false);
      }
    } else {
      setIsToggling(false);
    }
  };

  if (!template) {
    return <div>Không tìm thấy mẫu website</div>;
  }

  return (
    <div className="mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 admin-dark:hover:text-gray-100 admin-dark:text-gray-200 hover:bg-gray-100 admin-dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 text-gray-900 admin-dark:text-gray-100" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 admin-dark:text-gray-100">{template.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('edit')}
            className="flex items-center gap-2 bg-primary hover:bg-violet-400 hover:text-white admin-dark:bg-violet-700 admin-dark:hover:bg-violet-900"
          >
            <AppWindow className="h-4 w-4" />
            Xem mẫu website
          </Button>

          <Button
            onClick={toggleExportState}
            className={`flex items-center gap-2 ${localExportState ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"} text-white`}
            disabled={isToggling}
          >
            {localExportState ? "Đã xuất bản" : "Chưa xuất bản"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="py-0 bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={template.imageUrl || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className="text-sm admin-dark:bg-gray-700 admin-dark:text-gray-300"
                  >
                    {template.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 admin-dark:text-gray-100">Mô tả chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 admin-dark:text-gray-300 leading-relaxed">
                {template.description}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 admin-dark:text-gray-100">Tính năng nổi bật</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Responsive Design",
                  "SEO Optimized",
                  "Fast Loading",
                  "Cross Browser Compatible",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 p-3 bg-muted/20 admin-dark:bg-gray-800 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-gray-800 admin-dark:text-gray-200">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                theme="admin"
                size="sm"
                variant="outline"
                className="flex min-w-10 items-center gap-2 bg-primary hover:text-white hover:bg-black admin-dark:bg-red-700 admin-dark:hover:bg-red-900"
                title="Xóa"
              >
                <Trash2 className="h-4 w-4" />
                Xóa mẫu Website này!
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa mẫu "{template.name}"? Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={() => { handleDelete(template.id); navigate(-1); }}>Xóa</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="space-y-6">
          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 admin-dark:text-gray-100">Thông tin mẫu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Folder className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800 admin-dark:text-gray-200">Danh mục</p>
                  <p className="text-sm text-muted-foreground admin-dark:text-gray-400">{template.category}</p>
                </div>
              </div>

              <Separator className="admin-dark:bg-gray-700" />

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800 admin-dark:text-gray-200">Ngày tạo</p>
                  <p className="text-sm text-muted-foreground admin-dark:text-gray-400">
                    {new Date(template.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <Separator className="admin-dark:bg-gray-700" />

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800 admin-dark:text-gray-200">Cập nhật lần cuối</p>
                  <p className="text-sm text-muted-foreground admin-dark:text-gray-400">
                    {new Date(template.updated_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 admin-dark:text-gray-100">
                <Tag className="h-4 w-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {template?.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="admin-dark:bg-gray-700 admin-dark:text-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 admin-dark:text-gray-100">Hành động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => navigate(`edit`)}
                className="w-full bg-primary hover:bg-primary/90 admin-dark:bg-gray-600 admin-dark:hover:bg-gray-500"
              >
                Chỉnh sửa mẫu
              </Button>
              <Link to={template.url_github}>
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-gray-800 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 admin-dark:bg-gray-800"
                >
                  Github dự án
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 admin-dark:text-gray-100">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground admin-dark:text-gray-400">Lượt xem</span>
                <span className="font-medium text-gray-900 admin-dark:text-gray-100">1,234</span>
              </div>
              <Separator className="admin-dark:bg-gray-700" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground admin-dark:text-gray-400">Đánh giá</span>
                <span className="font-medium text-gray-900 admin-dark:text-gray-100">4.8/5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
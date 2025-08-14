import { Trash2, AppWindow, LogOut, ArrowLeft, Edit, Calendar, Tag, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
} from "@/components/ui/alert-dialog"

// export default  function WebsitetemplatesDetail({ templates, onBack, onEdit }) {
export default function WebsitetemplatesDetail() {
  const { id } = useParams();

  const { templates, handleEdit, handleDelete } = useOutletContext();
  const template = templates.find(t => String(t.id) === id);

  const navigate = useNavigate();

  return (
    <div className=" mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => { navigate(-1) }}
            className="flex items-center gap-2  text-gray-700 hover:text-gray-900 admin-dark:hover:text-gray-100 admin-dark:text-gray-200 hover:bg-gray-100 admin-dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 text-gray-900 admin-dark:text-gray-100" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 admin-dark:text-gray-100">{template.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => handleEdit(template.id)}
            className="flex items-center gap-2 bg-primary hover:bg-violet-400 hover:text-white admin-dark:bg-violet-700 admin-dark:hover:bg-violet-900"
          >
            <AppWindow className="h-4 w-4" />
            Xem mẫu website
          </Button>

          <Button
            onClick={() => handleEdit(template.id)}
            className="flex items-center gap-2 bg-primary hover:text-white hover:bg-black admin-dark:bg-blue-600 admin-dark:hover:bg-blue-500"
          >
            Xuất bản
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* template Image */}
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

          {/* Description */}
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

          {/* Features Section */}
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
                    className="flex items-center gap-3 p-3  bg-muted/20 admin-dark:bg-gray-800 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-gray-800 admin-dark:text-gray-200">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* button delete template */}
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
                <AlertDialogAction onClick={() => handleDelete(template.id)}>Xóa</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* template Info */}
          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 admin-dark:text-gray-100">Thông tin mẫu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category */}
              <div className="flex items-center gap-3">
                <Folder className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800 admin-dark:text-gray-200">Danh mục</p>
                  <p className="text-sm text-muted-foreground admin-dark:text-gray-400">{template.category}</p>
                </div>
              </div>

              <Separator className="admin-dark:bg-gray-700" />

              {/* Created Date */}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800 admin-dark:text-gray-200">Ngày tạo</p>
                  <p className="text-sm text-muted-foreground admin-dark:text-gray-400">
                    {new Date(template.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <Separator className="admin-dark:bg-gray-700" />

              {/* Updated Date */}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800 admin-dark:text-gray-200">Cập nhật lần cuối</p>
                  <p className="text-sm text-muted-foreground admin-dark:text-gray-400">
                    {new Date(template.updatedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
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

          {/* Actions */}
          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 admin-dark:text-gray-100">Hành động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => navigate(`${template.id}/edit`)}
                className="w-full bg-primary hover:bg-primary/90 admin-dark:bg-gray-600 admin-dark:hover:bg-gray-500"
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa mẫu
              </Button>
              <Link to={template.urlGitHub}>
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-gray-800 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 admin-dark:bg-gray-800"
                >
                  Github dự án
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 admin-dark:text-gray-100">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground admin-dark:text-gray-400">Lượt xem</span>
                <span className="font-medium text-gray-900 admin-dark:text-gray-100">1,234</span>
              </div>
              {/* <Separator className="admin-dark:bg-gray-700" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground admin-dark:text-gray-400">Lượt tải</span>
              <span className="font-medium text-gray-900 admin-dark:text-gray-100">89</span>
            </div> */}
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

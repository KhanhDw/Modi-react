import { useState } from "react"
import { Search, Plus, Edit, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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


export default  function WebsiteTemplateList({ templates, onEdit, onView, onDelete, onAddNew }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quản lý mẫu Website</h1>
          <Button onClick={onAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Thêm mẫu mới
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm mẫu website..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-0">
              {/* Template Image */}
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={template.imageUrl || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />

                {/* Action Buttons Overlay */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button size="sm" variant="secondary" onClick={() => onView(template)} className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => onEdit(template)} className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
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
                        <AlertDialogAction onClick={() => onDelete(template.id)}>Xóa</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4">
              <div className="w-full">
                <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{template.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Date */}
                <p className="text-xs text-muted-foreground">
                  Cập nhật: {new Date(template.updatedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchTerm ? "Không tìm thấy mẫu website nào phù hợp" : "Chưa có mẫu website nào"}
          </div>
          {!searchTerm && <Button onClick={onAddNew}>Thêm mẫu đầu tiên</Button>}
        </div>
      )}
    </div>
  )
}

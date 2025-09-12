import { useState } from "react"
import { useMenuData } from "@/hooks/use-menu-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react"

function MenuItemEditor({ item, level, onUpdate, onDelete, onAddChild }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingChild, setIsAddingChild] = useState(false)
  const [editForm, setEditForm] = useState({ title: item.title, href: item.href || "", order: item.order })
  const [newChildForm, setNewChildForm] = useState({ title: "", href: "", order: 1 })

  const handleUpdate = () => {
    onUpdate(item.id, editForm)
    setIsEditing(false)
  }

  const handleAddChild = () => {
    if (level < 2) {
      onAddChild(item.id, newChildForm)
      setNewChildForm({ title: "", href: "", order: 1 })
      setIsAddingChild(false)
    }
  }

  const levelColors = ["bg-blue-50", "bg-green-50", "bg-purple-50"]
  const levelBadges = ["Cấp 1", "Cấp 2", "Cấp 3"]

  return (
    <div className={`border rounded-lg p-4 ${levelColors[level]} ml-${level * 4}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{levelBadges[level]}</Badge>
          <span className="font-medium">{item.title}</span>
          {item.href && <span className="text-sm text-muted-foreground">({item.href})</span>}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            {level < 2 && (
              <DropdownMenuItem onClick={() => setIsAddingChild(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm mục con
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mục menu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tiêu đề</label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Đường dẫn</label>
              <Input
                value={editForm.href}
                onChange={(e) => setEditForm((prev) => ({ ...prev, href: e.target.value }))}
                placeholder="/path/to/page"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Thứ tự</label>
              <Input
                type="number"
                value={editForm.order}
                onChange={(e) => setEditForm((prev) => ({ ...prev, order: Number.parseInt(e.target.value) }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdate}>Lưu</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingChild} onOpenChange={setIsAddingChild}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm mục con</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tiêu đề</label>
              <Input
                value={newChildForm.title}
                onChange={(e) => setNewChildForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Đường dẫn</label>
              <Input
                value={newChildForm.href}
                onChange={(e) => setNewChildForm((prev) => ({ ...prev, href: e.target.value }))}
                placeholder="/path/to/page"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Thứ tự</label>
              <Input
                type="number"
                value={newChildForm.order}
                onChange={(e) => setNewChildForm((prev) => ({ ...prev, order: Number.parseInt(e.target.value) }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddChild}>Thêm</Button>
              <Button variant="outline" onClick={() => setIsAddingChild(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {item.children && (
        <div className="mt-4 space-y-2">
          {item.children.map((child) => (
            <MenuItemEditor
              key={child.id}
              item={child}
              level={level + 1}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminMenuEditor() {
  const { menuData, isLoading, updateMenuItem, addMenuItem, deleteMenuItem } = useMenuData()
  const [isAddingRoot, setIsAddingRoot] = useState(false)
  const [newRootForm, setNewRootForm] = useState({ title: "", href: "", order: 1 })

  const handleAddRoot = () => {
    addMenuItem(null, newRootForm)
    setNewRootForm({ title: "", href: "", order: 1 })
    setIsAddingRoot(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quản lý Menu 3 Cấp</CardTitle>
            <Button onClick={() => setIsAddingRoot(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm mục chính
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          )}

          <div className="space-y-4">
            {menuData.items.map((item) => (
              <MenuItemEditor
                key={item.id}
                item={item}
                level={0}
                onUpdate={updateMenuItem}
                onDelete={deleteMenuItem}
                onAddChild={addMenuItem}
              />
            ))}
          </div>

          <Dialog open={isAddingRoot} onOpenChange={setIsAddingRoot}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm mục menu chính</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tiêu đề</label>
                  <Input
                    value={newRootForm.title}
                    onChange={(e) => setNewRootForm((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Đường dẫn</label>
                  <Input
                    value={newRootForm.href}
                    onChange={(e) => setNewRootForm((prev) => ({ ...prev, href: e.target.value }))}
                    placeholder="/path/to/page"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Thứ tự</label>
                  <Input
                    type="number"
                    value={newRootForm.order}
                    onChange={(e) => setNewRootForm((prev) => ({ ...prev, order: Number.parseInt(e.target.value) }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddRoot}>Thêm</Button>
                  <Button variant="outline" onClick={() => setIsAddingRoot(false)}>
                    Hủy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
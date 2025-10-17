import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import PageList from "@/components/feature/pagination";

const columns = [
  { key: "title", label: "Tiêu đề" },
  { key: "platform", label: "Platform" },
  { key: "author", label: "Tác giả" },
  { key: "status", label: "Trạng thái" },
  { key: "createdAt", label: "Ngày tạo" },
  { key: "engagement", label: "Engagement" },
  { key: "actions", label: "Thao tác", align: "right" }, // thêm align nếu muốn căn phải
];

const initialPosts = [
  {
    id: 1,
    platform: "facebook",
    title: "Giới thiệu sản phẩm mới của công ty",
    content:
      "Chúng tôi vui mừng thông báo về sản phẩm công nghệ mới nhất sẽ thay đổi cách bạn làm việc...",
    image: "/modern-tech-launch.png",
    date: "2024-01-15",
    author: "Nguyễn Văn A",
    status: "published",
    tags: "sản phẩm, công nghệ",
    likes: 245,
    comments: 32,
    shares: 18,
    views: 1250,
  },
  {
    id: 2,
    platform: "youtube",
    title: "Hướng dẫn sử dụng phần mềm quản lý",
    content:
      "Video chi tiết về cách sử dụng các tính năng chính của phần mềm quản lý doanh nghiệp...",
    image: "/software-tutorial-thumbnail.png",
    date: "2024-01-12",
    author: "Trần Thị B",
    status: "published",
    tags: "hướng dẫn, phần mềm",
    likes: 189,
    comments: 45,
    shares: 23,
    views: 3420,
  },
  {
    id: 3,
    platform: "instagram",
    title: "Behind the scenes - Văn phòng làm việc",
    content:
      "Khám phá không gian làm việc hiện đại và sáng tạo của đội ngũ chúng tôi...",
    image: "/modern-office-behind-scenes.png",
    date: "2024-01-10",
    author: "Lê Văn C",
    status: "draft",
    tags: "văn phòng, team",
    likes: 156,
    comments: 28,
    shares: 12,
    views: 890,
  },
];

const platformColors = {
  facebook: "bg-blue-600 admin-dark:bg-blue-500",
  youtube: "bg-red-600 admin-dark:bg-red-500",
  instagram:
    "bg-gradient-to-r from-purple-600 to-pink-600 admin-dark:from-purple-500 admin-dark:to-pink-500",
};

const platformNames = {
  facebook: "Facebook",
  youtube: "YouTube",
  instagram: "Instagram",
};

const statusColors = {
  published: "bg-green-600 admin-dark:bg-green-500",
  draft: "bg-yellow-600 admin-dark:bg-yellow-500",
  archived: "bg-gray-600 admin-dark:bg-gray-500",
};

const statusNames = {
  published: "Đã xuất bản",
  draft: "Bản nháp",
  archived: "Lưu trữ",
};

export default function MarketingSimple() {
  const activeClass =
    "bg-blue-500 text-white admin-dark:bg-blue-600 admin-dark:text-white font-medium rounded-md px-4 py-2 transition-colors duration-200";

  const normalClass =
    "border-2 border-gray-300 text-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800 hover:bg-gray-100 admin-dark:hover:bg-gray-700 rounded-md px-4 py-2 font-medium transition-colors duration-200 flex items-center gap-2";

  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    platform: "",
    author: "",
    status: "draft",
    tags: "",
    image: "",
  });

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || post.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddPost = () => {
    const newPost = {
      id: Math.max(...posts.map((p) => p.id)) + 1,
      ...formData,
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
    };
    setPosts([...posts, newPost]);
    setFormData({
      title: "",
      content: "",
      platform: "",
      author: "",
      status: "draft",
      tags: "",
      image: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditPost = () => {
    setPosts(
      posts.map((post) =>
        post.id === editingPost.id ? { ...post, ...formData } : post
      )
    );
    setIsEditDialogOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const openEditDialog = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      platform: post.platform,
      author: post.author,
      status: post.status,
      tags: post.tags,
      image: post.image,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with Add Post Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 admin-dark:text-white">
          Quản lý bài viết Marketing
        </h1>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className={activeClass}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm bài viết
            </Button>
          </DialogTrigger>
          <DialogContent className=" max-w-4xl  bg-white admin-dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-gray-900 admin-dark:text-white">
                Tạo bài viết mới
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p">
                  <Label
                    htmlFor="add-title"
                    className="text-gray-700 admin-dark:text-gray-200"
                  >
                    Tiêu đề
                  </Label>
                  <Input
                    id="add-title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600"
                  />
                </div>
                <div className="p">
                  <Label
                    htmlFor="add-author"
                    className="text-gray-700 admin-dark:text-gray-200"
                  >
                    Tác giả
                  </Label>
                  <Input
                    id="add-author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className="bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600"
                  />
                </div>
              </div>
              <div className="p">
                <Label
                  htmlFor="add-content"
                  className="text-gray-700 admin-dark:text-gray-200"
                >
                  Nội dung
                </Label>
                <Textarea
                  id="add-content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                  className="max-h-120 overflow-y-auto bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p">
                  <Label className="text-gray-700 admin-dark:text-gray-200">
                    Platform
                  </Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) =>
                      setFormData({ ...formData, platform: value })
                    }
                  >
                    <SelectTrigger className="bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white admin-dark:bg-gray-700 admin-dark:text-white">
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p">
                  <Label className="text-gray-700 admin-dark:text-gray-200">
                    Trạng thái
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white admin-dark:bg-gray-700 admin-dark:text-white">
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="published">Đã xuất bản</SelectItem>
                      <SelectItem value="archived">Lưu trữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p">
                  <Label className="text-gray-700 admin-dark:text-gray-200">
                    Tags
                  </Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600"
                  />
                </div>
              </div>
              <div className="p">
                <Label className="text-gray-700 admin-dark:text-gray-200">
                  URL Hình ảnh
                </Label>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-gray-300 text-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800"
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddPost}
                className="bg-blue-500 hover:bg-blue-600 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700"
              >
                Tạo mới
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-8 bg-white admin-dark:bg-gray-800 shadow-lg admin-dark:shadow-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 admin-dark:text-white">
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 admin-dark:text-gray-500 h-5 w-5" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, tác giả, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600 focus:ring-2 focus:ring-blue-500 admin-dark:focus:ring-blue-600"
              />
            </div>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full md:w-48 bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-800 admin-dark:bg-gray-700 admin-dark:text-white">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card className="bg-white admin-dark:bg-gray-800 shadow-lg admin-dark:shadow-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 admin-dark:text-white">
            <Eye className="h-5 w-5" />
            Danh sách bài viết ({filteredPosts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className=" border-b border-gray-200 admin-dark:border-gray-700">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`text-gray-900 admin-dark:text-white ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow
                  key={post.id}
                  className="border-b border-gray-200 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {post.image && (
                        <img
                          loading="lazy"
                          src={post.image || "/placeholder.svg"}
                          alt=""
                          className="w-12 h-12 rounded-md object-cover border border-gray-200 admin-dark:border-gray-600"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900 admin-dark:text-white line-clamp-1">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 admin-dark:text-gray-400 flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {post.tags}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-white font-medium ${
                        platformColors[post.platform]
                      }`}
                    >
                      {platformNames[post.platform]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-900 admin-dark:text-white">
                      <User className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
                      {post.author}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-white font-medium ${
                        statusColors[post.status]
                      }`}
                    >
                      {statusNames[post.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-900 admin-dark:text-white">
                      <Calendar className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
                      {new Date(post.date).toLocaleDateString("vi-VN")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-700 admin-dark:text-gray-200">
                      <div>
                        👍 {post.likes} | 💬 {post.comments}
                      </div>
                      <div>
                        🔄 {post.shares} | 👁️ {post.views}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(post)}
                        className="border-gray-300 text-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800 hover:bg-gray-100 admin-dark:hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-300 text-red-600 admin-dark:border-gray-600 admin-dark:text-red-500 admin-dark:bg-gray-800 hover:bg-red-50 admin-dark:hover:bg-red-900/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white admin-dark:bg-gray-800">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-gray-900 admin-dark:text-white">
                              Xác nhận xóa
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 admin-dark:text-gray-300">
                              Bạn có chắc chắn muốn xóa bài viết "{post.title}"?
                              Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-300 text-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800">
                              Hủy
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePost(post.id)}
                              className="bg-red-600 hover:bg-red-700 admin-dark:bg-red-500 admin-dark:hover:bg-red-600"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PageList
            columns={columns}
            data={filteredPosts}
          />
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 admin-dark:text-gray-400 text-lg font-medium mb-2">
                Không tìm thấy bài viết nào
              </div>
              <p className="text-sm text-gray-400 admin-dark:text-gray-500">
                Thử thay đổi bộ lọc hoặc thêm bài viết mới
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <DialogContent className="max-w-2xl bg-white admin-dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 admin-dark:text-white">
              Chỉnh sửa bài viết
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="edit-title"
                  className="text-gray-700 admin-dark:text-gray-200"
                >
                  Tiêu đề
                </Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600"
                />
              </div>
              <div>
                <Label
                  htmlFor="edit-author"
                  className="text-gray-700 admin-dark:text-gray-200"
                >
                  Tác giả
                </Label>
                <Input
                  id="edit-author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="edit-content"
                className="text-gray-700 admin-dark:text-gray-200"
              >
                Nội dung
              </Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={4}
                className="bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-700 admin-dark:text-gray-200">
                  Platform
                </Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) =>
                    setFormData({ ...formData, platform: value })
                  }
                >
                  <SelectTrigger className="bg-white text-gray-800 admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-800 admin-dark:bg-gray-700 admin-dark:text-white">
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-700 admin-dark:text-gray-200">
                  Trạng thái
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-800 admin-dark:bg-gray-700 admin-dark:text-white">
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="published">Đã xuất bản</SelectItem>
                    <SelectItem value="archived">Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-700 admin-dark:text-gray-200">
                  Tags
                </Label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-700 admin-dark:text-gray-200">
                URL Hình ảnh
              </Label>
              <Input
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-gray-300 text-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800"
            >
              Hủy
            </Button>
            <Button
              onClick={handleEditPost}
              className="bg-blue-500 hover:bg-blue-600 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700"
            >
              Cập nhật
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

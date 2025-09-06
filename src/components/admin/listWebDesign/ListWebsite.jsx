import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Search, Plus, Trash2, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import FilterModalListTemplateWebAdmin from "@/components/admin/templateWebsite/filterModalListTemplateWeb";
import { useLenisToggle } from "@/contexts/LenisContext"



export default function WebsiteTemplateList() {
  const { templates, handleDelete } = useOutletContext();
  const { setEnabled } = useLenisToggle()
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    technologies: [],
    tags: [],
    top_features: [],
    authors: [],
    dateRange: "",
    publishStatus: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset trang khi search/filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Các option filter
  const availableTags = [...new Set(templates?.flatMap(t => t.tags || []))];
  const availableTech = [...new Set(templates?.flatMap(t => t.tech || []))];
  const availableTopFeatures = [...new Set(templates?.flatMap(t => t.top_features || []))];
  const availableAuthors = [...new Set(templates?.map(() => "Admin"))];

  // Lọc template
  const filteredTemplates = templates?.filter((t) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      t.name?.toLowerCase().includes(search) ||
      t.description?.toLowerCase().includes(search) ||
      t.category?.toLowerCase().includes(search) ||
      t.tags?.some(tag => tag.toLowerCase().includes(search)) ||
      t.tech?.some(tech => tech.toLowerCase().includes(search)) ||
      t.top_features?.some(f => f.toLowerCase().includes(search));

    const matchesTechnology =
      filters.technologies.length === 0 ||
      filters.technologies.some(tech => t.tech?.includes(tech));

    const matchesTags =
      filters.tags.length === 0 ||
      filters.tags.some(tag => t.tags?.includes(tag));

    const matchesAuthor =
      filters.authors.length === 0 || filters.authors.includes("Admin");

    const matchesStatus =
      !filters.publishStatus ||
      (filters.publishStatus === "published" && t.export_state) ||
      (filters.publishStatus === "draft" && !t.export_state);

    return matchesSearch && matchesTechnology && matchesTags && matchesAuthor && matchesStatus;
  }) || [];

  // Phân trang
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, startIndex + itemsPerPage);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Format price
  const ProductPrice = ({ price }) => {
    if (price == null) return <span className="text-gray-500 text-xs">Chưa cập nhật giá</span>;
    return <span>{Number(price).toLocaleString("vi-VN")}</span>;
  };

  const handleDialogToggle = (open) => {
    if (open) {
      document.documentElement.style.overflow = "hidden"; // chặn scroll native
      setEnabled(false)  // disable lenis
    } else {
      document.documentElement.style.overflow = ""; // bật lại
      setEnabled(true)   // enable lenis
    }
  };

  return (
    <div className="mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quản lý mẫu Website</h1>
          <Button onClick={() => navigate("new")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Thêm mẫu mới
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <FilterModalListTemplateWebAdmin
              filters={filters}
              onFiltersChange={setFilters}
              availableTags={availableTags}
              availableAuthors={availableAuthors}
              availableTech={availableTech}
              availableTopFeatures={availableTopFeatures}
              onDialogToggle={handleDialogToggle}
            />
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm mẫu website..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-gray-300 admin-dark:border-gray-700 rounded-lg shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-600 admin-dark:text-gray-500 font-semibold">
            <p>Hiện có</p> {templates.length} <p>website mẫu</p>
          </div>
        </div>
      </div>

      {/* Danh sách */}
      <div className="space-y-4">
        {currentTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {searchTerm ? "Không tìm thấy mẫu website nào phù hợp" : "Chưa có mẫu website nào"}
            </div>
            {!searchTerm && <Button onClick={() => navigate("new")}>Thêm mẫu đầu tiên</Button>}
          </div>
        ) : (
          currentTemplates.map((t) => (
            <Card
              key={t.id}
              className="group border-2 border-gray-300 admin-dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 bg-slate-50 admin-dark:bg-slate-800"
            >
              <CardContent className="px-4">
                <div className="flex min-h-[200px]">
                  {/* Hình ảnh */}
                  <div className="relative w-120 h-50 flex-shrink-0">
                    {t.image_url ? (
                      <img
                        src={`${import.meta.env.VITE_MAIN_BE_URL}${t.image_url}`}
                        alt={t.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Không có hình ảnh</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                        {t.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Nội dung */}
                  <div className="flex-1 px-6 pr-0">
                    <h3 className="font-semibold text-xl mb-1 line-clamp-2">{t.name}</h3>
                    <p className="text-sm text-gray-600 admin-dark:text-gray-400">
                      Người đăng: <span className="text-blue-600 font-medium">Admin</span>
                    </p>
                    <p className="text-sm">Danh mục: {t.category}</p>

                    <div className="mt-3">
                      <p className="text-sm font-medium">Công nghệ:</p>
                      <div className="flex flex-wrap gap-1">
                        {t.tech?.map((item) => (
                          <Badge key={item} variant="outline" className="text-xs text-foreground">{item}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium">Các loại File:</p>
                      <div className="flex flex-wrap gap-2">
                        {t.tags?.slice(0, 6).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs text-foreground">{tag}</Badge>
                        ))}
                        {t.tags?.length > 6 && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            +{t.tags.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar phải */}
                  <div className="w-56 border-l-2 border-gray-300 p-2 flex flex-col justify-between">
                    <div className="flex items-center justify-end gap-1 mb-4">
                      <div
                        className={`${t.export_state ? "bg-green-600 text-white" : "bg-gray-400 text-gray-900"} flex mr-4 items-center gap-1 px-2 py-1 rounded-lg`}
                      >
                        {t.export_state ? "Đã xuất bản" : "Chưa xuất bản"}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`${t.id}/edit`)}
                        className="h-8 w-8 p-0"
                      >
                        <SquarePen className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa mẫu "{t.name}"? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(t.id)}>Xóa</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold mb-2">
                        {t.price ? <ProductPrice price={t.price} /> : 0}
                        <span className="text-xs ml-1">Vnđ</span>
                      </div>
                      <p className="text-xs">Lượt xem: <span className="font-semibold">{t.views}</span></p>
                      <p className="text-xs">Cập nhật: {formatDate(t.updated_at)}</p>
                    </div>

                    <Button size="sm" onClick={() => navigate(`${t.id}`)} className="w-full bg-blue-600 text-white">
                      Xem mẫu
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
            Prev
          </Button>
          <span className="text-sm">Trang {currentPage} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

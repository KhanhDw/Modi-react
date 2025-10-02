import FilterModalListTemplateWebAdmin from "@/components/admin/templateWebsite/filterModalListTemplateWeb";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLenisToggle } from "@/contexts/LenisContext";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function WebsiteTemplateList() {
  const { templates, handleDelete } = useOutletContext();
  const { setEnabled } = useLenisToggle();
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const availableTags = [...new Set(templates?.flatMap((t) => t.tags || []))];
  const availableTech = [...new Set(templates?.flatMap((t) => t.tech || []))];
  const availableTopFeatures = [...new Set(templates?.flatMap((t) => t.top_features || []))];
  const availableAuthors = [...new Set(templates?.map(() => "Admin"))];

  const filteredTemplates = templates?.filter((t) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      t.name?.toLowerCase().includes(search) ||
      t.description?.toLowerCase().includes(search) ||
      t.category?.toLowerCase().includes(search) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(search)) ||
      t.tech?.some((tech) => tech.toLowerCase().includes(search)) ||
      t.top_features?.some((f) => f.toLowerCase().includes(search));

    const matchesTechnology =
      filters.technologies.length === 0 ||
      filters.technologies.some((tech) => t.tech?.includes(tech));

    const matchesTags =
      filters.tags.length === 0 ||
      filters.tags.some((tag) => t.tags?.includes(tag));

    const matchesAuthor =
      filters.authors.length === 0 || filters.authors.includes("Admin");

    const matchesStatus =
      !filters.publishStatus ||
      (filters.publishStatus === "published" && t.export_state) ||
      (filters.publishStatus === "draft" && !t.export_state);

    return matchesSearch && matchesTechnology && matchesTags && matchesAuthor && matchesStatus;
  }) || [];

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const ProductPrice = ({ price }) => {
    if (price == null) return <span className="text-gray-500 text-xs">Chưa cập nhật giá</span>;
    return <span>{Number(price).toLocaleString("vi-VN")}</span>;
  };

  const handleDialogToggle = (open) => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
      setEnabled(false);
    } else {
      document.documentElement.style.overflow = "";
      setEnabled(true);
    }
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold xs:text-xl sm:text-xl">Quản lý mẫu Website</h1>
          <Button
            onClick={() => navigate("new")}
            className="flex items-center gap-2 cursor-pointer bg-[#B6EADA] hover:bg-[#5B8FB9] text-black hover:text-white"
          >
            <Plus className="h-4 w-4" /> Thêm mẫu mới
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          <div className="flex items-center gap-1 text-gray-600 admin-dark:text-white font-semibold">
            <p>Hiện có {templates.length} website mẫu</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {currentTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {searchTerm ? "Không tìm thấy mẫu website nào phù hợp" : "Chưa có mẫu website nào"}
            </div>
            {!searchTerm && <Button className="cursor-pointer bg-blue-700 hover:bg-blue-800 text-white" onClick={() => navigate("new")}>Thêm mẫu đầu tiên</Button>}
          </div>
        ) : (
          currentTemplates.map((t) => (
            <Card
              key={t.id}
              className="group border-2 border-gray-300 admin-dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 bg-slate-50 admin-dark:bg-slate-800"
            >
              <CardContent className="px-4">
                <div className="flex flex-col md:flex-row min-h-[200px] gap-4 sm:gap-2">
                  {/* Hình ảnh */}
                  <div className="relative w-full sm:w-auto h-40 sm:h-auto flex-shrink-0 md:w-50 ">
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
                  <div className="flex-1 px-0 sm:px-auto pr-0">
                    <h3 className="font-semibold text-gray-900 admin-dark:text-gray-100 text-xl mb-1 line-clamp-2">{t.name}</h3>
                    <p className="text-sm text-gray-600 admin-dark:text-gray-400">
                      Người đăng: <span className="text-blue-600 font-medium ">Admin</span>
                    </p>
                    <p className="text-sm text-gray-900 admin-dark:text-gray-100 ">Danh mục: {t.category}</p>

                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-900 admin-dark:text-gray-100 ">Công nghệ:</p>
                      <div className="flex flex-wrap gap-1">
                        {t.tech?.map((item) => (
                          <Badge key={item} variant="outline" className="text-xs text-gray-900 admin-dark:text-gray-100 mt-0.5">{item}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-900 admin-dark:text-gray-100 ">Các loại File:</p>
                      <div className="flex flex-wrap gap-2">
                        {t.tags?.slice(0, 6).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs text-gray-900 admin-dark:text-gray-100 mt-0.5">{tag}</Badge>
                        ))}
                        {t.tags?.length > 6 && (
                          <Badge variant="outline" className="text-xs text-gray-500 mt-0.5">
                            +{t.tags.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar phải */}
                  <div className="w-full md:w-56 border-t md:border-t-0 md:border-l-2 border-gray-300 pt-4 md:pt-0 md:p-2 flex flex-col justify-between ">
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
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <SquarePen className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500 cursor-pointer">
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
                      <div className="text-xl font-bold mb-2 text-gray-900 admin-dark:text-gray-100 ">
                        {t.price ? <ProductPrice price={t.price} /> : 0}
                        <span className="text-xs ml-1">VND</span>
                      </div>
                      <p className="text-xs text-gray-900 admin-dark:text-gray-100 ">Lượt xem:
                        <span className="font-semibold text-gray-900 admin-dark:text-gray-100 ">{t.views}</span>
                      </p>
                      <p className="text-xs text-gray-900 admin-dark:text-gray-100 ">Cập nhật: {formatDate(t.updated_at)}</p>
                    </div>

                    <Button size="sm" onClick={() => navigate(`${t.id}`)} className="w-full bg-blue-500 text-white gap mt-2 cursor-pointer hover:bg-blue-600">
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

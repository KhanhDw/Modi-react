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
import { useLenisToggle } from "@/contexts/LenisContext";

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
    if (price == null) return <span className="text-gray-500 text-xs sm:text-sm">Chưa cập nhật giá</span>;
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
    <div className="mx-auto p-2 sm:p-4">
      <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 admin-dark:text-gray-100">Quản lý mẫu Website</h1>
          <Button
            onClick={() => navigate("new")}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-blue-700 text-white hover:bg-blue-800"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" /> Thêm mẫu mới
          </Button>
        </div>

        <div className="flex flex-col gap-2 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <FilterModalListTemplateWebAdmin
              filters={filters}
              onFiltersChange={setFilters}
              availableTags={availableTags}
              availableAuthors={availableAuthors}
              availableTech={availableTech}
              availableTopFeatures={availableTopFeatures}
              onDialogToggle={handleDialogToggle}
            />
            <div className="relative w-full sm:w-64 md:w-80">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 h-3 w-3 sm:h-4 sm:w-4" />
              <Input
                placeholder="Tìm kiếm mẫu website..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 text-xs sm:text-sm w-full border-2 border-gray-300 admin-dark:border-gray-700 rounded-lg shadow-sm"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs sm:text-sm text-gray-600 admin-dark:text-white font-semibold">
            <p>Hiện có</p>
            <p>{templates.length}</p>
            <p>website mẫu</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {currentTemplates.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-500 admin-dark:text-gray-400 text-sm sm:text-base mb-2 sm:mb-4">
              {searchTerm ? "Không tìm thấy mẫu website nào phù hợp" : "Chưa có mẫu website nào"}
            </div>
            {!searchTerm && (
              <Button
                className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-blue-700 text-white hover:bg-blue-800"
                onClick={() => navigate("new")}
              >
                Thêm mẫu đầu tiên
              </Button>
            )}
          </div>
        ) : (
          currentTemplates.map((t) => (
            <Card
              key={t.id}
              className="group border-2 border-gray-300 admin-dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 bg-slate-50 admin-dark:bg-slate-800"
            >
              <CardContent className="px-2 sm:px-4 py-4">
                <div className="flex flex-col sm:flex-row min-h-[150px] sm:min-h-[200px] gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-48 h-32 sm:h-48 flex-shrink-0">
                    {t.image_url ? (
                      <img
                        src={`${import.meta.env.VITE_MAIN_BE_URL}${t.image_url}`}
                        alt={t.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg flex items-center justify-center bg-gray-100 admin-dark:bg-gray-700">
                        <span className="text-gray-500 admin-dark:text-gray-400 text-xs sm:text-sm">Không có hình ảnh</span>
                      </div>
                    )}
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 admin-dark:bg-orange-200 admin-dark:text-orange-900 admin-dark:border-orange-300 text-xs sm:text-sm">
                        {t.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 admin-dark:text-gray-100 text-base sm:text-lg md:text-xl mb-1 sm:mb-2 line-clamp-2">
                      {t.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 admin-dark:text-gray-400">
                      Người đăng: <span className="text-blue-600 admin-dark:text-blue-400 font-medium">Admin</span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-900 admin-dark:text-gray-100">Danh mục: {t.category}</p>

                    <div className="mt-2 sm:mt-3">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 admin-dark:text-gray-100">Công nghệ:</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {t.tech?.map((item) => (
                          <Badge key={item} variant="outline" className="text-xs sm:text-sm text-gray-900 admin-dark:text-gray-100">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2 sm:mt-3">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 admin-dark:text-gray-100">Các loại File:</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {t.tags?.slice(0, 6).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs sm:text-sm text-gray-900 admin-dark:text-gray-100">
                            {tag}
                          </Badge>
                        ))}
                        {t.tags?.length > 6 && (
                          <Badge variant="outline" className="text-xs sm:text-sm text-gray-500 admin-dark:text-gray-400">
                            +{t.tags.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-48 border-t sm:border-t-0 sm:border-l border-gray-300 admin-dark:border-gray-700 pt-4 sm:pt-0 sm:pl-2 flex flex-col justify-between gap-2 sm:gap-4">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <div
                        className={`${
                          t.export_state ? "bg-green-600 text-white" : "bg-gray-400 text-gray-900 admin-dark:text-gray-100"
                        } flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg`}
                      >
                        {t.export_state ? "Đã xuất bản" : "Chưa xuất bản"}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`${t.id}/edit`)}
                        className="h-7 sm:h-8 w-7 sm:w-8 p-0 border border-gray-300 admin-dark:border-gray-700"
                      >
                        <SquarePen className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-red-500 border border-gray-300 admin-dark:border-gray-700"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white admin-dark:bg-gray-800 border border-gray-300 admin-dark:border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base sm:text-lg text-gray-900 admin-dark:text-gray-100">Xác nhận xóa</AlertDialogTitle>
                            <AlertDialogDescription className="text-xs sm:text-sm text-gray-600 admin-dark:text-gray-400">
                              Bạn có chắc chắn muốn xóa mẫu "{t.name}"? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-xs sm:text-sm border border-gray-300 admin-dark:border-gray-700 text-gray-900 admin-dark:text-gray-100">Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(t.id)}
                              className="text-xs sm:text-sm bg-red-600 text-white hover:bg-red-700"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="text-right">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-gray-900 admin-dark:text-gray-100">
                        {t.price ? <ProductPrice price={t.price} /> : 0}
                        <span className="text-xs sm:text-sm ml-1">Vnđ</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-900 admin-dark:text-gray-100">
                        Lượt xem: <span className="font-semibold">{t.views}</span>
                      </p>
                      <p className="text-xs sm:text-sm text-gray-900 admin-dark:text-gray-100">Cập nhật: {formatDate(t.updated_at)}</p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => navigate(`${t.id}`)}
                      className="w-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-blue-600 text-white hover:bg-blue-800"
                    >
                      Xem mẫu
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 admin-dark:border-gray-700"
          >
            Prev
          </Button>
          <span className="text-xs sm:text-sm text-gray-900 admin-dark:text-gray-100">Trang {currentPage} / {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 admin-dark:border-gray-700"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
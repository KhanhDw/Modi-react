import FilterModalListTemplateWebAdmin from "@/components/admin/templateWebsite/filterModalListTemplateWeb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLenisToggle } from "@/contexts/LenisContext";
import { Plus, Search, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ConfirmDeleteDialog from "./DeleteAlertDialog";

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
  const availableTopFeatures = [
    ...new Set(templates?.flatMap((t) => t.top_features || [])),
  ];
  const availableAuthors = [...new Set(templates?.map(() => "Admin"))];

  const filteredTemplates =
    templates?.filter((t) => {
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

      return (
        matchesSearch &&
        matchesTechnology &&
        matchesTags &&
        matchesAuthor &&
        matchesStatus
      );
    }) || [];

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTemplates = filteredTemplates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const ProductPrice = ({ price }) => {
    if (price == null)
      return <span className="text-gray-500 text-xs">Chưa cập nhật giá</span>;
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
    <div className="mx-auto">
      <div className="flex flex-col gap-6 mb-3 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
          <h1 className="text-2xl font-bold xs:text-xl sm:text-xl">
            Quản lý mẫu Website
          </h1>
          <Button
            onClick={() => navigate("new")}
            className="flex items-center shadow gap-2 cursor-pointer bg-[#B6EADA] hover:bg-[#5B8FB9] text-black"
          >
            <Plus className="h-4 w-4 text-gray-700 admin-dark:text-gray-800" />
            <span className="text-sm sm:text-base font-semibold text-gray-700 admin-dark:text-gray-800">
              Thêm mẫu mới
            </span>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row sm:items-center sm:justify-between gap-4 w-full">
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
            <div className="relative md:min-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 admin-dark:text-gray-300 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm mẫu website..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full admin-dark:bg-gray-800 border-2 border-gray-300 admin-dark:border-gray-700 rounded-lg shadow-sm placeholder:text-gray-500 admin-dark:placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-end gap-1 text-gray-600 admin-dark:text-white font-semibold">
            <p className="text-sm sm:text-base">
              Hiện có {templates.length} website mẫu
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {currentTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 admin-dark:text-gray-400 mb-4 text-sm sm:text-base">
              {searchTerm
                ? "Không tìm thấy mẫu website nào phù hợp"
                : "Chưa có mẫu website nào"}
            </div>
            {!searchTerm && (
              <Button
                className="cursor-pointer bg-blue-700 hover:bg-blue-800 text-white"
                onClick={() => navigate("new")}
              >
                <span className="text-sm sm:text-base font-semibold">
                  Thêm mẫu đầu tiên
                </span>
              </Button>
            )}
          </div>
        ) : (
          currentTemplates.map((t) => (
            <div
              key={t.id}
              className="group border-2 py-2 sm:py-3 rounded-lg border-gray-300 admin-dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 bg-slate-50 admin-dark:bg-slate-800"
            >
              <div className="px-2 sm:px-3">
                <div className="flex flex-col md:flex-row min-h-[200px] gap-4 sm:gap-2">
                  {/* Hình ảnh */}
                  <div className="relative w-full sm:w-auto h-40 sm:h-auto flex-shrink-0 md:w-80 ">
                    {t.image_url ? (
                      <img
                        src={`${import.meta.env.VITE_MAIN_BE_URL}${
                          t.image_url
                        }`}
                        alt={t.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Không có hình ảnh</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-800 border-orange-200"
                      >
                        {t.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Nội dung */}
                  <div className="w-full flex flex-col md:flex-row md:items-start gap-2">
                    <div className="flex-1 px-0 sm:px-auto pr-0">
                      <h3 className="font-semibold text-gray-900 admin-dark:text-gray-100 text-base sm:text-lg mb-1 line-clamp-2">
                        {t.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 admin-dark:text-gray-400 font-semibold">
                        Người đăng:{" "}
                        <span className="text-xs sm:text-sm text-blue-600 font-medium ">
                          Admin
                        </span>
                      </p>
                      <p className="mt-2 text-xs sm:text-sm text-gray-700 admin-dark:text-gray-100 font-semibold">
                        Danh mục: {t.category}
                      </p>

                      <div className="mt-2">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 admin-dark:text-gray-100 ">
                          Công nghệ:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {t.tech?.map((item) => (
                            <Badge
                              key={item}
                              variant="outline"
                              className="text-xs text-gray-900 admin-dark:text-gray-100 mt-0.5"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 admin-dark:text-gray-100 ">
                          Các loại File:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {t.tags?.slice(0, 6).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs text-gray-800 admin-dark:text-gray-200 mt-1"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {t.tags?.length > 6 && (
                            <Badge
                              variant="outline"
                              className="text-xs text-gray-800 admin-dark:text-gray-200 mt-1"
                            >
                              +{t.tags.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar phải */}
                    <div className="w-full md:w-56 md:h-full md:pt-0 flex flex-col justify-between border-t md:border-t-0 md:border-l-2 border-gray-300">
                      <div className="h-fit md:pl-2 pt-2 md:pt-0">
                        <div className="flex items-center justify-end md:justify-center gap-2 mb-2">
                          <div
                            className={`${
                              t.export_state
                                ? "bg-green-600 text-white"
                                : "bg-gray-400 text-gray-900"
                            } flex mr-4 items-center gap-1 px-2 py-1 rounded-sm`}
                          >
                            <span className="text-sm sm:text-sm font-semibold text-white">
                              {t.export_state ? "Đã xuất bản" : "Chưa xuất bản"}
                            </span>
                          </div>

                          <Button
                            type="button"
                            onClick={() => navigate(`${t.id}/edit`)}
                            className="flex items-center justify-center
    h-8 w-8 p-1
    rounded-sm bg-blue-100 text-blue-600
    hover:bg-blue-200 hover:text-blue-700
    admin-dark:bg-blue-950 admin-dark:text-blue-400
    admin-dark:hover:bg-blue-900
    transition-colors duration-200 border-none cursor-pointer shadow-lg"
                          >
                            <SquarePen className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>

                          <ConfirmDeleteDialog
                            name={t.name}
                            id={t.id}
                            handleDelete={handleDelete}
                            className="shadow-lg"
                          />
                        </div>
                        <div className="bg-white admin-dark:bg-gray-900 rounded-xl shadow-sm p-4 space-y-3 text-sm sm:text-base">
                          {/* Giá */}
                          <div className="flex justify-between items-center border-b border-gray-200 admin-dark:border-gray-700 pb-2">
                            <span className="text-gray-500 admin-dark:text-gray-400">
                              Giá
                            </span>
                            <span className="font-bold text-gray-900 admin-dark:text-gray-100">
                              {t.price ? <ProductPrice price={t.price} /> : 0} đ
                            </span>
                          </div>

                          {/* Lượt xem */}
                          <div className="flex justify-between items-center border-b border-gray-200 admin-dark:border-gray-700 pb-2">
                            <span className="text-gray-500 admin-dark:text-gray-400">
                              Lượt xem
                            </span>
                            <span className="font-semibold text-gray-900 admin-dark:text-gray-100">
                              {t.views}
                            </span>
                          </div>

                          {/* Cập nhật */}
                          <div className="flex justify-between items-center border-b border-gray-200 admin-dark:border-gray-700 pb-2">
                            <span className="text-gray-500 admin-dark:text-gray-400">
                              Cập nhật
                            </span>
                            <span className="text-gray-900 admin-dark:text-gray-100">
                              {formatDate(t.updated_at)}
                            </span>
                          </div>

                          {/* Ngôn ngữ */}
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 admin-dark:text-gray-400">
                              Ngôn ngữ
                            </span>
                            <div className="text-gray-900 admin-dark:text-gray-100 flex items-center gap-1">
                              {t.available_langs?.map((lang, index) =>
                                lang === "vi" ? (
                                  <p
                                    key={`ww-${index}`}
                                    className="border border-gray-500 px-1 rounded-sm font-semibold"
                                  >
                                    Vi
                                  </p>
                                ) : (
                                  <p
                                    key={`ww-${index}`}
                                    className="border border-gray-500 px-1 rounded-sm font-semibold"
                                  >
                                    En
                                  </p>
                                )
                              ) || "-"}
                            </div>
                          </div>
                        </div>

                        <div className="w-full mt-4 flex justify-center">
                          <Button
                            size="sm"
                            onClick={() => navigate(`${t.id}`)}
                            className="w-full sm:w-50 md:w-full bg-blue-500 text-white gap cursor-pointer hover:bg-blue-600"
                          >
                            <span className="text-sm sm:text-base font-semibold text-white">
                              Xem mẫu
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

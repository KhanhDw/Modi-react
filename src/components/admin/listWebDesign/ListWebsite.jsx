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

export default function WebsiteTemplateList() {
  const { templates, handleDelete } = useOutletContext();
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

  // Phân trang (paginate 5 / trang)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset về trang 1 khi search/filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const availableTags = templates ? [...new Set(templates.flatMap((t) => t.tags))] : [];
  const availableTech = templates ? [...new Set(templates.flatMap((t) => t.tech))] : [];
  const availableTopFeatures = templates ? [...new Set(templates.flatMap((t) => t.top_features))] : [];
  const availableAuthors = templates ? [...new Set(templates.map((t) => "Admin"))] : [];

  const filteredTemplates = templates
    ? templates.filter((template) => {
      const matchesSearch =
        searchTerm === "" ||
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      template.tech.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      template.top_features.some((top_feature) => top_feature.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTechnology =
        filters.technologies.length === 0 ||
        filters.technologies.some(
          (tech) =>
            template.name.toLowerCase().includes(tech.toLowerCase()) ||
            template.description.toLowerCase().includes(tech.toLowerCase())
        );

      const matchesTags = filters.tags.length === 0 || filters.tags.some((tag) => template.tags.includes(tag));

      const matchesAuthor = filters.authors.length === 0 || filters.authors.includes("Admin");

      const matchesDate = filters.dateRange === "" || true;

      const matchesStatus =
        filters.publishStatus === "" ||
        (filters.publishStatus === "published" && template.export_state) ||
        (filters.publishStatus === "draft" && !template.export_state);

      return matchesSearch && matchesTechnology && matchesTags && matchesAuthor && matchesDate && matchesStatus;
    })
    : [];

  // Tính trang hiện tại
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, startIndex + itemsPerPage);

  // Format date function for displaying last updated date
  // This function formats the date to "DD/MM/YYYY"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const ProductPrice = ({ price }) => {
    if (price === null || price === undefined) {
      return <span className="text-gray-500 text-xs">Chưa cập nhật giá</span>;
    }

    if (typeof price !== 'number') {
      return <span>{price}</span>;
    }

    const formattedPrice = price.toLocaleString('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return (
      <span>{formattedPrice}</span>
    );
  };


  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quản lý mẫu Website</h1>
          <Button onClick={() => navigate("new")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Thêm mẫu mới
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <FilterModalListTemplateWebAdmin
              filters={filters}
              onFiltersChange={setFilters}
              availableTags={availableTags}
              availableAuthors={availableAuthors}
            />
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm mẫu website..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-gray-300 admin-dark:border-gray-700 rounded-lg shadow-sm"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-600  admin-dark:text-gray-500 font-semibold">
              <p>Hiện có</p>
              {templates.length}
              <p>website mẫu</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {currentTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {searchTerm ? "Không tìm thấy mẫu website nào phù hợp" : "Chưa có mẫu website nào"}
            </div>
            {!searchTerm && (
              <Button onClick={() => navigate("new")}>Thêm mẫu đầu tiên</Button>
            )}
          </div>
        ) : (
          currentTemplates.map((template) => (
            <Card
              key={template.id}
              className="group border-2 border-gray-300 admin-dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 bg-slate-50 admin-dark:bg-slate-800"
            >
              <CardContent className="px-4">
                <div className="flex min-h-[200px]">
                  <div className="flex flex-1">
                    <div className="relative w-120 h-50 flex-shrink-0">
                      {template.image_url ? <img
                        src={`
                         ${import.meta.env.VITE_MAIN_BE_URL}${template.image_url}
                        `}
                        alt={template.name}
                        className="w-full h-full object-cover rounded-lg"
                      /> :
                        <div className="w-full h-full rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">Không có hình ảnh</span>
                        </div>
                      }
                      <div className="absolute top-3 left-3">
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-800 border-orange-200"
                        >
                          {template.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-1 px-6 pr-0">
                      <div className="mb-3">
                        <h3 className="font-semibold text-xl text-gray-900 admin-dark:text-gray-100 mb-1 line-clamp-2">
                          {template.name}
                        </h3>
                        <div className="text-sm text-gray-600 admin-dark:text-gray-400">
                          Người đăng:{" "}
                          <span className="text-blue-600 admin-dark:text-blue-400 font-medium">Admin</span>
                          <br />
                          <span>Thuộc danh mục: </span><p className="text-sm text-gray-600 admin-dark:text-yellow-400"> {template.category}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-gray-700 admin-dark:text-gray-300">
                          <span className="font-medium">Công nghệ:</span>
                          <div className="flex flex-wrap gap-1">
                            {template.tech !== null && template.tech.length > 0 &&
                              template.tech.slice(0, template.tech.length + 1).map((item) => (
                                <Badge
                                  key={item}
                                  variant="outline"
                                  className="text-xs bg-gray-50 admin-dark:bg-gray-800 text-gray-700 admin-dark:text-gray-300 border-gray-300 admin-dark:border-gray-600"
                                >
                                  {item}
                                </Badge>
                              ))}
                            {/* {template.tech !== null && template.tech.length > 2 && (
                              <button type="button" className="text-xs bg-gray-50 admin-dark:bg-gray-800 text-gray-700 admin-dark:text-gray-300 border-gray-300 admin-dark:border-gray-600 hover:bg-gray-200 admin-dark:hover:bg-gray-700 px-2 py-1 rounded">
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-gray-50 admin-dark:bg-gray-800 text-gray-500 admin-dark:text-green-400 focus:border-gray-900 admin-dark:border-gray-600"
                                >
                                  +{template.tech.length - 2} more
                                </Badge>
                              </button>
                            )} */}
                          </div>
                        </div>
                        {/* <span className="text-blue-600 admin-dark:text-blue-400">React 18.x</span>,{" "} */}
                        {/* <span className="text-gray-600 admin-dark:text-gray-400">TypeScript</span> */}
                        {/* </div> */}
                        {/* </p> */}
                      </div>

                      <div>
                        <p className="text-sm text-gray-700 admin-dark:text-gray-300 font-medium mb-2">Các loại File:</p>
                        <div className="flex flex-wrap gap-2">
                          {template.tags.slice(0, 6).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs bg-gray-50 admin-dark:bg-gray-800 text-gray-700 admin-dark:text-gray-300 border-gray-300 admin-dark:border-gray-600"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 6 && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-50 admin-dark:bg-gray-800 text-gray-500 admin-dark:text-gray-400"
                            >
                              +{template.tags.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-56 border-l-2 border-gray-300 admin-dark:border-gray-700 bg-gray-50/30 admin-dark:bg-gray-800/30 p-2 flex flex-col justify-between">
                    <div className="flex items-center justify-end gap-1 mb-4">
                      <div
                        className={`${template.export_state === 1 ? "bg-green-600 text-gray-100" : "bg-gray-400 text-gray-900"
                          } flex mr-4 items-center gap-1 px-2 py-1 rounded-lg`}
                      >
                        <p>{template.export_state === 1 ? "Đã xuất bản" : "Chưa xuất bản"}</p>
                      </div>

                      <Button
                        theme="admin"
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`${template.id}/edit`)}
                        className="h-8 w-8 p-0 hover:bg-transparent hover:border-slate-500 border-2 bg-white"
                        title="Chỉnh sửa"
                      >
                        <SquarePen className="h-4 w-4 text-gray-900 admin-dark:text-gray-100" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            theme="admin"
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-white text-red-500 hover:text-red-700 hover:bg-transparent hover:border-slate-500 border-2"
                            title="Xóa"
                          >
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
                            <AlertDialogAction onClick={() => handleDelete(template.id)}>Xóa</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="text-right">



                      <div className="text-3xl font-bold text-gray-900 admin-dark:text-gray-200 mb-2">{template.price ? <ProductPrice price={template.price} /> : 0}<span className="text-xs text-gray-700 admin-dark:text-gray-500 ml-1">Vnđ</span></div>


                      <div className="text-xs text-gray-700 admin-dark:text-gray-200 leading-relaxed">
                        Lượt xem: <sapn className="text-xl font-semibold text-blue-900 admin-dark:text-blue-400">{template.views}</sapn>
                      </div>
                      <div className="text-xs text-gray-700 admin-dark:text-gray-200 leading-relaxed">
                        Cập nhật:
                        <span className="ml-2 font-medium">
                          {formatDate(template.updated_at)}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => navigate(`${template.id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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

      {/* Pagination */}
      {
        totalPages > 1 && (
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
        )
      }
    </div >
  );
}

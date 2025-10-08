import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

export default function FilterModalListTemplateWebAdmin({
  filters,
  onFiltersChange,
  availableTags = [],
  availableAuthors = [],
  availableTech = [],
  availableTopFeatures = [],
  onDialogToggle,
}) {
  // useLenisLocal();
  const [isOpen, setIsOpen] = useState(false);

  // báo ra ngoài mỗi khi open/close
  useEffect(() => {
    if (onDialogToggle) {
      onDialogToggle(isOpen);
    }
  }, [isOpen, onDialogToggle]);

  const updateFilter = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  const toggleArrayFilter = (filterType, value) => {
    const currentArray = filters[filterType];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    onFiltersChange({
      ...filters,
      [filterType]: newArray,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      technologies: [],
      tags: [],
      top_features: [],
      authors: [],
      dateRange: "",
      publishStatus: "",
    });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.technologies.length +
      filters.tags.length +
      filters.top_features.length +
      filters.authors.length +
      (filters.dateRange ? 1 : 0) +
      (filters.publishStatus ? 1 : 0)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          theme="admin"
          variant="outline"
          className="w-20 gap-2 relative cursor-pointer
             border-gray-300 bg-black hover:bg-gray-800
             admin-dark:bg-gray-800 admin-dark:border-gray-600
             admin-dark:text-gray-100 admin-dark:hover:bg-gray-700 transition text-black"
        >
          <Filter className="h-4 w-4 text-white transition-colors" />
          <p className="font-semibold text-white">Lọc</p>
          {getActiveFiltersCount() > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs
             bg-red-500 text-white shadow-md rounded-full ring-2 ring-white admin-dark:ring-gray-900"
            >
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0 z-40" />

      <DialogContent
        className="lenis-local w-fit flex flex-col items-start max-w-none max-h-[80vh]
                   overflow-hidden rounded-xl shadow-lg
                   bg-white text-gray-900 border border-gray-200
                   admin-dark:bg-gray-900 admin-dark:text-gray-100 admin-dark:border-gray-700"
        data-lenis-prevent
      >
        <DialogHeader className="h-fit w-60 sm:w-90 md:w-full flex items-center justify-between border-b border-gray-200 admin-dark:border-gray-700">
          <DialogTitle className="flex flex-wrap items-center justify-between pb-3 w-full text-lg font-semibold">
            <p>Bộ lọc</p>
            <Button
              theme="admin"
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="border border-gray-300 admin-dark:border-gray-600 mr-10 text-sm text-gray-600 admin-dark:text-gray-400 admin-dark:hover:text-white transition cursor-pointer"
            >
              Xóa tất cả
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="w-full flex-1 overflow-y-auto scrollbar-hide max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 w-full">
            {/* Công nghệ */}
            <div>
              <h4 className="font-medium mb-3 admin-dark:text-gray-200">Công nghệ</h4>
              <div className="space-y-2">
                {availableTech.map((tech, index) => (
                  <div key={tech + index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tech-${tech}-${index}`}
                      checked={filters.technologies.includes(tech)}
                      onCheckedChange={() => toggleArrayFilter("technologies", tech)}
                      className="admin-dark:border-gray-600 border-gray-400 cursor-pointer"
                    />
                    <label
                      htmlFor={`tech-${tech}-${index}`}
                      className="text-sm cursor-pointer admin-dark:text-gray-300"
                    >
                      {tech}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="font-medium mb-3 admin-dark:text-gray-200">Tags</h4>
              <div className="space-y-2">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={filters.tags.includes(tag)}
                      onCheckedChange={() => toggleArrayFilter("tags", tag)}
                      className="admin-dark:border-gray-600 border-gray-400 cursor-pointer"
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm cursor-pointer admin-dark:text-gray-300"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tính năng nổi bật */}
            <div>
              <h4 className="font-medium mb-3 admin-dark:text-gray-200">Tính năng</h4>
              <div className="space-y-2">
                {availableTopFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={filters.top_features.includes(feature)}
                      onCheckedChange={() => toggleArrayFilter("top_features", feature)}
                      className="admin-dark:border-gray-600 border-gray-400 cursor-pointer"
                    />
                    <label
                      htmlFor={`feature-${feature}`}
                      className="text-sm cursor-pointer admin-dark:text-gray-300"
                    >
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tác giả */}
            <div>
              <h4 className="font-medium mb-3 admin-dark:text-gray-200">Tác giả</h4>
              <div className="space-y-2">
                {availableAuthors.map((author) => (
                  <div key={author} className="flex items-center space-x-2">
                    <Checkbox
                      id={`author-${author}`}
                      checked={filters.authors.includes(author)}
                      onCheckedChange={() => toggleArrayFilter("authors", author)}
                      className="admin-dark:border-gray-600 border-gray-400 cursor-pointer"
                    />
                    <label
                      htmlFor={`author-${author}`}
                      className="text-sm cursor-pointer admin-dark:text-gray-300"
                    >
                      {author}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Ngày đăng */}
            <div>
              <h4 className="font-medium mb-3 admin-dark:text-gray-200">Ngày đăng</h4>
              <div className="space-y-2">
                {[
                  { value: "", label: "Tất cả" },
                  { value: "today", label: "Hôm nay" },
                  { value: "week", label: "Tuần này" },
                  { value: "month", label: "Tháng này" },
                  { value: "year", label: "Năm nay" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`date-${opt.value}`}
                      checked={filters.dateRange === opt.value}
                      onCheckedChange={() => updateFilter("dateRange", opt.value)}
                      className="admin-dark:border-gray-600 border-gray-400 cursor-pointer"
                    />
                    <label
                      htmlFor={`date-${opt.value}`}
                      className="text-sm cursor-pointer admin-dark:text-gray-300"
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Trạng thái */}
            <div>
              <h4 className="font-medium mb-3 admin-dark:text-gray-200">Trạng thái</h4>
              <div className="space-y-2">
                {[
                  { value: "", label: "Tất cả" },
                  { value: "published", label: "Đã công bố" },
                  { value: "draft", label: "Chưa công bố" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${opt.value}`}
                      checked={filters.publishStatus === opt.value}
                      onCheckedChange={() => updateFilter("publishStatus", opt.value)}
                      className="admin-dark:border-gray-600 border-gray-400 cursor-pointer"
                    />
                    <label
                      htmlFor={`status-${opt.value}`}
                      className="text-sm cursor-pointer admin-dark:text-gray-300"
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="pt-6 w-full">
            <h4 className="font-medium mb-3 admin-dark:text-gray-200">Bộ lọc đang áp dụng</h4>
            <div className="flex flex-wrap gap-2">
              {filters.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs text-gray-800 admin-dark:text-gray-200 admin-dark:border-gray-600">
                  {tech}
                </Badge>
              ))}
              {filters.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-gray-800 admin-dark:text-gray-200 admin-dark:border-gray-600">
                  {tag}
                </Badge>
              ))}
              {filters.top_features.map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs text-gray-800 admin-dark:text-gray-200 admin-dark:border-gray-600">
                  {feature}
                </Badge>
              ))}
              {filters.authors.map((author) => (
                <Badge key={author} variant="outline" className="text-xs text-gray-800 admin-dark:text-gray-200 admin-dark:border-gray-600">
                  {author}
                </Badge>
              ))}
              {filters.dateRange && (
                <Badge variant="outline" className="text-xs text-gray-800 admin-dark:text-gray-200 admin-dark:border-gray-600">
                  Ngày: {filters.dateRange}
                </Badge>
              )}
              {filters.publishStatus && (
                <Badge variant="outline" className="text-xs text-gray-800 admin-dark:text-gray-200 admin-dark:border-gray-600">
                  {filters.publishStatus === "published" ? "Đã công bố" : "Chưa công bố"}
                </Badge>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

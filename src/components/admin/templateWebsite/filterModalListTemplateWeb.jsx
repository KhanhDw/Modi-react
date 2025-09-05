import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useLenisLocal from "@/hook/useLenisLocal";
import React, { useEffect } from "react";

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
        <Button theme="admin" variant="outline" className=" w-20 gap-2 relative ">
          <Filter className="h-4 w-4" />
          <p className="font-bold">Lọc</p>
          {getActiveFiltersCount() > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent
        className="lenis-local w-fit   flex flex-col items-start max-w-none 
             max-h-[80vh] overflow-hidden"
        data-lenis-prevent
      >
        <DialogHeader className="h-fit w-full flex items-center justify-between">
          <DialogTitle className="flex items-center justify-between pb-3 w-full">
            <p>Bộ lọc</p>
            <Button
              theme="admin"
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-100 admin-dark:text-gray-300 admin-dark:hover:text-gray-100 mr-10"
            >
              Xóa tất cả
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="w-full flex-1 overflow-y-auto scrollbar-hide max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 w-full">
            {/* Công nghệ */}
            <div>
              <h4 className="font-medium mb-3">Công nghệ</h4>
              <div className="space-y-2">
                {availableTech.map((tech, index) => (
                  <div key={tech + index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tech-${tech}-${index}`}
                      checked={filters.technologies.includes(tech)}
                      onCheckedChange={() => toggleArrayFilter("technologies", tech)}
                    />
                    <label htmlFor={`tech-${tech}-${index}`} className="text-sm cursor-pointer">
                      {tech}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="font-medium mb-3">Tags</h4>
              <div className="space-y-2">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={filters.tags.includes(tag)}
                      onCheckedChange={() => toggleArrayFilter("tags", tag)}
                    />
                    <label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tính năng nổi bật */}
            <div>
              <h4 className="font-medium mb-3">Tính năng</h4>
              <div className="space-y-2">
                {availableTopFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={filters.top_features.includes(feature)}
                      onCheckedChange={() => toggleArrayFilter("top_features", feature)}
                    />
                    <label htmlFor={`feature-${feature}`} className="text-sm cursor-pointer">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tác giả */}
            <div>
              <h4 className="font-medium mb-3">Tác giả</h4>
              <div className="space-y-2">
                {availableAuthors.map((author) => (
                  <div key={author} className="flex items-center space-x-2">
                    <Checkbox
                      id={`author-${author}`}
                      checked={filters.authors.includes(author)}
                      onCheckedChange={() => toggleArrayFilter("authors", author)}
                    />
                    <label htmlFor={`author-${author}`} className="text-sm cursor-pointer">
                      {author}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Ngày đăng */}
            <div>
              <h4 className="font-medium mb-3">Ngày đăng</h4>
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
                    />
                    <label htmlFor={`date-${opt.value}`} className="text-sm cursor-pointer">
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Trạng thái */}
            <div>
              <h4 className="font-medium mb-3">Trạng thái</h4>
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
                    />
                    <label htmlFor={`status-${opt.value}`} className="text-sm cursor-pointer">
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
            <h4 className="font-medium mb-3">Bộ lọc đang áp dụng</h4>
            <div className="flex flex-wrap gap-2">
              {filters.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs text-foreground">
                  {tech}
                </Badge>
              ))}
              {filters.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-foreground">
                  {tag}
                </Badge>
              ))}
              {filters.top_features.map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs text-foreground">
                  {feature}
                </Badge>
              ))}
              {filters.authors.map((author) => (
                <Badge key={author} variant="outline" className="text-xs text-foreground">
                  {author}
                </Badge>
              ))}
              {filters.dateRange && (
                <Badge variant="outline" className="text-xs text-foreground">
                  Ngày: {filters.dateRange}
                </Badge>
              )}
              {filters.publishStatus && (
                <Badge variant="outline" className="text-xs text-foreground">
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

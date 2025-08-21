import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useLenisLocal from "@/hook/useLenisLocal";

// Loại bỏ trùng lặp trong availableTechnologies
const availableTechnologies = [
  ...new Set(["React", "Vue", "PHP", "JavaScript", "TypeScript", "Next.js", "Angular", "Node.js"]),
];

export default function FilterModalListTemplateWebAdmin({ filters, onFiltersChange, availableTags, availableAuthors }) {
  useLenisLocal();
  const [isOpen, setIsOpen] = useState(false);

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
      authors: [],
      dateRange: "",
      publishStatus: "",
    });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.technologies.length +
      filters.tags.length +
      filters.authors.length +
      (filters.dateRange ? 1 : 0) +
      (filters.publishStatus ? 1 : 0)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button theme="admin" variant="outline" className="flex items-center gap-2 relative bg-[#525252]">
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
      <DialogContent className="lenis-local max-w-md max-h-[80vh] overflow-y-auto" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Bộ lọc
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

        <div className="space-y-6">
          {/* Technology Filter */}
          <div>
            <h4 className="font-medium mb-3">Công nghệ</h4>
            <div className="space-y-2">
              {availableTechnologies.map((tech, index) => (
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

          {/* Tags Filter */}
          <div>
            <h4 className="font-medium mb-3">Tags</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableTags.slice(0, 10).map((tag) => (
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

          {/* Author Filter */}
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

          {/* Date Range Filter */}
          <div>
            <h4 className="font-medium mb-3">Ngày đăng</h4>
            <Select
              value={filters.dateRange || "All"}
              onValueChange={(value) => updateFilter("dateRange", value === "All" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Tất cả</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="year">Năm này</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Publish Status Filter */}
          <div>
            <h4 className="font-medium mb-3">Trạng thái</h4>
            <Select
              value={filters.publishStatus || "All"}
              onValueChange={(value) => updateFilter("publishStatus", value === "All" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Tất cả</SelectItem>
                <SelectItem value="published">Đã công bố</SelectItem>
                <SelectItem value="draft">Chưa công bố</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Bộ lọc đang áp dụng</h4>
              <div className="flex flex-wrap gap-2">
                {filters.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("technologies", tech)} />
                  </Badge>
                ))}
                {filters.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("tags", tag)} />
                  </Badge>
                ))}
                {filters.authors.map((author) => (
                  <Badge key={author} variant="secondary" className="flex items-center gap-1">
                    {author}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("authors", author)} />
                  </Badge>
                ))}
                {filters.dateRange && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.dateRange === "today"
                      ? "Hôm nay"
                      : filters.dateRange === "week"
                      ? "Tuần này"
                      : filters.dateRange === "month"
                      ? "Tháng này"
                      : "Năm này"}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("dateRange", "")} />
                  </Badge>
                )}
                {filters.publishStatus && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.publishStatus === "published" ? "Đã công bố" : "Chưa công bố"}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("publishStatus", "")} />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
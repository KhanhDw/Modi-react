import { useState, useEffect } from "react";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const categories = ["E-commerce", "Portfolio", "Business", "Blog", "Landing Page", "Corporate", "Creative"];

export default function WebsiteTemplateEdit() {
  const { id } = useParams();
  const { templates, handleSave, handleAdd } = useOutletContext();
  const template = id !== "new" ? templates.find((t) => String(t.id) === id) : null;
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    if (template) {
      const categoryValue = (template.category ?? "").trim();
      return {
        name: template.name || "",
        description: template.description || "",
        imageUrl: template.imageUrl || "",
        url_github: template.url_github || "",
        category: categoryValue,
        tags: Array.isArray(template.tags) ? template.tags : [],
        export_state: !!template.export_state,
      };
    }
    return {
      name: "",
      description: "",
      imageUrl: "",
      url_github: "",
      category: "",
      tags: [],
      export_state: false,
    };
  });

  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localExportState, setLocalExportState] = useState(!!template?.export_state);

  useEffect(() => {
    if (!template) return;
    const categoryValue = (template.category ?? "").trim();
    setFormData({
      name: template.name || "",
      description: template.description || "",
      imageUrl: template.imageUrl || "",
      url_github: template.url_github || "",
      category: categoryValue,
      tags: Array.isArray(template.tags) ? template.tags : [],
      export_state: !!template.export_state,
    });
    setLocalExportState(!!template.export_state);
  }, [template, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (template) {
        await handleSave({
          ...template,
          ...formData,
          updated_at: new Date().toISOString().split("T")[0],
        });
      } else {
        await handleAdd({
          ...formData,
          created_at: new Date().toISOString().split("T")[0],
          updated_at: new Date().toISOString().split("T")[0],
        });
      }
      navigate(-1);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExportState = async () => {
    if (isLoading) return;
    const newExportState = !localExportState;
    setLocalExportState(newExportState);
    setFormData((prev) => ({ ...prev, export_state: newExportState }));
    if (template) {
      try {
        await handleSave({
          ...template,
          ...formData,
          export_state: newExportState,
          updated_at: new Date().toISOString().split("T")[0],
        });
      } catch (error) {
        console.error("Error toggling export state:", error);
        setLocalExportState(!newExportState);
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Bảo đảm option luôn chứa giá trị hiện tại từ CSDL (kể cả khi không có trong mảng categories)
  const categoryOptions = [
    ...(formData.category && !categories.includes(formData.category) ? [formData.category] : []),
    ...categories,
  ];

  return (
    <div className="mx-auto px-4 w-fit">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center hover:text-gray-800 gap-2 text-gray-700 admin-dark:text-gray-200 hover:bg-gray-100 admin-dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4 text-gray-900 admin-dark:text-gray-100" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 admin-dark:text-gray-100">
          {template ? "Chỉnh sửa mẫu" : "Thêm mẫu mới"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 admin-dark:text-gray-100">Thông tin mẫu</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-800 admin-dark:text-gray-200">Tên mẫu *</Label>
                <Input
                  id="name"
                  className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên mẫu website"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-800 admin-dark:text-gray-200">Mô tả *</Label>
                <Textarea
                  id="description"
                  className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả chi tiết về mẫu website"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-800 admin-dark:text-gray-200">Danh mục *</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="bg-white admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-900 admin-dark:text-gray-100">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border border-gray-300 admin-dark:border-gray-600">
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-gray-800 admin-dark:text-gray-200">URL hình ảnh</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="border-gray-300 admin-dark:border-gray-600 admin-dark:bg-gray-800"
                  >
                    <Upload className="h-4 w-4 admin-dark:text-gray-200" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urlGitHub" className="text-gray-800 admin-dark:text-gray-200">URL Github</Label>
                <div className="flex gap-2">
                  <Input
                    id="urlGitHub"
                    className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500"
                    value={formData.url_github}
                    onChange={(e) => setFormData((prev) => ({ ...prev, url_github: e.target.value }))}
                    placeholder="https://github.com/<userName>/<Repo>"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-800 admin-dark:text-gray-200">Trạng thái xuất bản</Label>
                <Button
                  type="button"
                  onClick={toggleExportState}
                  className={`w-full ${localExportState ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"} text-white`}
                  disabled={isLoading}
                >
                  {localExportState ? "Đã xuất bản" : "Chưa xuất bản"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-gray-800 admin-dark:text-gray-200">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tag và nhấn Enter"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    className="border-gray-300 admin-dark:border-gray-600 admin-dark:bg-gray-800"
                  >
                    Thêm
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground admin-dark:bg-gray-700 admin-dark:text-gray-300"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-500"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Đang lưu..." : template ? "Cập nhật" : "Thêm mẫu"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 admin-dark:text-gray-100">Xem trước</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!formData.imageUrl && (
                <div className="relative overflow-hidden rounded-lg w-full border-2 border-gray-300 admin-dark:border-gray-700">
                  <div className="w-120 h-50 flex items-center justify-center border-2 border-gray-600 admin-dark:border-gray-800 rounded-lg overflow-hidden">
                    <h1>Chưa có ảnh</h1>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="admin-dark:bg-gray-700 admin-dark:text-gray-300">
                      {formData.category || "Chưa có danh mục"}
                    </Badge>
                  </div>
                </div>
              )}
              {formData.imageUrl && (
                <div className="relative overflow-hidden rounded-lg w-full border-2 border-gray-300 admin-dark:border-gray-700">
                  <div className="w-120 h-50 border-2 border-gray-600 admin-dark:border-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-120 h-50 object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=300&width=400";
                      }}
                    />
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="admin-dark:bg-gray-700 admin-dark:text-gray-300">
                      {formData.category || "Chưa có danh mục"}
                    </Badge>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 admin-dark:text-gray-100">
                  {formData.name || "Tên mẫu"}
                </h3>
                <p className="text-muted-foreground text-sm mb-3 admin-dark:text-gray-400">
                  {formData.description || "Mô tả mẫu website"}
                </p>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs admin-dark:bg-gray-700 admin-dark:text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CustomSelect from "@/pages/managers/MarketingPage/OptionsSelect";

const categories = [
  { key: "E-commerce", name: "Thương Mại Điện Tử" },
  { key: "Portfolio", name: "Danh Mục Cá Nhân" },
  { key: "Business", name: "Kinh Doanh/Doanh Nghiệp" },
  { key: "Blog", name: "Blog/Tin Tức" },
  { key: "Landing Page", name: "Trang Đích (Landing Page)" },
  { key: "Corporate", name: "Công Ty/Tập Đoàn" },
  { key: "Creative", name: "Sáng Tạo/Nghệ Thuật" },
];

export default function WebsiteTemplateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const to01 = (v) =>
    v === 1 || v === "1" || v === true || v === "true" ? 1 : 0;

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const { templates, handleSave, handleAdd } = useOutletContext();
  const template =
    id !== "new" ? templates.find((t) => String(t.id) === id) : null;

  const [formData, setFormData] = useState(() => {
    if (template) {
      const categoryValue = (template.category ?? "").trim();
      return {
        name: template.name ?? "",
        description: template.description ?? "",
        image_url: template.image_url ?? "",
        url_github: template.url_github ?? "",
        category: categoryValue,
        price: template.price ?? 0,
        tech: Array.isArray(template.tech) ? template.tech : [],
        top_features: Array.isArray(template.top_features)
          ? template.top_features
          : [],
        tags: Array.isArray(template.tags) ? template.tags : [],
        export_state: to01(template.export_state),
        lang: template.lang ?? "vi",
      };
    }
    return {
      name: "",
      description: "",
      image_url: "",
      url_github: "",
      category: "",
      price: 0,
      tech: [],
      top_features: [],
      tags: [],
      export_state: 0,
      lang: "vi",
    };
  });

  const [file, setFile] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [newTech, setNewTech] = useState("");
  const [newTopFeature, setNewTopFeature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localExportState, setLocalExportState] = useState(0);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (template) {
      const categoryValue = (template.category ?? "").trim();
      setFormData({
        name: template.name || "",
        description: template.description || "",
        image_url: template.image_url || "",
        url_github: template.url_github || "",
        category: categoryValue,
        price: template.price || 0,
        tech: Array.isArray(template.tech) ? template.tech : [],
        top_features: Array.isArray(template.top_features)
          ? template.top_features
          : [],
        tags: Array.isArray(template.tags) ? template.tags : [],
        export_state: to01(template.export_state),
      });
      setLocalExportState(template.export_state);
      setPreview(
        template.image_url
          ? `${import.meta.env.VITE_MAIN_BE_URL}${template.image_url}`
          : ""
      );
      setFile(null);
    } else {
      setFormData({
        name: "",
        description: "",
        image_url: "",
        url_github: "",
        category: "",
        price: 0,
        tech: [],
        top_features: [],
        tags: [],
        export_state: 0,
      });
      setPreview("");
      setFile(null);
    }
  }, [template, id]);

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

  const addTopFeature = () => {
    if (
      newTopFeature.trim() &&
      !formData.top_features.includes(newTopFeature.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        top_features: [...prev.top_features, newTopFeature.trim()],
      }));
      setNewTopFeature("");
    }
  };

  const removeTopFeature = (top_featuresToRemove) => {
    setFormData((prev) => ({
      ...prev,
      top_features: prev.top_features.filter(
        (top_features) => top_features !== top_featuresToRemove
      ),
    }));
  };

  const handleKeyPressTopFeature = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTopFeature();
    }
  };

  const addTech = () => {
    if (newTech.trim() && !formData.tech.includes(newTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        tech: [...prev.tech, newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const removeTech = (techToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tech: prev.tech.filter((tech) => tech !== techToRemove),
    }));
  };

  const handleKeyPressTech = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTech();
    }
  };

  // const categoryOptions = [
  //   ...(formData.category && !categories.includes(formData.category)
  //     ? [formData.category]
  //     : []),
  //   ...categories,
  // ];

  const categoryOptions = categories;

  const toggleExportState = async () => {
    if (isLoading) return;
    setLocalExportState((prev) => (prev === 1 ? 0 : 1));
    setFormData((prev) => ({
      ...prev,
      export_state: formData.export_state === 1 ? 0 : 1,
    }));
  };

  const handleFileChange = (e) => {
    const fileImage = e.target.files[0];
    const { name } = e.target;

    if (fileImage) {
      setFormData((prev) => ({
        ...prev,
        [name]: fileImage,
      }));
      const objectUrl = URL.createObjectURL(fileImage);
      setPreview(objectUrl);
      setFile(fileImage);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: "",
      }));
      setFile(null);
      setPreview(
        formData.image_url
          ? `${import.meta.env.VITE_MAIN_BE_URL}${formData.image_url}`
          : ""
      );
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const [activeLang, setActiveLang] = useState("vi");

  const handleChangeLang = async (lang = "") => {
    if (!id) return;
    try {
      const langPath = lang === "en" ? `/${lang}` : "";
      const url = `${
        import.meta.env.VITE_MAIN_BE_URL
      }${langPath}/api/web-samples/${id}`;
      const res = await fetch(url);

      let websiteData = {};
      if (res.ok) {
        websiteData = await res.json();
      }

      if (!websiteData || Object.keys(websiteData).length === 0) {
        setFormData((prev) => ({
          ...prev,
          lang,
          name: "",
          description: "",
          top_features: [],
        }));
      } else {
        setFormData(websiteData);
      }

      setActiveLang(lang);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
    }
  };

  const handleActiveLangbtn = (lang) => {
    if (lang !== activeLang) {
      const confirmMsg =
        lang === "en"
          ? "Bạn đang chuyển sang Tiếng Anh. Khi cập nhật, dữ liệu sẽ được lưu ở Tiếng Anh."
          : "Bạn đang chuyển về Tiếng Việt. Khi cập nhật, dữ liệu sẽ được lưu ở Tiếng Việt.";

      const proceed = window.confirm(confirmMsg);
      if (!proceed) return;
    }

    setActiveLang(lang);
    handleChangeLang(lang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataUpload = new FormData();

      if (file) {
        formDataUpload.append("image_url", file);
      }

      const translations = [
        {
          lang: activeLang,
          name: formData.name,
          description: formData.description,
          tags: formData.tags ?? [],
          top_features: formData.top_features ?? [],
        },
      ];
      formDataUpload.append("translations", JSON.stringify(translations));

      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === "image_url" ||
          key === "name" ||
          key === "description" ||
          key === "tags" ||
          key === "top_features"
        ) {
          return;
        }
        if (Array.isArray(value)) {
          formDataUpload.append(key, JSON.stringify(value));
        } else {
          formDataUpload.append(key, String(value));
        }
      });

      const today = new Date().toISOString().split("T")[0];
      if (template) {
        formDataUpload.append("updated_at", today);
        await handleSave(formDataUpload, template.id);
      } else {
        formDataUpload.append("created_at", today);
        formDataUpload.append("updated_at", today);
        await handleAdd(formDataUpload);
      }

      navigate(-1);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-full md:p-2">
      <div className="flex flex-col sm:flex-col md:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center hover:text-gray-800 gap-2 text-gray-700 admin-dark:text-gray-200 hover:bg-gray-100 admin-dark:hover:bg-gray-800 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-gray-900 admin-dark:text-gray-100" />
            <span className="text-sm sm:text-base">Quay lại</span>
          </Button>
          <h1 className="text-xl font-bold text-gray-900 admin-dark:text-gray-100">
            {template ? "Chỉnh sửa mẫu" : "Thêm mẫu mới"}
          </h1>
        </div>
        <div className="flex justify-center items-center gap-2 sm:gap-4">
          {[
            { key: "vi", label: "Tiếng Việt" },
            { key: "en", label: "Tiếng Anh" },
          ].map((lang) => (
            <button
              key={lang.key}
              type="button"
              name={lang.key}
              onClick={() => handleActiveLangbtn(lang.key)}
              className={`flex px-2 sm:px-3 py-1 sm:py-1.5 rounded-md font-semibold text-sm sm:text-xl transition-colors
                ${
                  activeLang === lang.key
                    ? "bg-blue-600 text-white cursor-pointer admin-dark:bg-blue-500 admin-dark:text-white"
                    : "bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 admin-dark:bg-blue-900 admin-dark:text-blue-300 admin-dark:hover:bg-blue-800"
                }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 sm:gap-6">
        <Card className="w-full bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-gray-900 admin-dark:text-gray-100 text-lg sm:text-xl">
              Thông tin mẫu
            </CardTitle>
            <Button
              type="button"
              onClick={toggleExportState}
              className={`w-full sm:w-auto mt-2 sm:mt-0 ${
                localExportState === 1
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 hover:bg-gray-500"
              } text-white cursor-pointer text-sm sm:text-base`}
              disabled={isLoading}
            >
              {localExportState === 1 ? "Đã xuất bản" : "Chưa xuất bản"}
            </Button>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-6"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-gray-800 admin-dark:text-gray-200"
                >
                  Tên mẫu *
                </Label>
                <Input
                  id="name"
                  className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500 text-sm sm:text-base"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nhập tên mẫu website"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-gray-800 admin-dark:text-gray-200"
                >
                  Mô tả *
                </Label>
                <Textarea
                  id="description"
                  className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500 text-sm sm:text-base focus:border-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Mô tả chi tiết về mẫu website"
                  rows={4}
                  required
                />
              </div>

              <div className="flex flex-col flex-wrap sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1 space-y-2 w-full">
                  <Label
                    htmlFor="category"
                    className="text-gray-800 admin-dark:text-gray-200"
                  >
                    Danh mục *
                  </Label>

                  <CustomSelect
                    value={formData.category || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                    placeholder="Chọn danh mục"
                    className="text-sm sm:text-base w-full sm:w-70 md:w-full"
                    options={categories.map((cat) => ({
                      value: cat.key,
                      label: cat.name,
                    }))}
                  />
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <Label
                    htmlFor="price"
                    className="text-gray-800 admin-dark:text-gray-200"
                  >
                    Giá *
                  </Label>
                  <NumericFormat
                    value={formData.price ?? ""}
                    onValueChange={(values) => {
                      setFormData((prev) => ({
                        ...prev,
                        price: values.floatValue || 0,
                      }));
                    }}
                    thousandSeparator=","
                    decimalScale={0}
                    allowNegative={false}
                    prefix="đ "
                    className="bg-white admin-dark:bg-gray-800 focus:outline-none border admin-dark:border-gray-700 border-gray-300 text-gray-900 admin-dark:text-gray-100 rounded-md px-3 py-1 text-sm sm:text-base"
                    placeholder="Nhập giá tiền"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="image_url"
                  className="text-gray-800 admin-dark:text-gray-200"
                >
                  URL hình ảnh
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="image_url"
                    name="image_url"
                    type="file"
                    accept="image/*"
                    className="bg-white admin-dark:bg-gray-800 text-gray-700 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500 cursor-pointer text-sm sm:text-base"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="urlGitHub"
                  className="text-gray-800 admin-dark:text-gray-200"
                >
                  URL Github
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="urlGitHub"
                    className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500 text-sm sm:text-base"
                    value={formData.url_github}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        url_github: e.target.value,
                      }))
                    }
                    placeholder="https://github.com/<userName>/<Repo>"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="tech"
                  className="text-gray-800 admin-dark:text-gray-200"
                >
                  Công nghệ sử dụng
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="tech"
                    className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500 text-sm sm:text-base"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={handleKeyPressTech}
                    placeholder="Nhập công nghệ và nhấn Enter"
                  />
                  <Button
                    type="button"
                    onClick={addTech}
                    variant="outline"
                    className="border-gray-300 bg-gray-300 hover:bg-gray-200 admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-600 cursor-pointer text-sm sm:text-base"
                  >
                    Thêm
                  </Button>
                </div>
                {formData?.tech?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="cursor-pointer bg-gray-300 hover:bg-gray-200 admin-dark:bg-gray-600 admin-dark:text-gray-100 text-xs sm:text-sm"
                        onClick={() => removeTech(tech)}
                      >
                        {tech} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="top_features"
                  className="text-gray-800 admin-dark:text-gray-200"
                >
                  Tính năng nổi bật
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="top_features"
                    className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500 text-sm sm:text-base"
                    value={newTopFeature}
                    onChange={(e) => setNewTopFeature(e.target.value)}
                    onKeyPress={handleKeyPressTopFeature}
                    placeholder="Nhập tính năng và nhấn Enter"
                  />
                  <Button
                    type="button"
                    onClick={addTopFeature}
                    variant="outline"
                    className="border-gray-300 bg-gray-300 hover:bg-gray-200 admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-600 cursor-pointer text-sm sm:text-base"
                  >
                    Thêm
                  </Button>
                </div>
                {formData?.top_features?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.top_features.map((top_feature) => (
                      <Badge
                        key={top_feature}
                        variant="secondary"
                        className="cursor-pointer bg-gray-300 hover:bg-gray-200 admin-dark:bg-gray-600 admin-dark:text-gray-100 text-xs sm:text-sm"
                        onClick={() => removeTopFeature(top_feature)}
                      >
                        {top_feature} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="tags"
                  className="text-gray-800 admin-dark:text-gray-200"
                >
                  Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500 text-sm sm:text-base"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tag và nhấn Enter"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    className="border-gray-300 bg-gray-300 hover:bg-gray-200 admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-600 cursor-pointer text-sm sm:text-base"
                  >
                    Thêm
                  </Button>
                </div>
                {formData?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer bg-gray-300 hover:bg-gray-200 admin-dark:bg-gray-600 admin-dark:text-gray-100 text-xs sm:text-sm"
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
                className="w-full flex bg-blue-500 hover:bg-blue-600 admin-dark:bg-blue-600 sm:w-60 sm:mx-auto admin-dark:hover:bg-blue-500 cursor-pointer px-4"
              >
                <Save className="h-4 w-4 text-white" />
                <span className="font-semibold text-sm sm:text-base text-white">
                  {isLoading
                    ? "Đang lưu..."
                    : template
                    ? "Cập nhật"
                    : "Thêm mẫu"}{" "}
                  {activeLang === "vi" ? "(Tiếng Việt)" : "(Tiếng Anh)"}
                </span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-fit bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 admin-dark:text-gray-100 text-lg sm:text-xl">
              Xem trước
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {preview ? (
                <div className="relative overflow-hidden rounded-lg w-full lg:w-120 border-2 border-gray-300 admin-dark:border-gray-700">
                  <div className="w-full lg:w-120 h-40 lg:h-50 admin-dark:border-gray-800 rounded-lg overflow-hidden">
                    <img
                      loading="lazy"
                      src={preview}
                      alt="Preview"
                      className="w-full lg:w-120 h-40 lg:h-50 object-cover"
                    />
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="admin-dark:bg-gray-700 admin-dark:text-gray-300 text-xs sm:text-sm"
                    >
                      {formData.category || "Chưa có danh mục"}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-lg w-full lg:w-120 border-2 border-gray-300 admin-dark:border-gray-700">
                  <div className="w-full lg:w-120 h-40 lg:h-50 flex items-center justify-center rounded-lg overflow-hidden">
                    <h1 className="text-sm sm:text-base text-gray-500">
                      Chưa có ảnh
                    </h1>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="admin-dark:bg-gray-700 admin-dark:text-gray-300 text-xs sm:text-sm"
                    >
                      {formData.category || "Chưa có danh mục"}
                    </Badge>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 admin-dark:text-gray-100">
                  {formData.name || "Tên mẫu"}
                </h3>
                <p className="max-w-full sm:max-w-6xl wrap-anywhere text-muted-foreground text-xs sm:text-sm admin-dark:text-gray-400 mb-3">
                  {formData.description || "Mô tả mẫu website"}
                </p>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs sm:text-sm text-gray-700 admin-dark:bg-gray-700 admin-dark:text-gray-300"
                      >
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

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
import { NumericFormat } from 'react-number-format';




const categories = ["E-commerce", "Portfolio", "Business", "Blog", "Landing Page", "Corporate", "Creative"];

export default function WebsiteTemplateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const to01 = (v) => (v === 1 || v === "1" || v === true || v === "true" ? 1 : 0);


  useEffect(() => {
    // Chặn reload / đóng tab khi đang mở form
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
  const template = id !== "new" ? templates.find((t) => String(t.id) === id) : null;

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
        top_features: Array.isArray(template.top_features) ? template.top_features : [],
        tags: Array.isArray(template.tags) ? template.tags : [],
        export_state: to01(template.export_state), // <- luôn 0/1
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
      export_state: 0, // <- 0/1
      lang: "vi",
    };
  });

  const [file, setFile] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [newTech, setNewTech] = useState("");
  const [newTopFeature, setNewTopFeature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localExportState, setLocalExportState] = useState(0);

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
        top_features: Array.isArray(template.top_features) ? template.top_features : [],
        tags: Array.isArray(template.tags) ? template.tags : [],
        export_state: to01(template.export_state),
      });
      setLocalExportState(template.export_state);
      setPreview(template.image_url ? `${import.meta.env.VITE_MAIN_BE_URL}${template.image_url}` : "");
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

  // top_features----------------------------------


  const addTopFeature = () => {
    if (newTopFeature.trim() && !formData.top_features.includes(newTopFeature.trim())) {
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
      top_features: prev.top_features.filter((top_features) => top_features !== top_featuresToRemove),
    }));
  };

  const handleKeyPressTopFeature = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTopFeature();
    }
  };

  // tech---------------------------------------

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

  // Bảo đảm option luôn chứa giá trị hiện tại từ CSDL (kể cả khi không có trong mảng categories)
  const categoryOptions = [
    ...(formData.category && !categories.includes(formData.category) ? [formData.category] : []),
    ...categories,
  ];


  const toggleExportState = async () => {
    if (isLoading) return;
    setLocalExportState((prev) => (prev === 1 ? 0 : 1));
    setFormData((prev) => ({ ...prev, export_state: formData.export_state === 1 ? 0 : 1 }));
  };


  const [preview, setPreview] = useState("");



  const handleFileChange = (e) => {
    const fileImage = e.target.files[0];
    const { name } = e.target; // "image_url"


    if (fileImage) {
      console.log(name, fileImage);
      // chỉ lấy tên file
      setFormData((prev) => ({
        ...prev,
        [name]: fileImage,
      }));

      // Nếu vẫn muốn có preview
      const objectUrl = URL.createObjectURL(fileImage);
      setPreview(objectUrl);
      setFile(fileImage); // Lưu file để gửi lên server
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

  // params: lang = "" | "en"
  const handleChangeLang = async (lang = "") => {
    if (!id) return;
    try {
      // thêm "/" nếu có lang
      const langPath = lang === 'en' ? `/${lang}` : "";
      const url = `${import.meta.env.VITE_MAIN_BE_URL}${langPath}/api/web-samples/${id}`;
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
        // ✅ Có dữ liệu -> hiển thị bình thường
        setFormData(websiteData);
      }

      setActiveLang(lang);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    }

    console.log("Đang load lang:", lang);
  };

  const handleActiveLangbtn = (lang) => {
    if (lang !== activeLang) {
      // cảnh báo nếu chuyển từ vi sang en
      const confirmMsg =
        lang === "en"
          ? "Bạn đang chuyển sang Tiếng Anh. Khi cập nhật, dữ liệu sẽ được lưu ở Tiếng Anh."
          : "Bạn đang chuyển về Tiếng Việt. Khi cập nhật, dữ liệu sẽ được lưu ở Tiếng Việt.";

      const proceed = window.confirm(confirmMsg);
      if (!proceed) return; // nếu user nhấn Hủy thì không chuyển
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

      // ✅ Thêm translations thủ công (FE cần gửi JSON.stringify)
      const translations = [
        {
          lang: activeLang,
          name: formData.name,            // lấy từ state formData
          description: formData.description,
          tags: formData.tags ?? [],
          top_features: formData.top_features ?? []
        }
        // có thể thêm lang khác nếu cần
      ];
      formDataUpload.append("translations", JSON.stringify(translations));

      // append các field khác từ state formData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image_url" || key === "name" || key === "description" || key === "tags" || key === "top_features") {
          // bỏ qua vì đã đưa vào translations
          return;
        }
        if (Array.isArray(value)) {
          formDataUpload.append(key, JSON.stringify(value));
        } else {
          formDataUpload.append(key, String(value));
        }
      });

      // append ngày tháng
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

  return (<>
    <div className="mx-auto max-w-fit">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
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
        <div className="flex justify-center items-center space-x-4">
          <button type="button" name="vi"
            onClick={() => handleActiveLangbtn("vi")}
            className={`${activeLang === "vi" ? "admin-dark:bg-blue-500 bg-slate-600 admin-dark:text-gray-100 text-gray-200" : "admin-dark:bg-slate-200 bg-slate-600 admin-dark:text-gray-800 text-gray-200"}  flex  px-2 py-1 rounded-md `}>
            <span className="font-semibold text-xl">Tiếng Việt</span>
          </button>
          <button type="button" name="en"
            onClick={() => handleActiveLangbtn("en")}
            className={`${activeLang === "en" ? "admin-dark:bg-blue-500 bg-slate-600 admin-dark:text-gray-100 text-gray-200" : "admin-dark:bg-slate-200 bg-slate-600 admin-dark:text-gray-800 text-gray-200"}  flex  px-2 py-1 rounded-md `}>
            <span className="font-semibold text-xl">Tiếng Anh</span>
          </button>
        </div>
      </div>

      <div className="flex  gap-7 items-start">
        <Card className="w-120 bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
          <CardHeader className={"flex items-center justify-between"}>
            <CardTitle className="text-gray-900 admin-dark:text-gray-100">Thông tin mẫu</CardTitle>
            <CardTitle className="text-gray-900 admin-dark:text-gray-100">
              <Button
                type="button"
                onClick={toggleExportState}
                className={`w-full ${localExportState === 1 ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"} text-white`}
                disabled={isLoading}
              >
                {localExportState === 1 ? "Đã xuất bản" : "Chưa xuất bản"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 ">
              <div className="space-y-2 ">
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
                  className="bg-white  admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả chi tiết về mẫu website"
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center justify-bettween w-full">
                <div className="w-full space-y-2">
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
                <div className="w-full space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-gray-800 admin-dark:text-gray-200"
                  >
                    Giá *
                  </Label>
                  <NumericFormat
                    value={formData.price ?? ""} // để rỗng nếu chưa có giá trị
                    onValueChange={(values) => {
                      setFormData((prev) => ({
                        ...prev,
                        price: values.floatValue || 0, // floatValue sẽ là số hoặc undefined
                      }));
                    }}
                    thousandSeparator="," // phân cách hàng nghìn
                    decimalScale={0} // không cho nhập số thập phân
                    allowNegative={false} // không cho nhập số âm
                    prefix="đ " // thêm tiền tố "đ "
                    className="bg-white admin-dark:bg-gray-800 border border-gray-300 admin-dark:border-gray-600 text-gray-900 admin-dark:text-gray-100 rounded-md px-3 py-2"
                    placeholder="Nhập giá tiền"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-gray-800 admin-dark:text-gray-200">URL hình ảnh</Label>
                <div className="flex gap-2">
                  {/* {isUploadFileImage ? ( */}
                  <Input
                    id="image_url"
                    name="image_url"
                    type="file"
                    accept="image/*"
                    className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500"
                    onChange={handleFileChange}
                  />
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
                <Label htmlFor="tech" className="text-gray-800 admin-dark:text-gray-200">Công nghệ sử dụng</Label>
                <div className="flex gap-2">
                  <Input
                    id="tech"
                    className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={handleKeyPressTech}
                    placeholder="Nhập công nghệ và nhấn Enter"
                  />
                  <Button
                    type="button"
                    onClick={addTech}
                    variant="outline"
                    className="border-gray-300 admin-dark:border-gray-600 admin-dark:bg-gray-800"
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
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground admin-dark:bg-gray-700 admin-dark:text-gray-300"
                        onClick={() => removeTech(tech)}
                      >
                        {tech} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>


              <div className="space-y-2">
                <Label htmlFor="top_features" className="text-gray-800 admin-dark:text-gray-200">Tính năng nổi bật</Label>
                <div className="flex gap-2">
                  <Input
                    id="top_features"
                    className="bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 border-gray-300 admin-dark:border-gray-600 placeholder-gray-400 admin-dark:placeholder-gray-500"
                    value={newTopFeature}
                    onChange={(e) => setNewTopFeature(e.target.value)}
                    onKeyPress={handleKeyPressTopFeature}
                    placeholder="Nhập tính năng và nhấn Enter"
                  />
                  <Button
                    type="button"
                    onClick={addTopFeature}
                    variant="outline"
                    className="border-gray-300 admin-dark:border-gray-600 admin-dark:bg-gray-800"
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
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground admin-dark:bg-gray-700 admin-dark:text-gray-300"
                        onClick={() => removeTopFeature(top_feature)}
                      >
                        {top_feature} ×
                      </Badge>
                    ))}
                  </div>
                )}
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

                {formData?.tags?.length > 0 && (
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
                <span className="font-semibold text-xl">{isLoading ? "Đang lưu..." : template ? "Cập nhật" : "Thêm mẫu"} {activeLang === "vi" ? "(Tiếng Việt)" : "(Tiếng Anh)"}</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="w-fit  bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 admin-dark:text-gray-100">Xem trước</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 ">
              {preview ? (
                <div className="relative overflow-hidden rounded-lg min-w-120 border-2 border-gray-300 admin-dark:border-gray-700">
                  <div className="w-fit h-50 border-2 border-gray-600 admin-dark:border-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      // src={formData.image_url ? `${import.meta.env.VITE_MAIN_BE_URL}${formData.image_url}` : ""}
                      alt="Preview"
                      className="w-120 h-50 object-cover"
                    />
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="admin-dark:bg-gray-700 admin-dark:text-gray-300">
                      {formData.category || "Chưa có danh mục"}
                    </Badge>
                  </div>
                </div>

              ) : (
                <div className="relative overflow-hidden rounded-lg w-fit border-2 border-gray-300 admin-dark:border-gray-700">
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

              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 admin-dark:text-gray-100">
                  {formData.name || "Tên mẫu"}
                </h3>
                <p className="max-w-6xl wrap-anywhere text-muted-foreground text-sm mb-3 admin-dark:text-gray-400">
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
    </div >
  </>
  );
}

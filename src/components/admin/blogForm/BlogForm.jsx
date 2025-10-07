import TextEditorWrapper from "@/components/feature/TextEditor/TextEditor";
import { Textarea } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import CustomSelect from "./OptionSelect";

export default function BlogForm({ blog, onSubmit, handleChangeLang, onCancel }) {
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    author_id: 1,          // mặc định = 1
    status: "draft",       // mặc định là draft
    published_at: new Date().toISOString().slice(0, 16),
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [activeLang, setActiveLang] = useState("vi");

  // ✅ Thêm state errors
  const [errors, setErrors] = useState({});

  // Reset form khi blog prop thay đổi
  useEffect(() => {
    if (blog) {
      setFormData((prev) => ({
        ...prev,
        title: blog.title ?? "",
        content: blog.content ?? "",
        image: blog.image ?? "",
        author_id: blog.author_id ?? 1,
        status: blog.status ?? prev.status,
        lang: blog.lang ?? prev.lang,
        published_at: blog.published_at
          ? blog.published_at.slice(0, 16)
          : prev.published_at,
      }));
      setPreview(blog.image ? `${import.meta.env.VITE_MAIN_BE_URL}${blog.image}` : "");
      setFile(null);
      setActiveLang(blog.lang ?? "vi");
    } else {
      setFormData({
        title: "",
        content: "",
        image: "",
        author_id: 1,
        lang: "vi",
        status: "draft",
        published_at: new Date().toISOString().slice(0, 16),
      });
      setPreview("");
      setFile(null);
      setActiveLang("vi");
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    } else {
      setFile(null);
      setPreview(
        formData.image
          ? `${import.meta.env.VITE_MAIN_BE_URL}${formData.image}`
          : ""
      );
    }

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const contentHTML = editorRef.current?.getHTML()?.trim() ?? "";

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề.";
    }
    if (!contentHTML) {
      newErrors.content = "Nội dung không được để trống.";
    }
    if (!blog && !file) {
      newErrors.image = "Vui lòng chọn ảnh.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSubmit = {
      ...formData,
      lang: activeLang,
      title: formData.title.trim(),
      content: contentHTML,
    };

    onSubmit(dataToSubmit, file);
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col lg:flex-row w-full gap-4 items-start"
    >
      {/* Left column */}
      <div className="w-full lg:w-1/3 flex flex-col gap-5 p-2 sm:p-3 rounded-md md:rounded-lg border-2 border-gray-300 admin-dark:border-gray-700 admin-dark:bg-slate-800">
        {!blog?.id && (
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-sm text-center">Chỉ thiết lập thêm nội dung cho Tiếng Việt</p>
            <p className="text-sm text-center">
              Cập nhật nội dung Tiếng Anh (sau khi thêm tin tức).
            </p>
          </div>
        )}

        {/* Lang switch */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-4 mb-4">
          {/* Nút Tiếng Việt */}
          <button
            type="button"
            name="vi"
            onClick={() => handleActiveLangbtn("vi")}
            className={`flex items-center shadow justify-center flex-col px-4 py-1.5 rounded-md font-semibold transition-colors cursor-pointer duration-200
      ${activeLang === "vi"
                ? "bg-blue-600 text-white admin-dark:bg-blue-500"
                : "bg-gray-300 text-gray-700 admin-dark:bg-gray-700 admin-dark:text-gray-300"
              }`}
          >
            <span className="text-sm md:text-base font-semibold">Tiếng Việt</span>
          </button>

          {/* Nút Tiếng Anh - chỉ hiện khi có blog.id */}
          {blog?.id && (
            <button
              type="button"
              name="en"
              onClick={() => handleActiveLangbtn("en")}
              className={`flex items-center shadow cursor-pointer justify-center flex-col px-4 py-1.5 rounded-md text-sm font-semibold transition-colors duration-200
        ${activeLang === "en"
                  ? "bg-blue-600 text-white admin-dark:bg-blue-500"
                  : "bg-gray-300 text-gray-700 admin-dark:bg-gray-700 admin-dark:text-gray-300"
                }`}
            >
              <span className="text-sm md:text-base font-semibold">Tiếng Anh</span>
            </button>
          )}
        </div>

        {/* Title */}
        <div>
          <span className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
            Tiêu đề
          </span>
          <Textarea
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề"
            rows={3}
            className={`w-full px-3 py-2 rounded-lg
      border
      ${errors.title ? "border-red-500" : "border-gray-300 admin-dark:border-gray-700"}
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      admin-dark:text-gray-200
      transition-colors duration-200
    `}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Status & Published */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-10 lg:flex-wrap lg:gap-4">
          <div className="w-fit lg:w-full">
            <span className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
              Trạng thái
            </span>
            <CustomSelect
              value={formData.status}
              onValueChange={(newValue) => handleChange({ target: { name: "status", value: newValue } })}
              options={[
                { value: "draft", label: "Nháp" },
                { value: "published", label: "Công khai" },
              ]}
              className={'w-full sm:w-40'}
            />

          </div>

          <div className="w-fit lg:w-full xl:w-fit">
            <span className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
              Ngày đăng
            </span>
            <input autoComplete="off"
              type="datetime-local"
              name="published_at"
              value={formData.published_at}
              onChange={handleChange}
              disabled={!blog} // ❌ không cho chỉnh khi thêm mới
              className={`w-full px-3 py-2 border-2 border-gray-300 rounded-lg admin-dark:border-gray-700 focus:outline-none admin-dark:text-gray-200
      ${!blog ? "bg-gray-200 admin-dark:bg-gray-800 text-gray-500 cursor-not-allowed" : ""}`} // style khi disable
            />
          </div>

        </div>

        {/* Image */}
        <div>
          <span className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
            Ảnh
          </span>
          <input autoComplete="off"
            type="file"
            accept="image/*"
            name="image"
            onChange={handleFileChange}
            className={`w-full px-3 py-2 border-2 rounded-lg cursor-pointer admin-dark:text-gray-200 ${errors.image ? "border-red-500" : "border-slate-300 admin-dark:border-slate-700"
              }`}
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          <div className="mt-2 w-full flex justify-center items-center rounded-md">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-62 sm:h-fit w-full object-cover rounded-md"
                onError={(e) => {
                  e.currentTarget.src = "/images/error.png";
                  e.currentTarget.onerror = null;
                }}
              />
            ) : (
              <p className="text-center text-sm font-medium text-green-800 admin-dark:text-gray-200">
                Nơi hiển thị ảnh
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row justify-center items-center gap-2 w-full">
          <button
            type="button"
            onClick={onCancel}
            className="px-2 py-1.5 w-full sm:w-40 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition duration-200 cursor-pointer admin-dark:bg-gray-600 admin-dark:hover:bg-gray-700"
          >
            <span className="text-sm md:text-base font-semibold">Hủy</span>
          </button>
          <button
            type="submit"
            className="px-2 py-1.5 w-full sm:w-40 text-white rounded-lg bg-green-700 hover:bg-green-800 transition duration-200 cursor-pointer"
          >
            <span className="font-semibold text-sm md:text-base">
              {blog ? "Cập nhật" : "Thêm"}
              {/* {activeLang === "vi" ? "(Việt)" : "(Anh)"} */}
            </span>
          </button>
        </div>
      </div>

      {/* Right column */}
      <div className="admin-dark:border-gray-700 w-full lg:w-2/3 p-2 sm:p-3 rounded-md md:rounded-lg border-2 border-gray-300 admin-dark:bg-slate-800 mt-4 lg:mt-0">
        <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
          Nội dung
        </label>
        <div className="w-full">
          <TextEditorWrapper ref={editorRef} value={formData.content} />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>
      </div>
    </form>
  );
}

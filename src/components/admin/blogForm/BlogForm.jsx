import { Textarea } from "@material-tailwind/react";
import React, { useState, useEffect, useRef } from "react";
import TextEditorWrapper from "@/components/feature/TextEditor/TextEditor";

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
      className="flex flex-col lg:flex-row w-full gap-6 items-start"
    >
      {/* Left column */}
      <div className="w-full lg:w-1/3 flex flex-col gap-5 p-4 rounded-xl border-2 border-gray-300 admin-dark:border-gray-700 admin-dark:bg-slate-800">
        {!blog?.id && (
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-sm">Chỉ thiết lập thêm nội dung cho Tiếng Việt</p>
            <p className="text-sm">
              Cập nhật nội dung Tiếng Anh (sau khi thêm tin tức).
            </p>
          </div>
        )}

        {/* Lang switch */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center  gap-2 sm:gap-4 mb-4">
          <button
            type="button"
            name="vi"
            onClick={() => handleActiveLangbtn("vi")}
            className={`flex items-center justify-center flex-col px-2 py-1 rounded-md text-xs cursor-pointer font-semibold ${activeLang === "vi"
              ? "bg-gray-200 text-white admin-dark:bg-gray-900 admin-dark:text-gray-300 cursor-pointer"
              : "bg-gray-300 text-gray-700 admin-dark:bg-gray-700 admin-dark:text-gray-300 cursor-pointer"
              }`}
          >
            Thiết lập nội dung tiếng Việt
          </button>
          {blog?.id && (
            <button
              type="button"
              name="en"
              onClick={() => handleActiveLangbtn("en")}
              className={`flex px-2 py-1 rounded-md text-sm cursor-pointer font-semibold ${activeLang === "en"
                ? "bg-blue-500 text-white admin-dark:bg-gray-900 admin-dark:text-white cursor-pointer"
                : "bg-gray-300 text-gray-700 admin-dark:bg-gray-700 admin-dark:text-gray-300 cursor-pointer"
                }`}
            >
              Thiết lập nội dung tiếng Anh
            </button>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
            Tiêu đề
          </label>
          <Textarea
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề"
            rows={3}
            className={`w-full px-3 py-2 border-2 rounded-lg  focus:ring-0 admin-dark:bg-gray-800 admin-dark:border-slate-700 admin-dark:text-gray-200
            ${errors.title ? "border-red-500" : "border-gray-300 admin-dark:border-slate-800"}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Status & Published */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 rounded-lg cursor-pointer admin-dark:bg-gray-800 admin-dark:border-slate-700 admin-dark:text-gray-200"
            >
              <option value="draft">Nháp</option>
              <option value="published">Công khai</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
              Ngày đăng
            </label>
            <input autoComplete="off"
              type="datetime-local"
              name="published_at"
              value={formData.published_at}
              onChange={handleChange}
              disabled={!blog} // ❌ không cho chỉnh khi thêm mới
              className={`w-full px-3 py-2 border-2 rounded-lg 
      admin-dark:bg-gray-800 admin-dark:border-slate-700 admin-dark:text-gray-200
      ${!blog ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`} // style khi disable
            />
          </div>

        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
            Ảnh
          </label>
          <input autoComplete="off"
            type="file"
            accept="image/*"
            name="image"
            onChange={handleFileChange}
            className={`w-full px-3 py-2 border-2 rounded-lg cursor-pointer admin-dark:text-gray-200 ${errors.image ? "border-red-500" : "border-slate-300 admin-dark:border-slate-700"
              }`}
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          <div className="mt-2 border w-full flex justify-center items-center rounded p-1">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-52 w-full object-cover rounded"
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
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 w-full sm:w-auto bg-gray-900 text-white rounded-lg hover:bg-gray-600 transition duration-200 cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 w-full sm:w-auto bg-gray-700 text-white rounded-lg hover:bg-green-900 transition duration-200 cursor-pointer"
          >
            <span className="font-semibold lg:text-sm xl:text-xl">
              {blog ? "Cập nhật" : "Thêm"} {activeLang === "vi" ? "(Việt)" : "(Anh)"}
            </span>
          </button>
        </div>
      </div>

      {/* Right column */}
      <div className="admin-dark:border-gray-700 w-full lg:w-2/3 p-4 rounded-xl border-2 border-gray-300 admin-dark:bg-slate-800 mt-4 lg:mt-0">
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

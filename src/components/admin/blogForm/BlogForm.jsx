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
    published_at: new Date().toISOString().slice(0, 16), // format cho input datetime-local
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [activeLang, setActiveLang] = useState("vi");

  // Reset form khi blog prop thay đổi
  useEffect(() => {
    if (blog) {
      setFormData((prev) => ({
        ...prev,
        title: blog.title ?? "",
        content: blog.content ?? "",
        image: blog.image ?? "",
        author_id: blog.author_id ?? 1,
        status: blog.status ?? prev.status, // ✅ giữ lại status hiện tại nếu blog không có
        lang: blog.lang ?? prev.lang, // ✅ giữ lại lang hiện tại nếu blog không có
        published_at: blog.published_at
          ? blog.published_at.slice(0, 16)
          : prev.published_at,
      }));
      setPreview(blog.image ? `${import.meta.env.VITE_MAIN_BE_URL}${blog.image}` : "");
      setFile(null); // Reset file input
      setActiveLang(blog.lang ?? 'vi');
    } else {
      setFormData({
        title: "",
        content: "",
        image: "",
        author_id: 1,
        lang: "vi",
        status: "draft",   // chỉ reset khi form add mới
        published_at: new Date().toISOString().slice(0, 16),
      });
      setPreview("");
      setFile(null);
      setActiveLang('vi');
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Preview
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra file khi tạo mới (không có blog)
    if (!formData && !file) {
      alert("Vui lòng chọn ảnh trước khi lưu.");
      return;
    }

    const contentHTML = editorRef.current?.getHTML()?.trim() ?? "";

    // Gom dữ liệu thành object thường
    const dataToSubmit = {
      ...formData,
      lang: activeLang,
      title: formData.title.trim(),
      content: contentHTML,
    };

    // Debug
    console.log("--- DataToSubmit debug ---", dataToSubmit, file);

    // Truyền object lên cha
    onSubmit(dataToSubmit, file);
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

  return (

    <form
      onSubmit={handleSubmit}
      className="flex flex-col lg:flex-row w-full gap-6 items-start"
    >
      {/* Left column: Form */}
      <div className="w-full lg:w-1/3 flex flex-col gap-5 p-4 rounded-xl border-2 border-gray-300 admin-dark:bg-slate-800">
        {/* Form content (lang switch, title, image, status, buttons) */}
        {/* <div className="flex flex-wrap sm:flex-nowrap justify-start sm:justify-end gap-2 sm:gap-4 mb-4">
          <button
            type="button"
            name="vi"
            onClick={() => handleActiveLangbtn("vi")}
            className={`flex px-2 py-1 rounded-md text-sm font-semibold ${activeLang === "vi"
              ? "bg-blue-500 text-white admin-dark:bg-blue-500 admin-dark:text-white"
              : "bg-gray-300 text-gray-700 admin-dark:bg-gray-700 admin-dark:text-gray-300"
              }`}
          >
            Tiếng Việt
          </button>
          {blog?.id && (
            <button
              type="button"
              name="en"
              onClick={() => handleActiveLangbtn("en")}
              className={`flex px-2 py-1 rounded-md text-sm font-semibold ${activeLang === "en"
                ? "bg-blue-500 text-white admin-dark:bg-blue-500 admin-dark:text-white"
                : "bg-gray-300 text-gray-700 admin-dark:bg-gray-700 admin-dark:text-gray-300"
                }`}
            >
              Tiếng Anh
            </button>
          )}
        </div> */}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
            Tiêu đề
          </label>
          <Textarea
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            spellCheck="false"
            placeholder="Nhập tiêu đề"
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 admin-dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:border-none focus:ring-gray-300 admin-dark:text-gray-200"
          />
        </div>

        {/* Status & Published */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 outline-none border-slate-300 rounded-lg bg-white admin-dark:bg-gray-800 admin-dark:border-slate-700 admin-dark:text-gray-200 cursor-pointer"
            >
              <option value="draft">Nháp</option>
              <option value="published">Công khai</option>
            </select>
          </div>

          {blog && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
                Ngày đăng
              </label>
              <input
                type="datetime-local"
                name="published_at"
                value={formData.published_at}
                onChange={handleChange}
                className="w-full outline-none border-2 px-3 py-2 admin-dark:border-slate-700 border-gray-300 rounded-lg admin-dark:text-gray-200"
              />
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
            Ảnh
          </label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border-2 border-slate-300 admin-dark:border-slate-700 rounded-lg admin-dark:text-gray-200 cursor-pointer"
          />
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
            <span className="font-semibold">
              {blog ? "Cập nhật" : "Thêm"} {activeLang === "vi" ? "(Việt)" : "(Anh)"}
            </span>
          </button>
        </div>
      </div>

      {/* Right column: Editor */}
      <div className="w-full lg:w-2/3 p-4 rounded-xl border-2 border-gray-300 admin-dark:bg-slate-800 mt-4 lg:mt-0">
        <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">
          Nội dung
        </label>
        <div className="w-full">
          <TextEditorWrapper ref={editorRef} value={formData.content} />
        </div>
      </div>
    </form>


  );
}
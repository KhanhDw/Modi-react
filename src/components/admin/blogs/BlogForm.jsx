import { useState, useEffect } from "react";

export default function BlogForm({ blog, onSubmit, onCancel }) {
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

  // Reset form khi blog prop thay đổi
  useEffect(() => {
    if (blog) {
      setFormData((prev) => ({
        ...prev,
        title: blog.title || "",
        content: blog.content || "",
        image: blog.image || "",
        author_id: blog.author_id || 1,
        status: blog.status ?? prev.status, // ✅ giữ lại status hiện tại nếu blog không có
        published_at: blog.published_at
          ? blog.published_at.slice(0, 16)
          : prev.published_at,
      }));
      setPreview(blog.image ? `${import.meta.env.VITE_MAIN_BE_URL}${blog.image}` : "");
      setFile(null); // Reset file input
    } else {
      setFormData({
        title: "",
        content: "",
        image: "",
        author_id: 1,
        status: "draft",   // chỉ reset khi form add mới
        published_at: new Date().toISOString().slice(0, 16),
      });
      setPreview("");
      setFile(null);
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { name } = e.target; // "image"

    if (file) {
      // chỉ lấy tên file
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Nếu vẫn muốn có preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: "",
      }));
      setPreview(
        formData.image
          ? `${import.meta.env.VITE_MAIN_BE_URL}${formData.image}`
          : ""
      );
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // const data = new FormData();
    // data.append("title", formData.title);
    // data.append("content", formData.content);
    // data.append("status", formData.status);  // ✅ luôn có published/draft
    // data.append("author_id", formData.author_id);
    // data.append("published_at", formData.published_at);
    // data.append("image", formData.image); // giữ link/tên cũ

    onSubmit(formData, file);
    // onSubmit(data, file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div className="flex justify-between space-x-3">
        <div className="w-full ">
          {/* Tiêu đề */}
          <div>
            <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-200 admin-dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 admin-dark:text-gray-200"
            />
          </div>

          {/* Ảnh */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">Ảnh</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-slate-200 admin-dark:border-slate-700 rounded-lg admin-dark:text-gray-200"
            />

          </div>
        </div>
        <div className="border w-92 mx-auto flex justify-center items-center rounded p-1 " >
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-92 object-cover rounded"
            />
          )}
          {!preview && <p className="text-center text-sm font-medium text-green-800 admin-dark:text-gray-200"> Nơi hiển thị ảnh</p>}
        </div>
      </div>


      {/* Nội dung */}
      <div>
        <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">Nội dung</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows="6"
          className="w-full px-3 py-2 border border-slate-200 admin-dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 admin-dark:text-gray-200"
        />
      </div>

      {/* Tác giả */}
      <div hidden>
        <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">Tác giả (ID)</label>
        <input
          type="number"
          name="author_id"
          value={formData.author_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 admin-dark:text-gray-200"
        />
      </div>

      <div className="flex justify-between space-x-3">
        <div className=" w-full flex items-center  space-x-4">
          {/* Trạng thái */}
          <div className=" ">
            <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 admin-dark:bg-gray-800 bg-white text-gray-800 py-2 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 admin-dark:text-gray-200"
            >
              <option value="draft">Nháp</option>
              <option value="published">Công khai</option>
            </select>
          </div>

          {/* Ngày đăng (chỉ khi edit) */}
          {blog && (
            <div>
              <label className="block text-sm font-medium text-green-800 admin-dark:text-gray-200 pb-2">Ngày đăng</label>
              <input
                type="datetime-local"
                name="published_at"
                value={formData.published_at}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-green-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 admin-dark:text-gray-200"
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex space-x-2 w-full  justify-end">
          <button
            type="submit"
            className="px-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
          >
            {blog ? "Cập nhật" : "Thêm"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 w-full bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Hủy
          </button>
        </div>
      </div>
    </form>

  );
}
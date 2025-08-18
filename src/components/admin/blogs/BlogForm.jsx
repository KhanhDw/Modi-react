import { useState, useEffect } from "react";

export default function BlogForm({ blog, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author_id: "",
    published_at: "",
    img: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Reset form khi blog prop thay đổi
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        author_id: blog.author_id || "",
        published_at: blog.published_at || "",
        img: blog.img || "",
      });
      setPreview(blog.img ? `${import.meta.env.VITE_MAIN_BE_URL}${blog.img}` : "");
      setFile(null); // Reset file input
    } else {
      setFormData({
        title: "",
        content: "",
        author_id: "",
        published_at: "",
        img: "",
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
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(formData.img ? `${import.meta.env.VITE_MAIN_BE_URL}${formData.img}` : "");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <label className="block text-sm font-medium text-green-800">Tiêu đề</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-green-800">Ảnh</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-green-200 rounded-lg"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 h-32 w-32 object-cover rounded"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-green-800">Nội dung</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows="6"
          className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-green-800">Tác giả (ID)</label>
        <input
          type="number"
          name="author_id"
          value={formData.author_id}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-green-800">Ngày đăng</label>
        <input
          type="datetime-local"
          name="published_at"
          value={formData.published_at}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
        >
          {blog ? "Cập nhật" : "Thêm"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
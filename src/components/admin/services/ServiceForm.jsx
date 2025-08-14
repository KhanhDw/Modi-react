import { useState, useEffect } from "react";

export default function ServiceForm({ service, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    ten_dich_vu: "",
    mo_ta: "",
  });

  // Reset form khi service thay đổi hoặc khi chuyển sang chế độ thêm mới
  useEffect(() => {
    if (service) {
      setFormData({
        ten_dich_vu: service.ten_dich_vu || "",
        mo_ta: service.mo_ta || "",
      });
    } else {
      // Reset form về trống khi không có service (chế độ thêm mới)
      setFormData({ ten_dich_vu: "", mo_ta: "" });
    }
  }, [service]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.ten_dich_vu.trim()) {
      alert("Vui lòng nhập tên dịch vụ");
      return;
    }
    onSubmit(formData);
    // Không reset form sau submit để giữ dữ liệu cho lần tiếp theo
  };

  const handleCancel = () => {
    if (!service) {
      // Reset form khi hủy thêm mới
      setFormData({ ten_dich_vu: "", mo_ta: "" });
    }
    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 md:p-6 rounded-lg shadow-md space-y-6 border border-green-200"
    >
      <div>
        <label className="block text-lg font-semibold text-green-800 mb-2">
          Tên dịch vụ
        </label>
        <input
          type="text"
          name="ten_dich_vu"
          value={formData.ten_dich_vu}
          onChange={handleChange}
          className="w-full p-2 border-2 border-green-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-gray-500"
          placeholder="Nhập tên dịch vụ..."
        />
      </div>

      <div>
        <label className="block text-lg font-semibold text-green-800 mb-2">
          Mô tả
        </label>
        <textarea
          name="mo_ta"
          value={formData.mo_ta}
          onChange={handleChange}
          rows="4"
          className="w-full p-2 border-2 border-green-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-gray-500"
          placeholder="Nhập mô tả..."
        ></textarea>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition duration-200"
        >
          {service ? "Cập nhật" : "Thêm mới"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-md hover:bg-gray-400 transition duration-200"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserForm({ user, onClose, onSuccess }) {
  const isEdit = !!user;

  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    role: "manager", // ENUM('deve','admin','manager')
    avatar_url: "",  // nếu muốn nhập URL
    password: "",    // BẮT BUỘC khi thêm mới; khi sửa có thể để trống = không đổi
  });

  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        full_name: user.full_name || "",
        phone: user.phone || "",
        role: user.role || "manager",
        avatar_url: user.avatar_url || "",
        password: "",
      });
      setAvatarFile(null);
    }
  }, [isEdit, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setAvatarFile(f || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // tạo FormData để hỗ trợ upload file
    const fd = new FormData();
    fd.append("username", form.username);
    fd.append("email", form.email);
    fd.append("full_name", form.full_name);
    fd.append("phone", form.phone);
    fd.append("role", form.role);

    // Nếu có chọn file → gửi file; nếu không có file nhưng có URL → gửi avatar_url (string)
    if (avatarFile) {
      fd.append("avatar_url", avatarFile);
    } else if (form.avatar_url) {
      fd.append("avatar_url", form.avatar_url);
    }

    // password: required khi add; optional khi edit
    if (!isEdit || (isEdit && form.password.trim() !== "")) {
      fd.append("password", form.password);
    }

    try {
      if (isEdit) {
        await axios.put(
          `${import.meta.env.VITE_MAIN_BE_URL}/api/users/${user.id}`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_MAIN_BE_URL}/api/users`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      onSuccess();
    } catch (err) {
      console.error("Lỗi lưu user:", err);
      alert(err?.response?.data?.error || "Lỗi lưu user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white admin-dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">
          {isEdit ? "Sửa tài khoản" : "Thêm tài khoản"}
        </h3>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Họ tên (full_name)"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Tên đăng nhập (username)"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Số điện thoại (phone)"
            className="w-full border p-2 rounded"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option className="text-black" value="manager">manager</option>
            <option className="text-black" value="admin">admin</option>
            <option className="text-black" value="deve">deve</option>
          </select>

          {/* Avatar: chọn 1 trong 2 cách */}
          <div className="grid gap-2">
            <label className="text-sm text-gray-500">Avatar (chọn 1 trong 2):</label>
            <input type="file" accept="image/*" onChange={handleFile} className="w-full border p-2 rounded" />
            <input
              name="avatar_url"
              value={form.avatar_url}
              onChange={handleChange}
              placeholder="Hoặc dán URL ảnh"
              className="w-full border p-2 rounded"
            />
          </div>

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder={isEdit ? "Đổi mật khẩu (để trống nếu không đổi)" : "Mật khẩu"}
            className="w-full border p-2 rounded"
            required={!isEdit}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

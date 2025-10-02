import { ScrollArea } from "@/components/ui/scroll-area";
import useLenisLocal from "@/hook/useLenisLocal";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UserForm({ user, onClose, onSuccess }) {
  useLenisLocal(".lenis-local");
  const isEdit = !!user;

  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    role: "manager", // ENUM('dev','admin','manager')
    avatar_url: "",  // nếu muốn nhập URL
    password: "",    // BẮT BUỘC khi thêm mới; khi sửa có thể để trống = không đổi
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(""); // thêm state preview để hiển thị ảnh

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
      setPreview(user.avatar_url || ""); // khi sửa thì hiển thị avatar hiện tại
    }
  }, [isEdit, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));

    // nếu nhập URL avatar, cập nhật preview ngay
    if (name === "avatar_url") {
      setPreview(value);
    }
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setAvatarFile(f || null);

    // khi chọn file → tạo URL tạm để hiển thị
    if (f) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(form.avatar_url || "");
    }
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-3">
      <ScrollArea className="bg-white admin-dark:bg-gray-900 rounded-xl py-3 w-full h-full md:h-fit max-w-lg lenis-local" data-lenis-prevent>
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
          {isEdit ? "Sửa tài khoản" : "Thêm tài khoản"}
        </h3>

        <form onSubmit={handleSubmit} className="grid gap-3 w-full p-2 sm:p-4">
          <input autoComplete="off"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Họ tên (full_name)"
            className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition placeholder:text-sm placeholder:sm:text-base"
            required
          />
          <input autoComplete="off"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Tên đăng nhập (username)"
            className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition placeholder:text-sm placeholder:sm:text-base"
            required
          />
          <input autoComplete="off"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition placeholder:text-sm placeholder:sm:text-base"
            required
          />
          <input autoComplete="off"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Số điện thoại (phone)"
            className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition placeholder:text-sm placeholder:sm:text-base"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          >
            <option className="text-black" value="manager">manager</option>
            <option className="text-black" value="admin">admin</option>
            <option className="text-black" value="deve">dev</option>
          </select>

          <input autoComplete="off"
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer"
          />

          <input autoComplete="off"
            name="avatar_url"
            value={form.avatar_url}
            onChange={handleChange}
            placeholder="Hoặc dán URL ảnh"
            className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition placeholder:text-sm placeholder:sm:text-base"
          />

          {/* xem trước avatar khi có preview */}
          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Avatar Preview"
                className="w-24 h-24 object-cover rounded-full border border-gray-300 admin-dark:border-gray-700 shadow-md"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}

          <input autoComplete="off"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder={isEdit ? "Đổi mật khẩu (để trống nếu không đổi)" : "Mật khẩu"}
            className="w-full p-2 rounded border border-gray-300 admin-dark:border-gray-600 focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition placeholder:text-sm placeholder:sm:text-base"
            required={!isEdit}
          />

          <div className="flex justify-center gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 admin-dark:border-gray-700 rounded cursor-pointer bg-gray-200 hover:bg-gray-300 admin-dark:bg-gray-900 admin-dark:hover:bg-gray-800">
              <span className="text-sm sm:text-base font-semibold">Hủy</span>
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer">
              <span className="text-sm sm:text-base font-semibold">{isEdit ? "Cập nhật" : "Thêm mới"}</span>
            </button>
          </div>
        </form>
      </ScrollArea>
    </div >

  );
}

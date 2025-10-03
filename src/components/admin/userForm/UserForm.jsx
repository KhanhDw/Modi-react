import React, { useEffect, useState } from "react";
import axios from "axios";

// NOTE: Components like ScrollArea and hooks like useLenisLocal are assumed to be available
// For the purpose of this single-file output, we'll simulate the ScrollArea behavior
const ScrollArea = ({ children, className, ...props }) => (
  <div
    className={`overflow-y-auto ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Placeholder for useLenisLocal
const useLenisLocal = (selector) => {
  // Logic for Lenis setup would go here
  useEffect(() => {
    // console.log(`Lenis initialized for: ${selector}`);
  }, [selector]);
};

// --- Custom Components for better UI structure (Simulating Shadcn/UI Inputs) ---

// Custom Input Field with Label
const InputField = ({
  label,
  id,
  placeholder,
  type = "text",
  required,
  className,
  ...props
}) => (
  <div className="flex flex-col space-y-1">
    <label
      htmlFor={id}
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder || label}
      required={required}
      className={`w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm ${className}`}
      {...props}
    />
  </div>
);

// Custom File Input Field with Label
const FileInput = ({ label, id, accept = "image/*", onChange, ...props }) => (
  <div className="flex flex-col space-y-1">
    <label
      htmlFor={id}
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={onChange}
      className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-white dark:hover:file:bg-gray-600 transition duration-150"
      {...props}
    />
  </div>
);

// --- NEW COMPONENT: Image Placeholder Box ---
const PlaceholderBox = ({ label, isCircle = false }) => (
  <div
    className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-400 dark:border-gray-500 text-gray-500 dark:text-gray-300 transition duration-300 p-2 text-center select-none ${
      isCircle ? "w-24 h-24 rounded-full" : "w-full h-32 rounded-lg"
    }`}
    style={{ minWidth: isCircle ? "6rem" : "auto" }}
  >
    {/* Icon (Camera/Image) */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7 mb-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <p className="text-xs font-semibold">{label}</p>
  </div>
);
// --- End NEW COMPONENT ---

// --- Main Component ---

export default function UserForm({ user, onClose, onSuccess }) {
  useLenisLocal(".lenis-local");
  const isEdit = !!user;

  const initialFormState = {
    username: "",
    email: "",
    full_name: "",
    phone: "",
    role: "manager", // ENUM('dev','admin','manager')
    avatar_url: "",
    password: "",
    confirm_password: "",
    cccd: "",
    img_cccd_top: "", // Stores file object or URL string
    img_cccd_bottom: "", // Stores file object or URL string
    number_bank: "",
    name_bank: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit && user) {
      setForm({
        ...initialFormState,
        username: user.username || "",
        email: user.email || "",
        full_name: user.full_name || "",
        phone: user.phone || "",
        role: user.role || "manager",
        avatar_url: user.avatar_url || "",
        cccd: user.cccd || "",
        number_bank: user.number_bank || "",
        name_bank: user.name_bank || "",
        // Assuming img_cccd_top/bottom are URLs if editing an existing user
        img_cccd_top: user.img_cccd_top || "",
        img_cccd_bottom: user.img_cccd_bottom || "",
      });
      setPreviewAvatar(user.avatar_url || "");
    }
  }, [isEdit, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));

    if (name === "avatar_url") {
      setPreviewAvatar(value);
    }
  };

  const handleAvatarFileChange = (e) => {
    const f = e.target.files?.[0];
    setAvatarFile(f || null);

    if (f) {
      setPreviewAvatar(URL.createObjectURL(f));
    } else {
      setPreviewAvatar(form.avatar_url || "");
    }
  };

  // Helper to get preview URL for CCCD images (File object or URL string)
  const getCccdPreviewUrl = (fieldValue) => {
    if (fieldValue instanceof File) {
      return URL.createObjectURL(fieldValue);
    }
    return typeof fieldValue === "string" && fieldValue ? fieldValue : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      form.password &&
      form.confirm_password &&
      form.password !== form.confirm_password
    ) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp.");
      setIsLoading(false);
      return;
    }

    const fd = new FormData();

    // Append basic fields
    Object.keys(form).forEach((key) => {
      // Exclude specific fields we handle later or file objects that shouldn't be stringified
      if (
        key !== "password" &&
        key !== "confirm_password" &&
        key !== "avatar_url" &&
        key !== "img_cccd_top" &&
        key !== "img_cccd_bottom"
      ) {
        fd.append(key, form[key]);
      }
    });

    // Handle password
    if (form.password) {
      fd.append("password", form.password);
      fd.append("confirm_password", form.confirm_password);
    } else if (!isEdit && form.confirm_password) {
      // For new user, if password is left empty but confirm is filled (shouldn't happen with required attribute, but safe)
      fd.append("confirm_password", form.confirm_password);
    }

    // Handle Avatar (File or URL)
    if (avatarFile) {
      fd.append("avatar_url", avatarFile); // File upload
    } else if (form.avatar_url) {
      fd.append("avatar_url", form.avatar_url); // URL string
    }

    // Handle CCCD images (append file objects if they are File, otherwise they are URLs and server should handle persistence)
    if (form.img_cccd_top instanceof File) {
      fd.append("img_cccd_top", form.img_cccd_top);
    }
    if (form.img_cccd_bottom instanceof File) {
      fd.append("img_cccd_bottom", form.img_cccd_bottom);
    }

    try {
      if (isEdit) {
        await axios.put(
          `${import.meta.env.VITE_MAIN_BE_URL}/api/users/${user.id}`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(`${import.meta.env.VITE_MAIN_BE_URL}/api/users`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onSuccess();
    } catch (err) {
      console.error("Lỗi lưu user:", err);
      // Custom modal/message box instead of alert()
      alert(`Lỗi lưu user: ${err?.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ">
      <ScrollArea
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] lenis-local"
        data-lenis-prevent
      >
        <div className="p-6">
          <h3 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            {isEdit ? "CẬP NHẬT TÀI KHOẢN" : "THÊM TÀI KHOẢN MỚI"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* --- SECTION 1: THÔNG TIN CÁ NHÂN --- */}
            <section className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-blue-600 dark:text-blue-400">
                1. Thông tin Cá nhân & Liên lạc
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Họ tên đầy đủ"
                  id="full_name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  required
                  autoComplete="off"
                />
                <InputField
                  label="Số điện thoại"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0901234567"
                  type="tel"
                  autoComplete="off"
                />
                <InputField
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  autoComplete="off"
                />
              </div>
            </section>

            {/* --- SECTION 2: THÔNG TIN TÀI KHOẢN & MẬT KHẨU --- */}
            <section className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
              <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-blue-600 dark:text-blue-400">
                2. Tài khoản & Phân quyền
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username & Role */}
                <InputField
                  label="Tên đăng nhập"
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Tên đăng nhập"
                  required
                  autoComplete="off"
                />
                <div className="flex flex-col space-y-1">
                  <label
                    htmlFor="role"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Vai trò (Role) <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                  >
                    <option value="manager">Manager (Quản lý)</option>
                    <option value="admin">Admin (Quản trị viên)</option>
                    <option value="dev">Dev (Lập trình viên)</option>
                  </select>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InputField
                  label={
                    isEdit
                      ? "Mật khẩu mới (Để trống nếu không đổi)"
                      : "Mật khẩu"
                  }
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  required={!isEdit}
                  autoComplete="new-password"
                />
                <InputField
                  label={isEdit ? "Xác nhận mật khẩu mới" : "Xác nhận mật khẩu"}
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  required={!isEdit || !!form.password}
                  autoComplete="new-password"
                />
              </div>

              {/* Avatar Section */}
              <div className="flex xs:flex-col xl:flex-row mt-6 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800/50">
                <div className="flex items-start flex-col space-y-3 ">
                  <h5 className="font-medium mb-3 text-gray-900 dark:text-white">
                    Ảnh đại diện (Avatar)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className=" space-y-3">
                      <FileInput
                        label="Upload từ thiết bị"
                        id="avatar_file"
                        onChange={handleAvatarFileChange}
                      />
                    </div>
                  </div>
                </div>
                <div className=" flex justify-center sm:justify-end xl:justify-center">
                  {previewAvatar ? (
                    <img
                      src={previewAvatar}
                      alt="Avatar Preview"
                      className="w-24 h-24 object-cover rounded-full border-4 border-white dark:border-gray-600 shadow-xl transition-all duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        setPreviewAvatar("");
                      }}
                    />
                  ) : (
                    <PlaceholderBox
                      label="Chưa có Avatar"
                      isCircle={true}
                    />
                  )}
                </div>
              </div>
            </section>

            {/* --- SECTION 3: THÔNG TIN ĐỊNH DANH (CCCD) --- */}
            <section className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-green-600 dark:text-green-400">
                3. Thông tin Định danh (CCCD)
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="Số Căn cước công dân (CCCD)"
                  id="cccd"
                  name="cccd"
                  value={form.cccd}
                  onChange={handleChange}
                  placeholder="12 số CCCD/CMND"
                  type="number"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* CCCD Mặt trước */}
                  <div className="space-y-2">
                    <FileInput
                      label="Ảnh CCCD Mặt trước"
                      id="img_cccd_top"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setForm((s) => ({ ...s, img_cccd_top: f || "" }));
                      }}
                    />
                    <div className="mt-2 flex justify-center">
                      {getCccdPreviewUrl(form.img_cccd_top) ? (
                        <img
                          src={getCccdPreviewUrl(form.img_cccd_top)}
                          alt="CCCD Top Preview"
                          className="w-full h-auto max-h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow-md"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      ) : (
                        <PlaceholderBox label="Mặt trước (Chưa có ảnh)" />
                      )}
                    </div>
                  </div>

                  {/* CCCD Mặt sau */}
                  <div className="space-y-2">
                    <FileInput
                      label="Ảnh CCCD Mặt sau"
                      id="img_cccd_bottom"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setForm((s) => ({ ...s, img_cccd_bottom: f || "" }));
                      }}
                    />
                    <div className="mt-2 flex justify-center">
                      {getCccdPreviewUrl(form.img_cccd_bottom) ? (
                        <img
                          src={getCccdPreviewUrl(form.img_cccd_bottom)}
                          alt="CCCD Bottom Preview"
                          className="w-full h-auto max-h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow-md"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      ) : (
                        <PlaceholderBox label="Mặt sau (Chưa có ảnh)" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* --- SECTION 4: THÔNG TIN NGÂN HÀNG --- */}
            <section className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
              <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-purple-600 dark:text-purple-400">
                4. Thông tin Ngân hàng
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Số tài khoản"
                  id="number_bank"
                  name="number_bank"
                  value={form.number_bank}
                  onChange={handleChange}
                  placeholder="Số tài khoản ngân hàng"
                  type="number"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoComplete="off"
                />
                <InputField
                  label="Tên ngân hàng"
                  id="name_bank"
                  name="name_bank"
                  value={form.name_bank}
                  onChange={handleChange}
                  placeholder="Ví dụ: Vietcombank"
                  autoComplete="off"
                />
              </div>
            </section>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex justify-center gap-4 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 p-4 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold transition duration-150 shadow-md"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition duration-150 shadow-lg shadow-blue-500/50 flex items-center justify-center disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <span>{isEdit ? "CẬP NHẬT TÀI KHOẢN" : "THÊM MỚI"}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </ScrollArea>
    </div>
  );
}

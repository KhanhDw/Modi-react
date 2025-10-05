import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import PlaceholderBox from "./PlaceholderBox";
import RoleDropdown from "./SelectRole"
import InputField from "./InputField";
import FileInput from "./FileInput";
import BankDropdown from "@/components/feature/SelectBank.jsx";

export default function UserForm({ user, onClose, onSuccess }) {
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

  const modalRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Gọi hàm đóng khi click ngoài
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


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

  // Thêm hàm này vào trong component UserForm:
  const getImageUrl = (url) => {
    if (!url) return null;
    // Kiểm tra nếu URL đã là tuyệt đối (bắt đầu bằng http/https)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Ngược lại, nối với base URL của backend
    return `${import.meta.env.VITE_MAIN_BE_URL}${url.startsWith("/") ? url : "/" + url
      }`;
  };

  // Helper to get preview URL for CCCD images (File object or URL string)
  const getCccdPreviewUrl = (fieldValue) => {
    if (fieldValue instanceof File) {
      return URL.createObjectURL(fieldValue);
    }
    // Sử dụng getImageUrl để xử lý đường dẫn tương đối/tuyệt đối
    return getImageUrl(fieldValue);
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
    }

    // Handle CCCD images (append file objects if they are File, otherwise they are URLs and server should handle persistence)
    if (form.img_cccd_top instanceof File) {
      fd.append("img_cccd_top", form.img_cccd_top);
    } else if (isEdit && !form.img_cccd_top) {
      // Gửi chuỗi rỗng để xóa ảnh cũ trong DB
      fd.append("img_cccd_top", "");
    }

    if (form.img_cccd_bottom instanceof File) {
      fd.append("img_cccd_bottom", form.img_cccd_bottom);
    } else if (isEdit && !form.img_cccd_bottom) {
      // Gửi chuỗi rỗng để xóa ảnh cũ trong DB
      fd.append("img_cccd_bottom", "");
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
      <div
        ref={modalRef}
        className="overflow-y-auto scrollbar-hide bg-white admin-dark:bg-gray-900 rounded-lg shadow-2xl w-full md:max-w-2xl lg:max-w-3xl max-h-[90vh] transition-all duration-300 transform scale-100 lenis-local"
        data-lenis-prevent
      >
        <div className="p-2 sm:p-4 md:p-5">
          <h3 className="text-xl lg:text-[22px] font-extrabold mb-6 text-center text-gray-900 admin-dark:text-white">
            {isEdit ? "CẬP NHẬT TÀI KHOẢN" : "THÊM TÀI KHOẢN MỚI"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* --- SECTION 1: THÔNG TIN CÁ NHÂN --- */}
            <section className="p-3 border border-gray-200 admin-dark:border-gray-700 rounded-lg">
              <h4 className="text-base sm:text-lg font-semibold mb-4 border-b border-gray-300 admin-dark:border-gray-700 pb-2 text-blue-600 admin-dark:text-blue-400">
                Thông tin Cá nhân & Liên lạc
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
                  maxLength={10}
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0901234567"
                  type="tel"
                  required
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
            <section className="p-3 border border-gray-200 admin-dark:border-gray-700 rounded-lg">
              <h4 className="text-base sm:text-lg font-semibold mb-4 border-b border-gray-300 admin-dark:border-gray-700 pb-2 text-blue-600 admin-dark:text-blue-400">
                Tài khoản & Phân quyền
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

                <RoleDropdown form={form} setForm={setForm} />

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
              <div className="flex flex-col gap-3 md:flex-row md:items-center mt-6 p-4 border border-dashed border-gray-300 admin-dark:border-gray-600 rounded-lg bg-white admin-dark:bg-gray-800/50 w-full">
                <div className="flex items-start flex-col space-y-3 w-full">
                  <h5 className="font-medium text-sm sm:text-base mb-3 text-gray-900 admin-dark:text-white">
                    Ảnh đại diện (Avatar)
                  </h5>
                  <div className="w-full flex flex-col">
                    <div className="space-y-3 w-full">
                      <FileInput
                        label="Upload từ thiết bị"
                        id="avatar_file"
                        onChange={handleAvatarFileChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center sm:justify-center xl:justify-center w-full">
                  {avatarFile ? (
                    <img
                      src={previewAvatar}
                      alt="Avatar Preview"
                      className="w-24 h-24 object-cover rounded-full border-4 border-white admin-dark:border-white shadow-xl transition-all duration-300 hover:scale-105"
                      onError={(e) => setPreviewAvatar("")}
                    />
                  ) : form.avatar_url ? (
                    <img
                      src={getImageUrl(form.avatar_url)}
                      alt="Avatar Preview"
                      className="w-24 h-24 object-cover rounded-full border-4 border-white admin-dark:border-gray-600 shadow-xl transition-all duration-300 hover:scale-105"
                      onError={(e) => (e.currentTarget.style.display = "none")}
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
            <section className="p-3 border border-gray-200 admin-dark:border-gray-700 rounded-lg">
              <h4 className="text-base sm:text-lg font-semibold mb-4 border-b border-gray-300 admin-dark:border-gray-700 admin-dark:border-hray pb-2 text-green-600 dark:text-green-400">
                Thông tin Định danh (CCCD)
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

                <div className="flex flex-col md:flex-row justify-between gap-6 pt-2">
                  {/* CCCD Mặt trước */}
                  <div className="space-y-2">
                    <FileInput
                      label="Ảnh CCCD Mặt trước"
                      id="img_cccd_top"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setForm((s) => ({ ...s, img_cccd_top: f || null }));
                      }}
                    />
                    <div className="mt-2 flex justify-center">
                      {getCccdPreviewUrl(form.img_cccd_top) ? (
                        <img
                          src={getCccdPreviewUrl(form.img_cccd_top)}
                          alt="CCCD Top Preview"
                          className="w-full h-auto max-h-52 object-cover rounded-lg border border-gray-300 admin-dark:border-gray-600 shadow-md"
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
                        setForm((s) => ({ ...s, img_cccd_bottom: f || null }));
                      }}
                    />
                    <div className="mt-2 flex justify-center">
                      {getCccdPreviewUrl(form.img_cccd_bottom) ? (
                        <img
                          src={getCccdPreviewUrl(form.img_cccd_bottom)}
                          alt="CCCD Bottom Preview"
                          className="w-full h-auto max-h-52 object-cover rounded-lg border border-gray-300 admin-dark:border-gray-600 shadow-md"
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
            <section className="p-3 border border-gray-200 admin-dark:border-gray-700 rounded-lg">
              <h4 className="text-base sm:text-lg font-semibold mb-4 border-b border-gray-300 admin-dark:border-gray-700 pb-2 text-purple-600 admin-dark:text-purple-400">
                Thông tin Ngân hàng
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
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="name_bank"
                    className="text-sm sm:text-base font-medium text-gray-700 admin-dark:text-gray-300"
                  >
                    Chọn ngân hàng <span className="text-red-500">*</span>
                  </label>
                  <BankDropdown
                    formData={form}
                    setFormData={setForm}
                  />
                </div>
              </div>
            </section>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex justify-center gap-4 p-4 sticky bottom-0 left-0 right-0 bg-white admin-dark:bg-gray-900 border-t border-gray-200 admin-dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 admin-dark:border-gray-700 rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-600 text-gray-800 admin-dark:text-gray-200 font-semibold transition duration-150 shadow-md"
                disabled={isLoading}
              >
                <span className="text-sm sm:text-base font-semibold">Hủy</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition duration-150 shadow-lg shadow-blue-500/50 flex items-center justify-center disabled:opacity-50 cursor-pointer"
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
                  <span className="text-sm sm:text-base font-semibold">{isEdit ? "CẬP NHẬT TÀI KHOẢN" : "THÊM MỚI"}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

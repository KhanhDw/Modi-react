import React from "react";
import formatDateTime from "../../../utils/formatDate.jsx";
import { VIETNAMESE_BANKS } from "@/components/feature/SelectBank.jsx";

const getBankName = (code) => {
  const bank = VIETNAMESE_BANKS.find((b) => b.code === code);
  return bank ? bank.name : code || "N/A";
};
// Component UserDetailView
export default function UserDetailView({ user, onClose }) {
  // Dữ liệu giả định để hiển thị nếu user không tồn tại,
  // nhưng trong thực tế, bạn nên đảm bảo user được truyền vào.
  const userData = user || {
    id: "N/A",
    username: "N/A",
    email: "N/A",
    full_name: "Không rõ",
    phone: "N/A",
    role: "N/A",
    avatar_url: "",
    cccd: "N/A",
    img_cccd_top: "",
    img_cccd_bottom: "",
    number_bank: "N/A",
    name_bank: "N/A",
    created_at: "N/A",
    updated_at: "N/A",
  };

  // Helper để hiển thị giá trị hoặc 'N/A'
  const displayValue = (value) => value || "N/A";

  // Helper để hiển thị Vai trò (Role) dễ đọc hơn
  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Admin (Quản trị viên)";
      case "manager":
        return "Manager (Quản lý)";
      case "dev":
        return "Dev (Lập trình viên)";
      default:
        return "Không xác định";
    }
  };

  // Helper để lấy đường dẫn đầy đủ cho ảnh
  const getImageUrl = (path) => {
    if (!path) return null;
    // Giả định VITE_MAIN_BE_URL được định nghĩa trong môi trường của bạn
    // Tùy thuộc vào cách bạn lưu trữ, bạn có thể cần thêm logic kiểm tra URL
    return path.startsWith("http")
      ? path
      : `${import.meta.env.VITE_MAIN_BE_URL}${path}`;
  };

  // Component phụ trợ cho mỗi trường thông tin
  const DetailItem = ({ label, value, className = "" }) => (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm font-medium text-gray-500 admin-dark:text-gray-400">
        {label}
      </p>
      <p className="text-base font-semibold text-gray-900 admin-dark:text-white break-words">
        {displayValue(value)}
      </p>
    </div>
  );

  // Component phụ trợ cho hiển thị ảnh
  const ImagePreview = ({ label, url }) => (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 admin-dark:text-gray-300">
        {label}
      </p>
      <div className="w-full h-32 bg-gray-100 admin-dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-300 admin-dark:border-gray-600 shadow-sm flex items-center justify-center">
        {url ? (
          <img
            src={getImageUrl(url)}
            alt={label}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentNode.innerHTML =
                '<p class="text-xs text-red-500 p-2">Lỗi tải ảnh</p>';
            }}
          />
        ) : (
          <p className="text-sm text-gray-500 admin-dark:text-gray-400">
            Chưa có ảnh
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="overflow-y-auto bg-white admin-dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] transition-all duration-300 transform scale-100"
        data-lenis-prevent
      >
        <div className="p-6">
          <h3 className="text-2xl font-extrabold mb-6 text-center text-blue-600 admin-dark:text-blue-400 border-b pb-3">
            THÔNG TIN CHI TIẾT NGƯỜI DÙNG
          </h3>

          <div className="space-y-6">
            {/* --- AVATAR & BASIC INFO HEADER --- */}
            <header className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-blue-50 admin-dark:bg-gray-800 rounded-xl shadow-inner">
              <div className="flex-shrink-0">
                <img
                  src={getImageUrl(userData.avatar_url)}
                  alt="Avatar"
                  className="w-24 h-24 object-cover rounded-full border-4 border-white admin-dark:border-gray-700 shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-avatar.png"; // Thay thế bằng placeholder thực tế
                    e.currentTarget.classList.add("ring-2", "ring-red-500");
                  }}
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-gray-900 admin-dark:text-white">
                  {displayValue(userData.full_name)}
                </p>
                <p className="text-lg text-blue-600 admin-dark:text-blue-300 mt-1">
                  {getRoleLabel(userData.role)}
                </p>
                <p className="text-sm text-gray-600 admin-dark:text-gray-400 mt-1">
                  ID người dùng: {displayValue(userData.id)}
                </p>
              </div>
            </header>

            <hr className="border-gray-200 admin-dark:border-gray-700" />

            {/* --- SECTION 1: THÔNG TIN CÁ NHÂN & LIÊN LẠC --- */}
            <section className="p-4 border border-gray-200 admin-dark:border-gray-700 rounded-xl">
              <h4 className="text-xl font-semibold mb-4 pb-2 text-blue-600 admin-dark:text-blue-400">
                1. Thông tin Cá nhân & Liên lạc
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem
                  label="Tên đăng nhập"
                  value={userData.username}
                />
                <DetailItem
                  label="Email"
                  value={userData.email}
                />
                <DetailItem
                  label="Số điện thoại"
                  value={userData.phone}
                />
                <DetailItem
                  label="Vai trò (Role)"
                  value={getRoleLabel(userData.role)}
                />
              </div>
            </section>

            {/* --- SECTION 2: THÔNG TIN ĐỊNH DANH (CCCD) --- */}
            <section className="p-4 border border-gray-200 admin-dark:border-gray-700 rounded-xl bg-gray-50 admin-dark:bg-gray-800/50">
              <h4 className="text-xl font-semibold mb-4 pb-2 text-green-600 admin-dark:text-green-400">
                2. Thông tin Định danh (CCCD)
              </h4>
              <div className="space-y-6">
                <DetailItem
                  label="Số Căn cước công dân (CCCD)"
                  value={userData.cccd}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ImagePreview
                    label="Ảnh CCCD Mặt trước"
                    url={userData.img_cccd_top}
                  />
                  <ImagePreview
                    label="Ảnh CCCD Mặt sau"
                    url={userData.img_cccd_bottom}
                  />
                </div>
              </div>
            </section>

            {/* --- SECTION 3: THÔNG TIN NGÂN HÀNG --- */}
            <section className="p-4 border border-gray-200 admin-dark:border-gray-700 rounded-xl">
              <h4 className="text-xl font-semibold mb-4 pb-2 text-purple-600 admin-dark:text-purple-400">
                3. Thông tin Ngân hàng
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem
                  label="Số tài khoản"
                  value={userData.number_bank}
                />
                <DetailItem
                  label="Tên ngân hàng"
                  value={getBankName(userData.name_bank)} // đổi chiếu code sang tên
                />
              </div>
            </section>

            {/* --- FOOTER/AUDIT INFO --- */}
            <footer className="pt-4 border-t border-gray-200 admin-dark:border-gray-700 text-sm text-gray-500 admin-dark:text-gray-400">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p>
                  Tạo lúc:{" "}
                  <span className="font-medium text-gray-700 admin-dark:text-gray-300">
                    {formatDateTime(displayValue(userData.created_at))}
                  </span>
                </p>
                <p>
                  Cập nhật cuối:{" "}
                  <span className="font-medium text-gray-700 admin-dark:text-gray-300">
                    {formatDateTime(displayValue(userData.updated_at))}
                  </span>
                </p>
              </div>
            </footer>
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex justify-center gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2 border border-gray-300 admin-dark:border-gray-700 rounded-xl cursor-pointer bg-gray-200 hover:bg-gray-300 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-600 text-gray-800 admin-dark:text-gray-200 font-semibold transition duration-150 shadow-md"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

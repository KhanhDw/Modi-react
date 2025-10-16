import NotificationToast from "@/components/feature/notification-toast.jsx";
import { useState } from "react";
import { X } from "lucide-react";
import BankDropdown from "@/components/feature/SelectBank";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLenisLocal from "@/hook/useLenisLocal";

function FormAddCustomer({ onCancel, onSuccess }) {
  useLenisLocal(".lenis-local");

  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    type: "new",
    cccd: "",
    img_cccd_top: "",
    img_cccd_bottom: "",
    number_bank: "",
    name_bank: "",
    status: "active",
    total_spent: 0,
    booking_count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        (type === "number" ||
          ["total_spent", "booking_count"].includes(name)) &&
        value !== ""
          ? Number(value)
          : value,
    }));
  };

  // 1. Khi upload, lưu file trực tiếp
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    setToast(null);

    if (file) {
      if (!file.type.startsWith("image/")) {
        setToast({
          message: "Vui lòng chọn file hình ảnh hợp lệ.",
          type: "error",
        });
        setFormData((prev) => ({ ...prev, [name]: null }));
        e.target.value = null;
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setToast({
          message: "Kích thước ảnh không vượt quá 10MB.",
          type: "error",
        });
        setFormData((prev) => ({ ...prev, [name]: null }));
        e.target.value = null;
        return;
      }

      // Lưu file vào state
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: null }));
    }
  };

  // 2. Khi submit thì dùng FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key] ?? "");
      }

      const response = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/customers`,
        {
          method: "POST",
          body: form, // KHÔNG set Content-Type, fetch sẽ tự set multipart/form-data
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Đã xảy ra lỗi khi thêm khách hàng."
        );
      }

      const result = await response.json();
      console.log("Thêm khách hàng thành công:", result);

      setMessage("Thêm khách hàng thành công!");
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        type: "new",
        cccd: "",
        img_cccd_top: null,
        img_cccd_bottom: null,
        number_bank: "",
        name_bank: "",
        status: "active",
        total_spent: 0,
        booking_count: 0,
      });
      setToast({
        message: "Khách hàng đã được thêm thành công!",
        type: "success",
      });
      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (error) {
      console.error("Xử lý thất bại:", error);
      setMessage(`Xử lý thất bại: ${error.message}`);
      setToast({ message: `Lỗi: ${error.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 block w-full px-3 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-600 shadow-sm bg-white admin-dark:bg-gray-700 text-gray-900 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors focus:border-none";
  const labelClass =
    "block text-sm font-medium text-gray-700 admin-dark:text-gray-300";

  // Component phụ trợ cho phần upload ảnh và preview
  const ImageUploadField = ({ name, label, base64Image, onChange }) => (
    <div className="space-y-2 w-full">
      <label
        htmlFor={name}
        className={labelClass}
      >
        {label}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        accept="image/*"
        onChange={onChange}
        className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:cursor-pointer
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100
                       admin-dark:file:bg-gray-700 admin-dark:file:text-blue-400
                       transition-colors cursor-pointer"
      />
      <div className="mt-2">
        {base64Image instanceof File ? (
          <img
            src={URL.createObjectURL(base64Image)}
            alt={label}
            className="w-full h-auto max-h-70 object-cover rounded-md shadow-md"
          />
        ) : (
          <div className="w-full h-40 flex items-center justify-center border-2 border-dashed border-blue-400 rounded-md text-blue-500 bg-blue-50 admin-dark:bg-gray-800 admin-dark:border-blue-500 admin-dark:text-blue-300 text-sm text-center px-4">
            Chưa có ảnh. Vui lòng chọn ảnh để xem trước.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ScrollArea
      className="flex flex-col justify-center items-center w-full h-full"
      data-lenis-prevent
    >
      <div className="flex justify-between items-center mt-2 w-full relative p-3 md:p-5">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold uppercase text-start sm:text-center text-gray-900 admin-dark:text-gray-100 w-full">
          Thêm Khách Hàng Mới
        </h2>

        {/* Nút đóng/Hủy */}
        {typeof onCancel === "function" && (
          <button
            onClick={onCancel}
            className="absolute right-0 p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 admin-dark:hover:bg-gray-700 admin-dark:text-gray-400 transition-colors cursor-pointer"
            title="Đóng form"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 p-3 md:p-5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
          {/* CỘT TRÁI: THÔNG TIN CƠ BẢN VÀ NGÂN HÀNG */}
          <div className="space-y-6">
            {/* PHẦN 1: THÔNG TIN LIÊN HỆ */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold border-b border-gray-300 admin-dark:border-gray-700 pb-2 text-blue-600 admin-dark:text-blue-400">
                Thông Tin Liên Hệ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Tên khách hàng */}
                <div>
                  <label
                    htmlFor="name"
                    className={labelClass}
                  >
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label
                    htmlFor="phone"
                    className={labelClass}
                  >
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    maxLength={10}
                    required
                    min={0}
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="0901234567"
                  />
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className={labelClass}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="tenkhach@email.com"
                  />
                </div>
              </div>

              {/* Địa chỉ */}
              <div>
                <label
                  htmlFor="address"
                  className={labelClass}
                >
                  Địa chỉ
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  required
                  className={inputClass}
                  placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
                ></textarea>
              </div>
            </div>

            {/* PHẦN 2: THÔNG TIN NGÂN HÀNG */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base md:text-lg font-semibold border-b border-gray-300 admin-dark:border-gray-700 pb-2 text-blue-600 admin-dark:text-blue-400">
                Thông Tin Ngân Hàng
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {/* Số tài khoản ngân hàng */}
                <div>
                  <label
                    htmlFor="number_bank"
                    className={labelClass}
                  >
                    Số tài khoản ngân hàng
                  </label>
                  <input
                    maxLength={14}
                    required
                    min={0}
                    type="text"
                    id="number_bank"
                    name="number_bank"
                    value={formData.number_bank}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="101010xxxxxx"
                  />
                </div>

                {/* Tên Ngân hàng (SELECT MỚI) */}
                <div>
                  <label
                    htmlFor="name_bank"
                    className={labelClass}
                  >
                    Tên Ngân hàng
                  </label>

                  <BankDropdown
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              </div>
            </div>

            {/* PHẦN 3: THÔNG TIN QUẢN LÝ (Giữ ẩn) */}
            <div
              hidden
              className="space-y-4 pt-4"
            >
              <h3 className="text-base md:text-lg font-semibold border-b pb-2 text-blue-600 admin-dark:text-blue-400">
                Thông Tin Quản Lý
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="type"
                    className={labelClass}
                  >
                    Loại khách hàng
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="new">Khách mới</option>
                    <option value="regular">Khách thường xuyên</option>
                    <option value="vip">Khách VIP</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className={labelClass}
                  >
                    Trạng thái
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="total_spent"
                    className={labelClass}
                  >
                    Tổng chi tiêu (VND)
                  </label>
                  <input
                    type="number"
                    id="total_spent"
                    name="total_spent"
                    value={formData.total_spent}
                    onChange={handleChange}
                    min="0"
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label
                    htmlFor="booking_count"
                    className={labelClass}
                  >
                    Số lần đặt
                  </label>
                  <input
                    type="number"
                    id="booking_count"
                    name="booking_count"
                    value={formData.booking_count}
                    onChange={handleChange}
                    min="0"
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN ĐỊNH DANH VÀ ẢNH */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold border-b border-gray-300 admin-dark:border-gray-700 pb-2 text-blue-600 admin-dark:text-blue-400">
                Thông Tin Định Danh & Ảnh
              </h3>

              {/* CCCD/CMND */}
              <div>
                <label
                  htmlFor="cccd"
                  className={labelClass}
                >
                  Số CCCD/CMND
                </label>
                <input
                  type="text"
                  id="cccd"
                  name="cccd"
                  maxLength={14}
                  value={formData.cccd}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="001200xxxxxx"
                />
              </div>

              <div className="flex flex-col md:flex-row lg:flex-col items-center justify-center gap-8 w-full">
                {/* Link ảnh CCCD mặt trước (DÙNG IMAGE UPLOAD) */}
                <ImageUploadField
                  name="img_cccd_top"
                  label="Ảnh CCCD (Mặt trước)"
                  base64Image={formData.img_cccd_top}
                  onChange={handleImageUpload}
                />

                {/* Link ảnh CCCD mặt sau (DÙNG IMAGE UPLOAD) */}
                <ImageUploadField
                  name="img_cccd_bottom"
                  label="Ảnh CCCD (Mặt sau)"
                  base64Image={formData.img_cccd_bottom}
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hiển thị thông báo trạng thái */}
        {message && (
          <div
            className={`mt-4 text-center font-medium p-3 rounded-lg ${
              message.startsWith("Xử lý thất bại")
                ? "bg-red-100 text-red-700 admin-dark:bg-red-900 admin-dark:text-red-300"
                : "bg-green-100 text-green-700 admin-dark:bg-green-900 admin-dark:text-green-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Button Submit */}
        <div className="flex justify-center mb-2">
          <button
            type="submit"
            disabled={loading}
            className="w-fit sm:w-auto rounded-xl shadow-md px-4 py-2
             bg-blue-600 text-white
             hover:bg-blue-700
             transform hover:scale-[1.03]
             transition duration-200
             disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span className="text-sm md:text-base font-semibold">
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Đang lưu...
                </span>
              ) : (
                "Lưu Khách Hàng"
              )}
            </span>
          </button>
        </div>
      </form>
      {toast && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ScrollArea>
  );
}

export default FormAddCustomer;

import NotificationToast from "@/components/feature/notification-toast.jsx";
import { useState } from "react";


function FormAddCustomer({ onSuccess }) {
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        type: "new",
        status: "active",
        total_spent: 0,
        booking_count: 0,
    });
    // Thêm các state để quản lý trạng thái của quá trình gửi dữ liệu
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            // Chuyển đổi giá trị sang số nếu là các trường số
            [name]: ["total_spent", "booking_count"].includes(name)
                ? Number(value)
                : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Xóa thông báo cũ
        setLoading(true); // Bắt đầu quá trình gửi, hiển thị trạng thái đang tải

        try {
            const response = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/customers`, {
                method: "POST", // Phương thức HTTP
                headers: {
                    "Content-Type": "application/json", // Đặt header để server biết dữ liệu gửi đi là JSON
                },
                body: JSON.stringify(formData), // Chuyển đổi dữ liệu từ object sang chuỗi JSON
            });

            if (!response.ok) {
                // Nếu response không thành công (ví dụ: lỗi 4xx, 5xx), ném lỗi để xử lý ở khối catch
                const errorData = await response.json();
                throw new Error(errorData.error || "Đã xảy ra lỗi khi thêm khách hàng.");
            }

            const result = await response.json(); // Phân tích phản hồi từ server
            console.log("Thêm khách hàng thành công:", result);

            // Cập nhật thông báo thành công và reset form
            setMessage("Thêm khách hàng thành công!");
            setFormData({
                name: "",
                phone: "",
                email: "",
                address: "",
                type: "new",
                status: "active",
                total_spent: 0,
                booking_count: 0,
            });
            setToast({ message: "Khách hàng đã được thêm thành công!", type: "success" });
            if (typeof onSuccess === "function") {
                onSuccess();
            }
        } catch (error) {
            console.error("Xử lý thất bại:", error);
            setMessage(`Xử lý thất bại: ${error.message}`); // Hiển thị thông báo lỗi
            setToast({ message: `Lỗi: ${error.message}`, type: "error" });
        } finally {
            setLoading(false); // Kết thúc quá trình gửi

        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className=" admin-dark:bg-gray-800 w-full max-w-3xl rounded-lg p-5">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800 admin-dark:text-gray-100">
                    Thêm Khách Hàng Mới
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tên khách hàng */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 admin-dark:text-gray-300"
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
                                className="mt-1 block w-full px-3 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-600 shadow-sm bg-white admin-dark:bg-gray-700 text-gray-900 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors focus:border-none"
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700 admin-dark:text-gray-300"
                            >
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-600 shadow-sm bg-white admin-dark:bg-gray-700 text-gray-900 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors focus:border-none"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 admin-dark:text-gray-300"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-600 shadow-sm bg-white admin-dark:bg-gray-700 text-gray-900 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors focus:border-none"
                            />
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700 admin-dark:text-gray-300"
                            >
                                Địa chỉ
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className="mt-1 block w-full px-3 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-600 shadow-sm bg-white admin-dark:bg-gray-700 text-gray-900 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors focus:border-none"
                            ></textarea>
                        </div>

                        {/* Loại khách hàng */}
                        <div>
                            <label
                                htmlFor="type"
                                className="block text-sm font-medium text-gray-700 admin-dark:text-gray-300"
                            >
                                Loại khách hàng
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-600 shadow-sm bg-white admin-dark:bg-gray-700 text-gray-900 admin-dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors focus:border-none cursor-pointer"
                            >
                                <option value="new">Mới</option>
                                <option value="regular">Thường xuyên</option>
                                <option value="old">Cũ</option>
                                <option value="vip">VIP</option>
                            </select>
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-gray-700 admin-dark:text-gray-300"
                            >
                                Trạng thái
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-600 shadow-sm bg-white admin-dark:bg-gray-700 text-gray-900 admin-dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors focus:border-none cursor-pointer"
                            >
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
                            </select>
                        </div>

                        {/* Tổng chi tiêu */}
                        <div>
                            <label
                                htmlFor="total_spent"
                                className="block text-sm font-medium text-gray-700 admin-dark:text-gray-300"
                            >
                                Tổng chi tiêu
                            </label>
                            <input
                                type="number"
                                id="total_spent"
                                name="total_spent"
                                value={formData.total_spent}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-600 shadow-sm bg-white admin-dark:bg-gray-700 text-gray-900 admin-dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors focus:border-none"
                            />
                        </div>

                        {/* Số lần đặt chỗ */}
                        <div>
                            <label
                                htmlFor="booking_count"
                                className="block text-sm font-medium text-gray-700 admin-dark:text-gray-300"
                            >
                                Số lần đặt chỗ
                            </label>
                            <input
                                type="number"
                                id="booking_count"
                                name="booking_count"
                                value={formData.booking_count}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-600 shadow-sm bg-white admin-dark:bg-gray-700 text-gray-900 admin-dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors focus:border-none"
                            />
                        </div>
                    </div>

                    {/* Hiển thị thông báo trạng thái */}
                    {message && (
                        <div className={`mt-4 text-center font-medium ${message.startsWith("Xử lý thất bại") ? "text-red-500 admin-dark:text-red-400" : "text-green-500 admin-dark:text-green-400"}`}>
                            {message}
                        </div>
                    )}

                    {/* Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading} // Vô hiệu hóa nút khi đang gửi dữ liệu
                            className="px-6 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 admin-dark:focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? "Đang lưu..." : "Lưu Khách Hàng"}
                        </button>
                    </div>
                </form>
            </div>
            {toast && (
                <NotificationToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

export default FormAddCustomer;

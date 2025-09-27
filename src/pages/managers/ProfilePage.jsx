import axios from "axios";
import { useEffect, useState } from "react";
import { FiCamera, FiEdit, FiEye, FiEyeOff, FiSave, FiX } from "react-icons/fi";

const ProfilePage = () => {
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);

    const [isEditInfo, setIsEditInfo] = useState(false);
    const [isEditPassword, setIsEditPassword] = useState(false);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form states for info editing
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Password states
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Password visibility states
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    // Loading states
    const [updatingInfo, setUpdatingInfo] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Gọi API lấy dữ liệu user
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("Chưa có token, cần login trước");
                return;
            }

            const res = await axios.get(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/auth/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUser(res.data.user);
            // Sử dụng đường dẫn đầy đủ từ server
            const avatarUrl = res.data.user.avatar_url
                ? `${import.meta.env.VITE_MAIN_BE_URL}${res.data.user.avatar_url}`
                : null;
            setPreview(avatarUrl);

            // Initialize form data
            setFullName(res.data.user.full_name || "");
            setEmail(res.data.user.email || "");
            setPhone(res.data.user.phone || "");
        } catch (err) {
            console.error("Lỗi lấy user:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra định dạng file
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert("Vui lòng chọn file ảnh (JPEG, PNG, GIF)");
                return;
            }
            // Kiểm tra kích thước file (tối đa 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File ảnh quá lớn, tối đa 5MB");
                return;
            }
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
            // Auto upload avatar
            handleUploadAvatar(file);
        }
    };

    // Upload avatar function
    const handleUploadAvatar = async (file) => {
        setUploadingAvatar(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("Chưa đăng nhập");
                setPreview(user.avatar_url ? `${import.meta.env.VITE_MAIN_BE_URL}${user.avatar_url}` : null);
                setAvatar(null);
                return;
            }

            const formData = new FormData();
            formData.append('avatar', file);

            const res = await axios.put(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/users/${user.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (res.data.success) {
                const newAvatarUrl = `${import.meta.env.VITE_MAIN_BE_URL}${res.data.avatar_url}`;
                setUser(prev => ({ ...prev, avatar_url: res.data.avatar_url }));
                setPreview(newAvatarUrl);
                alert("Cập nhật ảnh đại diện thành công");
                window.location.reload();
            }
        } catch (err) {
            console.error("Lỗi upload avatar:", err);
            alert(err.response?.data?.error || "Có lỗi xảy ra khi tải ảnh lên");
            // Revert preview on error
            setPreview(user.avatar_url ? `${import.meta.env.VITE_MAIN_BE_URL}${user.avatar_url}` : null);
            setAvatar(null);
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Handle update user info
    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setUpdatingInfo(true);

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("Chưa đăng nhập");
                return;
            }

            const res = await axios.put(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/users/${user.id}`,
                {
                    full_name: fullName,
                    email: email,
                    phone: phone
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.success) {
                setUser(prev => ({
                    ...prev,
                    full_name: fullName,
                    email: email,
                    phone: phone
                }));
                setIsEditInfo(false);
                alert("Cập nhật thông tin thành công");
                window.location.reload();
            }
        } catch (err) {
            console.error("Lỗi cập nhật thông tin:", err);
            alert(err.response?.data?.error || "Có lỗi xảy ra");
        } finally {
            setUpdatingInfo(false);
        }
    };

    // Handle change password
    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!oldPassword.trim()) {
            alert("Vui lòng nhập mật khẩu hiện tại");
            return;
        }

        if (!newPassword.trim()) {
            alert("Vui lòng nhập mật khẩu mới");
            return;
        }

        if (newPassword.length < 6) {
            alert("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Mật khẩu nhập lại không khớp");
            return;
        }

        setChangingPassword(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("Chưa đăng nhập");
                return;
            }

            const res = await axios.put(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/users/${user.id}/change-password`,
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                alert("Đổi mật khẩu thành công");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setIsEditPassword(false);
                fetchUser();
            }
        } catch (err) {
            console.error("Lỗi đổi mật khẩu:", err);
            alert(err.response?.data?.error || "Có lỗi xảy ra");
        } finally {
            setChangingPassword(false);
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Cancel edit info
    const cancelEditInfo = () => {
        setIsEditInfo(false);
        setFullName(user.full_name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
    };

    // Cancel edit password
    const cancelEditPassword = () => {
        setIsEditPassword(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswords({ old: false, new: false, confirm: false });
    };

    if (loading) return <p className="text-center">Đang tải...</p>;

    if (!user) return <p className="text-center">Không tìm thấy người dùng</p>;

    return (
        <div className="max-w-7xl mx-auto admin-dark:bg-gray-900">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 admin-dark:text-white mb-10 text-center">
                Hồ sơ cá nhân
            </h2>

            <div className="bg-white admin-dark:bg-gray-800 sm:p-2 xl:p-4 rounded-md md:rounded-xl shadow-lg transition-colors duration-300 border border-gray-200 admin-dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 xl:gap-6 gap-8">
                    {/* Cột 1: Avatar */}
                    <div className="flex flex-col mt-3 items-center border-r border-gray-200 admin-dark:border-gray-700 pr-4">
                        <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 shadow-lg cursor-pointer">
                            <img
                                src={
                                    preview ||
                                    "https://randomuser.me/api/portraits/lego/1.jpg"
                                }
                                alt="avatar"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {uploadingAvatar && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                            <label
                                htmlFor="avatarUpload"
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer bg-opacity-30 rounded-full"
                                title="Thay đổi ảnh đại diện"
                            >
                                <FiCamera className="text-white text-3xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
                                <input
                                    type="file"
                                    id="avatarUpload"
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={uploadingAvatar}
                                />
                            </label>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 admin-dark:text-white mt-4">
                            {user.full_name}
                        </h3>
                        <p className="text-gray-500 admin-dark:text-gray-400 text-center">
                            {user.role}
                        </p>
                    </div>

                    {/* Cột 2: Thông tin cá nhân */}
                    <section className="border rounded-md md:rounded-xl border-gray-200 admin-dark:border-gray-700 p-2 sm:p-3 md:p-3 xl:gap-4">
                        <div className="flex justify-between md:flex-col lg:flex-row md:gap-2 items-center mb-6">
                            <h4 className="text-base sm:text-[18px] md:text-[18px] lg:text-xl font-semibold text-gray-900 admin-dark:text-white">
                                Thông tin cá nhân
                            </h4>
                            <button
                                type="button"
                                onClick={isEditInfo ? cancelEditInfo : () => setIsEditInfo(true)}
                                className="flex items-center gap-1 px-3 py-1 border border-gray-300 admin-dark:border-gray-600 rounded-full text-gray-700 admin-dark:text-gray-300 hover:bg-gradient-to-tr hover:from-purple-600 hover:via-pink-500 hover:to-red-400 hover:text-white transition-transform transform hover:scale-105 cursor-pointer"
                            >
                                {isEditInfo ? <FiX /> : <FiEdit />}
                                {isEditInfo ? "Hủy" : "Edit"}
                            </button>
                        </div>

                        <form onSubmit={handleUpdateInfo} className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={user.username}
                                    readOnly
                                    className="w-full rounded-md md:rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    readOnly={!isEditInfo}
                                    className={`w-full rounded-md md:rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition
                                    ${!isEditInfo ? "cursor-not-allowed bg-gray-50" : "cursor-text"}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    readOnly={!isEditInfo}
                                    className={`w-full rounded-md md:rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition
                                    ${!isEditInfo ? "cursor-not-allowed bg-gray-50" : "cursor-text"}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    readOnly={!isEditInfo}
                                    className={`w-full rounded-md md:rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition
                                    ${!isEditInfo ? "cursor-not-allowed bg-gray-50" : "cursor-text"}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Ngày tạo
                                </label>
                                <p className="text-gray-700 admin-dark:text-gray-300">
                                    {new Date(user.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Cập nhật lần cuối
                                </label>
                                <p className="text-gray-700 admin-dark:text-gray-300">
                                    {new Date(user.updated_at).toLocaleString()}
                                </p>
                            </div>

                            {isEditInfo && (
                                <button
                                    type="submit"
                                    disabled={updatingInfo}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-red-400 hover:from-purple-700 hover:via-pink-600 hover:to-red-500 text-white font-semibold text-sm px-4 py-2 rounded-full shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {updatingInfo ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <FiSave />
                                    )}
                                    {updatingInfo ? "Đang lưu..." : "Lưu thông tin"}
                                </button>
                            )}
                        </form>
                    </section>

                    {/* Cột 3: Đổi mật khẩu */}
                    <section className="border rounded-md md:rounded-xl border-gray-200 admin-dark:border-gray-700 p-2 sm:p-3 md:p-3">
                        <div className="flex justify-between md:flex-col lg:flex-row md:gap-2 items-center mb-6">
                            <h4 className="text-base sm:text-[18px] md:text-[18px] lg:text-xl font-semibold text-gray-900 admin-dark:text-white">
                                Đổi mật khẩu
                            </h4>
                            <button
                                type="button"
                                onClick={isEditPassword ? cancelEditPassword : () => setIsEditPassword(true)}
                                className={`${isEditPassword ? "bg-green-600 text-white font-bold" : ""} flex items-center gap-1 px-3 py-1 border border-gray-300 admin-dark:border-gray-600 rounded-full text-gray-700 admin-dark:text-gray-300 hover:bg-gradient-to-tr hover:from-purple-600 hover:via-pink-500 hover:to-red-400 hover:text-white transition-transform transform hover:scale-105 cursor-pointer`}
                            >
                                {isEditPassword ? <FiX /> : <FiEdit />}
                                {isEditPassword ? "Hủy" : "Edit"}
                            </button>
                        </div>

                        <form onSubmit={handleChangePassword} className="grid grid-cols-1 gap-4">
                            <div className="relative">
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Mật khẩu hiện tại
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.old ? "text" : "password"}
                                        placeholder="Mật khẩu hiện tại"
                                        readOnly={!isEditPassword}
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className={`w-full rounded-md md:rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 pr-10 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition
                                        ${!isEditPassword ? "cursor-not-allowed bg-gray-50" : "cursor-text"}`}
                                        style={{ lineHeight: "1.25rem" }}
                                    />
                                    {isEditPassword && (
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('old')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                        >
                                            {showPasswords.old ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        placeholder="••••••••"
                                        readOnly={!isEditPassword}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={`w-full rounded-md md:rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 pr-10 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition
                                        ${!isEditPassword ? "cursor-not-allowed bg-gray-50" : "cursor-text"}`}
                                        style={{ lineHeight: "1.25rem" }}
                                    />
                                    {isEditPassword && (
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('new')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                        >
                                            {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Nhập lại mật khẩu mới
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        placeholder="••••••••"
                                        readOnly={!isEditPassword}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full rounded-md md:rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 pr-10 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition
                                        ${!isEditPassword ? "cursor-not-allowed bg-gray-50" : "cursor-text"}`}
                                        style={{ lineHeight: "1.25rem" }}
                                    />
                                    {isEditPassword && (
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                        >
                                            {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isEditPassword && (
                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-red-400 hover:from-purple-700 hover:via-pink-600 hover:to-red-500 text-white font-semibold text-sm px-4 py-2 rounded-full shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {changingPassword ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <FiSave />
                                    )}
                                    {changingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
                                </button>
                            )}
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

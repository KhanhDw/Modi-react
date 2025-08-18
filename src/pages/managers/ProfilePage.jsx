import React, { useState } from "react";
import { FiCamera, FiUser, FiMail, FiLock, FiEdit, FiEye, FiEyeOff } from "react-icons/fi";

const ProfilePage = () => {
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);

    // trạng thái edit thông tin cá nhân và đổi mật khẩu
    const [isEditInfo, setIsEditInfo] = useState(false);
    const [isEditPassword, setIsEditPassword] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        setPreview(URL.createObjectURL(file));
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-6 admin-dark:bg-gray-900 min-h-screen">
            <h2 className="text-3xl font-extrabold text-gray-800 admin-dark:text-white mb-10 text-center">
                Hồ sơ cá nhân
            </h2>

            <div className="bg-white admin-dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-10 transition-colors duration-300 border border-gray-200 admin-dark:border-gray-700">


                {/* Avatar + Tên + Social + Edit */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-0 border-b border-gray-200 admin-dark:border-gray-700 pb-8">
                    <div className="flex items-center gap-6">
                        <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 shadow-lg cursor-pointer">
                            <img
                                src={
                                    preview ||
                                    "https://randomuser.me/api/portraits/lego/1.jpg"
                                }

                                alt="avatar"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <label
                                htmlFor="avatarUpload"
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer bg-opacity-30 rounded-full"
                                title="Thay đổi ảnh đại diện"
                            >
                                <FiCamera className="text-white text-3xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />

                                <input
                                    type="file"
                                    id="avatarUpload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 admin-dark:text-white">
                                Nguyễn Văn A
                            </h3>
                            <p className="text-gray-500 admin-dark:text-gray-400 mt-1">
                                Team Manager | Arizona, United States
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Thông tin cá nhân + đổi mật khẩu */}
                <form className="space-y-10">
                    {/* Thông tin cá nhân */}
                    <section className="border rounded-2xl border-gray-200 admin-dark:border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-semibold text-gray-900 admin-dark:text-white">Thông tin cá nhân</h4>
                            <button
                                type="button"
                                onClick={() => setIsEditInfo(!isEditInfo)}
                                className="flex items-center gap-1 px-3 py-1 border border-gray-300 admin-dark:border-gray-600 rounded-full text-gray-700 admin-dark:text-gray-300 hover:bg-gradient-to-tr hover:from-purple-600 hover:via-pink-500 hover:to-red-400 hover:text-white transition-transform transform hover:scale-105 cursor-pointer"
                            >
                                <FiEdit />
                                {isEditInfo ? "Hủy" : "Edit"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/** Bỏ readOnly khi isEditInfo = true */}
                            <div>
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Nguyễn Văn A"
                                    readOnly={!isEditInfo}
                                    className={`w-full rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition
                                        ${!isEditInfo ? 'cursor-not-allowed' : 'cursor-text'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    defaultValue="email@example.com"
                                    readOnly={!isEditInfo}
                                    className={`w-full rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition
                                        ${!isEditInfo ? 'cursor-not-allowed' : 'cursor-text'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    defaultValue="+84 123 456 789"
                                    readOnly={!isEditInfo}
                                    className={`w-full rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition
                                        ${!isEditInfo ? 'cursor-not-allowed' : 'cursor-text'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Bio
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Team Manager"
                                    readOnly={!isEditInfo}
                                    className={`w-full rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition
                                        ${!isEditInfo ? 'cursor-not-allowed' : 'cursor-text'}`}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Đổi mật khẩu */}
                    <section className="border rounded-2xl border-gray-200 admin-dark:border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-semibold text-gray-900 admin-dark:text-white">Đổi mật khẩu</h4>
                            <button
                                type="button"
                                onClick={() => setIsEditPassword(!isEditPassword)}
                                className="flex items-center gap-1 px-3 py-1 border border-gray-300 admin-dark:border-gray-600 rounded-full text-gray-700 admin-dark:text-gray-300 hover:bg-gradient-to-tr hover:from-purple-600 hover:via-pink-500 hover:to-red-400 hover:text-white transition-transform transform hover:scale-105 cursor-pointer"
                            >
                                <FiEdit />
                                {isEditPassword ? "Hủy" : "Edit"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Mật khẩu hiện tại */}
                            <div className="relative">
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Mật khẩu hiện tại
                                </label>
                                <input
                                    type={isEditPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    readOnly={!isEditPassword}
                                    className={`w-full rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition
          ${!isEditPassword ? 'cursor-not-allowed' : 'cursor-text'}`}
                                    style={{ lineHeight: '1.25rem' }}
                                />
                            </div>

                            {/* Mật khẩu mới */}
                            <div className="relative">
                                <label className="block text-sm text-gray-500 admin-dark:text-gray-400 font-medium mb-1">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type={isEditPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    readOnly={!isEditPassword}
                                    className={`w-full rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 px-4 py-2 text-gray-900 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition
          ${!isEditPassword ? 'cursor-not-allowed' : 'cursor-text'}`}
                                    style={{ lineHeight: '1.25rem' }}
                                />
                            </div>
                        </div>
                    </section>


                    <div className="text-right">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-400 hover:from-purple-700 hover:via-pink-600 hover:to-red-500 text-white font-semibold text-base px-4 py-2.5 rounded-full shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-105 select-none cursor-pointer"
                        >
                            Lưu thay đổi
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProfilePage;

import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiKey } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import loginBanner from '../../assets/images/authentication-banners/login.png';
import logo from '/logoModi1.png';

function AdminLoginPage() {
    const navigate = useNavigate();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState(null); // lưu thông báo lỗi
    const [loading, setLoading] = useState(false); // trạng thái loading

    const handleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    // ✅ Kiểm tra nếu đã login thì redirect
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            navigate("/managers");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            const data = await response.json();

            // Sau khi nhận được data từ API
            if (!response.ok || !data.accessToken) {
                throw new Error(data.message || "Đăng nhập thất bại");
            }


            if (data.user?.fullname) {
                localStorage.setItem("fullName", data.user.fullname);
            }

            if (!response.ok || !data.accessToken) {
                throw new Error(data.message || "Đăng nhập thất bại");
            }

            // Lưu token & user info
            localStorage.setItem("accessToken", data.accessToken);
            if (data.refreshToken) {
                localStorage.setItem("refreshToken", data.refreshToken);
            }
            if (data.adminData) {
                localStorage.setItem("adminData", JSON.stringify(data.adminData));
            }

            // Điều hướng sau khi login thành công
            navigate("/managers");
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 admin-dark:bg-[#0a1120] transition">
            <div className="bg-white admin-dark:bg-gray-800 shadow-md w-full max-w-[900px] h-auto md:h-[550px] flex flex-col md:flex-row rounded-md overflow-hidden transition">
                {/* Left Section */}
                <div className="w-full md:w-1/2 p-6 md:p-6 flex flex-col justify-between">
                    <div>
                        {/* Logo */}
                        <div className="flex items-center gap-3 justify-center mb-8">
                            <Link to={'/'} >
                                <img src={logo} alt="Logo" className="w-15 " />
                            </Link>
                        </div>

                        <h2 className="text-2xl text-center font-bold mb-6 text-gray-900 admin-dark:text-gray-100">
                            Đăng nhập
                        </h2>

                        <form onSubmit={handleLogin}>
                            {/* Username */}
                            <div className="mb-4">
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700 admin-dark:text-gray-300">
                                    Tài khoản
                                </label>
                                <div className="flex items-center bg-gray-100 admin-dark:bg-gray-700 px-4 py-3 rounded-full">
                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        placeholder="Nhập tài khoản (admin)"
                                        autoComplete="off"
                                        value={form.username}
                                        onChange={handleChange}
                                        className="bg-transparent flex-1 outline-none text-sm text-gray-700 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400"
                                    />
                                    <FiMail className="text-gray-400 admin-dark:text-gray-300" />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="mb-2">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 admin-dark:text-gray-300">
                                    Mật khẩu
                                </label>
                                <div className="flex items-center bg-gray-100 admin-dark:bg-gray-700 px-4 py-3 rounded-full">
                                    <input
                                        id="password"
                                        type={isShowPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Nhập mật khẩu (1234)"
                                        autoComplete="off"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="bg-transparent flex-1 outline-none text-sm text-gray-700 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400"
                                    />
                                    <FiKey
                                        className="text-gray-400 admin-dark:text-gray-300 cursor-pointer"
                                        onClick={handleShowPassword}
                                    />
                                </div>
                            </div>

                            {/* Hiển thị lỗi */}
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}

                            {/* Forget password */}
                            <div className="text-right mb-6">
                                <Link to="/forgot-password" className="text-orange-500 text-sm hover:underline">
                                    Quên mật khẩu
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-500 text-white w-full py-3 rounded-full text-sm font-medium hover:bg-orange-600 transition disabled:opacity-50"
                            >
                                {loading ? "Đang xử lý..." : "Đăng nhập"}
                            </button>
                        </form>

                        {/* Go Home */}
                        <p className="text-center text-sm text-gray-600 admin-dark:text-gray-400 mt-6">
                            <Link to="/" className="text-orange-500 font-medium hover:underline">
                                Về trang chủ
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full md:w-1/2 h-64 md:h-full relative hidden md:block">
                    <img
                        src={loginBanner}
                        alt="Login banner"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminLoginPage;

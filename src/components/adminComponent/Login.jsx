import { useState } from "react";
import { FiMail, FiKey } from "react-icons/fi";
import loginBanner from '../../assets/images/authentication-banners/login.png';
import logo from '../../assets/images/logo/elegant-logo.png'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 admin-dark:bg-[#0a1120] transition">
            <div className="bg-white admin-dark:bg-gray-800 shadow-md w-full max-w-[900px] h-auto md:h-[550px] flex flex-col md:flex-row rounded-md overflow-hidden transition">

                {/* Left Section */}
                <div className="w-full md:w-1/2 p-6 md:p-6 flex flex-col justify-between">
                    <div>
                        {/* Logo */}
                        <img src={logo} alt="Logo" className="w-28 mb-6 md:mb-8" />
                        <h2 className="text-2xl text-center font-bold mb-6 text-gray-900 admin-dark:text-gray-100">
                            Login
                        </h2>

                        {/* Email */}
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-700 admin-dark:text-gray-300"
                            >
                                Email
                            </label>
                            <div className="flex items-center bg-gray-100 admin-dark:bg-gray-700 px-4 py-3 rounded-full">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-transparent flex-1 outline-none text-sm text-gray-700 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400"
                                />
                                <FiMail className="text-gray-400 admin-dark:text-gray-300" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-2">
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-700 admin-dark:text-gray-300"
                            >
                                Password
                            </label>
                            <div className="flex items-center bg-gray-100 admin-dark:bg-gray-700 px-4 py-3 rounded-full">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="bg-transparent flex-1 outline-none text-sm text-gray-700 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400"
                                />
                                <FiKey
                                    className="text-gray-400 admin-dark:text-gray-300 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>

                        {/* Forget password */}
                        <div className="text-right mb-6">
                            <a href="#" className="text-orange-500 text-sm hover:underline">
                                Forget password
                            </a>
                        </div>

                        {/* Login Button */}
                        <button className="bg-orange-500 text-white w-full py-3 rounded-full text-sm font-medium hover:bg-orange-600 transition">
                            Log in
                        </button>

                        {/* Sign up */}
                        <p className="text-center text-sm text-gray-600 admin-dark:text-gray-400 mt-6">
                            Don’t have an account?{" "}
                            <a href="#" className="text-orange-500 font-medium hover:underline">
                                Sign up
                            </a>
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
};

export default Login;

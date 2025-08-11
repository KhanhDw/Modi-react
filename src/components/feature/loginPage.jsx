import { useState } from "react";
import { FiMail, FiKey } from "react-icons/fi";
import loginBanner from '../assets/images/authentication-banners/login.png';
import logo from '../assets/images/logo/elegant-logo.png'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
            <div className="bg-white shadow-md w-full max-w-[900px] h-auto md:h-[550px] flex flex-col md:flex-row rounded-md overflow-hidden">
                {/* Left Section */}
                <div className="w-full md:w-1/2 p-6 md:p-6 flex flex-col justify-between">
                    <div>
                        <img src={logo} alt="Logo" className="w-28 mb-6 md:mb-8" />
                        <h2 className="text-2xl text-center md:text-center font-bold mb-6">Login</h2>

                        {/* Email */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="flex items-center bg-gray-100 px-4 py-3 rounded-full">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-transparent flex-1 outline-none text-sm text-gray-700"
                                />
                                <FiMail className="text-gray-400" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-2">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="flex items-center bg-gray-100 px-4 py-3 rounded-full">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="bg-transparent flex-1 outline-none text-sm text-gray-700"
                                />
                                <FiKey
                                    className="text-gray-400 cursor-pointer"
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
                        <p className="text-center md:text-center text-sm text-gray-600 mt-6">
                            Don’t have an account?{" "}
                            <a href="#" className="text-orange-500 font-medium hover:underline">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>

                {/* Right Section - Hidden on small screens */}
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

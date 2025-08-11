import { useState } from "react";
import { FiUser, FiMail, FiKey } from "react-icons/fi";
import signupBanner from '../assets/images/authentication-banners/signup.png'; // bạn thay bằng ảnh đúng
import logo from '../assets/images/logo/elegant-logo.png';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
            <div className="bg-white shadow-md w-full max-w-[900px] h-auto md:h-[550px] flex flex-col md:flex-row rounded-md overflow-hidden">
                {/* Left Section */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        <img src={logo} alt="Logo" className="w-28 mb-6 md:mb-6" />
                        <h2 className="text-2xl text-center md:text-center font-bold mb-6">Signup</h2>

                        {/* Name */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <div className="flex items-center bg-gray-100 px-4 py-3 rounded-full">
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="bg-transparent flex-1 outline-none text-sm text-gray-700"
                                />
                                <FiUser className="text-gray-400" />
                            </div>
                        </div>

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
                        <div className="mb-6">
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

                        {/* Signup Button */}
                        <button className="bg-orange-500 cursor-pointer text-white w-full py-3 rounded-full text-sm font-medium hover:bg-orange-600 transition">
                            Sign up
                        </button>

                        {/* Login Link */}
                        <p className="text-center md:text-center text-sm text-gray-600 mt-6">
                            Already have an account?{" "}
                            <a href="#" className="text-orange-500 font-medium hover:underline">
                                Log in
                            </a>
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full md:w-1/2 h-64 md:h-full relative hidden md:block">
                    <img
                        src={signupBanner}
                        alt="Signup banner"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Signup;

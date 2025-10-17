import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import logoSvg from "../../assets/images/logo/logo.svg";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] admin-dark:bg-[#0a1120] flex flex-col items-center justify-center px-4 transition">
      {/* Logo + Name */}
      <div className="flex items-center gap-3 mb-6">
        <img
          loading="lazy"
          src={logoSvg}
          alt="Logo"
          className="w-14 h-14"
        />
        <h1 className="text-2xl font-bold text-[#1e1e1e] admin-dark:text-gray-100">
          Dabang
        </h1>
      </div>

      {/* Card */}
      <div className="bg-white admin-dark:bg-[#0f172a] shadow-md rounded-2xl w-full max-w-md p-6 transition">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 admin-dark:text-gray-100">
            Sign up
          </h2>
          <a
            href="#"
            className="text-[#5d5fef] text-sm font-medium hover:underline"
          >
            Already have an account?
          </a>
        </div>

        {/* Form */}
        <form>
          {/* Name */}
          <div className="mb-4 relative">
            <input
              autoComplete="off"
              type="text"
              placeholder="Enter your full name"
              className="w-full pr-10 pl-4 py-3 border border-gray-300 admin-dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#5d5fef] focus:border-transparent transition bg-transparent text-gray-800 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400"
              required
            />
            <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 admin-dark:text-gray-300" />
          </div>

          {/* Email */}
          <div className="mb-4 relative">
            <input
              autoComplete="off"
              type="email"
              placeholder="Enter your email"
              className="w-full pr-10 pl-4 py-3 border border-gray-300 admin-dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#5d5fef] focus:border-transparent transition bg-transparent text-gray-800 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400"
              required
            />
            <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 admin-dark:text-gray-300" />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <input
              autoComplete="off"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="w-full px-4 py-3 pr-10 border border-gray-300 admin-dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#5d5fef] focus:border-transparent transition bg-transparent text-gray-800 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400"
              required
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 admin-dark:text-gray-300 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-[#5d5fef] hover:bg-[#5b4ee0] text-white font-bold py-3 w-full rounded-lg transition duration-200"
          >
            Sign up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300 admin-dark:border-gray-600" />
          <span className="px-4 text-sm text-gray-500 admin-dark:text-gray-400">
            or sign up with
          </span>
          <hr className="flex-1 border-gray-300 admin-dark:border-gray-600" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center border border-red-500 text-red-500 font-medium py-2 rounded-lg text-sm hover:bg-red-50 admin-dark:hover:bg-red-900/20 transition duration-200">
            <FaGoogle className="mr-2" />
            Google
          </button>
          <button className="flex items-center justify-center border border-blue-600 text-blue-600 font-medium py-2 rounded-lg text-sm hover:bg-blue-50 admin-dark:hover:bg-blue-900/20 transition duration-200">
            <FaFacebook className="mr-2" />
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

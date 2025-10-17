import { useState } from "react";
import { FiKey } from "react-icons/fi";
import resetBanner from "../../assets/images/authentication-banners/reset-password.png";
import logo from "../../assets/images/logo/elegant-logo.png";

const ResetPassword = () => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 admin-dark:bg-[#0a1120] transition">
      <div className="bg-white admin-dark:bg-gray-800 shadow-md w-full max-w-[900px] h-auto md:h-[500px] flex flex-col md:flex-row rounded-md overflow-hidden transition">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <img
              loading="lazy"
              src={logo}
              alt="Logo"
              className="w-28 mb-6 md:mb-6"
            />
            <h2 className="text-2xl text-center font-bold mb-6 text-gray-900 admin-dark:text-gray-100">
              Reset Password
            </h2>

            {/* New Password */}
            <div className="mb-4">
              <label
                htmlFor="new-password"
                className="block mb-2 text-sm font-medium text-gray-700 admin-dark:text-gray-300"
              >
                Password
              </label>
              <div className="flex items-center bg-gray-100 admin-dark:bg-gray-700 px-4 py-3 rounded-full">
                <input
                  autoComplete="off"
                  id="new-password"
                  type={showPassword1 ? "text" : "password"}
                  placeholder="Enter new password"
                  required
                  className="bg-transparent flex-1 outline-none text-sm text-gray-800 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400"
                />
                <FiKey
                  className="text-gray-400 admin-dark:text-gray-300 cursor-pointer"
                  onClick={() => setShowPassword1(!showPassword1)}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-700 admin-dark:text-gray-300"
              >
                Confirm Password
              </label>
              <div className="flex items-center bg-gray-100 admin-dark:bg-gray-700 px-4 py-3 rounded-full">
                <input
                  autoComplete="off"
                  id="confirm-password"
                  type={showPassword2 ? "text" : "password"}
                  placeholder="Confirm password"
                  required
                  className="bg-transparent flex-1 outline-none text-sm text-gray-800 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400"
                />
                <FiKey
                  className="text-gray-400 admin-dark:text-gray-300 cursor-pointer"
                  onClick={() => setShowPassword2(!showPassword2)}
                />
              </div>
            </div>

            {/* Reset Password Button */}
            <button className="bg-orange-500 cursor-pointer text-white w-full py-3 rounded-full text-sm font-medium hover:bg-orange-600 transition">
              Reset Password
            </button>

            {/* Back to Login Link */}
            <p className="text-center text-sm text-gray-600 admin-dark:text-gray-400 mt-6">
              Back to{" "}
              <a
                href="#"
                className="text-orange-500 font-medium hover:underline"
              >
                Log in
              </a>
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 h-64 md:h-full relative hidden md:block">
          <img
            loading="lazy"
            src={resetBanner}
            alt="Reset Password banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

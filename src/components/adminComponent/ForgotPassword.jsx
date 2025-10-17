import { FiMail } from "react-icons/fi";
import loginBanner from "../../assets/images/authentication-banners/forgot-password.png";
import logo from "../../assets/images/logo/elegant-logo.png";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 admin-dark:bg-[#0a1120] transition">
      <div className="bg-white admin-dark:bg-gray-800 shadow-md w-full max-w-[900px] h-auto md:h-[550px] flex flex-col md:flex-row rounded-md overflow-hidden transition">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
          {/* Logo */}
          <img
            loading="lazy"
            src={logo}
            alt="Logo"
            className="w-28 mb-6 md:mb-8"
          />

          {/* Form Content */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl text-center font-bold mb-6 text-gray-900 admin-dark:text-gray-100">
              Forgot password
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
                  autoComplete="off"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent flex-1 outline-none text-sm text-gray-800 admin-dark:text-gray-100 placeholder-gray-400 admin-dark:placeholder-gray-400"
                />
                <FiMail className="text-gray-400 admin-dark:text-gray-300" />
              </div>
            </div>

            {/* Send Reset Button */}
            <button className="bg-orange-500 cursor-pointer text-white mt-6 w-full py-3 rounded-full text-sm font-medium hover:bg-orange-600 transition">
              Send Password Reset Link
            </button>

            {/* Back to login */}
            <p className="text-center text-sm text-gray-600 admin-dark:text-gray-400 mt-6">
              Back to{" "}
              <a
                href="#"
                className="text-orange-500 font-medium hover:underline"
              >
                Login
              </a>
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 h-64 md:h-full relative hidden md:block">
          <img
            loading="lazy"
            src={loginBanner}
            alt="Login banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

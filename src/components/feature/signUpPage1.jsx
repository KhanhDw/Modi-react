import { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaFacebook, FaGoogle } from 'react-icons/fa';
import logoSvg from '../assets/images/logo/logo.svg';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4">
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
                <img src={logoSvg} alt="Logo" className="w-14 h-14" />
                <h1 className="text-2xl font-bold text-[#1e1e1e]">Dabang</h1>
            </div>

            {/* Card */}
            <div className="bg-white shadow-md rounded-2xl w-full max-w-md p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Sign up</h2>
                    <div className="text-sm font-medium">
                        <span className="text-gray-400 mr-1">Have an account?</span>
                        <a href="#" className="text-[#6D5FFD] hover:underline">
                            Sign in
                        </a>
                    </div>
                </div>

                {/* Form */}
                <form>
                    {/* Name */}
                    <div className="mb-4 relative">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#6D5FFD] focus:border-transparent transition duration-150"
                            required
                        />
                        <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Email */}
                    <div className="mb-4 relative">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#6D5FFD] focus:border-transparent transition duration-150"
                            required
                        />
                        <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Password */}
                    <div className="mb-4 relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#6D5FFD] focus:border-transparent transition duration-150"
                            required
                        />
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>

                    {/* Accept Terms */}
                    <div className="flex items-center gap-2 mb-6 text-sm">
                        <input
                            id="acceptTerms"
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={() => setAcceptedTerms(!acceptedTerms)}
                            className="accent-[#6D5FFD] w-4 h-4"
                            required
                        />
                        <label htmlFor="acceptTerms" className="text-gray-700 cursor-pointer">
                            Accept{' '}
                            <a href="#" className="text-[#6D5FFD] hover:underline">
                                terms
                            </a>{' '}
                            &{' '}
                            <a href="#" className="text-[#6D5FFD] hover:underline">
                                privacy policy
                            </a>
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="bg-[#6D5FFD] hover:bg-[#5b4ee0] text-white font-bold py-3 w-full rounded-lg transition duration-200 disabled:opacity-50"
                        disabled={!acceptedTerms}
                    >
                        Sign up
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-1 border-gray-300" />
                    <span className="px-4 text-sm text-gray-500">or sign up with</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center border border-red-500 text-red-500 font-medium py-2 rounded-lg text-sm hover:bg-red-50 transition duration-200">
                        <FaGoogle className="mr-2" />
                        Google
                    </button>
                    <button className="flex items-center justify-center border border-blue-600 text-blue-600 font-medium py-2 rounded-lg text-sm hover:bg-blue-50 transition duration-200">
                        <FaFacebook className="mr-2" />
                        Facebook
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

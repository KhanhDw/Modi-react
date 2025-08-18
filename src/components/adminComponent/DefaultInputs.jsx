// npm install react-flatpickr flatpickr

import { useState } from "react";
import { FiCalendar, FiEye, FiEyeOff } from "react-icons/fi";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
];

export default function DefaultInputs() {
    const [showPassword, setShowPassword] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState("");

    const handleDateChange = (date) => {
        setDateOfBirth(date[0] ? date[0].toLocaleDateString() : "");
    };

    return (
        <div className="max-w-md m-2 mx-auto bg-white admin-dark:bg-gray-900 rounded-lg shadow p-6 space-y-6 border border-gray-200 admin-dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 admin-dark:text-gray-100">
                Default Inputs
            </h2>

            {/* Input */}
            <div>
                <label
                    htmlFor="input"
                    className="block mb-1 font-medium text-gray-700 admin-dark:text-gray-300"
                >
                    Input
                </label>
                <input
                    id="input"
                    type="text"
                    className="w-full rounded-md border border-gray-300 admin-dark:border-gray-600 px-4 py-2 placeholder-gray-400 text-gray-900 admin-dark:text-gray-100 admin-dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder=""
                />
            </div>

            {/* Input with Placeholder */}
            <div>
                <label
                    htmlFor="inputTwo"
                    className="block mb-1 font-medium text-gray-700 admin-dark:text-gray-300"
                >
                    Input with Placeholder
                </label>
                <input
                    id="inputTwo"
                    type="text"
                    placeholder="info@gmail.com"
                    className="w-full rounded-md border border-gray-300 admin-dark:border-gray-600 px-4 py-2 placeholder-gray-400 text-gray-900 admin-dark:text-gray-100 admin-dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
            </div>

            {/* Select Input */}
            <div>
                <label className="block mb-1 font-medium text-gray-700 admin-dark:text-gray-300">
                    Select Input
                </label>
                <select
                    className="w-full rounded-md border border-gray-300 admin-dark:border-gray-600 px-4 py-2 text-gray-900 admin-dark:text-gray-100 admin-dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select an option
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Password Input */}
            <div>
                <label className="block mb-1 font-medium text-gray-700 admin-dark:text-gray-300">
                    Password Input
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full rounded-md border border-gray-300 admin-dark:border-gray-600 px-4 py-2 placeholder-gray-400 text-gray-900 admin-dark:text-gray-100 admin-dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 admin-dark:text-gray-400 hover:text-gray-700 admin-dark:hover:text-gray-200"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                    </button>
                </div>
            </div>

            {/* Date Picker Input */}
            <div>
                <label className="block mb-1 font-medium text-gray-700 admin-dark:text-gray-300">
                    Date Picker Input
                </label>
                <div className="relative">
                    <Flatpickr
                        value={dateOfBirth}
                        onChange={handleDateChange}
                        options={{ dateFormat: "d/m/Y" }}
                        placeholder="Chọn ngày"
                        className="w-full rounded-md border border-gray-300 admin-dark:border-gray-600 px-4 py-2 pr-10 placeholder-gray-400 text-gray-900 admin-dark:text-gray-100 admin-dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                    <FiCalendar className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 admin-dark:text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}

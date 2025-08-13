//npm install react-flatpickr flatpickr

import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

import { FiEye, FiEyeOff } from "react-icons/fi";

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
        <div className="max-w-md m-2 mx-auto bg-white rounded-lg shadow p-6 space-y-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Default Inputs</h2>

            {/* Input */}
            <div>
                <label htmlFor="input" className="block mb-1 font-medium text-gray-700">
                    Input
                </label>
                <input
                    id="input"
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder=""
                />
            </div>

            {/* Input with Placeholder */}
            <div>
                <label htmlFor="inputTwo" className="block mb-1 font-medium text-gray-700">
                    Input with Placeholder
                </label>
                <input
                    id="inputTwo"
                    type="text"
                    placeholder="info@gmail.com"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
            </div>

            {/* Select Input */}
            <div>
                <label className="block mb-1 font-medium text-gray-700">Select Input</label>
                <select
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
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
                <label className="block mb-1 font-medium text-gray-700">Password Input</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                    </button>
                </div>
            </div>

            {/* Date Picker Input */}
            <div>
                <label className="block mb-1 font-medium text-gray-700">Date Picker Input</label>
                <Flatpickr
                    value={dateOfBirth}
                    onChange={handleDateChange}
                    options={{ dateFormat: "d/m/Y" }}
                    placeholder="Select a date"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
            </div>
        </div>
    );
}

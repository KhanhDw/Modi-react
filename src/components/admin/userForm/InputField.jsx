import React from "react";

// Custom Input Field with Label
const InputField = ({
  label,
  id,
  placeholder,
  type = "text",
  required,
  maxLength,
  className,
  ...props
}) => (
  <div className="flex flex-col space-y-1">
    <label
      htmlFor={id}
      className="text-sm sm:text-base font-medium text-gray-700 admin-dark:text-gray-300"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder || label}
      required={required}
      maxLength={maxLength}
      className={`w-full px-2.5 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-100 placeholder:text-gray-500 admin-dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm focus:outline-none focus:border-none placeholder:text-sm placeholder:sm:text-base ${className}`}
      {...props}
    />
  </div>
);

export default InputField;

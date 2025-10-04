import React from "react";

// Custom Input Field with Label
const InputField = ({
  label,
  id,
  placeholder,
  type = "text",
  required,
  className,
  ...props
}) => (
  <div className="flex flex-col space-y-1">
    <label
      htmlFor={id}
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder || label}
      required={required}
      className={`w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm ${className}`}
      {...props}
    />
  </div>
);

export default InputField;

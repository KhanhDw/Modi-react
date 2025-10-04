import React from "react";

// Custom File Input Field with Label
const FileInput = ({ label, id, accept = "image/*", onChange, ...props }) => (
  <div className="flex flex-col space-y-1">
    <label
      htmlFor={id}
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={onChange}
      className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-white dark:hover:file:bg-gray-600 transition duration-150"
      {...props}
    />
  </div>
);

export default FileInput;

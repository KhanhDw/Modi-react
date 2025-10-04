import React from "react";

const PlaceholderBox = ({ label, isCircle = false }) => (
  <div
    className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-400 dark:border-gray-500 text-gray-500 dark:text-gray-300 transition duration-300 p-2 text-center select-none ${
      isCircle ? "w-24 h-24 rounded-full" : "w-full h-32 rounded-lg"
    }`}
    style={{ minWidth: isCircle ? "6rem" : "auto" }}
  >
    {/* Icon (Camera/Image) */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7 mb-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <p className="text-xs font-semibold">{label}</p>
  </div>
);

export default PlaceholderBox;

import React, { useState, useEffect } from "react";

const VideoSettingsModal = ({
  isOpen,
  onClose,
  video,
  onSave,
  isSaving,
  introVideoName,
  bannerVideoName,
}) => {
  const [selectedOption, setSelectedOption] = useState("intro");

  useEffect(() => {
    if (isOpen) {
      setSelectedOption("intro");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedOption);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 bg-opacity-60 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white admin-dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 m-4 transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 admin-dark:text-white">
            Thiết lập Video
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 admin-dark:text-gray-500 hover:text-gray-600 hover:admin-dark:text-gray-300 transition-colors"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <fieldset className="space-y-4">
          <legend className="sr-only">Tùy chọn thiết lập video</legend>
          <label
            className={`p-5 border-2 rounded-lg cursor-pointer transition-all duration-200 block ${
              selectedOption === "intro"
                ? "border-blue-500 bg-blue-50 admin-dark:bg-blue-900/20 shadow-md"
                : "bg-gray-50 admin-dark:bg-gray-700/50 border-transparent hover:bg-gray-100 hover:admin-dark:bg-gray-700"
            }`}
          >
            <input
              type="radio"
              name="video-option"
              value="intro"
              checked={selectedOption === "intro"}
              onChange={() => setSelectedOption("intro")}
              className="sr-only"
            />
            <p className="text-lg font-semibold text-gray-900 admin-dark:text-white">
              Video giới thiệu
            </p>
            <p className="text-sm text-gray-500 admin-dark:text-gray-400 truncate">
              Đang dùng: {introVideoName || "Chưa thiết lập"}
            </p>
            <p className="text-sm text-blue-600 admin-dark:text-blue-400 truncate font-medium">
              Sẽ thay bằng: {video.filename}
            </p>
          </label>

          <label
            className={`p-5 border-2 rounded-lg cursor-pointer transition-all duration-200 block ${
              selectedOption === "banner"
                ? "border-blue-500 bg-blue-50 admin-dark:bg-blue-900/20 shadow-md"
                : "bg-gray-50 admin-dark:bg-gray-700/50 border-transparent hover:bg-gray-100 hover:admin-dark:bg-gray-700"
            }`}
          >
            <input
              type="radio"
              name="video-option"
              value="banner"
              checked={selectedOption === "banner"}
              onChange={() => setSelectedOption("banner")}
              className="sr-only"
            />
            <p className="text-lg font-semibold text-gray-900 admin-dark:text-white">
              Video banner
            </p>
            <p className="text-sm text-gray-500 admin-dark:text-gray-400 truncate">
              Đang dùng: {bannerVideoName || "Chưa thiết lập"}
            </p>
            <p className="text-sm text-blue-600 admin-dark:text-blue-400 truncate font-medium">
              Sẽ thay bằng: {video.filename}
            </p>
          </label>
        </fieldset>
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gray-200 admin-dark:bg-gray-700 text-gray-800 admin-dark:text-gray-200 font-semibold hover:bg-gray-300 hover:admin-dark:bg-gray-600 transition-colors"
          >
            Hủy
          </button>{" "}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoSettingsModal;

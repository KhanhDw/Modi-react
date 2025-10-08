import React, { useRef } from "react";
import { formatFileSize, formatDate } from "./utils";

const VideoPlayer = ({ selectedVideo, onDeleteVideo }) => {
  const videoRef = useRef(null);

  if (!selectedVideo) {
    return (
      <div className="admin-light:bg-gray-50 admin-dark:bg-gray-800 border-2 border-dashed border-gray-300 admin-dark:border-gray-600 rounded-xl p-10 h-full flex flex-col items-center justify-center text-center">
        <div className="admin-light:text-gray-500 admin-dark:text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto opacity-60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="admin-light:text-gray-600 admin-dark:text-gray-300 text-lg font-medium">
          Chọn video để phát
        </p>
        <p className="admin-light:text-gray-500 admin-dark:text-gray-400 text-sm mt-2">
          Video được chọn sẽ hiển thị tại đây
        </p>
      </div>
    );
  }

  // Hàm rút gọn tên file nếu quá dài
  const truncateFilename = (filename, maxLength = 30) => {
    if (filename.length <= maxLength) return filename;

    const extension = filename.split(".").pop();
    const nameWithoutExt = filename.slice(0, -(extension.length + 1));
    const truncatedName = nameWithoutExt.slice(
      0,
      maxLength - extension.length - 3
    );

    return `${truncatedName}...${extension}`;
  };

  return (
    <div className="admin-light:bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 rounded-xl p-6 mb-8 relative transition-all duration-200 hover:admin-light:shadow-lg hover:admin-dark:shadow-xl hover:admin-dark:shadow-gray-900/10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="admin-light:bg-blue-100 admin-dark:bg-blue-900/30 p-2 rounded-lg">
          <svg
            className="w-6 h-6 admin-light:text-blue-600 admin-dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="admin-light:text-gray-800 admin-dark:text-white text-xl font-semibold truncate">
            Đang phát: {selectedVideo.filename}
          </h2>
          <p className="admin-light:text-gray-500 admin-dark:text-gray-400 text-sm truncate">
            Streaming chất lượng cao
          </p>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative mb-6">
        <video
          ref={videoRef}
          controls
          autoPlay
          className="w-full max-w-4xl h-auto rounded-xl admin-light:shadow-lg admin-dark:shadow-xl admin-dark:shadow-black/20 transition-shadow duration-200"
          key={selectedVideo.url}
        >
          <source
            src={selectedVideo.url}
            type="video/mp4"
          />
          Trình duyệt của bạn không hỗ trợ video tag.
        </video>
      </div>

      {/* Video Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 admin-light:bg-gray-50 admin-dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-start gap-3 p-3 admin-light:bg-white admin-dark:bg-gray-600 rounded-lg transition-colors duration-200">
          <div className="admin-light:bg-green-100 admin-dark:bg-green-900/30 p-2 rounded-lg flex-shrink-0 mt-0.5">
            <svg
              className="w-5 h-5 admin-light:text-green-600 admin-dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="admin-light:text-gray-600 admin-dark:text-gray-300 text-sm font-medium mb-1">
              Tên file
            </p>
            <div className="group relative">
              <p className="admin-light:text-gray-800 admin-dark:text-white font-semibold truncate">
                {truncateFilename(selectedVideo.filename)}
              </p>
              {/* Tooltip hiển thị full tên file khi hover */}
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-20">
                <div className="admin-light:bg-gray-800 admin-dark:bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                  {selectedVideo.filename}
                </div>
                <div className="w-3 h-3 admin-light:bg-gray-800 admin-dark:bg-gray-900 transform rotate-45 absolute -bottom-1 left-3"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 admin-light:bg-white admin-dark:bg-gray-600 rounded-lg transition-colors duration-200">
          <div className="admin-light:bg-purple-100 admin-dark:bg-purple-900/30 p-2 rounded-lg flex-shrink-0">
            <svg
              className="w-5 h-5 admin-light:text-purple-600 admin-dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <div>
            <p className="admin-light:text-gray-600 admin-dark:text-gray-300 text-sm font-medium">
              Kích thước
            </p>
            <p className="admin-light:text-gray-800 admin-dark:text-white font-semibold">
              {formatFileSize(selectedVideo.size)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 admin-light:bg-white admin-dark:bg-gray-600 rounded-lg transition-colors duration-200">
          <div className="admin-light:bg-orange-100 admin-dark:bg-orange-900/30 p-2 rounded-lg flex-shrink-0">
            <svg
              className="w-5 h-5 admin-light:text-orange-600 admin-dark:text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="admin-light:text-gray-600 admin-dark:text-gray-300 text-sm font-medium">
              Ngày upload
            </p>
            <p className="admin-light:text-gray-800 admin-dark:text-white font-semibold">
              {formatDate(selectedVideo.created)}
            </p>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex  mt-4 xs:flex-col md:flex-row items-center md:justify-between gap-3">
        <div className="inline-flex items-center gap-2 admin-light:bg-green-50 admin-dark:bg-green-900/20 admin-light:text-green-700 admin-dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Hỗ trợ streaming chất lượng cao
        </div>
        {/* Delete Button */}
        <button
          onClick={() => onDeleteVideo(selectedVideo.filename)}
          className="flex right-4 bg-red-500 admin-dark:bg-red-600 hover:bg-red-600 admin-dark:hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 items-center gap-1 shadow-md z-10"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Xóa video
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;

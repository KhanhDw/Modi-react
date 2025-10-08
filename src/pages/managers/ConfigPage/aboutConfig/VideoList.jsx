// VideoList.jsx
import React, { useState, useEffect } from "react";
import { formatFileSize, formatDate } from "./utils";
import Pagination from "@/pages/managers/ConfigPage/aboutConfig/components/paginationVideoList.jsx";

const VideoList = ({
  videos,
  selectedVideo,
  onSelectVideo,
  onLoadVideos,
  loading,
  onDeleteVideo,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 6;

  // Reset về trang 1 khi videos thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [videos]);

  // Tính toán video cho trang hiện tại
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(videos.length / videosPerPage);

  // Hàm rút gọn tên file
  const truncateFilename = (filename, maxLength = 25) => {
    if (filename.length <= maxLength) return filename;

    const extension = filename.split(".").pop();
    const nameWithoutExt = filename.slice(0, -(extension.length + 1));
    const truncatedName = nameWithoutExt.slice(
      0,
      maxLength - extension.length - 3
    );

    return `${truncatedName}...${extension}`;
  };

  // Hàm chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-light:bg-white admin-dark:bg-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="admin-light:text-gray-800 admin-dark:text-white text-2xl font-bold flex items-center gap-3">
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
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
            Thư viện Video
          </h2>
          <p className="admin-light:text-gray-500 admin-dark:text-gray-400 text-sm mt-1">
            {videos.length} video trong thư viện
          </p>
        </div>

        <button
          onClick={onLoadVideos}
          disabled={loading}
          className="admin-light:bg-green-500 admin-dark:bg-green-600 hover:admin-light:bg-green-600 hover:admin-dark:bg-green-700 disabled:admin-light:bg-gray-400 disabled:admin-dark:bg-gray-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Đang tải...
            </>
          ) : (
            <>
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm mới
            </>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="admin-light:text-gray-400 admin-dark:text-gray-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <p className="admin-light:text-gray-600 admin-dark:text-gray-300 font-medium">
            Đang tải danh sách video...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && videos.length === 0 && (
        <div className="text-center py-16 admin-light:bg-gray-50 admin-dark:bg-gray-700/50 border-2 border-dashed border-gray-300 admin-dark:border-gray-600 rounded-xl">
          <div className="admin-light:text-gray-400 admin-dark:text-gray-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="admin-light:text-gray-600 admin-dark:text-gray-300 text-lg font-medium mb-2">
            Chưa có video nào
          </h3>
          <p className="admin-light:text-gray-500 admin-dark:text-gray-400">
            Hãy upload video đầu tiên của bạn!
          </p>
        </div>
      )}

      {/* Video Grid */}
      {!loading && videos.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {currentVideos.map((video, index) => (
              <div
                key={index}
                className={`
                  relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group
                  ${
                    selectedVideo?.filename === video.filename
                      ? "admin-light:border-blue-500 admin-dark:border-blue-400 admin-light:bg-blue-50 admin-dark:bg-blue-900/20 admin-light:shadow-lg admin-dark:shadow-xl"
                      : "admin-light:border-gray-200 admin-dark:border-gray-600 admin-light:bg-white admin-dark:bg-gray-700 admin-light:hover:shadow-lg admin-dark:hover:shadow-xl admin-light:hover:border-blue-300 admin-dark:hover:border-blue-500"
                  }
                `}
                onClick={() => onSelectVideo(video)}
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteVideo(video.filename);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 admin-dark:bg-red-600 hover:bg-red-600 admin-dark:hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-10"
                >
                  <svg
                    className="w-3 h-3"
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

                {/* Video Icon and Name */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`
                    p-2 rounded-lg flex-shrink-0
                    ${
                      selectedVideo?.filename === video.filename
                        ? "admin-light:bg-blue-100 admin-dark:bg-blue-800"
                        : "admin-light:bg-gray-100 admin-dark:bg-gray-600"
                    }
                  `}
                  >
                    <svg
                      className="w-5 h-5 admin-light:text-gray-600 admin-dark:text-gray-300"
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
                    <div className="group relative">
                      <h3 className="admin-light:text-gray-800 admin-dark:text-white font-semibold text-sm leading-tight truncate">
                        {truncateFilename(video.filename)}
                      </h3>
                      {/* Tooltip hiển thị full tên file */}
                      {video.filename.length > 25 && (
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-20">
                          <div className="admin-light:bg-gray-800 admin-dark:bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                            {video.filename}
                          </div>
                          <div className="w-3 h-3 admin-light:bg-gray-800 admin-dark:bg-gray-900 transform rotate-45 absolute -bottom-1 left-3"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Video Details */}
                <div className="space-y-2 pl-11">
                  <div className="flex items-center gap-2 text-xs">
                    <svg
                      className="w-3.5 h-3.5 admin-light:text-purple-500 admin-dark:text-purple-400"
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
                    <span className="admin-light:text-gray-600 admin-dark:text-gray-300">
                      {formatFileSize(video.size)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <svg
                      className="w-3.5 h-3.5 admin-light:text-orange-500 admin-dark:text-orange-400"
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
                    <span className="admin-light:text-gray-600 admin-dark:text-gray-300">
                      {formatDate(video.created)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs admin-light:text-green-600 admin-dark:text-green-400 font-medium pt-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Click để phát
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={videos.length}
            itemsPerPage={videosPerPage}
            currentItemsCount={currentVideos.length}
          />
        </>
      )}
    </div>
  );
};

export default VideoList;

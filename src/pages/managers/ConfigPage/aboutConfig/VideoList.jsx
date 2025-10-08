import React from "react";
import { formatFileSize, formatDate } from "./utils";

const VideoList = ({
  videos,
  selectedVideo,
  onSelectVideo,
  onLoadVideos,
  loading,
  onDeleteVideo,
}) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "#555", margin: 0 }}>🎬 Thư viện Video</h2>
        <button
          onClick={onLoadVideos}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: loading ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
          }}
        >
          {loading ? "⏳ Đang tải..." : "🔄 Refresh"}
        </button>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#666",
          }}
        >
          <p>⏳ Đang tải danh sách video...</p>
        </div>
      ) : videos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#666",
            border: "2px dashed #ddd",
            borderRadius: "8px",
          }}
        >
          <p>📭 Chưa có video nào</p>
          <p>Hãy upload video đầu tiên của bạn!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "15px",
          }}
        >
          {videos.map((video, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor:
                  selectedVideo?.filename === video.filename
                    ? "#f0f8ff"
                    : "#fff",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                position: "relative", // For positioning the delete button
              }}
              onClick={() => onSelectVideo(video)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click event
                  onDeleteVideo(video.filename);
                }}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(255, 0, 0, 0.7)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                X
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "24px",
                    marginRight: "10px",
                  }}
                >
                  🎥
                </span>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#333",
                    wordBreak: "break-word",
                  }}
                >
                  {video.filename}
                </div>
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  lineHeight: "1.4",
                  paddingLeft: "34px",
                }}
              >
                <div>📊 {formatFileSize(video.size)}</div>
                <div>📅 {formatDate(video.created)}</div>
                <div
                  style={{
                    color: "#4CAF50",
                    fontWeight: "bold",
                    marginTop: "5px",
                  }}
                >
                  ▶️ Click để phát
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;
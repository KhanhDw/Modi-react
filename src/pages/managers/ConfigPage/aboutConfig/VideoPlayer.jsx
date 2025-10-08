import React, { useRef } from "react";
import { formatFileSize, formatDate } from "./utils";

const VideoPlayer = ({ selectedVideo, onDeleteVideo }) => {
  const videoRef = useRef(null);

  if (!selectedVideo) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#666",
          border: "2px dashed #ddd",
          borderRadius: "8px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Chọn 1 video để phát</p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
        position: "relative",
      }}
    >
      <button
        onClick={() => onDeleteVideo(selectedVideo.filename)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "rgba(255, 0, 0, 0.7)",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "5px 10px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        Xóa video
      </button>
      <h2 style={{ color: "#555", marginBottom: "15px" }}>
        📺 Đang phát: {selectedVideo.filename}
      </h2>
      <video
        ref={videoRef}
        controls
        autoPlay
        style={{
          width: "100%",
          maxWidth: "800px",
          height: "auto",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
        key={selectedVideo.url}
      >
        <source src={selectedVideo.url} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video tag.
      </video>
      <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
        <p>
          <strong>📝 Tên file:</strong> {selectedVideo.filename}
        </p>
        <p>
          <strong>📊 Kích thước:</strong> {formatFileSize(selectedVideo.size)}
        </p>
        <p>
          <strong>📅 Ngày upload:</strong> {formatDate(selectedVideo.created)}
        </p>
        <p style={{ color: "#4CAF50", fontWeight: "bold" }}>
          ✅ Hỗ trợ streaming chất lượng cao
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
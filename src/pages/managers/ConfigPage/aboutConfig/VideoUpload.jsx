import React, { useState, useRef } from "react";
import axios from "axios";

const VideoUpload = ({ onUploadSuccess, onUploadError }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = [
      "video/mp4",
      "video/avi",
      "video/x-msvideo",
      "video/x-matroska",
      "video/quicktime",
      "video/webm",
      "video/mpeg",
    ];
    if (!validTypes.includes(file.type)) {
      onUploadError("Chỉ chấp nhận file video (MP4, AVI, MKV, MOV, WEBM, MPEG)");
      return;
    }

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      onUploadError("File quá lớn! Kích thước tối đa là 100MB");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/video/upload-video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      if (response.data.success) {
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        onUploadError("Upload thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Upload thất bại:", error);
      onUploadError(
        "Upload thất bại: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        marginBottom: "20px",
      }}
    >
      <h2 style={{ color: "#555", marginBottom: "15px" }}>Upload Video</h2>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="file"
          accept="video/*"
          onChange={handleUpload}
          disabled={uploading}
          ref={fileInputRef}
          style={{
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "100%",
          }}
        />
        <div style={{ fontSize: "12px", color: "#666" }}>
          <p>• Hỗ trợ: MP4, AVI, MKV, MOV, WEBM, MPEG</p>
          <p>• Kích thước tối đa: 100MB</p>
        </div>
      </div>

      {uploading && (
        <div style={{ marginTop: "10px" }}>
          <p style={{ marginBottom: "5px", fontSize: "14px" }}>
            Đang upload... {uploadProgress}%
          </p>
          <div
            style={{
              width: "100%",
              height: "10px",
              backgroundColor: "#e0e0e0",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "100%",
                backgroundColor: "#4CAF50",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;

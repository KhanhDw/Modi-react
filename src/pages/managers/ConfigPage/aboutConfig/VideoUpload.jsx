import React, { useState, useRef } from "react";
import axios from "axios";
import useUpdateImageUrl from "./updateImage_url";

const VideoUpload = ({ onUploadSuccess, onUploadError }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const { item, loading, updating, error, handleUpdateImageUrl } =
    useUpdateImageUrl();

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
      onUploadError(
        "Chỉ chấp nhận file video (MP4, AVI, MKV, MOV, WEBM, MPEG)"
      );
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
          // handleUpdateImageUrl(response.data.data.filename).then((e) => {
          //   console.log(response.data.data.filename);
          // });
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
    <div className="admin-light:bg-gray-50 admin-dark:bg-gray-800 p-4 sm:p-5 border border-gray-300 admin-dark:border-gray-600 rounded-lg mb-5">
      <h2 className="admin-light:text-gray-700 admin-dark:text-gray-200 mb-4">
        Upload Video
      </h2>

      <div className="mb-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleUpload}
          disabled={uploading}
          ref={fileInputRef}
          className="mb-3 p-3 border border-gray-400 admin-dark:border-gray-500 rounded w-full admin-light:bg-white admin-dark:bg-gray-700 admin-light:text-gray-800 admin-dark:text-gray-200"
        />
        <div className="text-xs admin-light:text-gray-600 admin-dark:text-gray-400">
          <p>• Hỗ trợ: MP4, AVI, MKV, MOV, WEBM, MPEG</p>
          <p>• Kích thước tối đa: 100MB</p>
        </div>
      </div>

      {uploading && (
        <div className="mt-3">
          <p className="mb-2 text-sm admin-light:text-gray-700 admin-dark:text-gray-300">
            Đang upload... {uploadProgress}%
          </p>
          <div className="w-full h-2.5 bg-gray-300 admin-dark:bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 admin-dark:bg-green-400 transition-all duration-300 ease-in-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;

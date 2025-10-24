// hooks/useImageManager.js
import { useState, useCallback } from "react";
import { extractBase64ImagesFromHTML } from "@/utils/imageHandler";

export const useImageManager = () => {
  const [uploadedImages, setUploadedImages] = useState(new Set()); // Ảnh đã upload
  const [usedImages, setUsedImages] = useState(new Set()); // Ảnh đang dùng trong content
  const [uploadQueue, setUploadQueue] = useState([]); // Queue upload

  // Thêm ảnh vào queue upload
  const addToUploadQueue = useCallback((base64Images) => {
    setUploadQueue((prev) => [...prev, ...base64Images]);
  }, []);

  // Đánh dấu ảnh đã upload
  const markAsUploaded = useCallback((base64, url) => {
    setUploadedImages((prev) => new Set([...prev, base64]));
    setUploadQueue((prev) => prev.filter((img) => img !== base64));
  }, []);

  // Cập nhật ảnh đang được sử dụng
  const updateUsedImages = useCallback((htmlContent) => {
    const currentImages = extractBase64ImagesFromHTML(htmlContent);
    setUsedImages(new Set(currentImages));
  }, []);

  // Lấy danh sách ảnh không dùng nữa (cần xóa)
  const getUnusedImages = useCallback(() => {
    return Array.from(uploadedImages).filter((img) => !usedImages.has(img));
  }, [uploadedImages, usedImages]);

  return {
    uploadedImages,
    usedImages,
    uploadQueue,
    addToUploadQueue,
    markAsUploaded,
    updateUsedImages,
    getUnusedImages,
  };
};

// VideoManager.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoUpload from "./VideoUpload";
import VideoPlayer from "./VideoPlayer";
import VideoList from "./VideoList";
import ConfirmModal from "./components/ConfirmModal";
import NotificationModal from "./components/NotificationModal";

const VideoManager = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const API_BE_URL = import.meta.env.VITE_MAIN_BE_URL;
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [videoToDelete, setVideoToDelete] = useState(null);

  useEffect(() => {
    loadVideos();
  }, [refreshKey]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BE_URL}/api/video/videos`);
      if (response.data.success) {
        setVideos(response.data.data);
      } else {
        console.error("Lỗi khi load videos:", response.data.message);
        setModalContent({
          title: "Lỗi",
          message: "Không thể tải danh sách video.",
        });
        setIsNotificationModalOpen(true);
      }
    } catch (error) {
      console.error("Lỗi khi load videos:", error);
      setModalContent({
        title: "Lỗi",
        message: "Đã có lỗi xảy ra khi tải danh sách video.",
      });
      setIsNotificationModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
  };

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setModalContent({
      title: "Thành công",
      message: "Video đã được tải lên thành công!",
    });
    setIsNotificationModalOpen(true);
  };

  const handleUploadError = (errorMessage) => {
    setModalContent({
      title: "Lỗi Upload",
      message: errorMessage,
    });
    setIsNotificationModalOpen(true);
  };

  const handleDeleteRequest = (filename) => {
    setVideoToDelete(filename);
    setModalContent({
      title: "Xác nhận xóa",
      message: `Bạn có chắc chắn muốn xóa video "${filename}" không?`,
    });
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;

    try {
      const response = await axios.delete(
        `${API_BE_URL}/api/video/delete-video/${videoToDelete}`
      );
      if (response.data.success) {
        setModalContent({
          title: "Thành công",
          message: "Video đã được xóa thành công!",
        });
        if (selectedVideo?.filename === videoToDelete) {
          setSelectedVideo(null);
        }
        loadVideos();
      } else {
        setModalContent({
          title: "Lỗi",
          message: "Lỗi khi xóa video: " + response.data.message,
        });
      }
    } catch (error) {
      console.error("Lỗi khi xóa video:", error);
      setModalContent({
        title: "Lỗi",
        message:
          "Lỗi khi xóa video: " +
          (error.response?.data?.message || error.message),
      });
    } finally {
      setIsConfirmModalOpen(false);
      setIsNotificationModalOpen(true);
      setVideoToDelete(null);
    }
  };

  //============================================
  const [videoUsing, setVideoUsing] = useState({
    video_url: "",
  });
  // Fetch banner từ API
  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_MAIN_BE_URL
      }/api/section-items/type/about_intro?slug=about`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const item = data[0];

          setVideoUsing({
            video_url: item.image_url || "", // video
          });
        }
      })
      .catch((err) => console.error("Lỗi khi fetch banner:", err));
  }, []);

  //============================================

  return (
    <div className="w-full flex items-center justify-center flex-col ">
      <h1 className="uppercase font-bold text-xl mb-4 text-gray-900 admin-dark:text-white">
        Cấu hình video banner
      </h1>

      <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-10 px-4 sm:px-6 lg:px-10">
        <div className="self-start w-full">
          <VideoUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />

          <VideoList
            videos={videos}
            selectedVideo={selectedVideo}
            onSelectVideo={handleSelectVideo}
            onLoadVideos={loadVideos}
            loading={loading}
            onDeleteVideo={handleDeleteRequest}
          />
        </div>
        <div className="w-full self-start flex flex-col mt-8 lg:mt-0">
          <div className="px-2 py-1 mb-3 border-2 border-gray-400 rounded-md flex flex-col sm:flex-row w-full gap-2">
            Video đang sử dụng:
            <p className="font-semibold break-all">{videoUsing.video_url}</p>
          </div>

          <VideoPlayer
            selectedVideo={selectedVideo}
            onDeleteVideo={handleDeleteRequest}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title={modalContent.title}
        message={modalContent.message}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
      />
    </div>
  );
};

export default VideoManager;

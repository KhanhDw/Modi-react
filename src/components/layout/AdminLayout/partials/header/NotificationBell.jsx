import { useState, useEffect, useRef } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLenisLocal from "@/hook/useLenisLocal";
import { useAdminTheme } from "@/contexts/ThemeLocalContext";
import fetchWithAuth from "@/utils/fetchWithAuth";
import { io } from "socket.io-client";

import NotificationAllDropdown from "@/components/layout/AdminLayout/partials/header/NotificationAllDropdown";

const socket = io(`${import.meta.env.VITE_MAIN_BE_URL}`);

export function NotificationBell() {
  useLenisLocal(".lenis-local");
  const { isDark } = useAdminTheme();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [userId, setUserId] = useState(null)

  const [showAll, setShowAll] = useState(false);


  const fetchNotifications = async (id) => {
    try {
      const data = await fetchWithAuth(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/notifications/user/${id}`
      );
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getCurrentUser = async () => {
    try {
      const data = await fetchWithAuth(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/auth/me`
      );
      fetchNotifications(data.user.id);
      setUserId(data.user.id);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
      return null;
    }
  };

  // Fetch API lấy thông báo từ backend
  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    socket.on("newLienHe", () => {
      getCurrentUser();
    });
    return () => {
      socket.off("newLienHe");
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await fetchWithAuth(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/notifications/${id}/read`,
        { method: "PATCH" }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      getCurrentUser();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async (userId) => {
    try {
      await fetchWithAuth(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/notifications/user/${userId}/read-all`,
        { method: "PATCH" }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      getCurrentUser();
    } catch (err) {
      console.error(err);
    }
  };

  const removeNotification = async (id) => {
    try {
      await fetchWithAuth(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/notifications/${id}`,
        { method: "DELETE" }
      );
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      getCurrentUser();
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-600 admin-dark:text-green-400";
      case "warning":
        return "text-yellow-600 admin-dark:text-yellow-400";
      case "error":
        return "text-red-600 admin-dark:text-red-400";
      default:
        return "text-blue-600 admin-dark:text-blue-400";
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hàm xử lý chuỗi message
  const renderMessage = (message) => {
    const parts = message.split("Khách hàng ");

    // parts sẽ là ["", "xxx vừa liên hệ"]

    if (parts.length > 1) {
      const nameParts = parts[1].split(" vừa gửi liên hệ.");
      if (nameParts.length > 0) {
        const customerName = nameParts[0];
        return (
          <>
            khách hàng <span className="font-bold">{customerName}</span> vừa gửi liên hệ cho bạn
          </>
        );
      }
    }
    return message;
  };

  return (
    <div className="relative inline-block ">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        className="relative hover:bg-gray-100  admin-dark:hover:bg-gray-700 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" color={isDark ? "#ffffff" : "#1f2937"} />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white admin-dark:bg-red-600 admin-dark:text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown thông báo */}
      {isOpen && !showAll && (
        <div
          ref={dropdownRef}
          className={`
            z-50 border rounded-md shadow-lg
            ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
            transition-all
            /* mobile full screen */
            fixed inset-0 w-full h-full sm:inset-0 sm:w-full sm:h-full
            /* từ md trở lên giữ nguyên kiểu dropdown */
            md:absolute md:inset-auto md:mt-2 md:w-[580px] xl:w-[680px] md:-right-20 sm:-right-86 xs:-right-66
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-400 admin-dark:border-gray-700 bg-gray-200 admin-dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 admin-dark:text-white">
              Thông báo
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  theme={isDark ? "admin" : "light"}
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsRead(userId)}
                  className="text-xs admin-dark:hover:bg-gray-600 text-blue-600 hover:text-blue-800 admin-dark:text-blue-400 admin-dark:hover:text-blue-300 cursor-pointer"
                >
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
              {/* chỉ hiện nút X khi xs & sm */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-6 w-6 text-gray-500 hover:text-red-600 admin-dark:text-gray-400 admin-dark:hover:text-red-400 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Nội dung */}
          <ScrollArea className="h-[calc(100vh-64px)] md:h-96 lenis-local  bg-gray-200 border-gray-400 admin-dark:bg-gray-800 admin-dark:border-gray-700 rounded-b-md" data-lenis-prevent>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-900 admin-dark:text-gray-400  ">
                Không có thông báo nào
              </div>
            ) : (
              <div className="divide-y divide-gray-200 admin-dark:divide-gray-700 ">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 admin-dark:hover:bg-gray-700 transition-colors ${!notification.isRead
                        ? "bg-blue-50 admin-dark:bg-blue-900/20"
                        : "bg-white admin-dark:bg-gray-800"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium text-sm ${getTypeColor(notification.type)}`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 admin-dark:bg-blue-400 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 admin-dark:text-gray-300 mb-2">
                          {renderMessage(notification.message)}
                        </p>
                        <p className="text-xs text-gray-500 admin-dark:text-gray-400">
                          {new Date(notification.createdAt).toLocaleString("vi-VN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {new Date(notification.createdAt).toLocaleString("vi-VN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500 hover:bg-gray-200 hover:text-green-600 admin-dark:text-gray-400 admin-dark:hover:text-green-400 cursor-pointer"
                            onClick={() => markAsRead(notification.id)}
                            title="Đánh dấu đã đọc"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-500 hover:bg-gray-200 hover:text-red-600 admin-dark:text-gray-400 admin-dark:hover:text-red-400 cursor-pointer"
                          onClick={() => removeNotification(notification.id)}
                          title="Xóa thông báo"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="overflow-hidden w-full bg-gray-700 admin-dark:bg-gray-900 border-t border-gray-200 admin-dark:border-gray-700 rounded-b-md">
            <button
              className="w-full text-center text-xs text-white hover:bg-gray-600 admin-dark:hover:bg-gray-700 admin-dark:text-gray-400 admin-dark:hover:text-gray-100 duration-300 transition-all focus:outline-none cursor-pointer py-1"
              onClick={() => {
                setShowAll(true); // Bật panel lớn
                setIsOpen(false); // Tắt dropdown nhỏ
              }}
            >
              <span>Xem tất cả thông báo</span>
            </button>
          </div>
        </div>
      )}

      {/* Giao diện panel lớn khi xem tất cả */}
      {showAll && (
        <NotificationAllDropdown
          notifications={notifications}
          isDark={isDark}
          isOpen={showAll}
          onClose={() => setShowAll(false)}
          renderMessage={renderMessage}
          markAsRead={markAsRead}
          removeNotification={removeNotification}
        />
      )}
    </div>
  );

}

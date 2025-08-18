import { useState, useEffect, useRef } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLenisLocal from "@/hook/useLenisLocal";
import { useAdminTheme } from "@/contexts/ThemeLocalContext";

const mockNotifications = [
  {
    id: "1",
    title: "Đơn hàng mới",
    message: "Bạn có một đơn hàng mới từ khách hàng Nguyễn Văn A",
    time: "2 phút trước",
    isRead: false,
    type: "info",
  },
  {
    id: "2",
    title: "Thanh toán thành công",
    message: "Giao dịch #12345 đã được xử lý thành công",
    time: "15 phút trước",
    isRead: false,
    type: "success",
  },
  {
    id: "3",
    title: "Cảnh báo tồn kho",
    message: "Sản phẩm ABC sắp hết hàng (còn 5 sản phẩm)",
    time: "1 giờ trước",
    isRead: true,
    type: "warning",
  },
  {
    id: "4",
    title: "Lỗi hệ thống",
    message: "Đã xảy ra lỗi trong quá trình đồng bộ dữ liệu",
    time: "2 giờ trước",
    isRead: true,
    type: "error",
  },
  {
    id: "5",
    title: "Khách hàng mới",
    message: "Trần Thị B vừa đăng ký tài khoản mới",
    time: "3 giờ trước",
    isRead: true,
    type: "info",
  },
];

export function NotificationBell() {
  useLenisLocal(".lenis-local");
  const { isDark } = useAdminTheme();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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

  return (
    <div className="relative inline-block">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        className="relative hover:bg-gray-100 admin-dark:hover:bg-gray-700 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" color={isDark ? "#ffffff" : "#1f2937"} />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white admin-dark:bg-red-600 admin-dark:text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute right-0 mt-2 w-80 z-50 border rounded-md shadow-lg ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 admin-dark:text-white">
              Thông báo
            </h3>
            {unreadCount > 0 && (
              <Button
                theme={isDark ? "admin" : "light"}
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs admin-dark:hover:bg-gray-600 text-blue-600 hover:text-blue-800 admin-dark:text-blue-400 admin-dark:hover:text-blue-300 cursor-pointer"
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>

          <ScrollArea className="h-96 lenis-local" data-lenis-prevent>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 admin-dark:text-gray-400">
                Không có thông báo nào
              </div>
            ) : (
              <div className="divide-y divide-gray-200 admin-dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 admin-dark:hover:bg-gray-700 transition-colors ${!notification.isRead
                      ? "bg-blue-50 admin-dark:bg-blue-900/20"
                      : "bg-white admin-dark:bg-gray-800"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`font-medium text-sm ${getTypeColor(
                              notification.type
                            )}`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 admin-dark:bg-blue-400 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 admin-dark:text-gray-300 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 admin-dark:text-gray-400">
                          {notification.time}
                        </p>
                      </div>

                      <div className="flex gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500 hover:text-gray-700 admin-dark:text-gray-400 admin-dark:hover:text-gray-200 cursor-pointer"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-500 hover:text-red-600 admin-dark:text-gray-400 admin-dark:hover:text-red-400 cursor-pointer"
                          onClick={() => removeNotification(notification.id)}
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
        </div>
      )}
    </div>
  );
}
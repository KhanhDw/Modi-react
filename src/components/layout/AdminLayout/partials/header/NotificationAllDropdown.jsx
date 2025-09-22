import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Check, X as XIcon } from "lucide-react";
import useLenisLocal from '@/hook/useLenisLocal'

export default function NotificationAllDropdown({
  notifications,
  isDark,
  isOpen,
  onClose,
  renderMessage,
  markAsRead,
  removeNotification,
}) {

  useLenisLocal(".lenis-local");

  const groupByDate = (notifications) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const groups = {};

    notifications.forEach((n) => {
      const date = new Date(n.createdAt);
      let label = format(date, "dd/MM/yyyy", { locale: vi });

      if (date.toDateString() === today.toDateString()) {
        label = "Hôm nay";
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = "Hôm qua";
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(n);
    });

    return groups;
  };

  const groupedNotifications = groupByDate(notifications);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div>
        {/* Overlay mờ */}
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
          onClick={onClose}
        />

        {/* Panel bên phải */}
        <div
          className={`fixed right-0 top-0 bottom-0 z-9999 shadow-lg w-full sm:w-100 lg:w-[500px] transition-transform duration-300
        ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"} flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 admin-dark:border-gray-700">
            <h2 className="text-xl font-semibold">Tất cả thông báo</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 cursor-pointer"
              aria-label="Đóng"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Nội dung */}
          <ScrollArea className="flex-1 w-full overflow-auto lenis-local" data-lenis-prevent>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 admin-dark:text-gray-400">
                Không có thông báo nào
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([label, items]) => (
                <div key={label} className="px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600 admin-dark:text-gray-300 mb-2 uppercase tracking-wide">
                    {label}
                  </p>
                  <div className="space-y-2">
                    {items.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-md mb-3 relative flex items-center justify-between gap-3 ${notification.isRead
                          ? isDark
                            ? "bg-gray-800 hover:bg-gray-700"
                            : "bg-gray-100 hover:bg-gray-200"
                          : isDark
                            ? "bg-blue-900/20 hover:bg-blue-900/40"
                            : "bg-blue-50 hover:bg-blue-100"
                          } transition-colors duration-200`}
                      >
                        <div className="flex-1">
                          <h4
                            className={`font-medium text-sm ${notification.isRead
                              ? "text-gray-800 admin-dark:text-gray-300"
                              : "text-blue-600 admin-dark:text-blue-400"
                              }`}
                          >
                            {notification.title}
                          </h4>

                          <p className="text-sm text-gray-600 admin-dark:text-gray-300">
                            {renderMessage(notification.message)}
                          </p>
                          <p className="text-xs text-gray-500 admin-dark:text-gray-400 mt-1">
                            {new Date(notification.createdAt).toLocaleTimeString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        <div className="flex flex-row items-center gap-2 mt-1">
                          {!notification.isRead && (
                            <button
                              className="text-gray-500 hover:text-green-500 admin-dark:text-gray-400 admin-dark:hover:text-green-400 cursor-pointer"
                              onClick={() => markAsRead(notification.id)}
                              title="Đánh dấu đã đọc"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            className="text-gray-500 hover:text-red-500 admin-dark:text-gray-400 admin-dark:hover:text-red-400 cursor-pointer"
                            onClick={() => removeNotification(notification.id)}
                            title="Xóa thông báo"
                          >
                            <XIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div >
      </div >
    </>
  );
}

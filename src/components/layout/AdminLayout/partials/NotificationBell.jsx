
import { useState } from "react"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import useLenisLocal from '@/hook/useLenisLocal';

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
]

export function NotificationBell() {
  useLenisLocal(".lenis-local");
  const [notifications, setNotifications] = useState(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
          onMouseEnter={() => setIsOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end" onMouseLeave={() => setIsOpen(false)}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Thông báo</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        <ScrollArea className="h-96 lenis-local" data-lenis-prevent>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Không có thông báo nào</div>
          ) : (
            <div className="divide-y ">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    !notification.isRead ? "bg-blue-50 dark:bg-blue-950/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium text-sm ${getTypeColor(notification.type)}`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>

                    <div className="flex gap-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-red-600"
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

        <Separator />
        <div className="p-2">
          <Button variant="ghost" className="w-full text-sm">
            Xem tất cả thông báo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

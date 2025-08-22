

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Clock, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// interface SocialCalendarProps {
//   posts: any[]
//   socialAccounts: any[]
//   onEditPost: (post: any) => void
//   onDeletePost: (post: any) => void
//   onViewPost: (post: any) => void
// }

export default function SocialCalendar({ posts, socialAccounts, onEditPost, onDeletePost, onViewPost }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getPostsForDate = (date) => {
    if (!date) return []

    const dateStr = date.toISOString().split("T")[0]
    return posts.filter((post) => {
      const postDate = new Date(post.scheduledTime).toISOString().split("T")[0]
      return postDate === dateStr
    })
  }

//   const navigateMonth = (direction: "prev" | "next") => {
  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatMonth = (date) => {
    return date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })
  }

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPlatformIcon = (accountId) => {
    const account = socialAccounts.find((acc) => acc.id === accountId)
    return account?.icon || Calendar
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-primary"
      case "posted":
        return "bg-green-500"
      case "failed":
        return "bg-destructive"
      default:
        return "bg-secondary"
    }
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

 return (
  <Card className="bg-white text-gray-900 border border-gray-200 admin-dark:bg-gray-800 admin-dark:text-white admin-dark:border-gray-700">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-gray-900 admin-dark:text-white">
            <Calendar className="h-5 w-5" />
            Lịch đăng bài
          </CardTitle>
          <CardDescription className="text-gray-500 admin-dark:text-gray-400">
            Xem và quản lý lịch đăng bài trên các nền tảng
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-300  hover:bg-gray-600 border-gray-300 text-gray-700  admin-dark:border-gray-700 admin-dark:text-gray-200 admin-dark:hover:bg-gray-700"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[150px] text-center font-medium text-gray-900 admin-dark:text-white">
            {formatMonth(currentDate)}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-300 hover:bg-gray-600 border-gray-300 text-gray-700  admin-dark:border-gray-700 admin-dark:text-gray-200 admin-dark:hover:bg-gray-700"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500 admin-dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const postsForDate = getPostsForDate(date);
          const isToday =
            date && date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border rounded-lg ${
                date
                  ? "bg-white hover:bg-gray-50 admin-dark:bg-gray-800 admin-dark:hover:bg-gray-700"
                  : "bg-gray-100 admin-dark:bg-gray-700"
              } border-gray-200 admin-dark:border-gray-700 ${
                isToday ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {date && (
                <>
                  <div
                    className={`text-sm font-medium mb-2 ${
                      isToday
                        ? "text-blue-600 admin-dark:text-blue-400"
                        : "text-gray-900 admin-dark:text-white"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {postsForDate.slice(0, 3).map((post, postIndex) => {
                      const PlatformIcon = getPlatformIcon(post.socialAccountId);
                      return (
                        <DropdownMenu key={postIndex}>
                          <DropdownMenuTrigger asChild>
                            <div
                              className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 ${getStatusColor(
                                post.status
                              )} text-white`}
                            >
                              <div className="flex items-center gap-1">
                                <PlatformIcon className="h-3 w-3" />
                                <span className="truncate flex-1">
                                  {post.content.substring(0, 20)}...
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="h-2 w-2" />
                                <span>{formatTime(post.scheduledTime)}</span>
                              </div>
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="bg-white text-gray-900 border border-gray-200 admin-dark:bg-gray-800 admin-dark:text-white admin-dark:border-gray-700"
                          >
                            <DropdownMenuItem
                              onClick={() => onViewPost(post)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onEditPost(post)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDeletePost(post)}
                              className="text-red-600 admin-dark:text-red-400"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      );
                    })}
                    {postsForDate.length > 3 && (
                      <div className="text-xs text-gray-500 admin-dark:text-gray-400 text-center">
                        +{postsForDate.length - 3} bài khác
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 admin-dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-400"></div>
          <span className="text-xs text-gray-900 admin-dark:text-white">
            Chờ duyệt
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-xs text-gray-900 admin-dark:text-white">
            Đã lên lịch
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-xs text-gray-900 admin-dark:text-white">
            Đã đăng
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-xs text-gray-900 admin-dark:text-white">
            Thất bại
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

}




import  React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, ImageIcon, Video, FileText } from "lucide-react"


export function PostSchedulerForm({ onSubmit, onCancel, socialAccounts, initialData }) {
  const [formData, setFormData] = useState({
    socialAccountId: initialData?.socialAccountId || "",
    content: initialData?.content || "",
    mediaUrl: initialData?.mediaUrl || "",
    mediaType: initialData?.mediaType || "none",
    scheduledDate: initialData?.scheduledDate || "",
    scheduledTime: initialData?.scheduledTime || "",
    hashtags: initialData?.hashtags || "",
    status: initialData?.status || "pending",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const scheduledDateTime = `${formData.scheduledDate}T${formData.scheduledTime}`
    onSubmit({
      ...formData,
      scheduledTime: scheduledDateTime,
    })
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const selectedAccount = socialAccounts.find((acc) => acc.id.toString() === formData.socialAccountId)

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {initialData ? "Chỉnh sửa bài đăng" : "Lên lịch đăng bài"}
        </CardTitle>
        <CardDescription>
          {initialData ? "Cập nhật thông tin bài đăng đã lên lịch" : "Tạo và lên lịch bài đăng cho mạng xã hội"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="socialAccountId">Tài khoản đăng *</Label>
              <Select
                value={formData.socialAccountId}
                onValueChange={(value) => handleChange("socialAccountId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  {socialAccounts
                    .filter((acc) => acc.connected)
                    .map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        <div className="flex items-center gap-2">
                          <account.icon className="h-4 w-4" />
                          {account.platform} - {account.account}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                  <SelectItem value="posted">Đã đăng</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung bài đăng *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Viết nội dung bài đăng tại đây..."
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              {formData.content.length}/280 ký tự
              {selectedAccount?.platform === "twitter" && formData.content.length > 280 && (
                <span className="text-destructive"> (Vượt quá giới hạn Twitter)</span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mediaType">Loại media</Label>
              <Select value={formData.mediaType} onValueChange={(value) => handleChange("mediaType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại media" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Chỉ text
                    </div>
                  </SelectItem>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Hình ảnh
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.mediaType !== "none" && (
              <div className="space-y-2">
                <Label htmlFor="mediaUrl">URL Media</Label>
                <Input
                  id="mediaUrl"
                  value={formData.mediaUrl}
                  onChange={(e) => handleChange("mediaUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Ngày đăng *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => handleChange("scheduledDate", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Giờ đăng *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => handleChange("scheduledTime", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input
              id="hashtags"
              value={formData.hashtags}
              onChange={(e) => handleChange("hashtags", e.target.value)}
              placeholder="#marketing #business #socialmedia"
            />
            <p className="text-xs text-muted-foreground">Phân cách các hashtag bằng dấu cách</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? "Cập nhật bài đăng" : "Lên lịch đăng bài"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Hủy
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}




import  React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Youtube, MessageCircle, Instagram, Twitter, Linkedin, Link } from "lucide-react"



export function SocialAccountForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    platform: initialData?.platform || "",
    accountName: initialData?.accountName || "",
    accountUrl: initialData?.accountUrl || "",
    accessToken: initialData?.accessToken || "",
    description: initialData?.description || "",
    followers: initialData?.followers || "",
    isActive: initialData?.isActive || true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const platformIcons = {
    facebook: Facebook,
    youtube: Youtube,
    tiktok: MessageCircle,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
  }

  const PlatformIcon = platformIcons[formData.platform] || Link

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlatformIcon className="h-5 w-5" />
          {initialData ? "Chỉnh sửa tài khoản" : "Kết nối tài khoản mạng xã hội"}
        </CardTitle>
        <CardDescription>
          {initialData ? "Cập nhật thông tin tài khoản mạng xã hội" : "Thêm tài khoản mạng xã hội mới để quản lý"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Nền tảng *</Label>
              <Select value={formData.platform} onValueChange={(value) => handleChange("platform", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nền tảng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">
                    <div className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </div>
                  </SelectItem>
                  <SelectItem value="youtube">
                    <div className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </div>
                  </SelectItem>
                  <SelectItem value="tiktok">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      TikTok
                    </div>
                  </SelectItem>
                  <SelectItem value="instagram">
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </div>
                  </SelectItem>
                  <SelectItem value="twitter">
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter/X
                    </div>
                  </SelectItem>
                  <SelectItem value="linkedin">
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName">Tên tài khoản *</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => handleChange("accountName", e.target.value)}
                placeholder="@mybusiness"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountUrl">URL tài khoản *</Label>
            <div className="relative">
              <Link className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="accountUrl"
                value={formData.accountUrl}
                onChange={(e) => handleChange("accountUrl", e.target.value)}
                placeholder="https://facebook.com/mybusiness"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="followers">Số followers</Label>
              <Input
                id="followers"
                value={formData.followers}
                onChange={(e) => handleChange("followers", e.target.value)}
                placeholder="12500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessToken">Access Token (tùy chọn)</Label>
              <Input
                id="accessToken"
                type="password"
                value={formData.accessToken}
                onChange={(e) => handleChange("accessToken", e.target.value)}
                placeholder="Để trống nếu không có"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Mô tả về tài khoản này..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? "Cập nhật tài khoản" : "Kết nối tài khoản"}
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

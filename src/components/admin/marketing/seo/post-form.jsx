


import  React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Hash, User } from "lucide-react"


export function PostForm({ onSubmit, onCancel, initialData, keywords = [] }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    keywordId: initialData?.keywordId || "",
    publishDate: initialData?.publishDate || "",
    author: initialData?.author || "",
    metaDescription: initialData?.metaDescription || "",
    status: initialData?.status || "draft",
    tags: initialData?.tags || "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-generate slug from title
    if (field === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {initialData ? "Chỉnh sửa bài viết" : "Tạo bài viết SEO mới"}
        </CardTitle>
        <CardDescription>
          {initialData ? "Cập nhật nội dung bài viết SEO" : "Tạo bài viết mới được tối ưu cho SEO"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề bài viết *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="VD: 10 Chiến lược Marketing hiệu quả 2024"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="10-chien-luoc-marketing-hieu-qua-2024"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung bài viết *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Viết nội dung bài viết tại đây..."
              rows={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => handleChange("metaDescription", e.target.value)}
              placeholder="Mô tả ngắn gọn về bài viết (150-160 ký tự)..."
              rows={2}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">{formData.metaDescription.length}/160 ký tự</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keywordId">Từ khóa chính</Label>
              <Select value={formData.keywordId} onValueChange={(value) => handleChange("keywordId", value)}>
                <SelectTrigger>
                  <Hash className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Chọn từ khóa" />
                </SelectTrigger>
                <SelectContent>
                  {keywords.map((keyword) => (
                    <SelectItem key={keyword.id} value={keyword.id.toString()}>
                      {keyword.keyword}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishDate">Ngày xuất bản</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => handleChange("publishDate", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Tác giả</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  placeholder="Tên tác giả"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                  <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="marketing, seo, digital marketing"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? "Cập nhật bài viết" : "Tạo bài viết"}
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

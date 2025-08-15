import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Hash, Search, TrendingUp } from "lucide-react"

export default function KeywordForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    keyword: initialData?.keyword || "",
    searchVolume: initialData?.searchVolume || "",
    competition: initialData?.competition || "medium",
    targetUrl: initialData?.targetUrl || "",
    currentPosition: initialData?.currentPosition || "",
    targetPosition: initialData?.targetPosition || "",
    notes: initialData?.notes || "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white border border-gray-200 admin-dark:bg-gray-800 admin-dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground admin-dark:text-white">
          <Hash className="h-5 w-5 text-foreground admin-dark:text-gray-200" />
          {initialData ? "Chỉnh sửa từ khóa" : "Thêm từ khóa mới"}
        </CardTitle>
        <CardDescription className="text-muted-foreground admin-dark:text-gray-400">
          {initialData ? "Cập nhật thông tin từ khóa SEO" : "Thêm từ khóa mới để theo dõi và tối ưu"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyword" className="text-foreground admin-dark:text-gray-200">Từ khóa *</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
                <Input
                  id="keyword"
                  value={formData.keyword}
                  onChange={(e) => handleChange("keyword", e.target.value)}
                  placeholder="VD: marketing digital"
                  className="pl-10 bg-white border-gray-300 text-foreground placeholder:text-gray-400 focus:ring-primary focus:border-primary admin-dark:bg-gray-900 admin-dark:border-gray-600 admin-dark:text-gray-100 admin-dark:placeholder:text-gray-500 admin-dark:focus:ring-blue-500 admin-dark:focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchVolume" className="text-foreground admin-dark:text-gray-200">Lượng tìm kiếm/tháng</Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
                <Input
                  id="searchVolume"
                  type="number"
                  value={formData.searchVolume}
                  onChange={(e) => handleChange("searchVolume", e.target.value)}
                  placeholder="8900"
                  className="pl-10 bg-white border-gray-300 text-foreground placeholder:text-gray-400 focus:ring-primary focus:border-primary admin-dark:bg-gray-900 admin-dark:border-gray-600 admin-dark:text-gray-100 admin-dark:placeholder:text-gray-500 admin-dark:focus:ring-blue-500 admin-dark:focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="competition" className="text-foreground admin-dark:text-gray-200">Mức độ cạnh tranh</Label>
              <Select value={formData.competition} onValueChange={(value) => handleChange("competition", value)}>
                <SelectTrigger className="bg-white border-gray-300 text-foreground focus:ring-primary focus:border-primary admin-dark:bg-gray-900 admin-dark:border-gray-600 admin-dark:text-gray-100 admin-dark:focus:ring-blue-500 admin-dark:focus:border-blue-500">
                  <SelectValue placeholder="Chọn mức độ" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-foreground admin-dark:bg-gray-800 admin-dark:border-gray-600 admin-dark:text-gray-100">
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetUrl" className="text-foreground admin-dark:text-gray-200">URL mục tiêu</Label>
              <Input
                id="targetUrl"
                value={formData.targetUrl}
                onChange={(e) => handleChange("targetUrl", e.target.value)}
                placeholder="https://example.com/marketing-digital"
                className="bg-white border-gray-300 text-foreground placeholder:text-gray-400 focus:ring-primary focus:border-primary admin-dark:bg-gray-900 admin-dark:border-gray-600 admin-dark:text-gray-100 admin-dark:placeholder:text-gray-500 admin-dark:focus:ring-blue-500 admin-dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPosition" className="text-foreground admin-dark:text-gray-200">Vị trí hiện tại</Label>
              <Input
                id="currentPosition"
                type="number"
                value={formData.currentPosition}
                onChange={(e) => handleChange("currentPosition", e.target.value)}
                placeholder="5"
                min="1"
                max="100"
                className="bg-white border-gray-300 text-foreground placeholder:text-gray-400 focus:ring-primary focus:border-primary admin-dark:bg-gray-900 admin-dark:border-gray-600 admin-dark:text-gray-100 admin-dark:placeholder:text-gray-500 admin-dark:focus:ring-blue-500 admin-dark:focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetPosition" className="text-foreground admin-dark:text-gray-200">Vị trí mục tiêu</Label>
              <Input
                id="targetPosition"
                type="number"
                value={formData.targetPosition}
                onChange={(e) => handleChange("targetPosition", e.target.value)}
                placeholder="1"
                min="1"
                max="10"
                className="bg-white border-gray-300 text-foreground placeholder:text-gray-400 focus:ring-primary focus:border-primary admin-dark:bg-gray-900 admin-dark:border-gray-600 admin-dark:text-gray-100 admin-dark:placeholder:text-gray-500 admin-dark:focus:ring-blue-500 admin-dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-foreground admin-dark:text-gray-200">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Ghi chú về chiến lược SEO cho từ khóa này..."
              rows={3}
              className="bg-white border-gray-300 text-foreground placeholder:text-gray-400 focus:ring-primary focus:border-primary admin-dark:bg-gray-900 admin-dark:border-gray-600 admin-dark:text-gray-100 admin-dark:placeholder:text-gray-500 admin-dark:focus:ring-blue-500 admin-dark:focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700 admin-dark:text-white"
            >
              {initialData ? "Cập nhật từ khóa" : "Thêm từ khóa"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent border-gray-300 text-foreground hover:bg-gray-100 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:hover:bg-gray-700"
            >
              Hủy
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
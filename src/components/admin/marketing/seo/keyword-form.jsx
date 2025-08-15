


import  React from "react"

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          {initialData ? "Chỉnh sửa từ khóa" : "Thêm từ khóa mới"}
        </CardTitle>
        <CardDescription>
          {initialData ? "Cập nhật thông tin từ khóa SEO" : "Thêm từ khóa mới để theo dõi và tối ưu"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyword">Từ khóa *</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="keyword"
                  value={formData.keyword}
                  onChange={(e) => handleChange("keyword", e.target.value)}
                  placeholder="VD: marketing digital"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchVolume">Lượng tìm kiếm/tháng</Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchVolume"
                  type="number"
                  value={formData.searchVolume}
                  onChange={(e) => handleChange("searchVolume", e.target.value)}
                  placeholder="8900"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="competition">Mức độ cạnh tranh</Label>
              <Select value={formData.competition} onValueChange={(value) => handleChange("competition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetUrl">URL mục tiêu</Label>
              <Input
                id="targetUrl"
                value={formData.targetUrl}
                onChange={(e) => handleChange("targetUrl", e.target.value)}
                placeholder="https://example.com/marketing-digital"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPosition">Vị trí hiện tại</Label>
              <Input
                id="currentPosition"
                type="number"
                value={formData.currentPosition}
                onChange={(e) => handleChange("currentPosition", e.target.value)}
                placeholder="5"
                min="1"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetPosition">Vị trí mục tiêu</Label>
              <Input
                id="targetPosition"
                type="number"
                value={formData.targetPosition}
                onChange={(e) => handleChange("targetPosition", e.target.value)}
                placeholder="1"
                min="1"
                max="10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Ghi chú về chiến lược SEO cho từ khóa này..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? "Cập nhật từ khóa" : "Thêm từ khóa"}
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


import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { DollarSign, Users, MousePointer, TrendingUp, Edit, Pause, Play, Trash2 } from "lucide-react"


export default function CampaignDetailModal({
  campaign,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
}) {


  const performanceData = [
    { name: "Tuần 1", clicks: 2400, leads: 240, revenue: 1200000 },
    { name: "Tuần 2", clicks: 3200, leads: 320, revenue: 1800000 },
    { name: "Tuần 3", clicks: 2800, leads: 280, revenue: 1500000 },
    { name: "Tuần 4", clicks: 3800, leads: 380, revenue: 2200000 },
  ]

  const budgetUsed = (campaign?.spent / campaign?.budget) * 100

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{campaign?.name}</DialogTitle>
              <DialogDescription>{campaign?.description}</DialogDescription>
            </div>
            <Badge variant={campaign?.status === "running" ? "default" : "secondary"}>
              {campaign?.status === "running" ? "Đang chạy" : "Hoàn thành"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Chỉnh sửa
            </Button>
            <Button onClick={onToggleStatus} variant="outline" size="sm">
              {campaign?.status === "running" ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Tạm dừng
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Tiếp tục
                </>
              )}
            </Button>
            <Button onClick={onDelete} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ngân sách</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign?.budget?.toLocaleString()}₫</div>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Đã sử dụng</span>
                    <span>{campaign?.spent?.toLocaleString()}₫</span>
                  </div>
                  <Progress value={budgetUsed} className="h-2" />
                  <p className="text-xs text-muted-foreground">{budgetUsed.toFixed(1)}% đã sử dụng</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign?.clicks?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% từ tuần trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign?.leads}</div>
                <p className="text-xs text-muted-foreground">
                  Tỷ lệ chuyển đổi: {((campaign?.leads / campaign?.clicks) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{campaign?.revenue}</div>
                <p className="text-xs text-muted-foreground">
                  ROI:{" "}
                  {(
                    ((Number.parseInt(campaign?.revenue.replace(/[₫,]/g, "")) - campaign?.spent) / campaign?.spent) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất theo thời gian</CardTitle>
              <CardDescription>Theo dõi clicks, leads và doanh thu hàng tuần</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "revenue" ? `${value.toLocaleString()}₫` : value.toLocaleString(),
                        name === "clicks" ? "Clicks" : name === "leads" ? "Leads" : "Doanh thu",
                      ]}
                    />
                    <Line type="monotone" dataKey="clicks" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                    <Line type="monotone" dataKey="leads" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chiến dịch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày bắt đầu:</span>
                  <span>{campaign?.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày kết thúc:</span>
                  <span>{campaign?.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thời gian chạy:</span>
                  <span>45 ngày</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đối tượng:</span>
                  <span>Nam 25-35 tuổi</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mục tiêu & KPI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mục tiêu leads:</span>
                    <span>500</span>
                  </div>
                  <Progress value={(campaign?.leads / 500) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {campaign?.leads}/500 ({((campaign?.leads / 500) * 100).toFixed(1)}%)
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mục tiêu doanh thu:</span>
                    <span>₫15,000,000</span>
                  </div>
                  <Progress value={56} className="h-2" />
                  <p className="text-xs text-muted-foreground">{campaign?.revenue}/₫15,000,000 (56%)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

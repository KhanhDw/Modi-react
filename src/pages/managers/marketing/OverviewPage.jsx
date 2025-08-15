import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, DollarSign, Users, Mail, FileText, Facebook } from "lucide-react"

export default function OverviewPage() {
  // Sample data
  const campaigns = [
    {
      id: 1,
      name: "Summer Sale 2024",
      budget: 5000000,
      spent: 3200000,
      revenue: "₫8,500,000",
      status: "running",
    },
    {
      id: 2,
      name: "Brand Awareness Q4",
      budget: 8000000,
      spent: 4800000,
      revenue: "₫12,300,000",
      status: "running",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chiến dịch</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+2 từ tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₫45,231,000</div>
            <p className="text-xs text-muted-foreground">+20.1% từ tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+180 từ tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,924</div>
            <p className="text-xs text-muted-foreground">+201 từ tháng trước</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chiến dịch đang chạy</CardTitle>
            <CardDescription>
              {campaigns.filter((c) => c.status === "running").length} chiến dịch đang hoạt động
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaigns
              .filter((c) => c.status === "running")
              .map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">{campaign.budget.toLocaleString()}₫</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      +
                      {(
                        ((Number.parseInt(campaign.revenue.replace(/[₫,]/g, "")) - campaign.spent) / campaign.spent) *
                        100
                      ).toFixed(0)}
                      %
                    </Badge>
                    <Badge variant="outline">Đang chạy</Badge>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Cập nhật mới nhất</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { action: "Tạo chiến dịch mới", item: "Holiday Campaign", time: "2 giờ trước", icon: Target },
              { action: "Đăng bài SEO", item: "Top 10 Marketing Tips", time: "4 giờ trước", icon: FileText },
              { action: "Gửi email campaign", item: "Weekly Newsletter", time: "6 giờ trước", icon: Mail },
              { action: "Đăng Facebook", item: "Product Showcase", time: "8 giờ trước", icon: Facebook },
            ].map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

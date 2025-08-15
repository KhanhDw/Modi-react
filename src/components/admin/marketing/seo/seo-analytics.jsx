"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, Search, Eye, MousePointer, Hash } from "lucide-react"



export default function SEOAnalytics({ keywords, posts }) {
  const rankingData = [
    { month: "T1", avgPosition: 8.5, keywords: 12 },
    { month: "T2", avgPosition: 7.2, keywords: 15 },
    { month: "T3", avgPosition: 6.8, keywords: 18 },
    { month: "T4", avgPosition: 5.9, keywords: 22 },
    { month: "T5", avgPosition: 5.2, keywords: 25 },
    { month: "T6", avgPosition: 4.8, keywords: 28 },
  ]

  const trafficData = [
    { month: "T1", organic: 1200, clicks: 890 },
    { month: "T2", organic: 1450, clicks: 1120 },
    { month: "T3", organic: 1680, clicks: 1340 },
    { month: "T4", organic: 1920, clicks: 1580 },
    { month: "T5", organic: 2150, clicks: 1820 },
    { month: "T6", organic: 2380, clicks: 2100 },
  ]

  const topKeywords = keywords.sort((a, b) => a.position - b.position).slice(0, 5)

  const recentPosts = posts
    .filter((p) => p.status === "published")
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Từ khóa theo dõi</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keywords.length}</div>
            <p className="text-xs text-muted-foreground">+3 từ tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vị trí trung bình</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3 từ tuần trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt xem organic</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.2% từ tuần trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR trung bình</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -0.1% từ tuần trước
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng thứ hạng</CardTitle>
            <CardDescription>Vị trí trung bình theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rankingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 10]} reversed />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "avgPosition" ? `Vị trí ${value}` : `${value} từ khóa`,
                      name === "avgPosition" ? "Vị trí TB" : "Số từ khóa",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgPosition"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lưu lượng organic</CardTitle>
            <CardDescription>Lượt xem và clicks từ tìm kiếm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [value.toLocaleString(), name === "organic" ? "Lượt xem" : "Clicks"]}
                  />
                  <Bar dataKey="organic" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="clicks" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Keywords & Recent Posts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top từ khóa</CardTitle>
            <CardDescription>Từ khóa có thứ hạng tốt nhất</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topKeywords.map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{keyword.keyword}</p>
                  <p className="text-sm text-muted-foreground">
                    {keyword.searchVolume?.toLocaleString()} tìm kiếm/tháng
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      keyword.competition === "high"
                        ? "destructive"
                        : keyword.competition === "medium"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {keyword.competition === "high" ? "Cao" : keyword.competition === "medium" ? "TB" : "Thấp"}
                  </Badge>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">#{keyword.position}</p>
                    <p className="text-xs text-muted-foreground">Vị trí</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bài viết hiệu quả</CardTitle>
            <CardDescription>Bài viết có lượt xem cao nhất</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPosts.map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1 flex-1">
                  <p className="font-medium text-sm">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.publishDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{post.views?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">lượt xem</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* SEO Health Score */}
      <Card>
        <CardHeader>
          <CardTitle>Điểm SEO tổng thể</CardTitle>
          <CardDescription>Đánh giá hiệu suất SEO của website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Technical SEO</span>
                <span className="text-sm">85/100</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Content Quality</span>
                <span className="text-sm">92/100</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Backlinks</span>
                <span className="text-sm">78/100</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Điểm tổng thể</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-primary">85</span>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



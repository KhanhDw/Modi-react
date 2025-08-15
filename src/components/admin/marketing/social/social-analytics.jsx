"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share, Eye } from "lucide-react"

// interface SocialAnalyticsProps {
//   socialAccounts: any[]
//   posts: any[]
// }

export default function SocialAnalytics({ socialAccounts, posts }) {
  const engagementData = [
    { month: "T1", facebook: 1200, youtube: 800, tiktok: 2400, instagram: 1600 },
    { month: "T2", facebook: 1400, youtube: 950, tiktok: 2800, instagram: 1850 },
    { month: "T3", facebook: 1600, youtube: 1100, tiktok: 3200, instagram: 2100 },
    { month: "T4", facebook: 1800, youtube: 1250, tiktok: 3600, instagram: 2350 },
    { month: "T5", facebook: 2000, youtube: 1400, tiktok: 4000, instagram: 2600 },
    { month: "T6", facebook: 2200, youtube: 1550, tiktok: 4400, instagram: 2850 },
  ]

  const followerGrowthData = [
    { month: "T1", followers: 8500 },
    { month: "T2", followers: 9200 },
    { month: "T3", followers: 10100 },
    { month: "T4", followers: 11300 },
    { month: "T5", followers: 12800 },
    { month: "T6", followers: 14500 },
  ]

  const platformDistribution = [
    { name: "Facebook", value: 35, color: "#1877F2" },
    { name: "TikTok", value: 30, color: "#000000" },
    { name: "Instagram", value: 20, color: "#E4405F" },
    { name: "YouTube", value: 15, color: "#FF0000" },
  ]

  const topPosts = [
    {
      content: "Giới thiệu sản phẩm mới - iPhone 15 Pro Max",
      platform: "Facebook",
      engagement: 2400,
      likes: 1200,
      comments: 340,
      shares: 180,
      date: "15/12/2024",
    },
    {
      content: "Behind the scenes - Quy trình sản xuất",
      platform: "TikTok",
      engagement: 3200,
      likes: 2100,
      comments: 450,
      shares: 280,
      date: "12/12/2024",
    },
    {
      content: "Customer testimonial - Đánh giá từ khách hàng",
      platform: "Instagram",
      engagement: 1800,
      likes: 1400,
      comments: 220,
      shares: 120,
      date: "10/12/2024",
    },
  ]

  const connectedAccounts = socialAccounts.filter((acc) => acc.connected)
  const totalFollowers = connectedAccounts.reduce(
    (sum, acc) => sum + Number.parseInt(acc.followers.replace(/[K,]/g, "")) * 1000,
    0,
  )
  const totalPosts = posts.filter((p) => p.status === "posted").length
  const avgEngagement = 4.2

const mutedClass = "text-gray-500 admin-dark:text-gray-400"
  const gridStroke = "currentColor";
  const tooltipStyle = {
    backgroundColor: "rgba(31, 41, 55, 0.9)", // nền tối mờ
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white border border-gray-200 text-gray-900 admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900 admin-dark:text-white">
            Tổng followers
          </CardTitle>
          <Users className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(totalFollowers / 1000).toFixed(1)}K</div>
          <div className="flex items-center text-xs text-green-600 admin-dark:text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            +12.5% từ tháng trước
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 text-gray-900 admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900 admin-dark:text-white">
            Bài đăng tháng này
          </CardTitle>
          <MessageCircle className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPosts}</div>
          <div className="flex items-center text-xs text-green-600 admin-dark:text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            +8 từ tháng trước
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 text-gray-900 admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900 admin-dark:text-white">
            Tỷ lệ tương tác
          </CardTitle>
          <Heart className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgEngagement}%</div>
          <div className="flex items-center text-xs text-red-600 admin-dark:text-red-400">
            <TrendingDown className="h-3 w-3 mr-1" />
            -0.3% từ tháng trước
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 text-gray-900 admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900 admin-dark:text-white">
            Lượt xem
          </CardTitle>
          <Eye className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">125K</div>
          <div className="flex items-center text-xs text-green-600 admin-dark:text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            +18.2% từ tháng trước
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
         <Card className="bg-white border border-gray-200 text-gray-900 admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:text-white">
        <CardHeader>
          <CardTitle className="text-gray-900 admin-dark:text-white">Tăng trưởng followers</CardTitle>
          <CardDescription className="text-gray-500 admin-dark:text-gray-400">
            Số lượng followers theo thời gian
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={followerGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" 
                    stroke={gridStroke}
                    className="opacity-20"
                  />
                  <XAxis dataKey="month"  stroke={gridStroke} />
                  <YAxis stroke={gridStroke}/>
                  <Tooltip
                  contentStyle={tooltipStyle}
                   formatter={(value) => [value.toLocaleString(), "Followers"]} />
                  <Line
                    type="monotone"
                    dataKey="followers"
                     stroke="#fcba03" // xanh Tailwind fixed
                    strokeWidth={2}
                    dot={{ fill: "#fcba03" }}
                    activeDot={{ r: 6, fill: "#fcba03" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 text-gray-900 admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:text-white">
        <CardHeader>
          <CardTitle className="text-gray-900 admin-dark:text-white">Tương tác theo nền tảng</CardTitle>
          <CardDescription className="text-gray-500 admin-dark:text-gray-400">
            Lượt tương tác hàng tháng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="facebook" fill="#1877F2" />
                  <Bar dataKey="tiktok" fill="#000000" />
                  <Bar dataKey="instagram" fill="#E4405F" />
                  <Bar dataKey="youtube" fill="#FF0000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Distribution & Top Posts */}
       <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-white border border-gray-200 text-gray-900 admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:text-white">
        <CardHeader>
          <CardTitle className="text-gray-900 admin-dark:text-white">Phân bố nền tảng</CardTitle>
          <CardDescription className="text-gray-500 admin-dark:text-gray-400">Tỷ lệ tương tác theo nền tảng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {platformDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {platformDistribution.map((platform, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }}></div>
                  <span className="text-sm">{platform.name}</span>
                  <span className="text-sm text-muted-foreground">{platform.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 text-gray-900 admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:text-white">
        <CardHeader>
          <CardTitle className="text-gray-900 admin-dark:text-white">Bài đăng hiệu quả nhất</CardTitle>
          <CardDescription className="text-gray-500 admin-dark:text-gray-400">Top bài đăng có tương tác cao</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {topPosts.map((post, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-lg space-y-2 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="border-gray-300 text-gray-900 admin-dark:border-gray-600 admin-dark:text-white"
                >
                  {post.platform}
                </Badge>
                <span className="text-xs text-gray-500 admin-dark:text-gray-400">{post.date}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 admin-dark:text-white">{post.content}</p>
              <div className="grid grid-cols-4 gap-2 text-xs text-gray-900 admin-dark:text-white">
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share className="h-3 w-3" />
                  <span>{post.shares}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-blue-600 admin-dark:text-blue-400">{post.engagement}</span>
                </div>
              </div>
            </div>
          ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance by Platform */}
      <Card className="bg-white border border-gray-200 text-gray-900 admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:text-white">
      <CardHeader>
        <CardTitle className="text-gray-900 admin-dark:text-white">Hiệu suất theo nền tảng</CardTitle>
        <CardDescription className="text-gray-500 admin-dark:text-gray-400">
          So sánh hiệu suất các tài khoản mạng xã hội
        </CardDescription>
      </CardHeader>
      <CardContent>
          <div className="space-y-4">
            {connectedAccounts.map((account, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <account.icon className="h-5 w-5" />
                    <span className="font-medium">{account.platform}</span>
                    <span className="text-muted-foreground">{account.account}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{account.followers} followers</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Tương tác</span>
                      <span>4.2%</span>
                    </div>
                    <Progress value={42} indicatorClassName="bg-violet-500" className="h-2 " />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Tăng trưởng</span>
                      <span>+12%</span>
                    </div>
                    <Progress value={75} indicatorClassName="bg-violet-500"  className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Bài đăng</span>
                      <span>{account.posts}/tháng</span>
                    </div>
                    <Progress value={(account.posts / 30) * 100} indicatorClassName="bg-violet-500"  className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



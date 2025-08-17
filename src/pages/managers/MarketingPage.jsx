import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  BarChart3,
  Users,
  Mail,
  Search,
  Share2,
  Target,
  DollarSign,
  Eye,
  MousePointer,
  Calendar,
  FileText,
  Hash,
  Facebook,
  Youtube,
  MessageCircle,
  Send,
  Settings,
  Plus,
  Link,
} from "lucide-react";

import CampaignForm from "@/components/admin/marketing/campaigns/campaign-form";
import CampaignDetailModal from "@/components/admin/marketing/campaigns/campaign-detail-modal";
import CampaignsTable from "@/components/admin/marketing/campaigns/campaigns-table";
import KeywordForm from "@/components/admin/marketing/seo/keyword-form";
import SEOAnalytics from "@/components/admin/marketing/seo/seo-analytics";
import SocialCalendar from "@/components/admin/marketing/social/social-calendar";
import SocialAnalytics from "@/components/admin/marketing/social/social-analytics";

// Child Components for Each Route
const Overview = ({ campaigns }) => (
  <div className="space-y-6">
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng chiến dịch</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{campaigns.length}</div>
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
          <CardTitle className="text-sm font-medium">
            Email subscribers
          </CardTitle>
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
            {campaigns.filter((c) => c.status === "running").length} chiến dịch
            đang hoạt động
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaigns
            .filter((c) => c.status === "running")
            .slice(0, 3)
            .map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {campaign.budget.toLocaleString()}₫
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    +
                    {(
                      ((Number.parseInt(campaign.revenue.replace(/[₫,]/g, "")) -
                        campaign.spent) /
                        campaign.spent) *
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
            {
              action: "Tạo chiến dịch mới",
              item: "Holiday Campaign",
              time: "2 giờ trước",
              icon: Target,
            },
            {
              action: "Đăng bài SEO",
              item: "Top 10 Marketing Tips",
              time: "4 giờ trước",
              icon: FileText,
            },
            {
              action: "Gửi email campaign",
              item: "Weekly Newsletter",
              time: "6 giờ trước",
              icon: Mail,
            },
            {
              action: "Đăng Facebook",
              item: "Product Showcase",
              time: "8 giờ trước",
              icon: Facebook,
            },
          ].map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.item}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  </div>
);

const Campaigns = ({
  campaigns,
  onView,
  onEdit,
  onDelete,
  setShowCampaignForm,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Quản lý chiến dịch</h2>
        <p className="text-muted-foreground">
          Theo dõi và quản lý các chiến dịch marketing
        </p>
      </div>
      <Button
        className="bg-primary hover:bg-primary/90"
        onClick={() => setShowCampaignForm(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Tạo chiến dịch mới
      </Button>
    </div>
    <CampaignsTable
      campaigns={campaigns}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  </div>
);

const SEO = ({
  keywords,
  posts,
  setShowKeywordForm,
  setShowPostForm,
  handleEditKeyword,
  handleEditPost,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">SEO & Content</h2>
        <p className="text-muted-foreground">Quản lý từ khóa và nội dung SEO</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setShowKeywordForm(true)}>
          <Hash className="h-4 w-4 mr-2" />
          Thêm từ khóa
        </Button>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowPostForm(true)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Tạo bài viết
        </Button>
      </div>
    </div>
    <SEOAnalytics keywords={keywords} posts={posts} />
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Từ khóa đang theo dõi</CardTitle>
              <CardDescription>
                {" "}
                {keywords.length} từ khóa chính
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowKeywordForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Thêm
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {keywords.slice(0, 4).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">{item.keyword}</p>
                <p className="text-sm text-muted-foreground">
                  {item.searchVolume?.toLocaleString()} tìm kiếm/tháng
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    item.competition === "high"
                      ? "destructive"
                      : item.competition === "medium"
                      ? "default"
                      : "secondary"
                  }
                >
                  {item.competition === "high"
                    ? "Cao"
                    : item.competition === "medium"
                    ? "Trung bình"
                    : "Thấp"}
                </Badge>
                <div className="text-right">
                  <p className="text-sm font-medium">#{item.position}</p>
                  <p className="text-xs text-muted-foreground">Vị trí</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditKeyword(item)}
                >
                  Sửa
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bài viết gần đây</CardTitle>
              <CardDescription>Content đã xuất bản</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPostForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Tạo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {posts.slice(0, 4).map((post, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="space-y-1 flex-1">
                <p className="font-medium text-sm">{post.title}</p>
                <p className="text-xs text-muted-foreground">
                  {post.publishDate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {post.views?.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">lượt xem</p>
                </div>
                <Badge
                  variant={
                    post.status === "published" ? "default" : "secondary"
                  }
                >
                  {post.status === "published" ? "Đã xuất bản" : "Nháp"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditPost(post)}
                >
                  Sửa
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

const Social = ({
  socialAccounts,
  scheduledPosts,
  setShowSocialAccountForm,
  setShowPostSchedulerForm,
  handleEditSocialAccount,
  handleEditScheduledPost,
  handleDeleteScheduledPost,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Quản lý mạng xã hội</h2>
        <p className="text-muted-foreground">
          Kết nối và quản lý các tài khoản mạng xã hội
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowSocialAccountForm(true)}
        >
          <Link className="h-4 w-4 mr-2" />
          Kết nối tài khoản
        </Button>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowPostSchedulerForm(true)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Lên lịch đăng bài
        </Button>
      </div>
    </div>
    <SocialAnalytics socialAccounts={socialAccounts} posts={scheduledPosts} />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {socialAccounts.map((social, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <social.icon className="h-5 w-5" />
                <CardTitle>{social.platform}</CardTitle>
              </div>
              <Badge variant={social.connected ? "default" : "secondary"}>
                {social.connected ? "Đã kết nối" : "Chưa kết nối"}
              </Badge>
            </div>
            <CardDescription>{social.account}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Followers</p>
                <p className="font-bold text-lg">{social.followers}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bài đăng</p>
                <p className="font-bold text-lg">{social.posts}</p>
              </div>
            </div>
            {social.connected ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowPostSchedulerForm(true)}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Lên lịch
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditSocialAccount(social)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                className="w-full"
                size="sm"
                onClick={() => handleEditSocialAccount(social)}
              >
                Kết nối tài khoản
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
    <SocialCalendar
      posts={scheduledPosts}
      socialAccounts={socialAccounts}
      onEditPost={handleEditScheduledPost}
      onDeletePost={handleDeleteScheduledPost}
      onViewPost={(post) => console.log("View post:", post)}
    />
  </div>
);

const Email = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Email Marketing</h2>
        <p className="text-muted-foreground">
          Quản lý danh sách email và chiến dịch gửi mail
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Quản lý danh sách
        </Button>
        <Button className="bg-primary hover:bg-primary/90">
          <Send className="h-4 w-4 mr-2" />
          Tạo chiến dịch email
        </Button>
      </div>
    </div>
    <div className="grid gap-6 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tổng subscribers
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8,924</div>
          <p className="text-xs text-muted-foreground">+201 từ tháng trước</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tỷ lệ mở email</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24.5%</div>
          <p className="text-xs text-muted-foreground">+2.1% từ tháng trước</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tỷ lệ click</CardTitle>
          <MousePointer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3.8%</div>
          <p className="text-xs text-muted-foreground">+0.5% từ tháng trước</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Email đã gửi</CardTitle>
          <Send className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">45,231</div>
          <p className="text-xs text-muted-foreground">+12% từ tháng trước</p>
        </CardContent>
      </Card>
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Chiến dịch email gần đây</CardTitle>
          <CardDescription>Kết quả các chiến dịch đã gửi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              name: "Weekly Newsletter #45",
              sent: 8924,
              opened: 2186,
              clicked: 339,
              date: "15/12/2024",
            },
            {
              name: "Black Friday Sale",
              sent: 8924,
              opened: 3124,
              clicked: 487,
              date: "29/11/2024",
            },
            {
              name: "Product Update November",
              sent: 8924,
              opened: 1967,
              clicked: 298,
              date: "25/11/2024",
            },
            {
              name: "Customer Survey",
              sent: 8924,
              opened: 1543,
              clicked: 234,
              date: "20/11/2024",
            },
          ].map((campaign, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="space-y-1 flex-1">
                <p className="font-medium text-sm">{campaign.name}</p>
                <p className="text-xs text-muted-foreground">{campaign.date}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs text-center">
                <div>
                  <p className="font-medium">
                    {campaign.sent.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground">Gửi</p>
                </div>
                <div>
                  <p className="font-medium">
                    {campaign.opened.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground">Mở</p>
                </div>
                <div>
                  <p className="font-medium">
                    {campaign.clicked.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground">Click</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách email</CardTitle>
          <CardDescription>Quản lý subscribers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              name: "Main Newsletter",
              count: 8924,
              growth: "+201",
              active: true,
            },
            { name: "VIP Customers", count: 1245, growth: "+45", active: true },
            {
              name: "Product Updates",
              count: 3456,
              growth: "+89",
              active: true,
            },
            {
              name: "Promotional Offers",
              count: 5678,
              growth: "+123",
              active: false,
            },
          ].map((list, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">{list.name}</p>
                <p className="text-sm text-muted-foreground">
                  {list.count.toLocaleString()} subscribers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {list.growth}
                </Badge>
                <Badge variant={list.active ? "default" : "secondary"}>
                  {list.active ? "Hoạt động" : "Tạm dừng"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function MarketingPage() {
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [showCampaignDetail, setShowCampaignDetail] = useState(false);
  const [showKeywordForm, setShowKeywordForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showSocialAccountForm, setShowSocialAccountForm] = useState(false);
  const [showPostSchedulerForm, setShowPostSchedulerForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editingSocialAccount, setEditingSocialAccount] = useState(null);
  const [editingScheduledPost, setEditingScheduledPost] = useState(null);

  // Sample data (same as original)
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Summer Sale 2024",
      description: "Chiến dịch khuyến mãi mùa hè",
      budget: 5000000,
      spent: 3200000,
      clicks: 12500,
      leads: 340,
      revenue: "₫8,500,000",
      status: "running",
      startDate: "01/06/2024",
      endDate: "31/08/2024",
    },
    {
      id: 2,
      name: "Brand Awareness Q4",
      description: "Tăng nhận diện thương hiệu",
      budget: 8000000,
      spent: 4800000,
      clicks: 18200,
      leads: 520,
      revenue: "₫12,300,000",
      status: "running",
      startDate: "01/10/2024",
      endDate: "31/12/2024",
    },
    {
      id: 3,
      name: "Product Launch",
      description: "Ra mắt sản phẩm mới",
      budget: 3500000,
      spent: 3500000,
      clicks: 8900,
      leads: 280,
      revenue: "₫6,200,000",
      status: "completed",
      startDate: "15/09/2024",
      endDate: "15/10/2024",
    },
  ]);

  const [keywords, setKeywords] = useState([
    {
      id: 1,
      keyword: "marketing digital",
      searchVolume: 8900,
      competition: "high",
      position: 3,
      targetUrl: "/marketing-digital",
    },
    {
      id: 2,
      keyword: "quảng cáo facebook",
      searchVolume: 5400,
      competition: "medium",
      position: 7,
      targetUrl: "/quang-cao-facebook",
    },
    {
      id: 3,
      keyword: "seo website",
      searchVolume: 12000,
      competition: "high",
      position: 5,
      targetUrl: "/seo-website",
    },
    {
      id: 4,
      keyword: "email marketing",
      searchVolume: 3200,
      competition: "low",
      position: 2,
      targetUrl: "/email-marketing",
    },
  ]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "10 Chiến lược Marketing hiệu quả 2024",
      slug: "10-chien-luoc-marketing-hieu-qua-2024",
      publishDate: "15/12/2024",
      views: 2400,
      status: "published",
      keywordId: 1,
      author: "Admin",
    },
    {
      id: 2,
      title: "Cách tối ưu SEO cho website bán hàng",
      slug: "cach-toi-uu-seo-cho-website-ban-hang",
      publishDate: "12/12/2024",
      views: 1800,
      status: "published",
      keywordId: 3,
      author: "Admin",
    },
    {
      id: 3,
      title: "Email Marketing: Bí quyết tăng tỷ lệ mở",
      slug: "email-marketing-bi-quyet-tang-ty-le-mo",
      publishDate: "10/12/2024",
      views: 3200,
      status: "published",
      keywordId: 4,
      author: "Admin",
    },
    {
      id: 4,
      title: "Social Media Marketing 2024",
      slug: "social-media-marketing-2024",
      publishDate: "08/12/2024",
      views: 0,
      status: "draft",
      keywordId: 1,
      author: "Admin",
    },
  ]);

  const [socialAccounts, setSocialAccounts] = useState([
    {
      id: 1,
      platform: "Facebook",
      account: "@mybusiness",
      followers: "12.5K",
      icon: Facebook,
      connected: true,
      posts: 24,
      accountUrl: "https://facebook.com/mybusiness",
    },
    {
      id: 2,
      platform: "YouTube",
      account: "@mybusinesschannel",
      followers: "8.2K",
      icon: Youtube,
      connected: true,
      posts: 12,
      accountUrl: "https://youtube.com/@mybusinesschannel",
    },
    {
      id: 3,
      platform: "TikTok",
      account: "@mybusiness_tiktok",
      followers: "25.1K",
      icon: MessageCircle,
      connected: false,
      posts: 0,
      accountUrl: "https://tiktok.com/@mybusiness_tiktok",
    },
  ]);

  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      socialAccountId: 1,
      content:
        "Giới thiệu sản phẩm mới - iPhone 15 Pro Max với nhiều tính năng đột phá",
      scheduledTime: "2024-12-16T09:00",
      status: "scheduled",
      mediaType: "image",
      hashtags: "#iphone #apple #technology",
    },
    {
      id: 2,
      socialAccountId: 2,
      content: "Video hướng dẫn sử dụng tính năng mới",
      scheduledTime: "2024-12-16T14:00",
      status: "scheduled",
      mediaType: "video",
      hashtags: "#tutorial #howto #tech",
    },
    {
      id: 3,
      socialAccountId: 3,
      content: "Behind the scenes - Quy trình sản xuất",
      scheduledTime: "2024-12-17T10:00",
      status: "pending",
      mediaType: "video",
      hashtags: "#behindthescenes #production #manufacturing",
    },
    {
      id: 4,
      socialAccountId: 1,
      content: "Customer testimonial - Đánh giá từ khách hàng",
      scheduledTime: "2024-12-17T16:00",
      status: "scheduled",
      mediaType: "image",
      hashtags: "#testimonial #customer #review",
    },
  ]);

  // Handlers (same as original)
  const handleCreateCampaign = (data) => {
    const newCampaign = {
      id: campaigns.length + 1,
      ...data,
      budget: Number.parseInt(data.budget),
      spent: 0,
      clicks: 0,
      leads: 0,
      revenue: "₫0",
    };
    setCampaigns([...campaigns, newCampaign]);
    setShowCampaignForm(false);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setShowCampaignForm(true);
  };

  const handleUpdateCampaign = (data) => {
    setCampaigns(
      campaigns.map((c) =>
        c.id === editingCampaign.id
          ? { ...c, ...data, budget: Number.parseInt(data.budget) }
          : c
      )
    );
    setShowCampaignForm(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (campaign) => {
    setCampaigns(campaigns.filter((c) => c.id !== campaign.id));
    setShowCampaignDetail(false);
  };

  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignDetail(true);
  };

  const handleToggleCampaignStatus = () => {
    if (selectedCampaign) {
      const newStatus =
        selectedCampaign.status === "running" ? "paused" : "running";
      setCampaigns(
        campaigns.map((c) =>
          c.id === selectedCampaign.id ? { ...c, status: newStatus } : c
        )
      );
      setSelectedCampaign({ ...selectedCampaign, status: newStatus });
    }
  };

  const handleCreateKeyword = (data) => {
    const newKeyword = {
      id: keywords.length + 1,
      ...data,
      searchVolume: Number.parseInt(data.searchVolume) || 0,
      position: Number.parseInt(data.currentPosition) || 0,
    };
    setKeywords([...keywords, newKeyword]);
    setShowKeywordForm(false);
  };

  const handleEditKeyword = (keyword) => {
    setEditingKeyword(keyword);
    setShowKeywordForm(true);
  };

  const handleUpdateKeyword = (data) => {
    setKeywords(
      keywords.map((k) =>
        k.id === editingKeyword.id
          ? {
              ...k,
              ...data,
              searchVolume: Number.parseInt(data.searchVolume) || 0,
              position: Number.parseInt(data.currentPosition) || 0,
            }
          : k
      )
    );
    setShowKeywordForm(false);
    setEditingKeyword(null);
  };

  const handleCreatePost = (data) => {
    const newPost = {
      id: posts.length + 1,
      ...data,
      views: 0,
      keywordId: Number.parseInt(data.keywordId) || null,
    };
    setPosts([...posts, newPost]);
    setShowPostForm(false);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowPostForm(true);
  };

  const handleUpdatePost = (data) => {
    setPosts(
      posts.map((p) =>
        p.id === editingPost.id
          ? {
              ...p,
              ...data,
              keywordId: Number.parseInt(data.keywordId) || null,
            }
          : p
      )
    );
    setShowPostForm(false);
    setEditingPost(null);
  };

  const handleCreateSocialAccount = (data) => {
    const platformIcons = {
      facebook: Facebook,
      youtube: Youtube,
      tiktok: MessageCircle,
      instagram: MessageCircle,
      twitter: MessageCircle,
      linkedin: MessageCircle,
    };
    const newAccount = {
      id: socialAccounts.length + 1,
      ...data,
      icon: platformIcons[data.platform] || Link,
      connected: true,
      posts: 0,
    };
    setSocialAccounts([...socialAccounts, newAccount]);
    setShowSocialAccountForm(false);
  };

  const handleEditSocialAccount = (account) => {
    setEditingSocialAccount(account);
    setShowSocialAccountForm(true);
  };

  const handleUpdateSocialAccount = (data) => {
    setSocialAccounts(
      socialAccounts.map((acc) =>
        acc.id === editingSocialAccount.id ? { ...acc, ...data } : acc
      )
    );
    setShowSocialAccountForm(false);
    setEditingSocialAccount(null);
  };

  const handleCreateScheduledPost = (data) => {
    const newPost = {
      id: scheduledPosts.length + 1,
      ...data,
      socialAccountId: Number.parseInt(data.socialAccountId),
    };
    setScheduledPosts([...scheduledPosts, newPost]);
    setShowPostSchedulerForm(false);
  };

  const handleEditScheduledPost = (post) => {
    setEditingScheduledPost(post);
    setShowPostSchedulerForm(true);
  };

  const handleUpdateScheduledPost = (data) => {
    setScheduledPosts(
      scheduledPosts.map((p) =>
        p.id === editingScheduledPost.id
          ? {
              ...p,
              ...data,
              socialAccountId: Number.parseInt(data.socialAccountId),
            }
          : p
      )
    );
    setShowPostSchedulerForm(false);
    setEditingScheduledPost(null);
  };

  const handleDeleteScheduledPost = (post) => {
    setScheduledPosts(scheduledPosts.filter((p) => p.id !== post.id));
  };

  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <nav className="grid grid-cols-5 gap-2">
            <NavLink
              to="overview"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md text-sm font-medium ${
                  isActive ||
                  (location.pathname === "/marketing" &&
                    "overview" === "overview")
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`
              }
            >
              <BarChart3 className="h-4 w-4" />
              Tổng quan
            </NavLink>
            <NavLink
              to="campaigns"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`
              }
            >
              <Target className="h-4 w-4" />
              Chiến dịch
            </NavLink>
            <NavLink
              to="seo"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`
              }
            >
              <Search className="h-4 w-4" />
              SEO & Content
            </NavLink>
            <NavLink
              to="social"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`
              }
            >
              <Share2 className="h-4 w-4" />
              Mạng xã hội
            </NavLink>
            <NavLink
              to="email"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`
              }
            >
              <Mail className="h-4 w-4" />
              Email Marketing
            </NavLink>
          </nav>
        </div>

        <Outlet
          context={{
            campaigns,
            keywords,
            posts,
            socialAccounts,
            scheduledPosts,
            setShowCampaignForm,
            setShowKeywordForm,
            setShowPostForm,
            setShowSocialAccountForm,
            setShowPostSchedulerForm,
            handleViewCampaign,
            handleEditCampaign,
            handleDeleteCampaign,
            handleEditKeyword,
            handleEditPost,
            handleEditSocialAccount,
            handleEditScheduledPost,
            handleDeleteScheduledPost,
          }}
        />

        <Dialog open={showCampaignForm} onOpenChange={setShowCampaignForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <CampaignForm
              onSubmit={
                editingCampaign ? handleUpdateCampaign : handleCreateCampaign
              }
              onCancel={() => {
                setShowCampaignForm(false);
                setEditingCampaign(null);
              }}
              initialData={editingCampaign}
            />
          </DialogContent>
        </Dialog>

        <CampaignDetailModal
          campaign={selectedCampaign}
          isOpen={showCampaignDetail}
          onClose={() => {
            setShowCampaignDetail(false);
            setSelectedCampaign(null);
          }}
          onEdit={() => {
            setShowCampaignDetail(false);
            handleEditCampaign(selectedCampaign);
          }}
          onDelete={() => handleDeleteCampaign(selectedCampaign)}
          onToggleStatus={handleToggleCampaignStatus}
        />

        <Dialog open={showKeywordForm} onOpenChange={setShowKeywordForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <KeywordForm
              onSubmit={
                editingKeyword ? handleUpdateKeyword : handleCreateKeyword
              }
              onCancel={() => {
                setShowKeywordForm(false);
                setEditingKeyword(null);
              }}
              initialData={editingKeyword}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showPostForm} onOpenChange={setShowPostForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Add PostForm component here if needed */}
          </DialogContent>
        </Dialog>

        <Dialog
          open={showSocialAccountForm}
          onOpenChange={setShowSocialAccountForm}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Add SocialAccountForm component here if needed */}
          </DialogContent>
        </Dialog>

        <Dialog
          open={showPostSchedulerForm}
          onOpenChange={setShowPostSchedulerForm}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Add PostSchedulerForm component here if needed */}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

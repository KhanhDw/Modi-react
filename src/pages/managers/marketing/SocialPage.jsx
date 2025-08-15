import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link, Calendar, Settings, Facebook, Youtube, MessageCircle } from "lucide-react"
import SocialCalendar from "@/components/admin/marketing/social/social-calendar"
import SocialAnalytics from "@/components/admin/marketing/social/social-analytics"

export default function SocialPage() {
  const [showSocialAccountForm, setShowSocialAccountForm] = useState(false)
  const [showPostSchedulerForm, setShowPostSchedulerForm] = useState(false)
  const [editingSocialAccount, setEditingSocialAccount] = useState(null)
  const [editingScheduledPost, setEditingScheduledPost] = useState(null)

  // Sample data
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
  ])

  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      socialAccountId: 1,
      content: "Giới thiệu sản phẩm mới - iPhone 15 Pro Max với nhiều tính năng đột phá",
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
  ])

  const handleCreateSocialAccount = (data) => {
    const platformIcons = {
      facebook: Facebook,
      youtube: Youtube,
      tiktok: MessageCircle,
      instagram: MessageCircle,
      twitter: MessageCircle,
      linkedin: MessageCircle,
    }

    const newAccount = {
      id: socialAccounts.length + 1,
      ...data,
      icon: platformIcons[data.platform] || Link,
      connected: true,
      posts: 0,
    }
    setSocialAccounts([...socialAccounts, newAccount])
    setShowSocialAccountForm(false)
  }

  const handleEditSocialAccount = (account) => {
    setEditingSocialAccount(account)
    setShowSocialAccountForm(true)
  }

  const handleUpdateSocialAccount = (data) => {
    setSocialAccounts(socialAccounts.map((acc) => (acc.id === editingSocialAccount.id ? { ...acc, ...data } : acc)))
    setShowSocialAccountForm(false)
    setEditingSocialAccount(null)
  }

  const handleCreateScheduledPost = (data) => {
    const newPost = {
      id: scheduledPosts.length + 1,
      ...data,
      socialAccountId: Number.parseInt(data.socialAccountId),
    }
    setScheduledPosts([...scheduledPosts, newPost])
    setShowPostSchedulerForm(false)
  }

  const handleEditScheduledPost = (post) => {
    setEditingScheduledPost(post)
    setShowPostSchedulerForm(true)
  }

  const handleUpdateScheduledPost = (data) => {
    setScheduledPosts(
      scheduledPosts.map((p) =>
        p.id === editingScheduledPost.id
          ? { ...p, ...data, socialAccountId: Number.parseInt(data.socialAccountId) }
          : p,
      ),
    )
    setShowPostSchedulerForm(false)
    setEditingScheduledPost(null)
  }

  const handleDeleteScheduledPost = (post) => {
    setScheduledPosts(scheduledPosts.filter((p) => p.id !== post.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý mạng xã hội</h2>
          <p className="text-muted-foreground">Kết nối và quản lý các tài khoản mạng xã hội</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSocialAccountForm(true)}>
            <Link className="h-4 w-4 mr-2" />
            Kết nối tài khoản
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowPostSchedulerForm(true)}>
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
                  <Button variant="outline" size="sm" onClick={() => handleEditSocialAccount(social)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button className="w-full" size="sm" onClick={() => handleEditSocialAccount(social)}>
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

      {/* Social Media Modals would go here */}
      {/* These would use the existing social components */}
    </div>
  )
}

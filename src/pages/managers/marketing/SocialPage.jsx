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
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 admin-dark:text-white">
          Quản lý mạng xã hội
        </h2>
        <p className="text-gray-500 admin-dark:text-gray-400">
          Kết nối và quản lý các tài khoản mạng xã hội
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          theme="admin"
          variant="outline"
          className="bg-gray-300 border-gray-300 text-gray-900 font-semibold hover:bg-gray-100 admin-dark:border-gray-700 admin-dark:text-gray-200 admin-dark:hover:bg-gray-800"
          onClick={() => setShowSocialAccountForm(true)}
        >
          <Link className="h-4 w-4 mr-2" />
          Kết nối tài khoản
        </Button>
        <Button
          theme="admin"
          className="bg-blue-600 hover:bg-blue-700 text-white admin-dark:bg-blue-500 admin-dark:hover:bg-blue-600"
          onClick={() => setShowPostSchedulerForm(true)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Lên lịch đăng bài
        </Button>
      </div>
    </div>

    {/* Analytics */}
    <SocialAnalytics socialAccounts={socialAccounts} posts={scheduledPosts} />

    {/* Card list */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {socialAccounts.map((social, index) => (
        <Card
        theme="admin"
          key={index}
          className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 shadow-sm"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <social.icon className="h-5 w-5" />
                <CardTitle >{social.platform}</CardTitle>
              </div>
              <Badge
                variant={social.connected ? "default" : "secondary"}
                className={
                  social.connected
                    ? "bg-green-500 text-white admin-dark:bg-green-600"
                    : "bg-gray-200 text-gray-800 admin-dark:bg-gray-700 admin-dark:text-gray-300"
                }
              >
                {social.connected ? "Đã kết nối" : "Chưa kết nối"}
              </Badge>
            </div>
            <CardDescription className="text-gray-500 admin-dark:text-gray-400">
              {social.account}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 admin-dark:text-gray-400">Followers</p>
                <p className="font-bold text-lg">{social.followers}</p>
              </div>
              <div>
                <p className="text-gray-500 admin-dark:text-gray-400">Bài đăng</p>
                <p className="font-bold text-lg">{social.posts}</p>
              </div>
            </div>

            {social.connected ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100 admin-dark:border-gray-700 admin-dark:text-gray-200 admin-dark:hover:bg-gray-800"
                  onClick={() => setShowPostSchedulerForm(true)}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Lên lịch
                </Button>
                <Button
                theme={"admin"}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 bg-gray-300 text-gray-700 hover:bg-gray-700 admin-dark:border-gray-700 admin-dark:text-gray-200 admin-dark:hover:bg-gray-800"
                  onClick={() => handleEditSocialAccount(social)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white admin-dark:bg-blue-500 admin-dark:hover:bg-blue-600"
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

    {/* Calendar */}
    <SocialCalendar
      posts={scheduledPosts}
      socialAccounts={socialAccounts}
      onEditPost={handleEditScheduledPost}
      onDeletePost={handleDeleteScheduledPost}
      onViewPost={(post) => console.log("View post:", post)}
    />
  </div>
);

}

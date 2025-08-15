import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Hash, FileText, Plus } from "lucide-react"
import KeywordForm from "@/components/admin/marketing/seo/keyword-form"
import SEOAnalytics from "@/components/admin/marketing/seo/seo-analytics"

export default function SEOPage() {
  const [showKeywordForm, setShowKeywordForm] = useState(false)
  const [showPostForm, setShowPostForm] = useState(false)
  const [editingKeyword, setEditingKeyword] = useState(null)
  const [editingPost, setEditingPost] = useState(null)

  // Sample data
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
    { id: 3, keyword: "seo website", searchVolume: 12000, competition: "high", position: 5, targetUrl: "/seo-website" },
    {
      id: 4,
      keyword: "email marketing",
      searchVolume: 3200,
      competition: "low",
      position: 2,
      targetUrl: "/email-marketing",
    },
  ])

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
  ])

  const handleCreateKeyword = (data) => {
    const newKeyword = {
      id: keywords.length + 1,
      ...data,
      searchVolume: Number.parseInt(data.searchVolume) || 0,
      position: Number.parseInt(data.currentPosition) || 0,
    }
    setKeywords([...keywords, newKeyword])
    setShowKeywordForm(false)
  }

  const handleEditKeyword = (keyword) => {
    setEditingKeyword(keyword)
    setShowKeywordForm(true)
  }

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
          : k,
      ),
    )
    setShowKeywordForm(false)
    setEditingKeyword(null)
  }

  return (
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
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowPostForm(true)}>
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
                <CardDescription>{keywords.length} từ khóa chính</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowKeywordForm(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Thêm
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {keywords.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{item.keyword}</p>
                  <p className="text-sm text-muted-foreground">{item.searchVolume?.toLocaleString()} tìm kiếm/tháng</p>
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
                    {item.competition === "high" ? "Cao" : item.competition === "medium" ? "Trung bình" : "Thấp"}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">#{item.position}</p>
                    <p className="text-xs text-muted-foreground">Vị trí</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEditKeyword(item)}>
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
              <Button variant="outline" size="sm" onClick={() => setShowPostForm(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Tạo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {posts.slice(0, 4).map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1 flex-1">
                  <p className="font-medium text-sm">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.publishDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">{post.views?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">lượt xem</p>
                  </div>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status === "published" ? "Đã xuất bản" : "Nháp"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* SEO Modals */}
      <Dialog open={showKeywordForm} onOpenChange={setShowKeywordForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <KeywordForm
            onSubmit={editingKeyword ? handleUpdateKeyword : handleCreateKeyword}
            onCancel={() => {
              setShowKeywordForm(false)
              setEditingKeyword(null)
            }}
            initialData={editingKeyword}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Hash, FileText, Plus } from "lucide-react"
import KeywordForm from "@/components/admin/marketing/seo/keyword-form"
import SEOAnalytics from "@/components/admin/marketing/seo/seo-analytics"
import {useLenisToggle} from "@/contexts/LenisContext"

export default function SEOPage() {
  const lenisContext = useLenisToggle(); 
  const { enabled, setEnabled } = lenisContext || {};// để nữa cấu lại , giờ chưa rành
 

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
        p.id === editingPost.id ? { ...p, ...data, keywordId: Number.parseInt(data.keywordId) || null } : p
      )
    );
    setShowPostForm(false);
    setEditingPost(null);
  };

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
    <div className="space-y-6 text-black admin-dark:bg-gray-900 admin-dark:text-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black admin-dark:text-white">SEO & Content</h2>
          <p className="text-muted-black admin-dark:text-gray-400">Quản lý từ khóa và nội dung SEO</p>
        </div>
        <div className="flex gap-2">
          <Button
            theme="admin"
            variant="outline"
            onClick={() => setShowKeywordForm(true)}
            className="  text-black hover:text-gray-200 bg-gray-200  hover:bg-gray-600 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:hover:bg-gray-700"
          >
            <Hash className="h-4 w-4 mr-2" />
            Thêm từ khóa
          </Button>
          <Button
            theme={"admin"}
            className="bg-primary hover:text-gray-200  hover:bg-gray-600  text-primary-black admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700 admin-dark:text-white"
            onClick={() => setShowPostForm(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Tạo bài viết
          </Button>
        </div>
      </div>

      <SEOAnalytics keywords={keywords} posts={posts} />

      <div className="grid gap-6 md:grid-cols-2 m-0">
        <Card className="bg-white border border-gray-200 admin-dark:bg-gray-800 admin-dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-black admin-dark:text-white hover:bg-gray-50 admin-dark:hover:bg-gray-700">Từ khóa đang theo dõi</CardTitle>
                <CardDescription className="text-gray-500 admin-dark:text-gray-400">{keywords.length} từ khóa chính</CardDescription>
              </div>
              <Button
                theme="admin"
                variant="outline"
                size="sm"
                onClick={() => setShowKeywordForm(true)}
                className="border border-gray-300   text-black bg-slate-200 hover:bg-gray-800 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:hover:bg-gray-700"
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
                className="flex items-center justify-between p-3 border rounded-lg border-gray-200 bg-gray-50 admin-dark:border-gray-700 admin-dark:bg-gray-800"
              >
                <div className="space-y-1">
                  <p className="font-medium text-black admin-dark:text-gray-100">{item.keyword}</p>
                  <p className="text-sm text-gray-50 admin-dark:text-gray-400">{item.searchVolume?.toLocaleString()} tìm kiếm/tháng</p>
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
                    className={
                      item.competition === "high"
                        ? "bg-red-500 text-white admin-dark:bg-red-600"
                        : item.competition === "medium"
                          ? "bg-blue-500 text-white admin-dark:bg-blue-600"
                          : "bg-gray-200 text-gray-800 admin-dark:bg-gray-600 admin-dark:text-gray-200"
                    }
                  >
                    {item.competition === "high" ? "Cao" : item.competition === "medium" ? "Trung bình" : "Thấp"}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium text-black admin-dark:text-gray-100">#{item.position}</p>
                    <p className="text-xs text-gray-700 bg-slate-200 admin-dark:text-gray-400">Vị trí</p>
                  </div>
                  <Button
                    theme={"admin"}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditKeyword(item)}
                    className="text-black admin-dark:bg-gray-700 bg-gray-300 hover:text-gray-100 hover:bg-gray-700 admin-dark:text-gray-200 admin-dark:hover:bg-gray-700"
                  >
                    Sửa
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 admin-dark:bg-gray-800 admin-dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-black admin-dark:text-white">Bài viết gần đây</CardTitle>
                <CardDescription className="text-muted-black admin-dark:text-gray-400">Content đã xuất bản</CardDescription>
              </div>
              <Button
                theme={"admin"}
                variant="outline"
                size="sm"
                onClick={() => setShowPostForm(true)}
                className="border bg-gray-300 border-gray-300 text-black hover:bg-gray-800 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:hover:bg-gray-700"
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
                className="flex items-center justify-between p-3 border rounded-lg border-gray-200 bg-gray-50 admin-dark:border-gray-700 admin-dark:bg-gray-800"
              >
                <div className="space-y-1 flex-1">
                  <p className="font-medium text-sm text-black admin-dark:text-gray-100">{post.title}</p>
                  <p className="text-xs text-gray-800 admin-dark:text-muted-black admin-dark:text-gray-400">{post.publishDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-black admin-dark:text-gray-100">{post.views?.toLocaleString()}</p>
                    <p className="text-xs text-muted-black admin-dark:text-gray-400">lượt xem</p>
                  </div>
                  <Badge
                    variant={post.status === "published" ? "default" : "secondary"}
                    className={
                      post.status === "published"
                        ? "bg-blue-500 text-white admin-dark:bg-blue-600"
                        : "bg-gray-200 text-gray-800 admin-dark:bg-gray-600 admin-dark:text-gray-200"
                    }
                  >
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 admin-dark:bg-gray-800 admin-dark:border-gray-700">
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
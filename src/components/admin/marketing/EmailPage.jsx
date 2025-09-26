import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Users, Send, Eye, MousePointer, Plus, Calendar, FileText } from "lucide-react"

export default function EmailPage() {
  const [showCampaignForm, setShowCampaignForm] = useState(false)
  const [showListForm, setShowListForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [editingList, setEditingList] = useState(null)

  // Sample data
  const [emailCampaigns, setEmailCampaigns] = useState([
    {
      id: 1,
      name: "Weekly Newsletter #45",
      subject: "Tin tức marketing tuần này",
      sent: 8924,
      opened: 2186,
      clicked: 339,
      date: "15/12/2024",
      status: "sent",
      listId: 1,
    },
    {
      id: 2,
      name: "Black Friday Sale",
      subject: "Giảm giá lên đến 70% - Black Friday",
      sent: 8924,
      opened: 3124,
      clicked: 487,
      date: "29/11/2024",
      status: "sent",
      listId: 1,
    },
    {
      id: 3,
      name: "Product Update November",
      subject: "Cập nhật sản phẩm tháng 11",
      sent: 8924,
      opened: 1967,
      clicked: 298,
      date: "25/11/2024",
      status: "sent",
      listId: 2,
    },
    {
      id: 4,
      name: "Holiday Campaign 2024",
      subject: "Chúc mừng năm mới 2024",
      sent: 0,
      opened: 0,
      clicked: 0,
      date: "31/12/2024",
      status: "scheduled",
      listId: 1,
    },
  ])

  const [emailLists, setEmailLists] = useState([
    { id: 1, name: "Main Newsletter", count: 8924, growth: "+201", active: true, description: "Danh sách chính" },
    { id: 2, name: "VIP Customers", count: 1245, growth: "+45", active: true, description: "Khách hàng VIP" },
    { id: 3, name: "Product Updates", count: 3456, growth: "+89", active: true, description: "Cập nhật sản phẩm" },
    { id: 4, name: "Promotional Offers", count: 5678, growth: "+123", active: false, description: "Khuyến mãi" },
  ])

  const handleCreateCampaign = (data) => {
    const newCampaign = {
      id: emailCampaigns.length + 1,
      ...data,
      sent: 0,
      opened: 0,
      clicked: 0,
      status: data.scheduleDate ? "scheduled" : "draft",
    }
    setEmailCampaigns([...emailCampaigns, newCampaign])
    setShowCampaignForm(false)
  }

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign)
    setShowCampaignForm(true)
  }

  const handleUpdateCampaign = (data) => {
    setEmailCampaigns(emailCampaigns.map((c) => (c.id === editingCampaign.id ? { ...c, ...data } : c)))
    setShowCampaignForm(false)
    setEditingCampaign(null)
  }

  const handleCreateList = (data) => {
    const newList = {
      id: emailLists.length + 1,
      ...data,
      count: 0,
      growth: "+0",
      active: true,
    }
    setEmailLists([...emailLists, newList])
    setShowListForm(false)
  }

  const handleEditList = (list) => {
    setEditingList(list)
    setShowListForm(true)
  }

  const handleUpdateList = (data) => {
    setEmailLists(emailLists.map((l) => (l.id === editingList.id ? { ...l, ...data } : l)))
    setShowListForm(false)
    setEditingList(null)
  }

  const totalSubscribers = emailLists.reduce((sum, list) => sum + list.count, 0)
  const averageOpenRate =
    emailCampaigns.length > 0
      ? (
        (emailCampaigns.reduce((sum, campaign) => sum + campaign.opened / Math.max(campaign.sent, 1), 0) /
          emailCampaigns.filter((c) => c.sent > 0).length) *
        100
      ).toFixed(1)
      : "0"
  const averageClickRate =
    emailCampaigns.length > 0
      ? (
        (emailCampaigns.reduce((sum, campaign) => sum + campaign.clicked / Math.max(campaign.sent, 1), 0) /
          emailCampaigns.filter((c) => c.sent > 0).length) *
        100
      ).toFixed(1)
      : "0"
  const totalSent = emailCampaigns.reduce((sum, campaign) => sum + campaign.sent, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Marketing</h2>
          <p className="text-muted-foreground">Quản lý danh sách email và chiến dịch gửi mail</p>
        </div>
        <div className="flex gap-2">
          <Button theme={'admin'} variant="outline" onClick={() => setShowListForm(true)}>
            <Users className="h-4 w-4 mr-2" />
            Quản lý danh sách
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowCampaignForm(true)}>
            <Send className="h-4 w-4 mr-2" />
            Tạo chiến dịch email
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card theme={'admin'} className={'border border-gray-200 admin-dark:bg-gray-800'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black admin-dark:text-foreground">Tổng subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+201 từ tháng trước</p>
          </CardContent>
        </Card>

        <Card theme={'admin'} className={'border border-gray-200 admin-dark:bg-gray-800'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black admin-dark:text-foreground">Tỷ lệ mở email</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageOpenRate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% từ tháng trước</p>
          </CardContent>
        </Card>

        <Card theme={'admin'} className={'border border-gray-200 admin-dark:bg-gray-800'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black admin-dark:text-foreground">Tỷ lệ click</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageClickRate}%</div>
            <p className="text-xs text-muted-foreground">+0.5% từ tháng trước</p>
          </CardContent>
        </Card>

        <Card theme={'admin'} className={'border border-gray-200 admin-dark:bg-gray-800'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black admin-dark:text-foreground">Email đã gửi</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% từ tháng trước</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card theme={'admin'} className={'border border-gray-200 admin-dark:bg-gray-800'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`text-black admin-dark:text-foreground`}>Chiến dịch email gần đây</CardTitle>
                <CardDescription>Kết quả các chiến dịch đã gửi</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowCampaignForm(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Tạo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {emailCampaigns.slice(0, 4).map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1 flex-1">
                  <p className="font-medium text-sm">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground">{campaign.date}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs text-center mr-4">
                  <div>
                    <p className="font-medium">{campaign.sent.toLocaleString()}</p>
                    <p className="text-muted-foreground">Gửi</p>
                  </div>
                  <div>
                    <p className="font-medium">{campaign.opened.toLocaleString()}</p>
                    <p className="text-muted-foreground">Mở</p>
                  </div>
                  <div>
                    <p className="font-medium">{campaign.clicked.toLocaleString()}</p>
                    <p className="text-muted-foreground">Click</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      campaign.status === "sent" ? "default" : campaign.status === "scheduled" ? "secondary" : "outline"
                    }
                  >
                    {campaign.status === "sent" ? "Đã gửi" : campaign.status === "scheduled" ? "Đã lên lịch" : "Nháp"}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEditCampaign(campaign)}>
                    Sửa
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card theme={'admin'} className={'border border-gray-200 admin-dark:bg-gray-800'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Danh sách email</CardTitle>
                <CardDescription>Quản lý subscribers</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowListForm(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Tạo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {emailLists.map((list, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1 flex-1">
                  <p className="font-medium">{list.name}</p>
                  <p className="text-sm text-muted-foreground">{list.count.toLocaleString()} subscribers</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="admin-dark:text-foreground text-primary">
                    {list.growth}
                  </Badge>
                  <Badge variant={list.active ? "default" : "secondary"}>
                    {list.active ? "Hoạt động" : "Tạm dừng"}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEditList(list)}>
                    Sửa
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Email Templates Section */}
      <Card theme={'admin'} className={'border border-gray-200 admin-dark:bg-gray-800'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`text-black admin-dark:text-foreground`}>Templates email</CardTitle>
              <CardDescription>Mẫu email có sẵn để sử dụng</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Tạo template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "Newsletter Template", description: "Mẫu newsletter hàng tuần", usage: 12 },
              { name: "Promotional Email", description: "Mẫu email khuyến mãi", usage: 8 },
              { name: "Welcome Email", description: "Email chào mừng thành viên mới", usage: 25 },
              { name: "Product Update", description: "Thông báo cập nhật sản phẩm", usage: 6 },
              { name: "Event Invitation", description: "Lời mời tham gia sự kiện", usage: 4 },
              { name: "Survey Request", description: "Yêu cầu khảo sát khách hàng", usage: 3 },
            ].map((template, index) => (
              <div key={index} className="p-4  rounded-lg hover:bg-muted/10 cursor-pointer border-2 border-gray-300 admin-dark:border-gray-700">
                <div className="space-y-2 ">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium ">{template.name}</h4>
                    <Badge theme={"admin"} variant="outline">{template.usage} lần</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground admin-dark:text-foreground">{template.description}</p>
                  <div className="flex gap-2 ">
                    <Button theme={`admin`} variant="outline" size="sm" className="flex-1 bg-transparent text-black admin-dark:text-foreground border border-gray-400">
                      Xem trước
                    </Button>
                    <Button theme={`admin`} variant="outline" size="sm" className="flex-1 bg-transparent text-black admin-dark:text-foreground border border-gray-400">
                      Sử dụng
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Campaign Form Modal */}
      <Dialog open={showCampaignForm} onOpenChange={setShowCampaignForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">
                {editingCampaign ? "Chỉnh sửa chiến dịch email" : "Tạo chiến dịch email mới"}
              </h2>
              <p className="text-sm text-muted-foreground">Tạo và gửi email marketing đến danh sách subscribers</p>
            </div>

            {/* Campaign form would go here */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Tên chiến dịch</label>
                <input className="px-3 py-2 border rounded-md" placeholder="Nhập tên chiến dịch..." />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Tiêu đề email</label>
                <input className="px-3 py-2 border rounded-md" placeholder="Nhập tiêu đề email..." />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Danh sách gửi</label>
                <select className="px-3 py-2 border rounded-md">
                  <option className="text-black admin-dark:text-foreground">Chọn danh sách...</option>
                  {emailLists.map((list) => (
                    <option key={list.id} value={list.id} className="text-black admin-dark:text-foreground">
                      {list.name} ({list.count} subscribers)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCampaignForm(false)}>
                Hủy
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Lên lịch
              </Button>
              <Button onClick={() => setShowCampaignForm(false)}>
                <Send className="h-4 w-4 mr-2" />
                Gửi ngay
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email List Form Modal */}
      <Dialog open={showListForm} onOpenChange={setShowListForm}>
        <DialogContent className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">
                {editingList ? "Chỉnh sửa danh sách email" : "Tạo danh sách email mới"}
              </h2>
              <p className="text-sm text-muted-foreground">Quản lý danh sách subscribers cho email marketing</p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Tên danh sách</label>
                <input className="px-3 py-2 border rounded-md" placeholder="Nhập tên danh sách..." />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Mô tả</label>
                <textarea className="px-3 py-2 border rounded-md" rows={3} placeholder="Mô tả danh sách..." />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowListForm(false)}>
                Hủy
              </Button>
              <Button onClick={() => setShowListForm(false)}>{editingList ? "Cập nhật" : "Tạo danh sách"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

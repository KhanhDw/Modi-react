


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"



export default function CampaignsTable({ campaigns, onView, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const filteredCampaigns = campaigns
    .filter((campaign) => {
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "budget":
          return b.budget - a.budget
        case "revenue":
          return Number.parseInt(b.revenue.replace(/[₫,]/g, "")) - Number.parseInt(a.revenue.replace(/[₫,]/g, ""))
        case "leads":
          return b.leads - a.leads
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const getStatusBadge = (status) => {
    switch (status) {
      case "running":
        return <Badge className="bg-primary">Đang chạy</Badge>
      case "completed":
        return <Badge variant="secondary">Hoàn thành</Badge>
      case "paused":
        return <Badge variant="outline">Tạm dừng</Badge>
      default:
        return <Badge variant="outline">Lên kế hoạch</Badge>
    }
  }

  const calculateROI = (revenue, spent) => {
    const revenueNum = Number.parseInt(revenue.replace(/[₫,]/g, ""))
    return (((revenueNum - spent) / spent) * 100).toFixed(1)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách chiến dịch</CardTitle>
            <CardDescription>Quản lý tất cả chiến dịch marketing</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm chiến dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="running">Đang chạy</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="paused">Tạm dừng</SelectItem>
                <SelectItem value="planned">Lên kế hoạch</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Tên A-Z</SelectItem>
                <SelectItem value="budget">Ngân sách</SelectItem>
                <SelectItem value="revenue">Doanh thu</SelectItem>
                <SelectItem value="leads">Leads</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên chiến dịch</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Ngân sách</TableHead>
                <TableHead className="text-right">Đã chi</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Doanh thu</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">{campaign.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell className="text-right font-medium">{campaign.budget?.toLocaleString()}₫</TableCell>
                  <TableCell className="text-right">{campaign.spent?.toLocaleString()}₫</TableCell>
                  <TableCell className="text-right">{campaign.clicks?.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">{campaign.leads}</TableCell>
                  <TableCell className="text-right font-medium text-primary">{campaign.revenue}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      +{calculateROI(campaign.revenue, campaign.spent)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(campaign)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(campaign)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(campaign)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không tìm thấy chiến dịch nào phù hợp</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

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
        return (
          <Badge className="bg-primary admin-dark:bg-green-700 ">
            Đang chạy
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="admin-dark:bg-gray-700 bg-gray-200">
            Hoàn thành
          </Badge>
        )
      case "paused":
        return (
          <Badge variant="outline" className="admin-dark:border-gray-500 border-gray-300">
            Tạm dừng
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="admin-dark:border-gray-500 border-gray-300">
            Lên kế hoạch
          </Badge>
        )
    }
  }

  const calculateROI = (revenue, spent) => {
    const revenueNum = Number.parseInt(revenue.replace(/[₫,]/g, ""))
    return (((revenueNum - spent) / spent) * 100).toFixed(1)
  }

  return (
    <Card className="admin-dark:bg-gray-900 bg-white admin-dark:text-gray-100 text-gray-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-900">Danh sách chiến dịch</CardTitle>
            <CardDescription className="admin-dark:text-gray-400 text-gray-500">
              Quản lý tất cả chiến dịch marketing
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4  admin-dark:text-gray-400 text-gray-500" />
              <Input
                placeholder="Tìm kiếm chiến dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:text-gray-100 bg-white border-gray-300 text-gray-900"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:text-gray-100 bg-white border-gray-300 text-gray-900">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="admin-dark:bg-gray-800 admin-dark:text-gray-100 admin-dark:border-gray-700 bg-white text-gray-900 border-gray-300">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="running">Đang chạy</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="paused">Tạm dừng</SelectItem>
                <SelectItem value="planned">Lên kế hoạch</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:text-gray-100 bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent className="admin-dark:bg-gray-800 admin-dark:text-gray-100 admin-dark:border-gray-700 bg-white text-gray-900 border-gray-300">
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
        <div className="rounded-md border admin-dark:border-gray-700 border-gray-200">
          <Table>
            <TableHeader className="admin-dark:bg-gray-800 bg-gray-50">
              <TableRow>
                <TableHead className="admin-dark:text-gray-300 text-gray-700">Tên chiến dịch</TableHead>
                <TableHead className="admin-dark:text-gray-300 text-gray-700">Trạng thái</TableHead>
                <TableHead className="text-right admin-dark:text-gray-300 text-gray-700">Ngân sách</TableHead>
                <TableHead className="text-right admin-dark:text-gray-300 text-gray-700">Đã chi</TableHead>
                <TableHead className="text-right admin-dark:text-gray-300 text-gray-700">Clicks</TableHead>
                <TableHead className="text-right admin-dark:text-gray-300 text-gray-700">Leads</TableHead>
                <TableHead className="text-right admin-dark:text-gray-300 text-gray-700">Doanh thu</TableHead>
                <TableHead className="text-right admin-dark:text-gray-300 text-gray-700">ROI</TableHead>
                <TableHead className="text-right admin-dark:text-gray-300 text-gray-700">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign, index) => (
                <TableRow key={index} className="admin-dark:hover:bg-gray-800 hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm  admin-dark:text-gray-400 text-gray-500">
                        {campaign.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell className="text-right font-medium text-gray-900">
                    {campaign.budget?.toLocaleString()}₫
                  </TableCell>
                  <TableCell className="text-right text-gray-900">{campaign.spent?.toLocaleString()}₫</TableCell>
                  <TableCell className="text-right text-gray-900">{campaign.clicks?.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium text-gray-900">{campaign.leads}</TableCell>
                  <TableCell className="text-right font-medium  text-blue-600">
                    {campaign.revenue}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className=" admin-dark:bg-primary/20 bg-blue-100 text-blue-600"
                    >
                      +{calculateROI(campaign.revenue, campaign.spent)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 admin-dark:hover:bg-gray-700 admin-dark:text-gray-300 hover:bg-gray-100 text-gray-600"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="admin-dark:bg-gray-800 admin-dark:text-gray-100 admin-dark:border-gray-700 bg-white text-gray-900 border-gray-200"
                      >
                        <DropdownMenuItem onClick={() => onView(campaign)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(campaign)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(campaign)}
                          className="text-destructive admin-dark:text-red-400 "
                        >
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
            <p className="text-muted-foreground admin-dark:text-gray-400 ">
              Không tìm thấy chiến dịch nào phù hợp
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
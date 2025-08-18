import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit, Trash2, MoreHorizontal, Car, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ServiceCustomerTable({
  customers,
  onSubmit,
  onCandled,
}) {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách khách hàng</CardTitle>
              <CardDescription className="text-gray-600">
                Quản lý tất cả khách hàng đã sử dụng dịch vụ
              </CardDescription>
            </div>
            {/* Code more for search, filter */}
            <div className="flex items-center gap-2">
              <div className="relative bg-white rounded-md shadow-sm text-black">
                <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khách hàng..."
                  className="pl-10 w-64"
                />
              </div>
              {/* <Select>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả</SelectItem>
                <SelectItem value="">Đang hoạt động </SelectItem>
                <SelectItem value="">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select> */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-black">
          <div className="rounded-md border border-gray-300 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black">Tên khách hàng</TableHead>
                  <TableHead className="text-black">Số dịch vụ</TableHead>
                  <TableHead className="text-black">Trạng thái</TableHead>
                  <TableHead className="text-black">Email</TableHead>
                  <TableHead className="text-black">SĐT</TableHead>
                  <TableHead className="text-black">Hoàn thành</TableHead>
                  <TableHead className="text-black">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="text-black">
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-black pl-9">
                      {customer.orders?.length || 0}
                    </TableCell>
                    <TableCell className="text-black">
                      {customer.status === "active" ? (
                        <Badge className="bg-green-500">Đang hoạt động</Badge>
                      ) : (
                        <Badge className="bg-red-500">Ngưng hoạt động</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-black">
                      {customer.email || "Chưa cập nhật"}
                    </TableCell>
                    <TableCell className="text-black">
                      {customer.phone || "Chưa cập nhật"}
                    </TableCell>
                    {/* <TableCell className="text-black">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </TableCell> */}
                    <TableCell className="text-black pl-9">
                      {
                        customer.orders.filter((c) => c.status === "completed")
                          .length
                      }
                    </TableCell>
                    <TableCell className="text-black">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
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
        </CardContent>
      </Card>
    </div>
  );
}

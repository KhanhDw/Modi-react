import { useEffect, useState } from "react";
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
import { Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useOutletContext } from "react-router-dom";
import ServiceForm from "./service-form";
import DialogShowForm_Service from "@/pages/managers/service/DialogShowFormService";

export default function ServiceTable() {
  const { initDataService, openEditServiceForm, handleDeleteService } =
    useOutletContext();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // số dịch vụ trên 1 trang

  // Lọc theo search
  const filteredService = initDataService.filter((service) =>
    service.ten_dich_vu.toLowerCase().includes(search.toLowerCase())
  );

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredService.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredService.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Card className="bg-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách dịch vụ</CardTitle>
            <CardDescription className="text-gray-600">
              Quản lý tất cả dịch vụ
            </CardDescription>
          </div>
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative bg-white rounded-md shadow-sm text-black">
              <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // reset về trang đầu khi tìm kiếm
                }}
                placeholder="Tìm kiếm dịch vụ..."
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-black">
        <div className="rounded-md border border-gray-300 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Tên dịch vụ</TableHead>
                <TableHead className="text-black">Mô tả</TableHead>
                <TableHead className="text-black">Bài viết</TableHead>
                <TableHead className="text-black">Giá</TableHead>
                <TableHead className="text-black">
                  Tổng doanh thu mang lại
                </TableHead>
                <TableHead className="text-black">Số lần đặt</TableHead>
                <TableHead className="text-black">Trạng thái</TableHead>
                <TableHead className="text-black">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.service_id}>
                  <TableCell>{item.ten_dich_vu}</TableCell>
                  <TableCell>{item.mo_ta}</TableCell>
                  <TableCell>{item.headerTitle}</TableCell>
                  <TableCell>
                    {item.price != null
                      ? Number(item.price).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : "0 ₫"}
                  </TableCell>
                  <TableCell>
                    {item.revenue != null
                      ? Number(item.revenue).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : "0 ₫"}
                  </TableCell>
                  <TableCell>{item.booking_count}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-600 text-white">Hoạt động</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openEditServiceForm(item)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteService(item.service_id)}
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
        {/* Pagination */}
        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            className="text-white disabled:opacity-50 border-gray-300"
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Trước
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              className={`px-3 ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            className="text-white disabled:opacity-50 border-gray-300"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Sau
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

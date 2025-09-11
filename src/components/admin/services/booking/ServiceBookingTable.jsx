import { useState } from "react";
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
import { Search, MoreHorizontal, Filter, Edit, Trash2 } from "lucide-react";
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
import { useOutletContext } from "react-router-dom";

export default function ServiceBookingTable() {
  const { initDataBooking, handleDeleteBooking, openEditBookingForm } =
    useOutletContext();

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const changeStatus = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // reset trang khi filter thay đổi
  };

  // Filter theo search + status
  const filteredBooking = initDataBooking.filter((booking) => {
    const keyword = search.toLowerCase();
    const matchSearch =
      booking.name.toLowerCase().includes(keyword) ||
      booking.ten_dich_vu.toLowerCase().includes(keyword);
    const matchStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredBooking.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredBooking.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Card className="bg-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách đơn đặt dịch vụ</CardTitle>
            <CardDescription className="text-gray-600">
              Quản lý tất cả đơn đặt dịch vụ
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative bg-white rounded-md shadow-sm text-black">
              <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm kiếm đơn đặt..."
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={changeStatus}>
              <SelectTrigger className="w-40 bg-white text-black border border-gray-300 rounded">
                <Filter className="h-4 w-4 mr-2 text-black" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="pending">Chưa hoàn thành</SelectItem>
                <SelectItem value="destroy">Hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-black">
        <div className="rounded-md border border-gray-300 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Tên khách hàng</TableHead>
                <TableHead className="text-black">Tên dịch vụ</TableHead>
                <TableHead className="text-black">Trạng thái</TableHead>
                <TableHead className="text-black">Giá</TableHead>
                <TableHead className="text-black">Ngày đặt</TableHead>
                <TableHead className="text-black">Ngày hoàn thành</TableHead>
                <TableHead className="text-black">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.ten_dich_vu}</TableCell>
                  <TableCell>
                    {item.status === "completed" ? (
                      <Badge className="bg-green-500">Hoàn thành</Badge>
                    ) : item.status !== "cancelled" ? (
                      <Badge className="bg-red-900 text-white">
                        Chưa hoàn thành
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500">Đơn bị hủy</Badge>
                    )}
                  </TableCell>
                  <TableCell>{`₫${item.price.toLocaleString()}`}</TableCell>
                  <TableCell>
                    {new Date(item.booking_date).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {item.completed_date
                      ? new Date(item.completed_date).toLocaleDateString(
                          "vi-VN"
                        )
                      : "Không có"}
                  </TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openEditBookingForm(item)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          key={item.id}
                          onClick={() => handleDeleteBooking(item.id)}
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
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="text-white disabled:opacity-50 border-gray-300"
          >
            Trước
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="text-white disabled:opacity-50 border-gray-300"
          >
            Sau
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

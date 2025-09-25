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
  // Filter theo search + status
  const filteredBooking = initDataBooking.filter((booking) => {
    const keyword = search.toLowerCase();
    const matchSearch =
      (booking.customer_name?.toLowerCase() || "").includes(keyword) ||
      (booking.service_name?.toLowerCase() || "").includes(keyword);
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
    <Card
      className="bg-gray-100 rounded-xl border border-gray-300 shadow-sm 
        admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-900 admin-dark:text-gray-100">
              Danh sách đơn đặt dịch vụ
            </CardTitle>
            <CardDescription className="text-gray-600 admin-dark:text-gray-400">
              Quản lý tất cả đơn đặt dịch vụ
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="relative bg-white rounded-md shadow-sm text-black 
                admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:shadow-gray-900/50"
            >
              <Search
                className="absolute left-3 top-[10px] h-4 w-4 text-gray-500 
                  admin-dark:text-gray-400"
              />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm kiếm đơn đặt..."
                className="pl-10 w-64 bg-transparent border-gray-300 
                  admin-dark:border-gray-600 admin-dark:text-gray-200 
                  admin-dark:placeholder-gray-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={changeStatus}>
              <SelectTrigger
                className="w-40 bg-white text-black border border-gray-300 rounded 
                  admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:border-gray-600"
              >
                <Filter
                  className="h-4 w-4 mr-2 text-black admin-dark:text-gray-200"
                />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent
                className="bg-white text-black border-gray-300 
                  admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:border-gray-600"
              >
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="pending">Chưa hoàn thành</SelectItem>
                <SelectItem value="destroy">Hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-black admin-dark:text-gray-200">
        <div
          className="rounded-md border border-gray-300 bg-white shadow-sm 
            admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
        >
          <Table>
            <TableHeader>
              <TableRow
                className="bg-gray-50 admin-dark:bg-gray-900 
                  hover:bg-gray-100 admin-dark:hover:bg-gray-800"
              >
                <TableHead className="text-black admin-dark:text-gray-200">
                  Tên khách hàng
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Tên dịch vụ
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Trạng thái
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Giá
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Ngày đặt
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Ngày bàn giao
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item, index) => (
                <TableRow
                  key={`${item.id}${index}`}
                  className="hover:bg-gray-50 admin-dark:hover:bg-gray-900"
                >
                  <TableCell className="text-gray-900 admin-dark:text-gray-200">
                    {item.customer_name}
                  </TableCell>
                  <TableCell className="text-gray-900 admin-dark:text-gray-200">
                    {item.service_name}
                  </TableCell>
                  <TableCell>
                    {item.status === "pending" ? (
                      <Badge className="bg-yellow-500 text-white admin-dark:bg-yellow-600">Chờ xác nhận</Badge>
                    ) : item.status === "completed" ? (
                      <Badge className="bg-green-500 text-white admin-dark:bg-green-600">Hoàn thành</Badge>
                    ) : item.status === "cancelled" ? (
                      <Badge className="bg-red-500 text-white admin-dark:bg-red-600">Hủy</Badge>
                    ) : item.status === "processing" ? (
                      <Badge className="bg-blue-500 text-white admin-dark:bg-blue-600">Đang xử lý</Badge>
                    ) : item.status === "confirmed" ? (
                      <Badge className="bg-purple-500 text-white admin-dark:bg-purple-600">Đã xác nhận</Badge>
                    ) : (
                      <Badge className="bg-gray-500 text-white admin-dark:bg-gray-600">Không xác định</Badge>
                    )
                    }
                  </TableCell>
                  <TableCell className="text-gray-900 admin-dark:text-gray-200">
                    {Number(item.price).toLocaleString("vi-VN")} ₫
                  </TableCell>
                  <TableCell className="text-gray-900 admin-dark:text-gray-200">
                    {new Date(item.booking_date).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-gray-900 admin-dark:text-gray-200">
                    {item.completed_date
                      ? new Date(item.completed_date).toLocaleDateString("vi-VN")
                      : "Không có"}
                  </TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-600 hover:bg-gray-200 
                admin-dark:text-gray-300 admin-dark:hover:bg-gray-700"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white text-black border-gray-300 
              admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:border-gray-600"
                      >
                        <DropdownMenuItem
                          onClick={() => openEditBookingForm(item)}
                          className="hover:bg-gray-100 admin-dark:hover:bg-gray-600"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          key={item.id}
                          onClick={() => handleDeleteBooking(item.id)}
                          className="hover:bg-gray-100 admin-dark:hover:bg-gray-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

              {currentData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-500 py-4 admin-dark:text-gray-400"
                  >
                    Không tìm thấy đơn đặt dịch vụ nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="text-gray-700 border-gray-300 bg-white hover:bg-gray-100 
              admin-dark:text-gray-200 admin-dark:bg-gray-700 admin-dark:border-gray-600 
              admin-dark:hover:bg-gray-600 admin-dark:disabled:opacity-50"
          >
            Trước
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 ${currentPage === i + 1
                ? "bg-blue-600 text-white hover:bg-blue-700 admin-dark:bg-blue-500 admin-dark:hover:bg-blue-600"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:border-gray-600 admin-dark:hover:bg-gray-600"
                }`}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="text-gray-700 border-gray-300 bg-white hover:bg-gray-100 
              admin-dark:text-gray-200 admin-dark:bg-gray-700 admin-dark:border-gray-600 
              admin-dark:hover:bg-gray-600 admin-dark:disabled:opacity-50"
          >
            Sau
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
import Pagination from "@/components/admin/services/utils/Pagination.jsx";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import CustomSelectFilter from "@/pages/managers/service/CustomSelectFilter";
import TableRowActions from "@/pages/managers/service/TableRowActions";



export default function ServiceBookingTable() {
  const { initDataBooking, handleDeleteBooking, openEditBookingForm } =
    useOutletContext();

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const changeStatus = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };


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
      <CardHeader className="px-2 sm:px-3">
        <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="">
            <CardTitle className="text-lg sm:text-lg md:text-xl font-bold text-gray-900 admin-dark:text-gray-100">
              Danh sách đơn đặt dịch vụ
            </CardTitle>
            <CardDescription className="text-xs sm:text-center md:text-center lg:text-start sm:text-sm text-gray-600 admin-dark:text-gray-400 mt-1">
              Quản lý tất cả đơn đặt dịch vụ
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-48 md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500
                  admin-dark:text-gray-400"
              />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm kiếm đơn đặt..."
                className="pl-10 text-xs sm:text-sm bg-white border-gray-300
                  admin-dark:bg-gray-700 admin-dark:border-gray-600 text-gray-800 admin-dark:text-gray-200
                  admin-dark:placeholder-gray-400 rounded-md shadow-sm w-full"
              />
            </div>
            <CustomSelectFilter
              value={statusFilter}
              onValueChange={changeStatus}
              placeholder="Trạng thái"
              options={[
                { value: "all", label: "Tất cả" },
                { value: "completed", label: "Hoàn thành" },
                { value: "pending", label: "Chưa hoàn thành" },
                { value: "destroy", label: "Hủy" },
              ]}
            />

          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-3 text-black admin-dark:text-gray-200">
        <div
          className="rounded-md border border-gray-300 bg-white shadow-sm
    admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50
    w-full overflow-x-auto"
        >
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow
                className="bg-gray-50 admin-dark:bg-gray-900
                  hover:bg-gray-100 admin-dark:hover:bg-gray-800"
              >
                <TableHead className="text-black admin-dark:text-gray-200">
                  STT
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Tên khách hàng
                </TableHead>
                <TableHead className="w-[20%] sm:w-[15%] text-black admin-dark:text-gray-200 font-semibold">
                  Tên dịch vụ
                </TableHead>
                <TableHead className="w-[15%] sm:w-[10%] text-black admin-dark:text-gray-200 font-semibold">
                  Trạng thái
                </TableHead>
                <TableHead className="w-[15%] sm:w-[10%] text-black admin-dark:text-gray-200 font-semibold ">
                  Giá
                </TableHead>
                <TableHead className="w-[15%] sm:w-[15%] text-black admin-dark:text-gray-200 font-semibold ">
                  Ngày đặt
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Ngày bàn giao
                </TableHead>
                <TableHead className="w-[15%] sm:w-[10%] text-black admin-dark:text-gray-200 font-semibold text-center">
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
                  <TableCell className={`text-gray-900 admin-dark:text-gray-200`}>
                    {startIndex + index + 1}
                  </TableCell>
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
                  <TableCell className="flex items-center justify-center space-x-2">
                    <TableRowActions
                      actions={[
                        {
                          label: "Chỉnh sửa",
                          icon: Edit,
                          onClick: () => openEditBookingForm(item),
                        },
                        {
                          label: "Xóa",
                          icon: Trash2,
                          onClick: () => handleDeleteBooking(item.id),
                        },
                      ]}
                    />
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
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500 admin-dark:text-gray-400">
            Trang {currentPage} / {totalPages || 1}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>

      </CardContent>
    </Card>
  );
}

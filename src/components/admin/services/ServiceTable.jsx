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
    <Card
      className="bg-gray-100 rounded-xl border border-gray-300 shadow-sm 
        admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
    >
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <CardTitle className="text-lg sm:text-lg md:text-2xl font-bold text-gray-900 admin-dark:text-gray-100">
              Danh sách dịch vụ
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-600 admin-dark:text-gray-400 mt-1">
              Quản lý tất cả dịch vụ
            </CardDescription>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-48 md:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 
                admin-dark:text-gray-400"
            />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset về trang đầu khi tìm kiếm
              }}
              placeholder="Tìm kiếm dịch vụ..."
              className="pl-10 text-xs sm:text-sm bg-white border-gray-300 
                admin-dark:bg-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 
                admin-dark:placeholder-gray-400 rounded-md shadow-sm w-full"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 text-black admin-dark:text-gray-200">
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
                <TableHead className="w-[25%] sm:w-[20%] md:w-[15%] text-black admin-dark:text-gray-200 font-semibold">
                  Tên dịch vụ
                </TableHead>
                <TableHead className="w-[30%] sm:w-[25%] md:w-[20%] text-black admin-dark:text-gray-200 font-semibold ">
                  Mô tả
                </TableHead>
                <TableHead className="w-[20%] sm:w-[15%] md:w-[15%] text-black admin-dark:text-gray-200 font-semibold">
                  Giá
                </TableHead>
                <TableHead className="w-[15%] sm:w-[15%] md:w-[10%] text-black admin-dark:text-gray-200 font-semibold ">
                  Số lần đặt
                </TableHead>
                <TableHead className="w-[15%] sm:w-[15%] md:w-[10%] text-black admin-dark:text-gray-200 font-semibold">
                  Trạng thái
                </TableHead>
                <TableHead className="w-[10%] sm:w-[10%] md:w-[10%] text-black admin-dark:text-gray-200 font-semibold text-center">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500 admin-dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 admin-dark:text-gray-600 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        ></path>
                      </svg>
                      <span className="text-sm font-medium text-gray-500 admin-dark:text-gray-300">
                        Không có dữ liệu
                      </span>
                      <span className="text-xs text-gray-400 admin-dark:text-gray-500 mt-1">
                        Chưa có dịch vụ nào được tìm thấy
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50 admin-dark:hover:bg-gray-900"
                  >
                    <TableCell className="text-gray-900 admin-dark:text-gray-200 truncate">
                      {item.ten_dich_vu}
                    </TableCell>
                    <TableCell className="text-gray-900 admin-dark:text-gray-200 truncate">
                      {item.mo_ta}
                    </TableCell>
                    <TableCell className="text-gray-900 admin-dark:text-gray-200">
                      {`₫${item.price.toLocaleString()}`}
                    </TableCell>
                    <TableCell className="text-gray-900 admin-dark:text-gray-200 ">
                      {item.booking_count}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-600 text-white admin-dark:bg-green-500 text-xs">
                        Hoạt động
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-600 hover:bg-gray-200 
                              admin-dark:text-gray-300 admin-dark:hover:bg-gray-700 w-8 h-8"
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
                            onClick={() => openEditServiceForm(item)}
                            className="hover:bg-gray-100 admin-dark:hover:bg-gray-600 text-xs sm:text-sm"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteService(item.id)}
                            className="hover:bg-gray-100 admin-dark:hover:bg-gray-600 text-xs sm:text-sm"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        <div className="flex flex-wrap justify-center sm:justify-end mt-4 gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            className="text-xs sm:text-sm text-gray-700 border-gray-300 bg-white hover:bg-gray-100 
              admin-dark:text-gray-200 admin-dark:bg-gray-700 admin-dark:border-gray-600 
              admin-dark:hover:bg-gray-600 admin-dark:disabled:opacity-50 px-3 py-1"
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Trước
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              className={`px-3 py-1 text-xs sm:text-sm ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white hover:bg-blue-700 admin-dark:bg-blue-500 admin-dark:hover:bg-blue-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:border-gray-600 admin-dark:hover:bg-gray-600"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            className="text-xs sm:text-sm text-gray-700 border-gray-300 bg-white hover:bg-gray-100 
              admin-dark:text-gray-200 admin-dark:bg-gray-700 admin-dark:border-gray-600 
              admin-dark:hover:bg-gray-600 admin-dark:disabled:opacity-50 px-3 py-1"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Sau
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
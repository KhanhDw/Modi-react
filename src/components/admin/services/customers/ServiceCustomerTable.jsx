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
import {
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Filter,
} from "lucide-react";
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

export default function ServiceCustomerTable() {
  const {
    initDataCustomer,
    initDataBooking,
    openEditCustomerForm,
    handleDeleteCustomer,
  } = useOutletContext();

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const changeStatus = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const filteredCustomer = initDataCustomer.filter((customer) => {
    const keyword = search.toLowerCase();
    const groupType = customer.type === "vip" ? "vip" : "thuong";

    const matchSearch =
      customer.name.toLowerCase().includes(keyword) ||
      groupType.includes(keyword);

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "new" && groupType === "thuong") ||
      (statusFilter === "vip" && groupType === "vip");

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredCustomer.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredCustomer.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card
        className="bg-gray-100 rounded-xl border border-gray-300 shadow-sm 
          admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
      >
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 admin-dark:text-white">
                Danh sách khách hàng
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-600 admin-dark:text-gray-400 mt-1">
                Quản lý tất cả khách hàng đã sử dụng dịch vụ
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
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
                  placeholder="Tìm kiếm khách hàng..."
                  className="pl-10 text-xs sm:text-sm bg-white border-gray-300 
                    admin-dark:bg-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 
                    admin-dark:placeholder-gray-400 rounded-md shadow-sm w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={changeStatus}>
                <SelectTrigger
                  className="w-full sm:w-40 text-xs sm:text-sm bg-white text-black border border-gray-300 rounded 
                    admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:border-gray-600"
                >
                  <Filter
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-black admin-dark:text-gray-200"
                  />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent
                  className="bg-white text-black border-gray-300 
                    admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:border-gray-600 text-xs sm:text-sm"
                >
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="new">Thường</SelectItem>
                  <SelectItem value="vip">Vip</SelectItem>
                </SelectContent>
              </Select>
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
                  <TableHead className="w-[20%] sm:w-[15%] text-black admin-dark:text-gray-200 font-semibold">
                    Tên khách hàng
                  </TableHead>
                  <TableHead className="w-[15%] sm:w-[10%] text-black admin-dark:text-gray-200 font-semibold">
                    Đã đặt
                  </TableHead>
                  <TableHead className="w-[20%] sm:w-[20%] text-black admin-dark:text-gray-200 font-semibold hidden sm:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="w-[20%] sm:w-[15%] text-black admin-dark:text-gray-200 font-semibold hidden md:table-cell">
                    SĐT
                  </TableHead>
                  <TableHead className="w-[15%] sm:w-[10%] text-black admin-dark:text-gray-200 font-semibold hidden lg:table-cell">
                    Hoàn thành
                  </TableHead>
                  <TableHead className="w-[15%] sm:w-[15%] text-black admin-dark:text-gray-200 font-semibold hidden xl:table-cell">
                    Chi
                  </TableHead>
                  <TableHead className="w-[10%] sm:w-[10%] text-black admin-dark:text-gray-200 font-semibold text-center">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
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
                          Chưa có khách hàng nào được tìm thấy
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="hover:bg-gray-50 admin-dark:hover:bg-gray-900"
                    >
                      <TableCell className="text-gray-900 admin-dark:text-gray-200 truncate">
                        {customer.name}
                      </TableCell>
                      <TableCell className="text-gray-900 admin-dark:text-gray-200">
                        {customer.booking_count || 0}
                      </TableCell>
                      <TableCell className="text-gray-900 admin-dark:text-gray-200 hidden sm:table-cell truncate">
                        {customer.email || "Chưa cập nhật"}
                      </TableCell>
                      <TableCell className="text-gray-900 admin-dark:text-gray-200 hidden md:table-cell">
                        {customer.phone || "Chưa cập nhật"}
                      </TableCell>
                      <TableCell className="text-gray-900 admin-dark:text-gray-200 hidden lg:table-cell">
                        {
                          initDataBooking.filter(
                            (c) =>
                              c.customer_id === customer.id &&
                              c.status === "completed"
                          ).length
                        }
                      </TableCell>
                      <TableCell className="text-gray-900 admin-dark:text-gray-200 hidden xl:table-cell">
                        {(customer.total_spent || 0).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
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
                              className="hover:bg-gray-100 admin-dark:hover:bg-gray-600 text-xs sm:text-sm"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditCustomerForm(customer)}
                              className="hover:bg-gray-100 admin-dark:hover:bg-gray-600 text-xs sm:text-sm"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCustomer(customer.id)}
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
          <div className="flex flex-wrap justify-center sm:justify-end mt-4 gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="text-xs sm:text-sm text-gray-700 border-gray-300 bg-white hover:bg-gray-100 
                admin-dark:text-gray-200 admin-dark:bg-gray-700 admin-dark:border-gray-600 
                admin-dark:hover:bg-gray-600 admin-dark:disabled:opacity-50 px-3 py-1"
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-xs sm:text-sm ${
                  currentPage === i + 1
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
              className="text-xs sm:text-sm text-gray-700 border-gray-300 bg-white hover:bg-gray-100 
                admin-dark:text-gray-200 admin-dark:bg-gray-700 admin-dark:border-gray-600 
                admin-dark:hover:bg-gray-600 admin-dark:disabled:opacity-50 px-3 py-1"
            >
              Sau
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
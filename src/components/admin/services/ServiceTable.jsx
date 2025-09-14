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
    <Card
      className="bg-gray-100 rounded-xl border border-gray-300 shadow-sm 
        admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-900 admin-dark:text-gray-100">
              Danh sách dịch vụ
            </CardTitle>
            <CardDescription className="text-gray-600 admin-dark:text-gray-400">
              Quản lý tất cả dịch vụ
            </CardDescription>
          </div>
          {/* Search */}
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
                  setCurrentPage(1); // reset về trang đầu khi tìm kiếm
                }}
                placeholder="Tìm kiếm dịch vụ..."
                className="pl-10 w-64 bg-transparent border-gray-300 
                  admin-dark:border-gray-600 admin-dark:text-gray-200 
                  admin-dark:placeholder-gray-400"
              />
            </div>
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
                  Tên dịch vụ
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Mô tả
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Giá
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Số lần đặt
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Trạng thái
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-gray-50 admin-dark:hover:bg-gray-900"
                >
                  <TableCell className="text-gray-900 admin-dark:text-gray-200">
                    {item.ten_dich_vu}
                  </TableCell>
                  <TableCell className="text-gray-900 admin-dark:text-gray-200">
                    {item.mo_ta}
                  </TableCell>
                  <TableCell className="text-gray-900 admin-dark:text-gray-200">
                    {`₫${item.price.toLocaleString()}`}
                  </TableCell>
                  <TableCell className="text-gray-900 admin-dark:text-gray-200">
                    {item.booking_count}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-600 text-white admin-dark:bg-green-500">
                      Hoạt động
                    </Badge>
                  </TableCell>
                  <TableCell>
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
                          onClick={() => openEditServiceForm(item)}
                          className="hover:bg-gray-100 admin-dark:hover:bg-gray-600"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteService(item.id)}
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
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            className="text-gray-700 border-gray-300 bg-white hover:bg-gray-100 
              admin-dark:text-gray-200 admin-dark:bg-gray-700 admin-dark:border-gray-600 
              admin-dark:hover:bg-gray-600 admin-dark:disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Trước
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              className={`px-3 ${
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
            className="text-gray-700 border-gray-300 bg-white hover:bg-gray-100 
              admin-dark:text-gray-200 admin-dark:bg-gray-700 admin-dark:border-gray-600 
              admin-dark:hover:bg-gray-600 admin-dark:disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Sau
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

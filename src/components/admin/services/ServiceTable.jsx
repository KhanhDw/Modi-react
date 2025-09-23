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
    useOutletContext(); // Lấy dữ liệu và hàm từ context cha: src\pages\managers\ServicesPage.jsx
  console.log("initDataService:", initDataService); // kiểm tra dữ liệu
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // số dịch vụ trên 1 trang

  // Lọc theo search
  const filteredService = Array.isArray(initDataService)
    ? initDataService.filter((service) =>
      (service.translation?.ten_dich_vu || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    : [];
  const totalPages = Math.ceil(filteredService.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredService.slice(
    startIndex,
    startIndex + itemsPerPage
  );


  console.log("currentData:::", currentData);


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
                  Hình ảnh
                </TableHead>
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
                  Ngôn ngữ hỗ trợ
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
              {currentData.map((item) => {
                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50 admin-dark:hover:bg-gray-900"
                  >
                    <TableCell>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt="Ảnh dịch vụ"
                          style={{
                            width: 60,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      ) : null}
                    </TableCell>


                    <TableCell className={`${!item.totalLanguages.includes("vi") ? "text-red-400" : "text-gray-900 admin-dark:text-gray-200"}  `}>
                      {item.translation?.ten_dich_vu || "Chưa có thông tin tiếng việt"}
                    </TableCell>
                    <TableCell className={`${!item.totalLanguages.includes("vi") ? "text-red-400" : "text-gray-900 admin-dark:text-gray-200"}  `}>
                      {item.translation?.mo_ta || "Chưa có thông tin tiếng việt"}
                    </TableCell>
                    <TableCell className="text-gray-900 admin-dark:text-gray-200">
                      {item.floor_price
                        ? `₫${Number(item.floor_price).toLocaleString()}`
                        : ""}
                    </TableCell>
                    <TableCell className="text-gray-900 admin-dark:text-gray-200">
                      {typeof item.booking_count === "number"
                        ? item.booking_count
                        : ""}
                    </TableCell>
                    <TableCell
                      className="text-gray-900 admin-dark:text-gray-200"
                    ><div className="flex flex-wrap gap-1">
                        {item.totalLanguages.map((lang, index) => {
                          return (
                            <span key={`${lang}-${index}`} className={`${lang === "vi" ? "bg-red-700" : "bg-blue-600"} px-2 py-1 text-xs text-white  rounded-sm`}>{lang}</span>
                          )
                        }) || ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-600 text-white admin-dark:bg-green-500">
                        {item.status === "Active"
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-600 hover:bg-gray-200 admin-dark:text-gray-300 admin-dark:hover:bg-gray-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white text-black border-gray-300 admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:border-gray-600"
                        >
                          <DropdownMenuItem
                            onClick={() => openEditServiceForm(item)}
                            className="hover:bg-gray-100 admin-dark:hover:bg-gray-600"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Cập nhật
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
                )
              }

              )}
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
              className={`px-3 ${currentPage === i + 1
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

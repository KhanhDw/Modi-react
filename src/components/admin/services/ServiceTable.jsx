import Pagination from "@/components/admin/services/utils/Pagination.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import WarningMessage from "./utils/warningMessage";



export default function ServiceTable() {

  const navigate = useNavigate();

  const { initDataService, openEditServiceForm, handleDeleteService } =
    useOutletContext(); // Lấy dữ liệu và hàm từ context cha: src\pages\managers\ServicesPage.jsx
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

  const handleReaderDetailService = (slug) => {
    navigate(`/managers/services/read-detail/${slug}`);
  }

  return (
    <Card
      className="bg-gray-100 rounded-xl border border-gray-300 shadow-sm
        admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
    >
      <CardHeader className="px-2 sm:px-3 md:p-4">
        <div className="flex flex-col sm:flex-col md:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4">
          <div className="">
            <CardTitle className="text-sm sm:text-xl md:text-xl md:text-start font-bold text-gray-900 admin-dark:text-gray-100">
              Danh sách dịch vụ
            </CardTitle>
            <CardDescription className="text-xs sm:text-base md:text-[16px] sm:text-center md:text-start text-gray-600 admin-dark:text-gray-400 mt-1">
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
                  admin-dark:placeholder-gray-400 placeholder:text-sm sm:placeholder:text-base"
              />
            </div>

          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-3 md:p-4 text-black admin-dark:text-gray-200">
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
                  Hình ảnh
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200">
                  Tên dịch vụ
                </TableHead>
                <TableHead className="w-[30%] sm:w-[25%] md:w-[20%] text-black admin-dark:text-gray-200 font-semibold ">
                  Mô tả
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200 text-center">
                  Giá
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200 text-center">
                  Số lần đặt
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200 text-center">
                  Ngôn ngữ hỗ trợ
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200 text-center">
                  Trạng thái
                </TableHead>
                <TableHead className="text-black admin-dark:text-gray-200 text-center">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item, index) => {
                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50 admin-dark:hover:bg-gray-900"
                  >
                    <TableCell className={`text-gray-900 admin-dark:text-gray-200  `}>
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>
                      {item.image_url ? (
                        <img
                          src={`${import.meta.env.VITE_MAIN_BE_URL}${item.image_url}`}
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


                    <TableCell onClick={() => handleReaderDetailService(item.translation?.slug)} className={`${!item.totalLanguages.includes("vi") ? "text-red-400" : "text-gray-900 admin-dark:text-gray-200"}  hover:bg-slate-600 cursor-pointer`}>
                      {item.translation?.ten_dich_vu || "Chưa có thông tin tiếng việt"}
                    </TableCell>
                    <TableCell className={`${!item.totalLanguages.includes("vi") ? "text-red-400" : "text-gray-900 admin-dark:text-gray-200"}  `}>
                      {item.translation?.mo_ta || "Chưa có thông tin tiếng việt"}
                    </TableCell>
                    <TableCell className="text-gray-900 admin-dark:text-gray-200 text-center">
                      {item.floor_price
                        ? `₫${Number(item.floor_price).toLocaleString()}`
                        : ""}
                    </TableCell>
                    <TableCell className="text-gray-900 admin-dark:text-gray-200 text-center">
                      {typeof item.booking_count === "number"
                        ? item.booking_count
                        : ""}
                    </TableCell>
                    <TableCell
                      className="text-gray-900 admin-dark:text-gray-200 flex-col items-center justify-center"
                    ><div className="flex flex-wrap gap-1 text-center">
                        {item.totalLanguages.map((lang, index) => {
                          return (
                            <span key={`${lang}-${index}`} className={`${lang === "vi" ? "bg-red-700" : "bg-blue-600"} px-2 py-1 text-xs text-white  rounded-sm`}>{lang}</span>
                          )
                        }) || ""}
                      </div>
                    </TableCell>
                    <TableCell className={`text-center`}>
                      <Badge className="bg-green-600 text-white admin-dark:bg-green-500">
                        {item.status === "Active"
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-center`}>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-600 hover:text-600 hover:bg-gray-200 admin-dark:text-gray-300 admin-dark:hover:bg-gray-700 cursor-pointer"
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
                            className="hover:bg-gray-100 admin-dark:hover:bg-gray-600 cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Cập nhật
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteService(item.id)}
                            className="hover:bg-gray-100 admin-dark:hover:bg-gray-600 cursor-pointer"
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
              {
                currentData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-4">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        <div className="flex xs:flex-col lg:flex-row justify-between items-center mt-4">
          <div className="text-sm text-gray-500 admin-dark:text-gray-400">
            Trang {currentPage} / {totalPages || 1}
          </div>
          <WarningMessage />
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

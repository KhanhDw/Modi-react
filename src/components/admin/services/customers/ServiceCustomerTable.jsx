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
import ExcelDataUploader from "./ExcelDataUploader";
import ReadInforCustomer from "./ReadInforCustomer";

export default function ServiceCustomerTable() {
  const {
    initDataCustomer,
    initDataBooking,
    openEditCustomerForm,
    handleDeleteCustomer,
  } = useOutletContext();

  const [openDialogImportCustomer, setOpenDialogImportCustomer] = useState(false);
  const [openReadInforCustomer, setOpenReadInforCustomer] = useState(false);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số khách hàng trên 1 trang


  const getFullInforCustomer = async (id) => {
    setSelectedCustomerId(id);
    setLoadingCustomer(true);
    setOpenReadInforCustomer(true); // mở modal luôn, nhưng hiển thị loading
    try {
      const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/customers/${id}/full`);
      if (!res.ok) throw new Error("Không thể lấy dữ liệu khách hàng");
      const data = await res.json();
      setCustomerDetail(data);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setCustomerDetail(null);
    } finally {
      setLoadingCustomer(false);
    }
  };



  useEffect(() => {

  }, [selectedCustomerId]);


  const changeStatus = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // reset trang khi filter thay đổi
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

  // Phân trang
  const totalPages = Math.ceil(filteredCustomer.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredCustomer.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gray-100 admin-dark:bg-gray-900 admin-dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="admin-dark:text-white">Danh sách khách hàng</CardTitle>
              <CardDescription className="text-gray-600 admin-dark:text-gray-400">
                Quản lý tất cả khách hàng đã sử dụng dịch vụ
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative bg-white admin-dark:bg-gray-800 rounded-md shadow-sm text-black admin-dark:text-white">
                <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1); // reset trang khi search thay đổi
                  }}
                  placeholder="Tìm kiếm khách hàng..."
                  className="pl-10 w-64 admin-dark:bg-gray-800 admin-dark:text-white admin-dark:border-gray-600 admin-dark:placeholder-gray-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={changeStatus}>
                <SelectTrigger className="w-40 bg-white admin-dark:bg-gray-800 text-black admin-dark:text-white border border-gray-300 admin-dark:border-gray-600 rounded">
                  <Filter className="h-4 w-4 mr-2 text-black admin-dark:text-white" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent className="bg-white admin-dark:bg-gray-800 admin-dark:border-gray-600 text-black admin-dark:text-white">
                  <SelectItem value="all" className="admin-dark:hover:bg-gray-700">Tất cả</SelectItem>
                  <SelectItem value="new" className="admin-dark:hover:bg-gray-700">Thường</SelectItem>
                  <SelectItem value="vip" className="admin-dark:hover:bg-gray-700">Vip</SelectItem>
                </SelectContent>
              </Select>
              <button
                className="bg-gray-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transform transition-all duration-200 ease-in-out "
                onClick={() => setOpenDialogImportCustomer(true)}
              >
                Nhập dữ liệu khách hàng vào hệ thống
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-black admin-dark:text-white">
          <div className="rounded-md border border-gray-300 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-800 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="admin-dark:border-gray-700">
                  <TableHead className="text-black admin-dark:text-white">Tên khách hàng</TableHead>
                  <TableHead className="text-black admin-dark:text-white">Đã đặt</TableHead>
                  <TableHead className="text-black admin-dark:text-white">Email</TableHead>
                  <TableHead className="text-black admin-dark:text-white">SĐT</TableHead>
                  <TableHead className="text-black admin-dark:text-white">Hoàn thành</TableHead>
                  <TableHead className="text-black admin-dark:text-white">Chi</TableHead>
                  <TableHead className="text-black admin-dark:text-white">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((customer) => (
                  <TableRow key={customer.id} className="admin-dark:border-gray-700 admin-dark:hover:bg-gray-750">
                    <TableCell className="text-black admin-dark:text-white">
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white pl-6">
                      {customer.booking_count || 0}
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white">
                      {customer.email || "Chưa cập nhật"}
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white">
                      {customer.phone || "Chưa cập nhật"}
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white pl-9">
                      {
                        initDataBooking.filter(
                          (c) =>
                            c.customer_id === customer.id &&
                            c.status === "completed"
                        ).length
                      }
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white">
                      {(Number(customer.total_spent || 0)).toLocaleString("vi-VN")} ₫
                    </TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="admin-dark:hover:bg-gray-700 admin-dark:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="admin-dark:bg-gray-800 admin-dark:border-gray-600">
                          <DropdownMenuItem
                            onClick={() => {
                              getFullInforCustomer(customer.id);
                            }}
                            className="admin-dark:text-white admin-dark:hover:bg-gray-700">
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditCustomerForm(customer)}
                            className="admin-dark:text-white admin-dark:hover:bg-gray-700"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="admin-dark:text-white admin-dark:hover:bg-gray-700"
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
                  <TableRow className="admin-dark:border-gray-700">
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500 admin-dark:text-gray-400">
                      Không tìm thấy khách hàng
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
              className="text-white admin-dark:text-gray-300 disabled:opacity-50 border-gray-300 admin-dark:border-gray-600 admin-dark:bg-gray-800 admin-dark:hover:bg-gray-700"
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 ${currentPage === i + 1
                  ? "bg-blue-600 text-white hover:bg-blue-700 admin-dark:bg-blue-700 admin-dark:hover:bg-blue-800"
                  : "bg-white admin-dark:bg-gray-800 text-gray-700 admin-dark:text-gray-300 border border-gray-300 admin-dark:border-gray-600 hover:bg-gray-100 admin-dark:hover:bg-gray-700"
                  }`}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="text-white admin-dark:text-gray-300 disabled:opacity-50 border-gray-300 admin-dark:border-gray-600 admin-dark:bg-gray-800 admin-dark:hover:bg-gray-700"
            >
              Sau
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* /* Component Upload Excel */}

      {openDialogImportCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white admin-dark:bg-gray-900 rounded-lg shadow-2xl p-8 min-w-[350px] max-w-[90vw] w-full flex flex-col items-center">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 admin-dark:text-gray-400 admin-dark:hover:text-white text-xl font-bold"
              onClick={() => setOpenDialogImportCustomer(false)}
              aria-label="Đóng"
            >
              &times;
            </button>
            <h2 className="mb-4 text-lg font-semibold text-gray-800 admin-dark:text-white">Nhập dữ liệu khách hàng từ Excel</h2>
            <ExcelDataUploader />
          </div>
        </div>
      )}

      {/* open dialog read full information of user */}
      {openReadInforCustomer && (
        <div className="fixed inset-0 admin-dark:bg-black flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-3xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setOpenReadInforCustomer(false)}
            >
              &times;
            </button>

            {loadingCustomer ? (
              <div className="text-center py-10">Đang tải dữ liệu...</div>
            ) : customerDetail ? (
              <ReadInforCustomer data={customerDetail} />
            ) : (
              <div className="text-center py-10 text-red-500">Không tìm thấy dữ liệu</div>
            )}
          </div>
        </div>
      )}


    </div>
  );
}

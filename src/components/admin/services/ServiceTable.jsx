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
import { useNavigate, useOutletContext } from "react-router-dom";
import WarningMessage from "./utils/warningMessage";
import TableRowActions from "@/pages/managers/service/TableRowActions";
import TrashService from "./TrashService"; // Import the new TrashService component
import ConfirmationModal from "@/components/shared/ConfirmationModal"; // Import ConfirmationModal
import { toast } from "sonner"; // Import toast for notifications

export default function ServiceTable() {
  const navigate = useNavigate();

  const {
    initDataService,
    openEditServiceForm,
    handleDeleteService,
    handleRefetchService,
    loadingStates,
    errorStates,
    mutationStates,
  } = useOutletContext(); // Lấy dữ liệu và hàm từ context cha: src\pages\managers\ServicesPage.jsx

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // số dịch vụ trên 1 trang

  const [isDeleteShow, setIsDeleteShow] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState(null);

  const handleDeleteClick = (serviceId) => {
    if (checkBookingBeforDelete(serviceId)) {
      setServiceToDeleteId(serviceId);
      setShowConfirmDeleteDialog(true);
    }
  };

  const confirmDelete = async () => {
    setShowConfirmDeleteDialog(false);
    if (serviceToDeleteId) {
      try {
        await handleDeleteService(serviceToDeleteId); // Use the existing handleDeleteService from context
        toast.success("Xóa dịch vụ thành công!");
        handleRefetchService(); // Refresh the main service list
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error("Xóa dịch vụ thất bại.");
      } finally {
        setServiceToDeleteId(null);
      }
    }
  };

  // Hàm bỏ dấu tiếng Việt
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // tách ký tự base và dấu
      .replace(/[\u0300-\u036f]/g, "") // xóa dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D"); // thay đ/Đ
  };

  // Lọc theo search
  const filteredService = Array.isArray(initDataService)
    ? initDataService.filter((service) => {
        const keyword = removeVietnameseTones(search.toLowerCase());
        const serviceName = removeVietnameseTones(
          (service.translation?.ten_dich_vu || "").toLowerCase()
        );

        return serviceName.includes(keyword);
      })
    : [];

  const totalPages = Math.ceil(filteredService.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredService.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleReaderDetailService = (slug) => {
    navigate(`/managers/services/read-detail/${slug}`);
  };

  const checkBookingBeforDelete = async (serviceId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/services/${serviceId}/bookings`
      );

      const data = await res.json();

      if (data.success) {
        if (data.data.length > 0) {
          console.log(data.data);
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      className="bg-gray-100 rounded-xl border border-gray-300 shadow-sm
        admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
    >
      <CardHeader className="px-2 sm:px-3 md:px-4">
        <div className="flex flex-col sm:flex-col md:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4">
          <div className="">
            <CardTitle className="text-sm sm:text-lg md:text-start font-bold text-gray-900 admin-dark:text-gray-100">
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

      <CardContent className="px-2 sm:px-3 md:px-4 text-black admin-dark:text-gray-200">
        <div
          className="rounded-md border border-gray-300 bg-white shadow-sm
            admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50
            w-full overflow-x-auto"
        >
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
            <Table className="w-full text-sm text-gray-700 dark:text-gray-300">
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <TableHead className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-gray-800 dark:text-gray-200">
                    STT
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left">
                    Hình ảnh
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left">
                    Tên dịch vụ
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left">Mô tả</TableHead>
                  <TableHead className="px-4 py-3 text-center">Giá</TableHead>
                  <TableHead className="px-4 py-3 text-center">Đặt</TableHead>
                  <TableHead className="px-4 py-3 text-center">
                    Ngôn ngữ
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center">
                    Trạng thái
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((item, i) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <TableCell className="px-4 py-2 text-center">
                        {i + 1}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <img
                          src={
                            item.image_url?.startsWith("http")
                              ? item.image_url
                              : `${import.meta.env.VITE_MAIN_BE_URL}${
                                  item.image_url
                                }`
                          }
                          alt={item.translation?.ten_dich_vu || "Service image"}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop if fallback also fails
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCAxMDAgODAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
                          }}
                          className="w-14 h-10 rounded-md object-cover border border-gray-200 dark:border-gray-700"
                        />
                      </TableCell>
                      <TableCell
                        onClick={() =>
                          handleReaderDetailService(item.translation?.slug)
                        }
                        className="px-4 py-2 font-medium truncate max-w-[200px] cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {item.translation?.ten_dich_vu || "Chưa có TV"}
                      </TableCell>
                      <TableCell className="px-4 py-2 truncate max-w-[250px]">
                        {item.translation?.mo_ta || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-center">
                        {item.floor_price
                          ? `₫${Number(item.floor_price).toLocaleString()}`
                          : ""}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-center">
                        {item.booking_count ?? ""}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {item.totalLanguages.map((lang) => (
                            <span
                              key={lang}
                              className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${
                                lang === "vi" ? "bg-red-600" : "bg-blue-600"
                              }`}
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-center">
                        <Badge
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            item.status === "Active"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                          }`}
                        >
                          {item.status === "Active" ? "Hoạt động" : "Tắt"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-center">
                        <TableRowActions
                          actions={[
                            {
                              label: "Cập nhật",
                              icon: Edit,
                              onClick: () => openEditServiceForm(item),
                            },
                            {
                              label: "Xóa",
                              icon: Trash2,
                              onClick: () => handleDeleteClick(item.id),
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Pagination */}
        <div className="flex xs:flex-col lg:flex-row justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDeleteShow(true)}
              type="button"
              className="flex items-center space-x-2 text-gray-700 admin-dark:text-gray-300 cursor-pointer"
            >
              <span className="transition-all duration-300 text-sm lg:text-base text-gray-700 admin-dark:text-gray-300 hover:text-blue-500 hover:scale-105 font-semibold admin-dark:hover:text-yellow-400 gap-2 flex flex-row items-center rounded-md bg-gray-200 admin-dark:bg-gray-700 p-1">
                <Trash2 />
              </span>
            </button>
          </div>
          <WarningMessage />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </CardContent>

      {/* Modal hiển thị dịch vụ đã xóa */}
      {isDeleteShow && (
        <TrashService
          setIsDeleteShow={setIsDeleteShow}
          handleRefetchService={handleRefetchService}
        />
      )}

      {/* Delete Confirmation Custom Modal */}
      {showConfirmDeleteDialog && (
        <ConfirmationModal
          isOpen={showConfirmDeleteDialog}
          onClose={() => {
            setShowConfirmDeleteDialog(false);
            setServiceToDeleteId(null);
          }}
          onConfirm={confirmDelete}
          title="Xác nhận xóa dịch vụ"
          message="Bạn có chắc chắn muốn xóa dịch vụ này không? Hành động này sẽ chuyển dịch vụ vào thùng rác."
        />
      )}
    </Card>
  );
}

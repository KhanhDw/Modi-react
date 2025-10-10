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
        `${import.meta.env.VITE_MAIN_BE_URL
        }/api/services/${serviceId}/bookings`,
        {
          method: "GET",
        }
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
                    <TableCell
                      className={`text-gray-900 admin-dark:text-gray-200  `}
                    >
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>
                      {item.image_url ? (
                        <img
                          src={`${import.meta.env.VITE_MAIN_BE_URL}${item.image_url
                            }`}
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

                    <TableCell
                      onClick={() =>
                        handleReaderDetailService(item.translation?.slug)
                      }
                      className={`${!item.totalLanguages.includes("vi")
                        ? "text-red-400"
                        : "text-gray-900 admin-dark:text-gray-200"
                        } hover:bg-slate-200 admin-dark:hover:bg-slate-700 cursor-pointer`}
                    >
                      {item.translation?.ten_dich_vu ||
                        "Chưa có thông tin tiếng việt"}
                    </TableCell>
                    <TableCell
                      className={`${!item.totalLanguages.includes("vi")
                        ? "text-red-400"
                        : "text-gray-900 admin-dark:text-gray-200"
                        }  `}
                    >
                      {item.translation?.mo_ta ||
                        "Chưa có thông tin tiếng việt"}
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
                    <TableCell className="text-gray-900 admin-dark:text-gray-200 flex-col items-center justify-center">
                      <div className="flex flex-wrap justify-center gap-1 text-center">
                        {item.totalLanguages.map((lang, index) => {
                          return (
                            <span
                              key={`${lang}-${index}`}
                              className={`${lang === "vi" ? "bg-red-700" : "bg-blue-600"
                                } px-2 py-1 text-xs text-white rounded`}
                            >
                              {lang}
                            </span>
                          );
                        }) || ""}
                      </div>
                    </TableCell>
                    <TableCell className={`text-center`}>
                      <Badge className="bg-green-600 px-2 py-1 rounded text-white admin-dark:bg-green-500">
                        {item.status === "Active"
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
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
                );
              })}
              {currentData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground py-4"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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

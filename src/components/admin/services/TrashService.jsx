import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Undo, Eye, X } from "lucide-react";
import useLenisLocal from "@/hook/useLenisLocal";
import { useOutletContext } from "react-router-dom";
import Pagination from "@/components/admin/services/utils/Pagination.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

export default function TrashService({
  setIsDeleteShow,
  handleRefetchService,
}) {
  useLenisLocal(".lenis-local");
  const [deletedServices, setDeletedServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [needsRefetchOnClose, setNeedsRefetchOnClose] = useState(false);

  const [openReadInforService, setOpenReadInforService] = useState(false);
  const [serviceDetail, setServiceDetail] = useState(null);
  const [loadingService, setLoadingService] = useState(false);

  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
  const [serviceToRestore, setServiceToRestore] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const handleClose = () => {
    if (needsRefetchOnClose) {
      handleRefetchService();
    }
    setIsDeleteShow(false);
  };

  const fetchDeletedServices = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/services/inactive`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch deleted services");
      }
      const data = await response.json();
      setDeletedServices(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching deleted services:", error);
      toast.error("Không thể tải danh sách dịch vụ đã xóa.");
    }
  };

  useEffect(() => {
    fetchDeletedServices();
  }, []);

  const handleRestoreService = (id) => {
    setServiceToRestore(id);
    setShowRestoreConfirmModal(true);
  };

  const confirmRestore = async () => {
    setShowRestoreConfirmModal(false);
    if (!serviceToRestore) return;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/services/${serviceToRestore}/restore`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to restore service");
      }
      toast.success("Khôi phục dịch vụ thành công!");
      setNeedsRefetchOnClose(true);
      fetchDeletedServices(); // Refresh the list
    } catch (error) {
      console.error("Error restoring service:", error);
      toast.error("Khôi phục dịch vụ thất bại.");
    } finally {
      setServiceToRestore(null);
    }
  };

  const handleForceDeleteService = (id) => {
    setServiceToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmModal(false);
    if (!serviceToDelete) return;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/services/${serviceToDelete}/hard`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to permanently delete service");
      }
      toast.success("Xóa vĩnh viễn dịch vụ thành công!");
      fetchDeletedServices(); // Refresh the list
    } catch (error) {
      console.error("Error permanently deleting service:", error);
      toast.error("Xóa vĩnh viễn dịch vụ thất bại.");
    } finally {
      setServiceToDelete(null);
    }
  };

  const filteredServices = useMemo(() => {
    const filtered = deletedServices.filter((service) => {
      const keyword = searchTerm.toLowerCase();
      return (
        (service.translation?.ten_dich_vu?.toLowerCase() || "").includes(
          keyword
        ) || (service.status?.toLowerCase() || "").includes(keyword)
      );
    });
    return filtered;
  }, [deletedServices, searchTerm]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredServices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div
      className="fixed w-full bg-black/70 inset-0 z-50 flex items-center justify-center px-3 sm:px-5"
      onClick={handleClose}
    >
      <Card
        className="bg-white admin-dark:bg-gray-800 w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="w-full flex flex-col md:flex-row gap-5 items-center justify-between">
            <div>
              <CardTitle className="admin-dark:text-white">
                Thùng rác: Dịch vụ
              </CardTitle>
              <CardDescription className="admin-dark:text-gray-400 mt-2">
                Những dịch vụ đã bị xóa. Bạn có thể khôi phục hoặc xóa vĩnh
                viễn.
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-[10px] h-4 w-4 admin-dark:text-gray-200 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm kiếm theo tên dịch vụ, trạng thái..."
                className="pl-10 w-64 admin-dark:bg-gray-700 admin-dark:text-white placeholder:text-sm placeholder:md:text-base
                text-gray-700"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto">
          <div className="rounded-md border border-gray-300 admin-dark:border-gray-700">
            <Table>
              <TableHeader className={"bg-gray-100 admin-dark:bg-gray-700"}>
                <TableRow className="admin-dark:border-gray-700 grid grid-cols-8 items-center">
                  <TableHead className="text-black admin-dark:text-white col-span-1 flex items-center">
                    STT
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white col-span-6 flex items-center">
                    Tên dịch vụ
                  </TableHead>
                  {/* <TableHead className="text-black admin-dark:text-white">
                    Trạng thái
                  </TableHead> */}
                  <TableHead className="text-black admin-dark:text-white col-span-1  flex items-center justify-center">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((service, index) => (
                    <TableRow
                      key={service.id}
                      className="admin-dark:border-gray-700 grid grid-cols-8  hover:bg-gray-100/10 items-center"
                    >
                      <TableCell className="admin-dark:text-white col-span-1">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="admin-dark:text-white col-span-6 whitespace-break-spaces">
                        {service.translation?.ten_dich_vu ||
                          "Không có thông tin tiếng việt"}
                      </TableCell>
                      {/* <TableCell className="admin-dark:text-white">
                        {service.status}
                      </TableCell> */}
                      <TableCell className="flex items-center space-x-2 col-span-1 justify-center">
                        <button
                          onClick={() => handleRestoreService(service.id)}
                          className="p-2 text-green-500 hover:text-green-700 cursor-pointer"
                          title="Khôi phục"
                        >
                          <Undo size={18} />
                        </button>
                        <button
                          onClick={() => handleForceDeleteService(service.id)}
                          className="p-2 text-red-500 hover:text-red-700 cursor-pointer"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 size={18} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-4 text-gray-500 admin-dark:text-gray-400"
                    >
                      Thùng rác trống
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="p-4 border-gray-300 admin-dark:border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </Card>

      {/* Modal hiển thị thông tin chi tiết dịch vụ */}
      {openReadInforService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 admin-dark:bg-black/60 px-3 sm:px-5 md:px-8"
          onClick={() => {
            setOpenReadInforService(false);
            setServiceDetail(null);
            setLoadingService(false);
          }}
        >
          <div
            className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl
               bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700
               p-3 sm:p-4 transition-all duration-300 scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng */}
            <button
              onClick={() => {
                setOpenReadInforService(false);
                setServiceDetail(null);
                setLoadingService(false);
              }}
              className="absolute top-1 sm:top-3 right-3 flex items-center justify-center
             w-9 h-9 rounded-full border border-gray-300 bg-white/80 text-gray-600
             hover:bg-gray-100 hover:text-gray-900 hover:shadow-md
             admin-dark:border-gray-600 admin-dark:bg-gray-800 admin-dark:text-gray-300
             admin-dark:hover:bg-gray-700 admin-dark:hover:text-white
             transition-all duration-200 cursor-pointer backdrop-blur-sm z-50"
              aria-label="Đóng"
            >
              <X
                className="h-5 w-5"
                strokeWidth={2.2}
              />
            </button>

            {/* Nội dung */}
            {(() => {
              if (loadingService) {
                return (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-700 admin-dark:text-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 admin-dark:border-gray-300"></div>
                    <p className="mt-4 text-sm font-medium">
                      Đang tải dữ liệu...
                    </p>
                  </div>
                );
              } else if (serviceDetail) {
                // Placeholder for service detail display
                return <p>Service Detail: {serviceDetail.id}</p>;
              } else {
                return (
                  <div className="text-center py-10 text-red-600 admin-dark:text-red-400 font-medium">
                    Không tìm thấy dữ liệu hoặc có lỗi xảy ra
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Restore */}
      {showRestoreConfirmModal && (
        <ConfirmationModal
          isOpen={showRestoreConfirmModal}
          onClose={() => setShowRestoreConfirmModal(false)}
          onConfirm={confirmRestore}
          title="Xác nhận khôi phục dịch vụ"
          message="Bạn có chắc chắn muốn khôi phục dịch vụ này không?"
        />
      )}

      {/* Confirmation Modal for Delete */}
      {showDeleteConfirmModal && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={() => setShowDeleteConfirmModal(false)}
          onConfirm={confirmDelete}
          title="Xác nhận xóa vĩnh viễn dịch vụ"
          message="Bạn có chắc chắn muốn xóa vĩnh viễn dịch vụ này không? Hành động này không thể hoàn tác."
        />
      )}
    </div>
  );
}

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
import ReadInforCustomer from "./readInforCustomer";
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

function TrashCustomer({ setIsDeleteShow, handleRefetchCustomer }) {
  useLenisLocal(".lenis-local");
  const [deletedCustomers, setDeletedCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [openReadInforCustomer, setOpenReadInforCustomer] = useState(false);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
  const [customerToRestore, setCustomerToRestore] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const fetchDeletedCustomers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/customers/inactive`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch deleted customers");
      }
      const data = await response.json();
      setDeletedCustomers(data);
    } catch (error) {
      console.error("Error fetching deleted customers:", error);
      toast.error("Không thể tải danh sách khách hàng đã xóa.");
    }
  };

  const getFullInforCustomer = async (id) => {
    try {
      setLoadingCustomer(true);
      setCustomerDetail(null);
      setOpenReadInforCustomer(false);

      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/customers/${id}/full`
      );

      if (!res.ok) throw new Error("Không thể lấy dữ liệu khách hàng");

      const data = await res.json();

      setCustomerDetail(data);
      setOpenReadInforCustomer(true);
    } catch (err) {
      console.error("Error fetching customer details:", err);
      setCustomerDetail(null);
    } finally {
      setLoadingCustomer(false);
    }
  };

  useEffect(() => {
    fetchDeletedCustomers();
  }, []);

  const handleRestoreCustomer = (id) => {
    setCustomerToRestore(id);
    setShowRestoreConfirmModal(true);
  };

  const confirmRestore = async () => {
    setShowRestoreConfirmModal(false);
    if (!customerToRestore) return;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/customers/${customerToRestore}/restore`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to restore customer");
      }
      toast.success("Khôi phục khách hàng thành công!");
      fetchDeletedCustomers(); // Refresh the list
      handleRefetchCustomer(); // Refresh the main customer list
    } catch (error) {
      console.error("Error restoring customer:", error);
      toast.error("Khôi phục khách hàng thất bại.");
    } finally {
      setCustomerToRestore(null);
    }
  };

  const handleForceDeleteCustomer = (id) => {
    setCustomerToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmModal(false);
    if (!customerToDelete) return;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/customers/${customerToDelete}/hard`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to permanently delete customer");
      }
      toast.success("Xóa vĩnh viễn khách hàng thành công!");
      fetchDeletedCustomers(); // Refresh the list
    } catch (error) {
      console.error("Error permanently deleting customer:", error);
      toast.error("Xóa vĩnh viễn khách hàng thất bại.");
    } finally {
      setCustomerToDelete(null);
    }
  };

  const filteredCustomers = useMemo(() => {
    return deletedCustomers.filter((customer) => {
      const keyword = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(keyword) ||
        (customer.email && customer.email.toLowerCase().includes(keyword)) ||
        (customer.phone && customer.phone.includes(keyword)) ||
        (customer.cccd && customer.cccd.includes(keyword))
      );
    });
  }, [deletedCustomers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div
      className="fixed w-full bg-black/70 inset-0 z-50 flex items-center justify-center"
      onClick={() => setIsDeleteShow(false)}
    >
      <Card
        className="bg-white admin-dark:bg-gray-800 w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="admin-dark:text-white">
                Thùng rác: Khách hàng
              </CardTitle>
              <CardDescription className="admin-dark:text-gray-400">
                Những khách hàng đã bị xóa. Bạn có thể khôi phục hoặc xóa vĩnh
                viễn.
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm kiếm theo tên, email, sđt, cccd..."
                className="pl-10 w-64 admin-dark:bg-gray-700 admin-dark:text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto">
          <div className="rounded-md border admin-dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="admin-dark:border-gray-700">
                  <TableHead className="text-black admin-dark:text-white">
                    STT
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Tên khách hàng
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Email
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    SĐT
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Số CCCD
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((customer, index) => (
                    <TableRow
                      key={customer.id}
                      className="admin-dark:border-gray-700"
                    >
                      <TableCell className="admin-dark:text-white">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="admin-dark:text-white">
                        {customer.name}
                      </TableCell>
                      <TableCell className="admin-dark:text-white">
                        {customer.email || "N/A"}
                      </TableCell>
                      <TableCell className="admin-dark:text-white">
                        {customer.phone || "N/A"}
                      </TableCell>
                      <TableCell className="admin-dark:text-white">
                        {customer.cccd || "N/A"}
                      </TableCell>
                      <TableCell className="flex items-center space-x-2">
                        <button
                          onClick={() => getFullInforCustomer(customer.id)}
                          className="p-2 text-blue-500 hover:text-blue-700"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleRestoreCustomer(customer.id)}
                          className="p-2 text-green-500 hover:text-green-700"
                          title="Khôi phục"
                        >
                          <Undo size={18} />
                        </button>
                        <button
                          onClick={() => handleForceDeleteCustomer(customer.id)}
                          className="p-2 text-red-500 hover:text-red-700"
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
                      colSpan={6}
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
        <div className="p-4 border-t admin-dark:border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </Card>

      {/* Modal hiển thị thông tin chi tiết khách hàng */}
      {openReadInforCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 admin-dark:bg-black/60 px-3 sm:px-5 md:px-8"
          onClick={() => {
            setOpenReadInforCustomer(false);
            setCustomerDetail(null);
            setLoadingCustomer(false);
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
                setOpenReadInforCustomer(false);
                setCustomerDetail(null);
                setLoadingCustomer(false);
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
              if (loadingCustomer) {
                return (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-700 admin-dark:text-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 admin-dark:border-gray-300"></div>
                    <p className="mt-4 text-sm font-medium">
                      Đang tải dữ liệu...
                    </p>
                  </div>
                );
              } else if (customerDetail) {
                return <ReadInforCustomer data={customerDetail} />;
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
          title="Xác nhận khôi phục khách hàng"
          message="Bạn có chắc chắn muốn khôi phục khách hàng này không?"
        />
      )}

      {/* Confirmation Modal for Delete */}
      {showDeleteConfirmModal && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={() => setShowDeleteConfirmModal(false)}
          onConfirm={confirmDelete}
          title="Xác nhận xóa vĩnh viễn khách hàng"
          message="Bạn có chắc chắn muốn xóa vĩnh viễn khách hàng này không? Hành động này không thể hoàn tác."
        />
      )}
    </div>
  );
}

export default TrashCustomer;

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

export default function TrashBooking({
  setIsDeleteShow,
  handleRefetchBooking,
}) {
  useLenisLocal(".lenis-local");
  const [deletedBookings, setDeletedBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [needsRefetchOnClose, setNeedsRefetchOnClose] = useState(false);

  const [openReadInforBooking, setOpenReadInforBooking] = useState(false); // Assuming a ReadInforBooking component might exist or be created
  const [bookingDetail, setBookingDetail] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(false);

  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
  const [bookingToRestore, setBookingToRestore] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const handleClose = () => {
    if (needsRefetchOnClose) {
      handleRefetchBooking();
    }
    setIsDeleteShow(false);
  };

  const fetchDeletedBookings = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/bookings/inactive`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch deleted bookings");
      }
      const data = await response.json();
      setDeletedBookings(data);
    } catch (error) {
      console.error("Error fetching deleted bookings:", error);
      toast.error("Không thể tải danh sách đơn đặt đã xóa.");
    }
  };

  // Placeholder for getFullInforBooking - assuming a similar structure to customers
  const getFullInforBooking = async (id) => {
    try {
      setLoadingBooking(true);
      setBookingDetail(null);
      setOpenReadInforBooking(false);

      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/bookings/${id}/full`
      );

      if (!res.ok) throw new Error("Không thể lấy dữ liệu đơn đặt");

      const data = await res.json();

      setBookingDetail(data);
      setOpenReadInforBooking(true);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setBookingDetail(null);
    } finally {
      setLoadingBooking(false);
    }
  };

  useEffect(() => {
    fetchDeletedBookings();
  }, []);

  const handleRestoreBooking = (id) => {
    setBookingToRestore(id);
    setShowRestoreConfirmModal(true);
  };

  const confirmRestore = async () => {
    setShowRestoreConfirmModal(false);
    if (!bookingToRestore) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL
        }/api/bookings/${bookingToRestore}/restore`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to restore booking");
      }
      toast.success("Khôi phục đơn đặt thành công!");
      setNeedsRefetchOnClose(true);
      fetchDeletedBookings(); // Refresh the list
    } catch (error) {
      console.error("Error restoring booking:", error);
      toast.error("Khôi phục đơn đặt thất bại.");
    } finally {
      setBookingToRestore(null);
    }
  };

  const handleForceDeleteBooking = (id) => {
    setBookingToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmModal(false);
    if (!bookingToDelete) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL
        }/api/bookings/${bookingToDelete}/hard`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to permanently delete booking");
      }
      toast.success("Xóa vĩnh viễn đơn đặt thành công!");
      fetchDeletedBookings(); // Refresh the list
    } catch (error) {
      console.error("Error permanently deleting booking:", error);
      toast.error("Xóa vĩnh viễn đơn đặt thất bại.");
    } finally {
      setBookingToDelete(null);
    }
  };

  const filteredBookings = useMemo(() => {
    const filtered = deletedBookings.filter((booking) => {
      const keyword = searchTerm.toLowerCase();
      return (
        (booking.customer_name?.toLowerCase() || "").includes(keyword) ||
        (booking.service_name?.toLowerCase() || "").includes(keyword) ||
        (booking.status?.toLowerCase() || "").includes(keyword)
      );
    });
    return filtered;
  }, [deletedBookings, searchTerm]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredBookings.slice(
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
                Thùng rác: Đơn đặt dịch vụ
              </CardTitle>
              <CardDescription className="admin-dark:text-gray-400 mt-2">
                Những đơn đặt dịch vụ đã bị xóa. Bạn có thể khôi phục hoặc xóa
                vĩnh viễn.
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
                placeholder="Tìm kiếm theo tên khách hàng, dịch vụ, trạng thái..."
                className="pl-10 w-64 admin-dark:bg-gray-700 admin-dark:text-white placeholder:text-sm placeholder:md:text-base"
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
                    Tên dịch vụ
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Trạng thái
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Ngày đặt
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((booking, index) => (
                    <TableRow
                      key={booking.id}
                      className="admin-dark:border-gray-700"
                    >
                      <TableCell className="admin-dark:text-white">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="admin-dark:text-white">
                        {booking.customer_name}
                      </TableCell>
                      <TableCell className="admin-dark:text-white">
                        {booking.service_name}
                      </TableCell>
                      <TableCell className="admin-dark:text-white">
                        {booking.status}
                      </TableCell>
                      <TableCell className="admin-dark:text-white">
                        {new Date(booking.booking_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </TableCell>
                      <TableCell className="flex items-center space-x-2">
                        <button
                          onClick={() => getFullInforBooking(booking.id)}
                          className="p-2 text-blue-500 hover:text-blue-700 cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleRestoreBooking(booking.id)}
                          className="p-2 text-green-500 hover:text-green-700 cursor-pointer"
                          title="Khôi phục"
                        >
                          <Undo size={18} />
                        </button>
                        <button
                          onClick={() => handleForceDeleteBooking(booking.id)}
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

      {/* Modal hiển thị thông tin chi tiết đơn đặt */}
      {openReadInforBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 admin-dark:bg-black/60 px-3 sm:px-5 md:px-8"
          onClick={() => {
            setOpenReadInforBooking(false);
            setBookingDetail(null);
            setLoadingBooking(false);
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
                setOpenReadInforBooking(false);
                setBookingDetail(null);
                setLoadingBooking(false);
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
              if (loadingBooking) {
                return (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-700 admin-dark:text-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 admin-dark:border-gray-300"></div>
                    <p className="mt-4 text-sm font-medium">
                      Đang tải dữ liệu...
                    </p>
                  </div>
                );
              } else if (bookingDetail) {
                // Assuming a ReadInforBooking component exists
                return <p>Booking Detail: {bookingDetail.id}</p>; // Placeholder
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
          title="Xác nhận khôi phục đơn đặt"
          message="Bạn có chắc chắn muốn khôi phục đơn đặt này không?"
        />
      )}

      {/* Confirmation Modal for Delete */}
      {showDeleteConfirmModal && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={() => setShowDeleteConfirmModal(false)}
          onConfirm={confirmDelete}
          title="Xác nhận xóa vĩnh viễn đơn đặt"
          message="Bạn có chắc chắn muốn xóa vĩnh viễn đơn đặt này không? Hành động này không thể hoàn tác."
        />
      )}
    </div>
  );
}

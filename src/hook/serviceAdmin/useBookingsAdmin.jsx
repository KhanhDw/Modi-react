// src/hook/serviceAdmin/useBookingsAdmin.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingAPI } from "@/api/bookingAPI";

export const useBookingsAdmin = ({ onBookingChange }) => {
  const queryClient = useQueryClient();

  // Query để fetch bookings
  const {
    data: bookings = [],
    isLoading: loadingBookings,
    error: bookingsError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch(BookingAPI.getALL());
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // Query để fetch all bookings (deleted và non-deleted)
  const {
    data: bookingsAll = [],
    isLoading: loadingBookingsAll,
    error: bookingsAllError,
  } = useQuery({
    queryKey: ["bookings", "all"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/bookings/all`
      );
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // Mutation để tạo booking mới
  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const dataBooking = {
        name: formData.cusName,
        phone: formData.cusPhone,
        email: formData.cusEmail,
        address: formData.cusAddress,
        cccd: formData.cccd,
        number_bank: formData.bankAccount,
        name_bank: formData.bankName,
        service: formData.service,
        price: formData.price,
        bookingDate: formData.bookingDate,
        completedDate: formData.completedDate,
      };

      const res = await fetch(BookingAPI.create(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataBooking),
      });

      if (!res.ok) {
        throw new Error("Error when try to create new booking");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate cả hai queries
      queryClient.invalidateQueries(["bookings"]);
      queryClient.invalidateQueries(["bookings", "all"]);
      localStorage.setItem("customerDataUpdated", Date.now());
      onBookingChange?.();
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
    },
  });

  // Mutation để update booking
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const dataEditBooking = {
        status: formData.status,
        service: formData.service,
        price: formData.price,
        bookingDate: formData.bookingDate,
        completedDate: formData.completedDate,
      };

      const res = await fetch(BookingAPI.edit(id), {
        method: "PUT",
        body: JSON.stringify(dataEditBooking),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Error when edit booking data");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      queryClient.invalidateQueries(["bookings", "all"]);
    },
    onError: (error) => {
      console.error("Error updating booking:", error);
    },
  });

  // Mutation để delete booking
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(BookingAPI.delete(id), {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error when delete booking");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      queryClient.invalidateQueries(["bookings", "all"]);
    },
    onError: (error) => {
      console.error("Error deleting booking:", error);
    },
  });

  return {
    bookings,
    bookingsAll,
    editingBooking: null, // Quản lý trong component nếu cần
    setEditingBooking: () => {}, // Placeholder
    loadingBookings,
    loadingBookingsAll,
    handleCreateBooking: (formData, handleClose) => {
      createMutation.mutate(formData, {
        onSuccess: () => handleClose?.(),
      });
    },
    handleEditingBooking: (formData, id, handleClose) => {
      updateMutation.mutate(
        { id, formData },
        {
          onSuccess: () => handleClose?.(),
        }
      );
    },
    handleDeleteBooking: (id, showToast) => {
      deleteMutation.mutate(id, {
        onSuccess: () => showToast?.("Xóa đơn đặt thành công!", "success"),
        onError: () => showToast?.("Đã xảy ra lỗi khi xóa đơn đặt.", "error"),
      });
    },
    handleRefetchBooking: () => {
      queryClient.invalidateQueries(["bookings"]);
      queryClient.invalidateQueries(["bookings", "all"]);
    },

    // Thêm states mutation cho UI
    isCreatingBooking: createMutation.isPending,
    isUpdatingBooking: updateMutation.isPending,
    isDeletingBooking: deleteMutation.isPending,

    // Error states
    bookingsError, // Error từ bookings query
    bookingsAllError, // Error từ bookingsAll query
    createBookingError: createMutation.error,
    updateBookingError: updateMutation.error,
    deleteBookingError: deleteMutation.error,
  };
};

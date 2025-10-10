import { useState, useEffect, useCallback } from "react";
import { BookingAPI } from "@/api/bookingAPI";

export const useBookingsAdmin = ({ onBookingChange }) => {
  const [bookings, setBookings] = useState([]);
  const [bookingsAll, setBookingsAll] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingBookingsAll, setLoadingBookingsAll] = useState(true);

  const fetchBooking = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch(BookingAPI.getALL());
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error when try get booking data:", err);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  const fetchBookingAlldeteletAndNodelete = useCallback(async () => {
    setLoadingBookingsAll(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/bookings/all`
      );
      const data = await res.json();
      setBookingsAll(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error when try get booking data:", err);
    } finally {
      setLoadingBookingsAll(false);
    }
  }, []);

  useEffect(() => {
    fetchBooking();
    fetchBookingAlldeteletAndNodelete();
  }, [fetchBooking, fetchBookingAlldeteletAndNodelete]);

  const handleCreateBooking = async (formData, handleClose) => {
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

    try {
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

      localStorage.setItem("customerDataUpdated", Date.now());
      await Promise.all([fetchBooking(), onBookingChange()]);
      handleClose();
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const handleEditingBooking = async (formData, id, handleClose) => {
    try {
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

      await fetchBooking();
      handleClose();
    } catch (err) {
      console.error("ERROR: ", err);
    }
  };

  const handleDeleteBooking = async (id, showToast) => {
    try {
      const res = await fetch(BookingAPI.delete(id), {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error when delete booking");
      }
      showToast("Xóa đơn đặt thành công!", "success");
      await fetchBooking();
    } catch (err) {
      console.log("Error: ", err);
      showToast("Đã xảy ra lỗi khi xóa đơn đặt.", "error");
    }
  };

  return {
    bookings,
    bookingsAll,
    editingBooking,
    setEditingBooking,
    loadingBookings,
    loadingBookingsAll,
    handleCreateBooking,
    handleEditingBooking,
    handleDeleteBooking,
    handleRefetchBooking: fetchBooking,
  };
};

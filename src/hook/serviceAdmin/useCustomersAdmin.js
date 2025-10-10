import { useState, useEffect, useCallback } from "react";
import { CustomerAPI } from "@/api/customerAPI";

export const useCustomersAdmin = ({ bookings, onCustomerChange, showToast }) => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const fetchCustomer = useCallback(async () => {
    setLoadingCustomers(true);
    try {
      const res = await fetch(CustomerAPI.getALL());
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error when try get customer data:", err);
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const handleEditingCustomer = async (formData, id, handleClose) => {
    try {
      const res = await fetch(CustomerAPI.edit(id), {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error when trying to update customer");
      }
      if (res.ok) {
        await fetchCustomer();
        await onCustomerChange(); // Refetch bookings
        handleClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCustomer = async (id) => {
    const customerBookings = bookings.filter(
      (booking) => booking.customer_id === id
    );
    if (customerBookings.length > 0) {
      showToast("Không thể xóa khách hàng vì đang có dịch vụ đã đặt.", "error");
      return false;
    }

    try {
      const res = await fetch(CustomerAPI.delete(id), {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Error when trying to delete customer");
      }
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      showToast("Xóa khách hàng thành công!", "success");
      return true;
    } catch (err) {
      console.error(err);
      showToast("Đã xảy ra lỗi khi xóa khách hàng.", "error");
      return false;
    }
  };

  const handleGetBookingForCustomerId = (customerId) => {
    const customerBookings = bookings.filter(
      (booking) => booking.customer_id === customerId
    );
    return customerBookings.length > 0;
  };

  return {
    customers,
    editingCustomer,
    setEditingCustomer,
    loadingCustomers,
    handleEditingCustomer,
    handleDeleteCustomer,
    handleGetBookingForCustomerId,
    handleRefetchCustomer: fetchCustomer,
  };
};

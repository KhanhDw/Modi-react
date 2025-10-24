// src/hook/serviceAdmin/useCustomersAdmin.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomerAPI } from "@/api/customerAPI";

export const useCustomersAdmin = ({
  bookings,
  onCustomerChange,
  showToast,
}) => {
  const queryClient = useQueryClient();

  // Query để fetch customers
  const {
    data: customers = [],
    isLoading: loadingCustomers,
    error: customersError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch(CustomerAPI.getALL());
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // Mutation để update customer
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await fetch(CustomerAPI.edit(id), {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error when trying to update customer");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      onCustomerChange?.(); // Refetch bookings
    },
    onError: (error) => {
      console.error("Error updating customer:", error);
    },
  });

  // Mutation để delete customer
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // Kiểm tra xem customer có bookings không
      const customerBookings = bookings.filter(
        (booking) => booking.customer_id === id
      );

      if (customerBookings.length > 0) {
        throw new Error("Không thể xóa khách hàng vì đang có dịch vụ đã đặt.");
      }

      const res = await fetch(CustomerAPI.delete(id), {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error when trying to delete customer");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
    },
    onError: (error) => {
      console.error("Error deleting customer:", error);
    },
  });

  const handleEditingCustomer = (formData, id, handleClose) => {
    updateMutation.mutate(
      { id, formData },
      {
        onSuccess: () => handleClose?.(),
        onError: (error) => {
          showToast?.(error.message, "error");
        },
      }
    );
  };

  const handleDeleteCustomer = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast?.("Xóa khách hàng thành công!", "success");
      },
      onError: (error) => {
        showToast?.(error.message, "error");
      },
    });
  };

  const handleGetBookingForCustomerId = (customerId) => {
    const customerBookings = bookings.filter(
      (booking) => booking.customer_id === customerId
    );
    return customerBookings.length > 0;
  };

  return {
    customers,
    editingCustomer: null, // Quản lý trong component
    setEditingCustomer: () => {}, // Placeholder
    loadingCustomers,
    handleEditingCustomer,
    handleDeleteCustomer,
    handleGetBookingForCustomerId,
    handleRefetchCustomer: () => queryClient.invalidateQueries(["customers"]),

    // Thêm states mutation cho UI
    isUpdatingCustomer: updateMutation.isPending,
    isDeletingCustomer: deleteMutation.isPending,

    // Error states
    customersError,
    updateCustomerError: updateMutation.error,
    deleteCustomerError: deleteMutation.error,
  };
};

// src\pages\managers\ServicesPage.jsx
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ServiceNav from "@/pages/managers/service/headerService.jsx";
import { useServicesAdmin } from "@/hook/serviceAdmin/useServicesAdmin";
import { useBookingsAdmin } from "@/hook/serviceAdmin/useBookingsAdmin";
import { useCustomersAdmin } from "@/hook/serviceAdmin/useCustomersAdmin";

export default function ServicesPage() {
  const [showForm, setShowForm] = useState(false);
  const [typeForm, setTypeForm] = useState(null); // service || booking || customer
  const [editingService, setEditingService] = useState(null); // ✅ THÊM state này
  const [editingBooking, setEditingBooking] = useState(null); // ✅ THÊM state này
  const [editingCustomer, setEditingCustomer] = useState(null); // ✅ THÊM state này

  const location = useLocation();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleClose = () => {
    setShowForm(false);
    setTypeForm(null);
    setEditingService(null);
    setEditingBooking(null);
    setEditingCustomer(null);
  };

  const showToast = (message, type) => {
    setToastMessage({ show: true, message, type });
    setTimeout(() => {
      setToastMessage({ show: false, message: "", type: "" });
    }, 3000);
  };

  // ✅ SỬA: Không truyền handleClose vào useServicesAdmin vì đã xử lý trong mutation callbacks
  const {
    errorsMessage,
    services,
    loadingServices,
    handleCreateService,
    handleEditService,
    handleDeleteService,
    handleRefetchService,
    isCreating,
    isUpdating,
    isDeleting,
    servicesError,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useServicesAdmin(); // ❌ BỎ handleClose

  const {
    bookings,
    bookingsAll,
    loadingBookings,
    loadingBookingsAll,
    handleCreateBooking,
    handleEditingBooking,
    handleDeleteBooking,
    handleRefetchBooking,
    isCreatingBooking,
    isUpdatingBooking,
    isDeletingBooking,
    bookingsError,
    bookingsAllError,
    createBookingError,
    updateBookingError,
    deleteBookingError,
  } = useBookingsAdmin({
    onBookingChange: () => handleRefetchCustomer(),
  });

  const {
    customers,
    loadingCustomers,
    handleEditingCustomer,
    handleDeleteCustomer,
    handleGetBookingForCustomerId,
    handleRefetchCustomer,
    isUpdatingCustomer,
    isDeletingCustomer,
    customersError,
    updateCustomerError,
    deleteCustomerError,
  } = useCustomersAdmin({
    bookings,
    onCustomerChange: () => handleRefetchBooking(),
    showToast,
  });

  const handleOpen = (nameType) => {
    setTypeForm(nameType);
    setShowForm(true);
  };

  const openEditServiceForm = (service) => {
    setTypeForm("service");
    setEditingService(service);
    setShowForm(true);
  };

  const openEditBookingForm = (booking) => {
    setTypeForm("booking");
    setEditingBooking(booking);
    setShowForm(true);
  };

  const openEditCustomerForm = (customer) => {
    setTypeForm("customer");
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const content = (
    <Outlet
      context={{
        // === Existing props ===
        typeForm,
        handleOpen,
        handleClose,
        showForm,
        setShowForm,
        errorsMessage,
        initDataService: services,
        editingService,
        setEditingService,
        handleCreateService: (formData) =>
          handleCreateService(formData, handleClose), // ✅ THÊM handleClose
        openEditServiceForm,
        handleEditService: (formData, id) =>
          handleEditService(formData, id, handleClose), // ✅ THÊM handleClose
        handleDeleteService: (id) => handleDeleteService(id),
        initDataBooking: bookings,
        initDataBookingAll: bookingsAll,
        handleCreateBooking: (formData) =>
          handleCreateBooking(formData, handleClose),
        handleDeleteBooking: (id) => handleDeleteBooking(id),
        openEditBookingForm,
        editingBooking,
        setEditingBooking,
        handleEditingBooking: (formData, id) =>
          handleEditingBooking(formData, id, handleClose),
        handleRefetchBooking,
        initDataCustomer: customers,
        editingCustomer,
        setEditingCustomer,
        openEditCustomerForm,
        handleEditingCustomer: (formData, id) =>
          handleEditingCustomer(formData, id, handleClose),
        handleDeleteCustomer: (id) => handleDeleteCustomer(id),
        handleRefetchCustomer,
        showToast,
        handleGetBookingForCustomerId,
        handleRefetchService,

        // === React Query states ===
        loadingStates: {
          // Services
          services: loadingServices,
          creatingService: isCreating,
          updatingService: isUpdating,
          deletingService: isDeleting,

          // Bookings
          bookings: loadingBookings,
          bookingsAll: loadingBookingsAll,
          creatingBooking: isCreatingBooking,
          updatingBooking: isUpdatingBooking,
          deletingBooking: isDeletingBooking,

          // Customers
          customers: loadingCustomers,
          updatingCustomer: isUpdatingCustomer,
          deletingCustomer: isDeletingCustomer,
        },

        errorStates: {
          // Services
          services: servicesError?.message,
          createService: createMutation?.error?.message,
          updateService: updateMutation?.error?.message,
          deleteService: deleteMutation?.error?.message,

          // Bookings
          bookings: bookingsError?.message,
          bookingsAll: bookingsAllError?.message,
          createBooking: createBookingError?.message,
          updateBooking: updateBookingError?.message,
          deleteBooking: deleteBookingError?.message,

          // Customers
          customers: customersError?.message,
          updateCustomer: updateCustomerError?.message,
          deleteCustomer: deleteCustomerError?.message,
        },

        mutationStates: {
          // Services
          isCreatingService: isCreating,
          isUpdatingService: isUpdating,
          isDeletingService: isDeleting,

          // Bookings
          isCreatingBooking: isCreatingBooking,
          isUpdatingBooking: isUpdatingBooking,
          isDeletingBooking: isDeletingBooking,

          // Customers
          isUpdatingCustomer: isUpdatingCustomer,
          isDeletingCustomer: isDeletingCustomer,
        },

        refetchAll: () => {
          handleRefetchService();
          handleRefetchBooking();
          handleRefetchCustomer();
        },
      }}
    />
  );

  return (
    <div className="bg-white admin-dark:bg-gray-900 min-h-screen">
      {toastMessage.show && (
        <div
          className={`fixed top-5 right-5 z-[100] p-4 rounded-md shadow-lg text-white
            ${toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {toastMessage.message}
        </div>
      )}
      <div className="container mx-auto md:px-2 lg:px-2">
        <div className="flex w-full flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <nav className="w-full flex flex-col sm:flex-row sm:flex-wrap sm:max-w-auto gap-2 sm:gap-3">
            <ServiceNav />
          </nav>
        </div>
        {content}
      </div>
    </div>
  );
}

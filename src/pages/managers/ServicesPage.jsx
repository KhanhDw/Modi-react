import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ServiceNav from "@/pages/managers/service/headerService.jsx";
import { useServicesAdmin } from "@/hook/serviceAdmin/useServicesAdmin";
import { useBookingsAdmin } from "@/hook/serviceAdmin/useBookingsAdmin";
import { useCustomersAdmin } from "@/hook/serviceAdmin/useCustomersAdmin";

export default function ServicesPage() {
  const [showForm, setShowForm] = useState(false);
  const [typeForm, setTypeForm] = useState(null); // service || booking || customer
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

  const {
    services,
    editingService,
    setEditingService,
    loadingServices,
    handleCreateService,
    handleEditService,
    handleDeleteService,
    handleRefetchService,
  } = useServicesAdmin(handleClose);

  const {
    bookings,
    bookingsAll,
    editingBooking,
    setEditingBooking,
    loadingBookings,
    loadingBookingsAll,
    handleCreateBooking,
    handleEditingBooking,
    handleDeleteBooking,
    handleRefetchBooking,
  } = useBookingsAdmin({
    onBookingChange: () => handleRefetchCustomer(),
  });

  const {
    customers,
    editingCustomer,
    setEditingCustomer,
    loadingCustomers,
    handleEditingCustomer,
    handleDeleteCustomer,
    handleGetBookingForCustomerId,
    handleRefetchCustomer,
  } = useCustomersAdmin({
    bookings,
    onCustomerChange: () => handleRefetchBooking(),
    showToast,
  });

  useEffect(() => {
    if (location.pathname === "/managers/services") {
      navigate("/managers/services/service_overview", { replace: true });
    }
  }, [location, navigate]);

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

  let content = null;

  if (loadingServices || loadingBookings || loadingCustomers) {
    content = (
      <div className="p-4 sm:p-6 text-center text-green-800 admin-dark:text-green-400 text-sm sm:text-base bg-transparent">
        Đang tải...
      </div>
    );
  } else {
    content = (
      <Outlet
        context={{
          typeForm,
          handleOpen,
          handleClose,
          showForm,
          setShowForm,
          initDataService: services,
          editingService,
          setEditingService,
          handleCreateService,
          openEditServiceForm,
          handleEditService: (formData, id) =>
            handleEditService(formData, id, handleClose),
          handleDeleteService,
          initDataBooking: bookings,
          initDataBookingAll: bookingsAll,
          handleCreateBooking: (formData) =>
            handleCreateBooking(formData, handleClose),
          handleDeleteBooking: (id) => handleDeleteBooking(id, showToast),
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
          handleDeleteCustomer,
          handleRefetchCustomer,
          showToast,
          handleGetBookingForCustomerId,
          handleRefetchService,
        }}
      />
    );
  }

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

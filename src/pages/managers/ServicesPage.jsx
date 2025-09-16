import { useState, useEffect } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { BarChart3, Users, Target, ShoppingCart } from "lucide-react";
import { ServiceAPI } from "@/api/serviceAPI";
import { BookingAPI } from "@/api/bookingAPI";
import { CustomerAPI } from "@/api/customerAPI";
import ThemeToggle from "@/components/layout/partials/ThemeToggle";

export default function ServicesPage() {
  // Common part
  const [showForm, setShowForm] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [typeForm, setTypeForm] = useState(null); // service || booking || customer
  // SERVICE LIST
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  // BOOKING LIST
  const [bookings, setBooking] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  // CUSTOMER LIST
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Common logic
  const handleOpen = (nameType) => {
    setTypeForm(nameType);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setTypeForm(null);
    setEditingService(null);
    setEditingBooking(null);
    setEditingCustomer(null);
  };

  // All part of SERVICE
  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const res = await fetch(ServiceAPI.getALL());
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Default overview service page
  useEffect(() => {
    if (location.pathname === "/managers/services") {
      navigate("/managers/services/service_overview", { replace: true });
    }
  }, [location, navigate]);

  const handleCreateService = async (formData) => {
    const payloadForAPI = {
      name: formData.serviceName,
      desc: formData.desc,
      headerArticle: formData.header,
      contentArticle: JSON.stringify(formData.content || {}),
      lang: formData.lang || "vi",
      price: formData.price || 0,
    };

    try {
      const res = await fetch(ServiceAPI.create(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadForAPI),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server trả về lỗi:", errorText);
        throw new Error("Lỗi khi tạo dịch vụ");
      }

      await fetchServices();
      handleClose();
    } catch (err) {
      console.error("Lỗi khi tạo dịch vụ:", err);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const res = await fetch(ServiceAPI.delete(id), {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error when delete service");
      }
      await fetchServices();
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const openEditServiceForm = (service) => {
    setTypeForm("service");
    setEditingService(service);
    setShowForm(true);
  };

  const handleEditService = async (formData, id) => {
    try {
      const dataEditService = {
        ten_dich_vu: formData.serviceName,
        mo_ta: formData.desc,
        price: formData.price,
        headerArticle: formData.header,
        contentArticle: JSON.stringify(formData.content || {}),
      };
      const res = await fetch(ServiceAPI.edit(id), {
        method: "PUT",
        body: JSON.stringify(dataEditService),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Error when edit service data");
      }
      await fetchServices();
      handleClose();
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  // All part of booking
  const fetchBooking = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch(BookingAPI.getALL());
      const data = await res.json();
      setBooking(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error when try get booking data:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  const handleCreateBooking = async (formData) => {
    const dataBooking = {
      name: formData.cusName,
      phone: formData.cusPhone,
      email: formData.cusEmail,
      address: formData.cusAddress,
      service: formData.service,
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
      await fetchBooking();
      await fetchCustomer();
      handleClose();
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const openEditBookingForm = (booking) => {
    setTypeForm("booking");
    setEditingBooking(booking);
    setShowForm(true);
  };

  const handleEditingBooking = async (formData, id) => {
    try {
      const dataEditBooking = {
        status: formData.status,
        service: formData.service,
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

  const handleDeleteBooking = async (id) => {
    try {
      const res = await fetch(BookingAPI.delete(id), {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error when delete service");
      }
      setBooking((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  // All part of customer
  const fetchCustomer = async () => {
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
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const openEditCustomerForm = (customer) => {
    setTypeForm("customer");
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleEditingCustomer = async (formData, id) => {
    try {
      const dataEditCustomer = {
        name: formData.cusName,
        phone: formData.cusPhone,
        email: formData.cusEmail,
        address: formData.cusAddress,
      };

      const res = await fetch(CustomerAPI.edit(id), {
        method: "PUT",
        body: JSON.stringify(dataEditCustomer),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Error when trying to update customer");
      }
      await fetchCustomer();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      const res = await fetch(CustomerAPI.delete(id), {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Error when trying to delete customer");
      }
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  let content = null;

  if (loadingServices || loadingBookings || loadingCustomers) {
    content = (
      <div className="p-4 sm:p-6 text-center text-green-800 admin-dark:text-green-400 text-sm sm:text-base">
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
          handleEditService,
          handleDeleteService,
          initDataBooking: bookings,
          handleCreateBooking,
          handleDeleteBooking,
          openEditBookingForm,
          editingBooking,
          setEditingBooking,
          handleEditingBooking,
          initDataCustomer: customers,
          editingCustomer,
          setEditingCustomer,
          openEditCustomerForm,
          handleEditingCustomer,
          handleDeleteCustomer,
        }}
      />
    );
  }

  return (
    <div className="bg-white admin-dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <nav className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
            <NavLink
              to="service_overview"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  isActive || location.pathname === "/managers/services"
                    ? "bg-blue-600 text-white admin-dark:bg-blue-700"
                    : "bg-gray-200 text-gray-700 admin-dark:bg-gray-800 admin-dark:text-gray-300 hover:bg-blue-500 hover:text-white admin-dark:hover:bg-blue-600"
                }`
              }
            >
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              Tổng quan
            </NavLink>
            <NavLink
              to="service_list"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white admin-dark:bg-blue-700"
                    : "bg-gray-200 text-gray-700 admin-dark:bg-gray-800 admin-dark:text-gray-300 hover:bg-blue-500 hover:text-white admin-dark:hover:bg-blue-600"
                }`
              }
            >
              <Target className="h-4 w-4 sm:h-5 sm:w-5" />
              Danh sách dịch vụ
            </NavLink>
            <NavLink
              to="service_booking"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white admin-dark:bg-blue-700"
                    : "bg-gray-200 text-gray-700 admin-dark:bg-gray-800 admin-dark:text-gray-300 hover:bg-blue-500 hover:text-white admin-dark:hover:bg-blue-600"
                }`
              }
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              Đơn đặt
            </NavLink>
            <NavLink
              to="service_customer"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white admin-dark:bg-blue-700"
                    : "bg-gray-200 text-gray-700 admin-dark:bg-gray-800 admin-dark:text-gray-300 hover:bg-blue-500 hover:text-white admin-dark:hover:bg-blue-600"
                }`
              }
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Khách hàng
            </NavLink>
          </nav>
          <div className="mt-3 sm:mt-0">
            <ThemeToggle />
          </div>
        </div>
        {content}
      </div>
    </div>
  );
}
import { BookingAPI } from "@/api/bookingAPI";
import { CustomerAPI } from "@/api/customerAPI";
import { ServiceAPI } from "@/api/serviceAPI";
import { BarChart3, ShoppingCart, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";




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
      setServices(Array.isArray(data.data) ? data.data : []);
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



  // File: ServicesPage.jsx
  const handleCreateService = async (formData) => {
    try {
      console.log("Dữ liệu nhận từ form:", formData);

      let bodyData = formData;
      let headers = {};

      // Nếu formData là FormData (tức có append)
      if (formData instanceof FormData) {
        bodyData = formData; // giữ nguyên
      } else {
        // nếu là object thường (chỉ tạo translation)
        bodyData = JSON.stringify(formData);
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/services`, {
        method: "POST",
        body: bodyData,
        headers,
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      console.log("Tạo dịch vụ thành công:", result);
      await fetchServices();
      handleClose();
    } catch (err) {
      console.error("Lỗi khi tạo dịch vụ:", err);
    }
  };


  const handleCreateServiceTranslation = async (formData, id) => {
    try {
      console.log("Dữ liệu nhận từ form (translation):", formData);

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const payload = {
        service_id: id,
        lang: formData.get("lang"),
        ten_dich_vu: formData.get("ten_dich_vu"),
        slug: formData.get("slug"),
        mo_ta: formData.get("mo_ta"),
        features: formData.get("features"),
        details: formData.get("details"),
      };

      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/services/service-translations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Có lỗi xảy ra khi tạo bản dịch");
      }

      console.log("Tạo bản dịch thành công:", result);
      await fetchServices();
      handleClose();
    } catch (err) {
      console.error("Lỗi khi tạo bản dịch:", err);
    }
  };

  const handleEditService = async (formData, id) => {
    try {
      const dataServiceUpdate = services.find((s) => s.id === id);

      const getTotalLang = dataServiceUpdate.totalLanguages.includes(formData.get("lang"));

      if (!getTotalLang) {
        await handleCreateServiceTranslation(formData, id);
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/services/${id}`, {
        method: "PUT",
        body: formData,   // trực tiếp gửi FormData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Cập nhật thất bại");
      console.log("✅ Update thành công:", result);
      await fetchServices();
      handleClose();
    } catch (error) {
      console.error("❌ Lỗi khi update service:", error.message);
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

  // Hàm refetch cho con gọi
  const handleRefetchCustomer = () => {
    fetchCustomer();
  };

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
      if (res.ok) {
        await fetchCustomer();
        handleClose();
        await fetchBooking();
      }
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
          handleRefetchCustomer, // Truyền hàm refetch cho con

        }}
      />
    );
  }

  return (
    <div className="bg-white admin-dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto md:px-2 lg:px-2">
        <div className="flex w-full flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <nav className="w-full flex flex-col sm:flex-row sm:flex-wrap sm:max-w-auto gap-2 sm:gap-3">
            <NavLink
              to="service_overview"
              className={({ isActive }) =>
                `flex flex-1 items-center sm:flex-col md:flex-row md:justify-center gap-2 p-2 rounded-md text-sm font-medium ${isActive || location.pathname === "/managers/services"
                  ? "bg-muted admin-dark:bg-gray-700 text-white"
                  : "bg-gray-200 admin-dark:bg-gray-800 admin-dark:text-gray-300 hover:bg-muted/80 admin-dark:hover:bg-gray-700 hover:text-white admin-dark:hover:text-white"
                }`
              }
            >
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              Tổng quan
            </NavLink>
            <NavLink
              to="service_list"
              className={({ isActive }) =>
                `flex flex-1 items-center sm:flex-col md:flex-row md:justify-center gap-2 p-2 rounded-md text-sm font-medium text-center ${isActive
                  ? "bg-muted admin-dark:bg-gray-700 text-white"
                  : "bg-gray-200 admin-dark:bg-gray-800 admin-dark:text-gray-300 hover:bg-muted/80 admin-dark:hover:bg-gray-700 hover:text-white admin-dark:hover:text-white"
                }`
              }
            >
              <Target className="h-4 w-4 sm:h-5 sm:w-5" />
              Danh sách dịch vụ
            </NavLink>
            <NavLink
              to="service_booking"
              className={({ isActive }) =>
                `flex flex-1 items-center sm:flex-col md:flex-row md:justify-center gap-2 p-2 rounded-md text-sm font-medium ${isActive
                  ? "bg-muted admin-dark:bg-gray-700 text-white"
                  : "bg-gray-200 admin-dark:bg-gray-800 admin-dark:text-gray-300 hover:bg-muted/80 admin-dark:hover:bg-gray-700 hover:text-white admin-dark:hover:text-white"
                }`
              }
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              Đơn đặt
            </NavLink>
            <NavLink
              to="service_customer"
              className={({ isActive }) =>
                `flex flex-1 items-center sm:flex-col md:flex-row md:justify-center gap-2 p-2 rounded-md text-sm font-medium ${isActive
                  ? "bg-muted admin-dark:bg-gray-700 text-white"
                  : "bg-gray-200 admin-dark:bg-gray-800 admin-dark:text-gray-300 hover:bg-muted/80 admin-dark:hover:bg-gray-700 hover:text-white admin-dark:hover:text-white"
                }`
              }
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Khách hàng
            </NavLink>
          </nav>
        </div>
        {content}
      </div>
    </div>
  );
}

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
  const [typeForm, setTypeForm] = useState(null); // service || booking || customer || article
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
    setTimeout(() => {
      setShowForm(false);
      setTypeForm(null);
      setEditingService(null);
      setEditingBooking(null);
      setEditingCustomer(null);
    }, 100);
  };

  // All part of SERVICE
  // Lấy danh sách dịch vụ từ API
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
  }, [location, Navigate]);

  // Xu ly gui du lieu ve server thuc hien tao dich vu
  const handleCreateService = async (formData) => {
    let price = formData.price;

    // Loại bỏ dấu chấm hoặc dấu phẩy hàng nghìn
    price = price.replace(/[.,]/g, "");
    price = parseFloat(price);

    const dataService = {
      name: formData.serviceName,
      desc: formData.desc,
      headerArticle: formData.header,
      footerArticle: formData.footer,
      contentArticle: JSON.stringify(formData.content || {}),
      lang: formData.lang || "vi",
      price: price || 0,
    };

    console.log("Dữ liệu gửi đi:", dataService);

    try {
      const res = await fetch(ServiceAPI.create(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataService),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server trả về lỗi:", errorText);
        throw new Error("Loi khi tao dich vu");
      }

      const result = await res.json();
      console.log("Kết quả tạo dịch vụ:", result);

      await fetchServices();
      handleClose();
    } catch (err) {
      console.error("Loi khi tao dich vu:", err);
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
    } catch (err) {
      console.log("Error: ", err);
    }
    await fetchServices();
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
      if (res.ok) {
        await fetchServices();
        handleClose();
      }
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
    } catch (err) {
      console.error("Error: ", err);
    }

    await fetchBooking();
    await fetchCustomer();
    handleClose();
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
      if (res.ok) {
        await fetchBooking();
        handleClose();
      }
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
        throw new error("Error when trying to update customer");
      }
      if (res.ok) {
        await fetchCustomer();
        handleClose();
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
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  let content = null;

  if (loadingServices || loadingBookings || loadingCustomers) {
    return <div className="p-6 text-center text-green-800">Đang tải...</div>;
  } else {
    content = (
      <Outlet
        context={{
          // Common
          typeForm,
          handleOpen,
          handleClose,
          showForm,
          setShowForm,
          //Dich vu
          initDataService: services,
          editingService,
          setEditingService,
          handleCreateService,
          openEditServiceForm,
          handleEditService,
          handleDeleteService,
          // Booking
          initDataBooking: bookings,
          handleCreateBooking,
          handleDeleteBooking,
          openEditBookingForm,
          editingBooking,
          setEditingBooking,
          handleEditingBooking,
          // Customer
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
    <div className=" bg-white rounded-2xl ">
      <div className="container mx-auto ">
        <div className="mb-6">
          <nav className="flex justify-center">
            <NavLink
              to="service_overview"
              className={({ isActive }) =>
                `flex flex-1 items-center gap-2 p-2 mx-2 rounded-md text-sm font-medium ${isActive || location.pathname === "/managers/services"
                  ? "bg-muted text-white"
                  : "bg-gray-200 hover:bg-muted/80 hover:text-white"
                }`
              }
            >
              <BarChart3 className="h-4 w-4" />
              Tổng quan
            </NavLink>
            <NavLink
              to="service_list"
              className={({ isActive }) =>
                `flex flex-1 items-center gap-2 p-2 mx-2 rounded-md text-sm font-medium ${isActive
                  ? "bg-muted text-white"
                  : "bg-gray-200 hover:bg-muted/80 hover:text-white"
                }`
              }
            >
              <Target className="h-4 w-4" />
              Danh sách dịch vụ
            </NavLink>
            <NavLink
              to="service_booking"
              className={({ isActive }) =>
                `flex flex-1 items-center gap-2 p-2 mx-2 rounded-md text-sm font-medium ${isActive
                  ? "bg-muted text-white"
                  : "bg-gray-200 hover:bg-muted/80 hover:text-white"
                }`
              }
            >
              <ShoppingCart className="h-4 w-4" />
              Đơn đặt
            </NavLink>
            <NavLink
              to="service_customer"
              className={({ isActive }) =>
                `flex flex-1 items-center gap-2 p-2 mx-2 rounded-md text-sm font-medium ${isActive
                  ? "bg-muted text-white"
                  : "bg-gray-200 hover:bg-muted/80 hover:text-white"
                }`
              }
            >
              <Users className="h-4 w-4" />
              Khách hàng
            </NavLink>
            {/* <NavLink
              to="service_review"
              className={({ isActive }) =>
                `flex flex-1 items-center gap-2 p-2 mx-2 rounded-md text-sm font-medium ${isActive
                  ? "bg-muted text-white"
                  : "bg-gray-200 hover:bg-muted/80 hover:text-white"
                }`
              }
            >
              <Target className="h-4 w-4" />
              Đánh giá dịch vụ
            </NavLink> */}
          </nav>
        </div>
        {content}
      </div>
    </div>
  );
}

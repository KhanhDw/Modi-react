import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import { BarChart3, Users, Target, ShoppingCart } from "lucide-react";
import { ServiceAPI } from "@/api/serviceAPI";
import ThemeToggle from "@/components/layout/partials/ThemeToggle";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Lấy danh sách dịch vụ từ API
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(ServiceAPI.getALL());
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading)
    return <div className="p-6 text-center text-green-800">Đang tải...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  // Default overview service page
  if (location.pathname === "/managers/services") {
    return <Navigate to="/managers/services/service_overview" replace />;
  }

  const handleOpen = () => {
    setShowForm(true);
  };

  const handleClose = () => {
    setEditingService(null);
    setShowForm(false);
  };

  // Xu ly gui du lieu ve server thuc hien tao dich vu
  const handleCreateService = async (formData) => {
    let price = formData.price;

    // Loại bỏ dấu chấm hoặc dấu phẩy hàng nghìn
    price = price.replace(/[.,]/g, "");
    price = parseFloat(price);

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

    try {
      const res = await fetch(ServiceAPI.create(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataService),
      });

      if (!res.ok) {
        throw new Error("Loi khi tao dich vu");
      }
      const result = await res.json();
    } catch (err) {
      console.error("Loi khi tao dich vu:", err);
    }
    await fetchServices();
    handleClose();
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

  const handleEditService = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-white rounded-2xl shadow-[0_35px_35px_rgba(0,0,0,0.25)] ">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <nav className="flex justify-center">
            <NavLink
              to="service_overview"
              className={({ isActive }) =>
                `flex flex-1 items-center gap-2 p-2 mx-2 rounded-md text-sm font-medium ${
                  isActive || location.pathname === "/managers/services"
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
              state={{ data: services }}
              className={({ isActive }) =>
                `flex flex-1 items-center gap-2 p-2 mx-2 rounded-md text-sm font-medium ${
                  isActive
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
                `flex flex-1 items-center gap-2 p-2 mx-2 rounded-md text-sm font-medium ${
                  isActive
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
                `flex flex-1 items-center gap-2 p-2 mx-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-muted text-white"
                    : "bg-gray-200 hover:bg-muted/80 hover:text-white"
                }`
              }
            >
              <Users className="h-4 w-4" />
              Khách hàng
            </NavLink>
            <NavLink
              to="service_review"
              className={({ isActive }) =>
                `flex flex-1 items-center gap-2 p-2 mx-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-muted text-white"
                    : "bg-gray-200 hover:bg-muted/80 hover:text-white"
                }`
              }
            >
              <Target className="h-4 w-4" />
              Đánh giá dịch vụ
            </NavLink>
          </nav>
        </div>
        <Outlet
          context={{
            //Dich vu
            initDataService: services,
            handleOpen,
            handleClose,
            showForm,
            setShowForm,
            editingService,
            setEditingService,
            handleCreateService,
            handleEditService,
            handleDeleteService,
          }}
        />
      </div>
    </div>
  );
}

// // Lấy danh sách dịch vụ từ API
// const fetchServices = async () => {
//   setLoading(true);
//   try {
//     const res = await fetch(
//       `${import.meta.env.VITE_MAIN_BE_URL}/api/services`
//     );
//     if (!res.ok) throw new Error("Không thể tải dữ liệu");
//     const data = await res.json();
//     setServices(Array.isArray(data) ? data : []);
//     setError(null);
//   } catch (err) {
//     console.error("Lỗi khi lấy dữ liệu:", err);
//     setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại.");
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   fetchServices();
// }, []);

// const handleAdd = () => {
//   setEditingService(null); // Đặt thành null để kích hoạt chế độ thêm mới và reset form
//   setShowForm(true);
// };

// const handleEdit = (service) => {
//   setEditingService(service); // Đổ dữ liệu service lên form
//   setShowForm(true);
// };

// const handleDelete = (id) => {
//   if (confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
//     fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/services/${id}`, {
//       method: "DELETE",
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Xóa không thành công");
//         return res.json();
//       })
//       .then(() => fetchServices()) // Tải lại danh sách sau khi xóa
//       .catch((err) => {
//         console.error("Lỗi khi xóa:", err);
//         setError("Xóa dịch vụ thất bại. Vui lòng thử lại.");
//       });
//   }
// };

// const handleSubmit = (formData) => {
//   const method = editingService ? "PUT" : "POST";
//   const url = editingService
//     ? `${import.meta.env.VITE_MAIN_BE_URL}/api/services/${editingService.id}`
//     : `${import.meta.env.VITE_MAIN_BE_URL}/api/services`;

//   fetch(url, {
//     method,
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(formData),
//   })
//     .then((res) => {
//       if (!res.ok) throw new Error("Thao tác không thành công");
//       return res.json();
//     })
//     .then(() => {
//       // Sau khi thêm hoặc cập nhật thành công, tải lại danh sách từ server
//       fetchServices();
//       setShowForm(false);
//       setError(null);
//     })
//     .catch((err) => {
//       console.error("Lỗi khi submit:", err);
//       setError("Thao tác thất bại. Vui lòng kiểm tra dữ liệu.");
//     });
// };

// if (loading)
//   return <div className="p-6 text-center text-green-800">Đang tải...</div>;
// if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

// Danh sach dich vu  <div className="p-4 md:p-6 min-h-screen bg-gray-100">
//   <PageHeader
//     title="Quản lý dịch vụ"
//     buttonText="Thêm dịch vụ"
//     onButtonClick={handleAdd}
//     className="mb-6"
//   />

//   {showForm && (
//     <div className="mb-6 bg-white p-4 md:p-6 rounded-lg shadow-md border border-green-200">
//       <ServiceForm
//         service={editingService}
//         onSubmit={handleSubmit}
//         onCancel={() => setShowForm(false)}
//       />
//     </div>
//   )}

//   {/* Bảng responsive */}
//   <div className="bg-white rounded-lg shadow-md overflow-hidden">
//     <table className="min-w-full divide-y divide-green-200">
//       <thead className="bg-green-100 text-green-800 uppercase text-xs">
//         <tr>
//           <th className="px-4 py-3 text-left font-semibold">ID</th>
//           <th className="px-4 py-3 text-left font-semibold">Tên dịch vụ</th>
//           <th className="px-4 py-3 text-left font-semibold">Mô tả</th>
//           <th className="px-4 py-3 text-left font-semibold">Ngày tạo</th>
//           <th className="px-4 py-3 text-center font-semibold">Hành động</th>
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-green-200">
//         {services.map((service, index) => (
//           <tr
//             key={service.id || index} // Fallback đến index nếu id bị thiếu
//             className="hover:bg-green-50 transition-colors duration-200"
//           >
//             <td className="px-4 py-3 whitespace-nowrap text-green-900">
//               {service.id}
//             </td>
//             <td className="px-4 py-3 font-medium text-green-900">
//               {service.ten_dich_vu}
//             </td>
//             <td className="px-4 py-3 text-green-800">{service.mo_ta}</td>
//             <td className="px-4 py-3 whitespace-nowrap text-green-800">
//               {new Date(service.ngay_tao).toLocaleDateString("vi-VN")}
//             </td>
//             <td className="px-4 py-3 text-center">
//               <button
//                 onClick={() => handleEdit(service)}
//                 className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 mr-2"
//               >
//                 Sửa
//               </button>
//               <button
//                 onClick={() => handleDelete(service.id)}
//                 className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
//               >
//                 Xóa
//               </button>
//             </td>
//           </tr>
//         ))}
//         {services.length === 0 && (
//           <tr>
//             <td
//               colSpan="5"
//               className="px-4 py-3 text-center text-green-600 italic"
//             >
//               Không có dịch vụ nào
//             </td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   </div>
// </div>

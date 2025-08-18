import PageHeader from "../../components/admin/common/PageHeader";
import ServiceForm from "../../components/admin/services/ServiceForm";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/layout/partials/ThemeToggle";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 10;

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/services`);
      if (!res.ok) throw new Error("Không thể tải dữ liệu");
      let data = await res.json();
      data = Array.isArray(data) ? data.sort((a, b) => {
        const nameA = a.ten_dich_vu.toLowerCase();
        const nameB = b.ten_dich_vu.toLowerCase();
        return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }) : [];
      setServices(data);
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
  }, [sortOrder]);

  const handleAdd = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/services/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Xóa không thành công");
          return res.json();
        })
        .then(() => fetchServices())
        .catch((err) => {
          console.error("Lỗi khi xóa:", err);
          setError("Xóa dịch vụ thất bại. Vui lòng thử lại.");
        });
    }
  };

  const handleSubmit = (formData) => {
    const method = editingService ? "PUT" : "POST";
    const url = editingService
      ? `${import.meta.env.VITE_MAIN_BE_URL}/api/services/${editingService.id}`
      : `${import.meta.env.VITE_MAIN_BE_URL}/api/services`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Thao tác không thành công");
        return res.json();
      })
      .then(() => {
        fetchServices();
        setShowForm(false);
        setError(null);
      })
      .catch((err) => {
        console.error("Lỗi khi submit:", err);
        setError("Thao tác thất bại. Vui lòng kiểm tra dữ liệu.");
      });
  };

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const paginatedServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading) return <div className="p-4 text-center text-green-800">Đang tải...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  return (
    <div className="rounded-lg p-2 sm:p-4 md:p-6 min-h-screen bg-gray-100">
      <PageHeader
        title="Quản lý dịch vụ"
        buttonText="Thêm dịch vụ"
        onButtonClick={handleAdd}
        className="mb-4 sm:mb-6"
      />

      {showForm && (
        <div className="mb-4 sm:mb-6 bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-200">
          <ServiceForm
            service={editingService}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={toggleSortOrder}
          className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
        >
          Sắp xếp theo tên ({sortOrder === "asc" ? "A-Z" : "Z-A"})
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-green-200">
        <table className="min-w-full divide-y divide-green-200">
          <thead className="bg-green-100 text-green-800 uppercase text-xs sm:text-sm">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold rounded-tl-xl">ID</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold">Tên dịch vụ</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold hidden sm:table-cell">Mô tả</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold hidden md:table-cell">Ngày tạo</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold rounded-tr-xl">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-200">
            {paginatedServices.map((service, index) => (
              <tr
                key={service.id || index}
                className="hover:bg-green-50 transition-colors duration-200"
              >
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-green-900 text-xs sm:text-sm">
                  {service.id}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-green-900 text-xs sm:text-sm">
                  {service.ten_dich_vu}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-green-800 text-xs sm:text-sm hidden sm:table-cell">
                  {service.mo_ta}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-green-800 text-xs sm:text-sm hidden md:table-cell">
                  {new Date(service.ngay_tao).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                  <div className="flex justify-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-xs sm:text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 text-xs sm:text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedServices.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-2 sm:px-4 py-2 sm:py-3 text-center text-green-600 italic text-xs sm:text-sm"
                >
                  Không có dịch vụ nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-full sm:w-auto px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50 text-xs sm:text-sm"
        >
          Trước
        </button>
        <span className="text-green-800 text-xs sm:text-sm">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-full sm:w-auto px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50 text-xs sm:text-sm"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
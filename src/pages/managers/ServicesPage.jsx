"use client"
import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/common/PageHeader";
import Table from "../../components/admin/common/Table";
import ServiceForm from "../../components/admin/services/ServiceForm";
import { useState, useEffect } from "react";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Lấy danh sách dịch vụ từ backend khi component mount
  useEffect(() => {
    fetch('http://localhost:3000/api/dichvu')
      .then((response) => response.json())
      .then((data) => setServices(data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
  }, []);

  const columns = [
    { key: "id", label: "ID", className: "text-gray-900" },
    { key: "ten_dich_vu", label: "Tên dịch vụ", className: "font-medium text-gray-900" },
    { key: "mo_ta", label: "Mô tả" },
    { key: "ngay_tao", label: "Ngày tạo" },
  ];

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
      fetch(`http://localhost:3000/api/dichvu/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(() => setServices(services.filter((s) => s.id !== id)))
        .catch((error) => console.error('Lỗi khi xóa:', error));
    }
  };

  const handleSubmit = (formData) => {
    const method = editingService ? 'PUT' : 'POST';
    const url = editingService
      ? `http://localhost:3000/api/dichvu/${editingService.id}`
      : 'http://localhost:3000/api/dichvu';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ten_dich_vu: formData.ten_dich_vu, mo_ta: formData.mo_ta }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (editingService) {
          setServices(services.map((s) => (s.id === editingService.id ? { ...s, ...formData } : s)));
        } else {
          setServices([...services, { id: data.data?.id || Date.now(), ...formData, ngay_tao: new Date().toISOString().split("T")[0] }]);
        }
        setShowForm(false);
      })
      .catch((error) => console.error('Lỗi khi submit:', error));
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <PageHeader title="Quản lý dịch vụ" buttonText="Thêm dịch vụ" onButtonClick={handleAdd} />

        {showForm && (
          <ServiceForm service={editingService} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
        )}

        <Table columns={columns} data={services} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </AdminLayout>
  );
}
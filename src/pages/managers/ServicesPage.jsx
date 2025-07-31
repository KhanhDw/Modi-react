"use client"
import AdminLayout from "../../components/admin/AdminLayout"
import PageHeader from "../../components/admin/common/PageHeader"
import Table from "../../components/admin/common/Table"
import ServiceForm from "../../components/admin/services/ServiceForm"
import { useState } from "react"

export default function ServicesPage() {
  const [services, setServices] = useState([
    { id: 1, ten_dich_vu: "Thiết kế website", mo_ta: "Thiết kế website chuyên nghiệp", ngay_tao: "2024-01-15" },
    {
      id: 2,
      ten_dich_vu: "Phát triển ứng dụng mobile",
      mo_ta: "Phát triển app iOS và Android",
      ngay_tao: "2024-01-20",
    },
    { id: 3, ten_dich_vu: "SEO Marketing", mo_ta: "Tối ưu hóa công cụ tìm kiếm", ngay_tao: "2024-01-25" },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)

  const columns = [
    { key: "id", label: "ID", className: "text-gray-900" },
    { key: "ten_dich_vu", label: "Tên dịch vụ", className: "font-medium text-gray-900" },
    { key: "mo_ta", label: "Mô tả" },
    { key: "ngay_tao", label: "Ngày tạo" },
  ]

  const handleAdd = () => {
    setEditingService(null)
    setShowForm(true)
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      setServices(services.filter((s) => s.id !== id))
    }
  }

  const handleSubmit = (formData) => {
    if (editingService) {
      setServices(services.map((s) => (s.id === editingService.id ? { ...s, ...formData } : s)))
    } else {
      const newService = {
        id: Date.now(),
        ...formData,
        ngay_tao: new Date().toISOString().split("T")[0],
      }
      setServices([...services, newService])
    }
    setShowForm(false)
  }

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
  )
}

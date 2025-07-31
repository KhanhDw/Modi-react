"use client"
import AdminLayout from "../../components/admin/AdminLayout"
import PageHeader from "../../components/admin/common/PageHeader"
import Table from "../../components/admin/common/Table"
import NewsForm from "../../components/admin/news/NewsForm"
import { useState } from "react"

export default function NewsPage() {
  const [news, setNews] = useState([
    {
      id: 1,
      tieu_de: "Ra mắt dịch vụ mới",
      noi_dung: "Chúng tôi vui mừng thông báo...",
      tac_gia: "Admin",
      ngay_dang: "2024-01-15",
    },
    {
      id: 2,
      tieu_de: "Cập nhật hệ thống",
      noi_dung: "Hệ thống đã được cập nhật...",
      tac_gia: "Admin",
      ngay_dang: "2024-01-20",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState(null)

  const columns = [
    { key: "id", label: "ID", className: "text-gray-900" },
    { key: "tieu_de", label: "Tiêu đề", className: "font-medium text-gray-900" },
    { key: "tac_gia", label: "Tác giả" },
    { key: "ngay_dang", label: "Ngày đăng" },
  ]

  const handleAdd = () => {
    setEditingNews(null)
    setShowForm(true)
  }

  const handleEdit = (item) => {
    setEditingNews(item)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa tin tức này?")) {
      setNews(news.filter((n) => n.id !== id))
    }
  }

  const handleSubmit = (formData) => {
    if (editingNews) {
      setNews(news.map((n) => (n.id === editingNews.id ? { ...n, ...formData } : n)))
    } else {
      const newNews = {
        id: Date.now(),
        ...formData,
        ngay_dang: new Date().toISOString().split("T")[0],
      }
      setNews([...news, newNews])
    }
    setShowForm(false)
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <PageHeader title="Quản lý tin tức" buttonText="Thêm tin tức" onButtonClick={handleAdd} />

        {showForm && <NewsForm news={editingNews} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />}

        <Table columns={columns} data={news} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </AdminLayout>
  )
}

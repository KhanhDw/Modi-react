import PageHeader from "../../components/admin/common/PageHeader"
import Table from "../../components/admin/common/Table"
import NewsForm from "../../components/admin/news/NewsForm"
import { useState, useEffect } from "react"



export default function NewsPage() {
  const [news, setNews] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState(null)

  // Lấy danh sách tin tức từ backend khi component mount
  useEffect(() => {
    fetch('http://localhost:3000/api/tintuc')
      .then((response) => response.json())
      .then((data) => setNews(data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error))
  }, [])

  const columns = [
    { key: "id", label: "ID", className: "text-gray-900" },
    { key: "tieu_de", label: "Tiêu đề", className: "font-medium text-gray-900" },
    {
      key: "hinh_anh", label: "Hình ảnh", render: (value) => (
        <img src={value || null} alt="Hình ảnh" style={{ width: 80, height: 50, objectFit: "cover" }} />
      )
    },
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
      fetch(`http://localhost:3000/api/tintuc/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(() => setNews(news.filter((n) => n.id !== id)))
        .catch((error) => console.error('Lỗi khi xóa:', error))
    }
  }

  const handleSubmit = (formData) => {
    const method = editingNews ? 'PUT' : 'POST'
    const url = editingNews
      ? `http://localhost:3000/api/tintuc/${editingNews.id}`
      : 'http://localhost:3000/api/tintuc'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (editingNews) {
          setNews(news.map((n) => (n.id === editingNews.id ? { ...formData, ...n } : n)))
        } else {
          setNews([
            // { id: data.data?.id || Date.now(), ...formData, ngay_dang: new Date().toISOString().split("T")[0] },
            { id: data.data?.id || Date.now(), ...formData, ngay_dang: new Date().toISOString().split("T")[0] },
            ...news,
          ])
        }
        setShowForm(false)
      })
      .catch((error) => console.error('Lỗi khi submit:', error))
  }

  return (
    <div className="p-6">
      <PageHeader title="Quản lý tin tức" buttonText="Thêm tin tức" onButtonClick={handleAdd} />

      {showForm && (
        <NewsForm
          news={editingNews}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Table
        columns={columns}
        data={news}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

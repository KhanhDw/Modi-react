import AdminLayout from "../../components/admin/AdminLayout"
import PageHeader from "../../components/admin/common/PageHeader"
import Table from "../../components/admin/common/Table"
import ContactDetail from "../../components/admin/contact/ContactDetail"
import { useState, useEffect } from "react"

export default function ContactPage() {
  const [contacts, setContacts] = useState([])
  const [showDetail, setShowDetail] = useState(null)

  // Lấy danh sách liên hệ từ backend khi component mount
  useEffect(() => {
    fetch('http://localhost:3000/api/lienhe')
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error))
  }, [])

  const columns = [
    { key: "ho_ten", label: "Họ tên", className: "font-medium text-gray-900" },
    { key: "email", label: "Email" },
    { key: "so_dien_thoai", label: "Điện thoại" },
    {
      key: "trang_thai",
      label: "Trạng thái",
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === "Đã phản hồi" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: "ngay_gui", label: "Ngày gửi" },
  ]

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa liên hệ này?")) {
      fetch(`http://localhost:3000/api/lienhe/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(() => setContacts(contacts.filter((c) => c.id !== id)))
        .catch((error) => console.error('Lỗi khi xóa:', error))
      if (showDetail && showDetail.id === id) {
        setShowDetail(null)
      }
    }
  }

  const handleStatusChange = (id, newStatus) => {
    fetch(`http://localhost:3000/api/lienhe/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trang_thai: newStatus }),
    })
      .then((response) => response.json())
      .then(() => {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { trang_thai: newStatus,  ...c, } : c))
        )
        if (showDetail && showDetail.id === id) {
          setShowDetail({  trang_thai: newStatus, ...showDetail, })
        }
      })
      .catch((error) => console.error('Lỗi khi cập nhật trạng thái:', error))
  }

  const extraInfo = `Tổng: ${contacts.length} | Chưa phản hồi: ${
    contacts.filter((c) => c.trang_thai === "Chưa phản hồi").length
  }`

  return (
    <AdminLayout>
      <div className="p-6">
        <PageHeader title="Quản lý liên hệ" extra={extraInfo} />
        <Table columns={columns} data={contacts} onView={setShowDetail} onDelete={handleDelete} />
        <ContactDetail
          contact={showDetail}
          isOpen={!!showDetail}
          onClose={() => setShowDetail(null)}
          onStatusChange={handleStatusChange}
        />
      </div>
    </AdminLayout>
  )
}

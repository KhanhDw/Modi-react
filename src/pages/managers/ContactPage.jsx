"use client"
import AdminLayout from "../../components/admin/AdminLayout"
import PageHeader from "../../components/admin/common/PageHeader"
import Table from "../../components/admin/common/Table"
import ContactDetail from "../../components/admin/contact/ContactDetail"
import { useState } from "react"

export default function ContactPage() {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      ho_ten: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      so_dien_thoai: "0123456789",
      noi_dung: "Tôi muốn tư vấn về dịch vụ thiết kế website",
      trang_thai: "Chưa phản hồi",
      ngay_gui: "2024-01-15",
    },
    {
      id: 2,
      ho_ten: "Trần Thị B",
      email: "tranthib@email.com",
      so_dien_thoai: "0987654321",
      noi_dung: "Báo giá dịch vụ SEO",
      trang_thai: "Đã phản hồi",
      ngay_gui: "2024-01-20",
    },
  ])

  const [showDetail, setShowDetail] = useState(null)

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

  const handleStatusChange = (id, newStatus) => {
    setContacts(contacts.map((c) => (c.id === id ? { ...c, trang_thai: newStatus } : c)))
    if (showDetail && showDetail.id === id) {
      setShowDetail({ ...showDetail, trang_thai: newStatus })
    }
  }

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa liên hệ này?")) {
      setContacts(contacts.filter((c) => c.id !== id))
      if (showDetail && showDetail.id === id) {
        setShowDetail(null)
      }
    }
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

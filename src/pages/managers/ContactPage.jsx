import PageHeader from "../../components/admin/common/PageHeader";
import Table from "../../components/admin/common/Table";
import ContactDetail from "../../components/admin/contact/ContactDetail";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [showDetail, setShowDetail] = useState(null);

  // Fetch contact data from backend
  useEffect(() => {
    fetch(`${process.env.MAIN_BE_URL}/api/lienhe`)
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, []);

  // Calculate statistics
  const calculateStats = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of current month

    const dailyCount = contacts.filter((contact) => {
      const contactDate = new Date(contact.ngay_gui);
      return (
        contactDate.getDate() === today.getDate() &&
        contactDate.getMonth() === today.getMonth() &&
        contactDate.getFullYear() === today.getFullYear()
      );
    }).length;

    const weeklyCount = contacts.filter((contact) => {
      const contactDate = new Date(contact.ngay_gui);
      return contactDate >= startOfWeek && contactDate <= today;
    }).length;

    const monthlyCount = contacts.filter((contact) => {
      const contactDate = new Date(contact.ngay_gui);
      return contactDate >= startOfMonth && contactDate <= today;
    }).length;

    return { dailyCount, weeklyCount, monthlyCount };
  };

  const { dailyCount, weeklyCount, monthlyCount } = calculateStats();

  const columns = [
    { key: "ho_ten", label: "Họ tên", className: "font-medium text-gray-900" },
    { key: "email", label: "Email" },
    { key: "so_dien_thoai", label: "Điện thoại" },
    {
      key: "trang_thai",
      label: "Trạng thái",
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${value === "Đã phản hồi" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {value}
        </span>
      ),
    },
    { key: "ngay_gui", label: "Ngày gửi" },
  ];

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa liên hệ này?")) {
      fetch(`MAIN_BE_URL/api/lienhe/${id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => setContacts(contacts.filter((c) => c.id !== id)))
        .catch((error) => console.error("Lỗi khi xóa:", error));
      if (showDetail && showDetail.id === id) {
        setShowDetail(null);
      }
    }
  };

  const handleStatusChange = (id, newStatus) => {
    fetch(`MAIN_BE_URL/api/lienhe/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trang_thai: newStatus }),
    })
      .then((response) => response.json())
      .then(() => {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, trang_thai: newStatus } : c))
        );
        if (showDetail && showDetail.id === id) {
          setShowDetail({ ...showDetail, trang_thai: newStatus });
        }
      })
      .catch((error) => console.error("Lỗi khi cập nhật trạng thái:", error));
  };

  const extraInfo = `Tổng: ${contacts.length} | Chưa phản hồi: ${contacts.filter((c) => c.trang_thai === "Chưa phản hồi").length
    }`;

  return (
    <div className="p-6">
      <PageHeader title="Quản lý liên hệ" extra={extraInfo} />

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border-2 border-slate-300 bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Hôm nay</h3>
          <p className="text-3xl font-bold text-blue-600">{dailyCount}</p>
        </div>
        <div className="border-2 border-slate-300 bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Tuần này</h3>
          <p className="text-3xl font-bold text-blue-600">{weeklyCount}</p>
        </div>
        <div className="border-2 border-slate-300 bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Tháng này</h3>
          <p className="text-3xl font-bold text-blue-600">{monthlyCount}</p>
        </div>
      </div>

      <Table columns={columns} data={contacts} onView={setShowDetail} onDelete={handleDelete} />
      <ContactDetail
        contact={showDetail}
        isOpen={!!showDetail}
        onClose={() => setShowDetail(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
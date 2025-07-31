"use client"
import AdminLayout from "../../components/admin/AdminLayout"

export default function DashboardPage() {
  const stats = [
    { label: "Dịch vụ", value: "12", icon: "🛠️" },
    { label: "Tin tức", value: "45", icon: "📰" },
    { label: "Tuyển dụng", value: "8", icon: "💼" },
    { label: "Liên hệ", value: "23", icon: "📞" },
  ]

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan hệ thống</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <span className="text-3xl mr-4">{stat.icon}</span>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="text-2xl mb-2">➕</div>
              <div className="font-medium">Thêm dịch vụ</div>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium">Viết tin tức</div>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="text-2xl mb-2">💼</div>
              <div className="font-medium">Đăng tuyển dụng</div>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="text-2xl mb-2">👁️</div>
              <div className="font-medium">Xem liên hệ</div>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

import PageHeader from "../../components/admin/common/PageHeader";
import Table from "../../components/admin/common/Table";
import ContactDetail from "../../components/admin/contact/ContactDetail";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [showDetail, setShowDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Changed from 6 to 7
  const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, responded
  const [searchTerm, setSearchTerm] = useState(""); // New search state

  // Fetch contact data from backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/lienhe`)
      .then((response) => response.json())
      .then((data) => {
        setContacts(data);
        setFilteredContacts(data);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...contacts];

    // Search by name, phone, or email
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.so_dien_thoai.includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      const statusText = statusFilter === "responded" ? "Đã phản hồi" : "Chưa phản hồi";
      filtered = filtered.filter(contact => contact.trang_thai === statusText);
    }

    // Filter by date range
    if (dateFilter !== "all") {
      const today = new Date();
      let startDate, endDate;

      switch (dateFilter) {
        case "today":
          startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
          break;
        case "week":
          startDate = new Date(today);
          startDate.setDate(today.getDate() - today.getDay());
          endDate = today;
          break;
        case "month":
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          endDate = today;
          break;
      }

      if (startDate && endDate) {
        filtered = filtered.filter(contact => {
          const contactDate = new Date(contact.ngay_gui);
          return contactDate >= startDate && contactDate <= endDate;
        });
      }
    }

    setFilteredContacts(filtered);
    setCurrentPage(1); // Reset to first page when filter or search changes
  }, [contacts, dateFilter, statusFilter, searchTerm]);

  // Calculate statistics for current filtered data
  const calculateStats = () => {
    const total = filteredContacts.length;
    const pending = filteredContacts.filter(c => c.trang_thai === "Chưa phản hồi").length;
    const responded = filteredContacts.filter(c => c.trang_thai === "Đã phản hồi").length;
    return { total, pending, responded };
  };

  const { total, pending, responded } = calculateStats();

  // Pagination calculations
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  const columns = [
    {
      key: "ho_ten",
      label: "Họ tên",
      className: "font-semibold text-gray-900",
      render: (value) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-semibold text-sm">
              {value.charAt(0).toUpperCase()}
            </span>
          </div>
          {value}
        </div>
      )
    },
    {
      key: "email",
      label: "Email",
      render: (value) => (
        <span className="text-gray-600">{value}</span>
      )
    },
    {
      key: "so_dien_thoai",
      label: "Điện thoại",
      render: (value) => (
        <span className="font-mono text-sm text-gray-700">{value}</span>
      )
    },
    {
      key: "trang_thai",
      label: "Trạng thái",
      render: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${value === "Đã phản hồi"
            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
            : "bg-amber-100 text-amber-800 border border-amber-200"
            }`}
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${value === "Đã phản hồi" ? "bg-emerald-400" : "bg-amber-400"
            }`}></div>
          {value}
        </span>
      ),
    },
    {
      key: "ngay_gui",
      label: "Ngày gửi",
      render: (value) => {
        const date = new Date(value);
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {date.toLocaleDateString('vi-VN')}
            </div>
            <div className="text-gray-500">
              {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      }
    },
  ];

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa liên hệ này?")) {
      fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/lienhe/${id}`, {
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
    fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/lienhe/${id}`, {
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

  const handleFilterChange = (value) => {
    setDateFilter(value);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleShowAll = () => {
    setStatusFilter("all");
    setDateFilter("all");
    setSearchTerm(""); // Reset search when showing all
  };

  const Pagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            {/* <p className="text-sm text-gray-700">
              Hiển thị{' '}
              <span className="font-medium">{startIndex + 1}</span>
              {' '}đến{' '}
              <span className="font-medium">{Math.min(endIndex, filteredContacts.length)}</span>
              {' '}trong tổng số{' '}
              <span className="font-medium">{filteredContacts.length}</span>
              {' '}kết quả
            </p> */}
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>

              {startPage > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                      ...
                    </span>
                  )}
                </>
              )}

              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                    ? 'z-10 bg-blue-600 text-white focus:z-20  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                >
                  {page}
                </button>
              ))}

              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý liên hệ</h1>
          <div className="flex items-center space-x-4">
            {/* New Search Bar */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, số điện thoại, email..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 w-64"
            />
            {/* Existing Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className={`bg-white overflow-hidden shadow-sm rounded-lg border-2 hover:shadow-md transition-all duration-200 cursor-pointer ${statusFilter === "all" && dateFilter === "all" ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-300"
              }`}
            onClick={handleShowAll}
          >
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusFilter === "all" && dateFilter === "all" ? "bg-blue-600" : "bg-blue-500"
                    }`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h2"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-xs font-medium text-gray-500 truncate">Tổng liên hệ</dt>
                    <dd className="text-xl font-bold text-gray-900">{total}</dd>
                  </dl>
                </div>
                {statusFilter === "all" && dateFilter === "all" && (
                  <div className="ml-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={`bg-white overflow-hidden shadow-sm rounded-lg border-2 hover:shadow-md transition-all duration-200 cursor-pointer ${statusFilter === "pending" ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-amber-300"
              }`}
            onClick={() => handleStatusFilterChange(statusFilter === "pending" ? "all" : "pending")}
          >
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusFilter === "pending" ? "bg-amber-600" : "bg-amber-500"
                    }`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-xs font-medium text-gray-500 truncate">Chờ phản hồi</dt>
                    <dd className="text-xl font-bold text-gray-900">{pending}</dd>
                  </dl>
                </div>
                {statusFilter === "pending" && (
                  <div className="ml-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={`bg-white overflow-hidden shadow-sm rounded-lg border-2 hover:shadow-md transition-all duration-200 cursor-pointer ${statusFilter === "responded" ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"
              }`}
            onClick={() => handleStatusFilterChange(statusFilter === "responded" ? "all" : "responded")}
          >
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusFilter === "responded" ? "bg-emerald-600" : "bg-emerald-500"
                    }`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-xs font-medium text-gray-500 truncate">Đã phản hồi</dt>
                    <dd className="text-xl font-bold text-gray-900">{responded}</dd>
                  </dl>
                </div>
                {statusFilter === "responded" && (
                  <div className="ml-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              data={currentContacts}
              onView={setShowDetail}
              onDelete={handleDelete}
            />
          </div>
          <Pagination />
        </div>

        <ContactDetail
          contact={showDetail}
          isOpen={!!showDetail}
          onClose={() => setShowDetail(null)}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
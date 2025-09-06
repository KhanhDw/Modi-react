import PageHeader from "../../components/admin/common/PageHeader";
import Table from "../../components/admin/common/Table";
import ContactDetail from "../../components/admin/contact/ContactDetail";
import { useState, useEffect, useCallback } from "react";

export default function ContactPage() {
  // Trạng thái để lưu trữ tất cả các liên hệ
  const [contacts, setContacts] = useState([]);
  // Trạng thái để lưu trữ các liên hệ đã được lọc
  const [filteredContacts, setFilteredContacts] = useState([]);
  // Trạng thái để hiển thị chi tiết liên hệ
  const [showDetail, setShowDetail] = useState(null);
  // Trạng thái để theo dõi trang hiện tại của bảng
  const [currentPage, setCurrentPage] = useState(1);
  // Số lượng mục trên mỗi trang (tính toán động)
  const [itemsPerPage, setItemsPerPage] = useState(7);
  // Bộ lọc theo ngày
  const [dateFilter, setDateFilter] = useState("all");
  // Bộ lọc theo trạng thái
  const [statusFilter, setStatusFilter] = useState("all");
  // Thanh tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // Tính toán số lượng mục trên mỗi trang một cách linh hoạt dựa trên kích thước màn hình và tỷ lệ zoom
  const calculateItemsPerPage = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Tính toán chiều cao khả dụng cho bảng (trừ đi chiều cao của header, bộ lọc, phân trang, v.v.)
    const headerHeight = 120; // Chiều cao xấp xỉ của header + bộ lọc
    const paginationHeight = 80; // Chiều cao của phân trang
    const statsHeight = 120; // Chiều cao của các thẻ thống kê
    const rowHeight = 65; // Chiều cao xấp xỉ của mỗi hàng
    const padding = 60; // Phần đệm thêm

    const availableHeight = viewportHeight - headerHeight - paginationHeight - statsHeight - padding;
    let calculatedRows = Math.floor(availableHeight / rowHeight);

    // Ước lượng tỷ lệ zoom (giả sử 100% là mức mặc định)
    const zoomLevel = window.devicePixelRatio * 100; // Ví dụ: 1.25 cho 125%

    // Điều chỉnh số hàng dựa trên tỷ lệ zoom
    if (zoomLevel === 125) {
      calculatedRows += 2; // Thêm 2 hàng ở 125%
    } else if (zoomLevel === 150) {
      calculatedRows += 1; // Thêm 1 hàng ở 150%
    } else if (zoomLevel > 150) {
      calculatedRows = Math.max(5, calculatedRows - 1); // Giảm 1 hàng nếu zoom lớn hơn 150%
    } else if (zoomLevel < 100) {
      calculatedRows = Math.max(5, calculatedRows - 1); // Giảm 1 hàng nếu zoom nhỏ hơn 100%
    }

    // Đặt giới hạn tối thiểu và tối đa
    const minRows = 5;
    const maxRows = 15;

    let finalRows = Math.max(minRows, Math.min(maxRows, calculatedRows));

    // Điều chỉnh dựa trên chiều rộng màn hình để có khả năng thích ứng tốt hơn
    if (viewportWidth < 1200) {
      finalRows = Math.max(5, finalRows - 1);
    }
    if (viewportWidth > 1600) {
      finalRows = Math.min(maxRows, finalRows + 1);
    }

    return finalRows;
  }, []);

  // Cập nhật số lượng mục trên mỗi trang khi thay đổi kích thước cửa sổ
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = calculateItemsPerPage();
      setItemsPerPage(newItemsPerPage);
    };

    // Đặt số lượng mục trên mỗi trang ban đầu
    handleResize();

    // Thêm trình lắng nghe sự kiện thay đổi kích thước
    window.addEventListener('resize', handleResize);

    // Dọn dẹp
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateItemsPerPage]);

  // Lấy dữ liệu liên hệ từ backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/lienhe`)
      .then((response) => response.json())
      .then((data) => {
        setContacts(data);
        setFilteredContacts(data);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, []);

  // Áp dụng các bộ lọc và tìm kiếm
  useEffect(() => {
    let filtered = [...contacts];

    // Tìm kiếm theo tên, số điện thoại hoặc email
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.so_dien_thoai.includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      const statusText = statusFilter === "responded" ? "Đã phản hồi" : "Chưa phản hồi";
      filtered = filtered.filter(contact => contact.trang_thai === statusText);
    }

    // Lọc theo khoảng ngày
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
    setCurrentPage(1);
  }, [contacts, dateFilter, statusFilter, searchTerm]);

  // Tính toán số liệu thống kê cho dữ liệu đã lọc hiện tại
  const calculateStats = () => {
    const total = filteredContacts.length;
    const pending = filteredContacts.filter(c => c.trang_thai === "Chưa phản hồi").length;
    const responded = filteredContacts.filter(c => c.trang_thai === "Đã phản hồi").length;
    return { total, pending, responded };
  };

  const { total, pending, responded } = calculateStats();

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  // Cấu hình cột thích ứng
  const getResponsiveColumns = () => {
    const baseColumns = [
      {
        key: "ho_ten",
        label: "Họ tên",
        className: "font-semibold admin-dark:text-gray-100 text-gray-900 min-w-[160px]",
        render: (value) => (
          <div className="flex items-center">
            <div className="w-8 h-8 admin-dark:bg-blue-900 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="admin-dark:text-blue-300 text-blue-600 font-semibold text-sm">
                {value.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="truncate">{value}</span>
          </div>
        )
      },
      {
        key: "email",
        label: "Email",
        className: "min-w-[180px]",
        render: (value) => (
          <span className="admin-dark:text-gray-300 text-gray-600 truncate block">{value}</span>
        )
      },
      {
        key: "so_dien_thoai",
        label: "Điện thoại",
        className: "min-w-[120px]",
        render: (value) => (
          <span className="font-mono text-sm admin-dark:text-gray-200 text-gray-700">{value}</span>
        )
      },
      {
        key: "trang_thai",
        label: "Trạng thái",
        className: "min-w-[140px]",
        render: (value) => (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${value === "Đã phản hồi"
              ? "admin-dark:bg-emerald-900 admin-dark:text-emerald-300 admin-dark:border-emerald-700 bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "admin-dark:bg-amber-900 admin-dark:text-amber-300 admin-dark:border-amber-700 bg-amber-100 text-amber-800 border border-amber-200"
              }`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${value === "Đã phản hồi" ? "admin-dark:bg-emerald-400 bg-emerald-400" : "admin-dark:bg-amber-400 bg-amber-400"
              }`}></div>
            {value}
          </span>
        ),
      },
      {
        key: "ngay_gui",
        label: "Ngày gửi",
        className: "min-w-[120px]",
        render: (value) => {
          const date = new Date(value);
          return (
            <div className="text-sm">
              <div className="font-medium admin-dark:text-gray-100 text-gray-900">
                {date.toLocaleDateString('vi-VN')}
              </div>
              <div className="admin-dark:text-gray-400 text-gray-500 text-xs">
                {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        }
      }
    ];

    return baseColumns;
  };

  const columns = getResponsiveColumns();

  // Xử lý việc xóa liên hệ
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

  // Xử lý việc thay đổi trạng thái
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

  // Xử lý thay đổi bộ lọc ngày
  const handleFilterChange = (value) => {
    setDateFilter(value);
  };

  // Xử lý thay đổi bộ lọc trạng thái
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  // Xử lý hiển thị tất cả
  const handleShowAll = () => {
    setStatusFilter("all");
    setDateFilter("all");
    setSearchTerm("");
  };

  // Thành phần phân trang
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
      <div className="flex items-center justify-between border-t admin-dark:border-gray-700 border-gray-200 admin-dark:bg-gray-800 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:text-gray-300 admin-dark:hover:bg-gray-600 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:text-gray-300 admin-dark:hover:bg-gray-600 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>

          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 admin-dark:text-gray-400 admin-dark:ring-gray-600 admin-dark:hover:bg-gray-700 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold admin-dark:text-gray-200 admin-dark:ring-gray-600 admin-dark:hover:bg-gray-700 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold admin-dark:text-gray-400 admin-dark:ring-gray-600 text-gray-700 ring-1 ring-inset ring-gray-300">
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
                    : 'admin-dark:text-gray-200 admin-dark:ring-gray-600 admin-dark:hover:bg-gray-700 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                >
                  {page}
                </button>
              ))}

              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold admin-dark:text-gray-400 admin-dark:ring-gray-600 text-gray-700 ring-1 ring-inset ring-gray-300">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold admin-dark:text-gray-200 admin-dark:ring-gray-600 admin-dark:hover:bg-gray-700 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 admin-dark:text-gray-400 admin-dark:ring-gray-600 admin-dark:hover:bg-gray-700 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className=" admin-dark:bg-gray-900 bg-white">
      <div className="mx-auto ">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold admin-dark:text-gray-100 text-gray-900">Quản lý liên hệ</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Thanh tìm kiếm */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, số điện thoại, email..."
              className="px-4 py-2 border admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:placeholder-gray-400 admin-dark:focus:ring-blue-400 admin-dark:focus:border-blue-400 admin-dark:hover:bg-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 w-full sm:w-64"
            />
            {/* Bộ lọc ngày */}
            <select
              value={dateFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 border admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:focus:ring-blue-400 admin-dark:focus:border-blue-400 admin-dark:hover:bg-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 min-w-[160px]"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>
        </div>

        {/* Các thẻ thống kê với lưới đáp ứng */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            className={`admin-dark:bg-gray-800 bg-white overflow-hidden shadow-sm rounded-lg border-2 hover:shadow-md transition-all duration-200 cursor-pointer ${statusFilter === "all" && dateFilter === "all"
              ? "admin-dark:border-blue-500 admin-dark:bg-blue-900/20 border-blue-400 bg-blue-50"
              : "admin-dark:border-gray-600 admin-dark:hover:border-blue-400 border-gray-200 hover:border-blue-300"
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
                    <dt className="text-xs font-medium admin-dark:text-gray-400 text-gray-500 truncate">Tổng liên hệ</dt>
                    <dd className="text-xl font-bold admin-dark:text-gray-100 text-gray-900">{total}</dd>
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
            className={`admin-dark:bg-gray-800 bg-white overflow-hidden shadow-sm rounded-lg border-2 hover:shadow-md transition-all duration-200 cursor-pointer ${statusFilter === "pending"
              ? "admin-dark:border-amber-500 admin-dark:bg-amber-900/20 border-amber-400 bg-amber-50"
              : "admin-dark:border-gray-600 admin-dark:hover:border-amber-400 border-gray-200 hover:border-amber-300"
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
                    <dt className="text-xs font-medium admin-dark:text-gray-400 text-gray-500 truncate">Chờ phản hồi</dt>
                    <dd className="text-xl font-bold admin-dark:text-gray-100 text-gray-900">{pending}</dd>
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
            className={`admin-dark:bg-gray-800 bg-white overflow-hidden shadow-sm rounded-lg border-2 hover:shadow-md transition-all duration-200 cursor-pointer ${statusFilter === "responded"
              ? "admin-dark:border-emerald-500 admin-dark:bg-emerald-900/20 border-emerald-400 bg-emerald-50"
              : "admin-dark:border-gray-600 admin-dark:hover:border-emerald-400 border-gray-200 hover:border-emerald-300"
              } sm:col-span-2 xl:col-span-1`}
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
                    <dt className="text-xs font-medium admin-dark:text-gray-400 text-gray-500 truncate">Đã phản hồi</dt>
                    <dd className="text-xl font-bold admin-dark:text-gray-100 text-gray-900">{responded}</dd>
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

        {/* Bảng với thiết kế đáp ứng được cải thiện */}
        <div className="admin-dark:bg-gray-800 bg-white shadow-sm rounded-lg border admin-dark:border-gray-700 border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div style={{ minWidth: '800px' }}> {/* Đảm bảo chiều rộng tối thiểu cho bảng */}
              <Table
                columns={columns}
                data={currentContacts}
                onView={setShowDetail}
                onDelete={handleDelete}
              />
            </div>
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
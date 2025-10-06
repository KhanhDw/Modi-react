import PageList from "@/components/feature/pagination.jsx";
import { useCallback, useEffect, useState } from "react";
import Table from "../../components/admin/common/Table";
import ContactDetail from "../../components/admin/contact/ContactDetail";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [showDetail, setShowDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const calculateItemsPerPage = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const headerHeight = 120;
    const paginationHeight = 80;
    const statsHeight = 120;
    const rowHeight = 65;
    const padding = 60;

    const availableHeight =
      viewportHeight - headerHeight - paginationHeight - statsHeight - padding;
    let calculatedRows = Math.floor(availableHeight / rowHeight);

    if (viewportWidth < 480) {
      calculatedRows = Math.max(3, calculatedRows - 2);
    } else if (viewportWidth < 768) {
      calculatedRows = Math.max(4, calculatedRows - 1);
    }

    const zoomLevel = window.devicePixelRatio * 100;
    if (zoomLevel >= 150) {
      calculatedRows = Math.max(3, calculatedRows - 1);
    } else if (zoomLevel < 100) {
      calculatedRows = Math.max(3, calculatedRows + 1);
    }

    const minRows = 3;
    const maxRows = 10;
    return Math.max(minRows, Math.min(maxRows, calculatedRows));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = calculateItemsPerPage();
      setItemsPerPage(newItemsPerPage);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateItemsPerPage]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/lienhe`)
      .then((response) => response.json())
      .then((data) => {
        setContacts(data);
        setFilteredContacts(data);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, []);

  useEffect(() => {
    let filtered = [...contacts];
    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.so_dien_thoai.includes(searchTerm) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      const statusText =
        statusFilter === "responded" ? "Đã phản hồi" : "Chưa phản hồi";
      filtered = filtered.filter(
        (contact) => contact.trang_thai === statusText
      );
    }
    if (dateFilter !== "all") {
      const today = new Date();
      let startDate, endDate;
      switch (dateFilter) {
        case "today":
          startDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
          endDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59
          );
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
        filtered = filtered.filter((contact) => {
          const contactDate = new Date(contact.ngay_gui);
          return contactDate >= startDate && contactDate <= endDate;
        });
      }
    }
    setFilteredContacts(filtered);
    setCurrentPage(1);
  }, [contacts, dateFilter, statusFilter, searchTerm]);

  const calculateStats = () => {
    const total = filteredContacts.length;
    const pending = filteredContacts.filter(
      (c) => c.trang_thai === "Chưa phản hồi"
    ).length;
    const responded = filteredContacts.filter(
      (c) => c.trang_thai === "Đã phản hồi"
    ).length;
    return { total, pending, responded };
  };

  const { total, pending, responded } = calculateStats();
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  const getResponsiveColumns = () => {
    const baseColumns = [
      {
        key: "ho_ten",
        label: "Họ tên",
        className:
          "font-semibold admin-dark:text-gray-100 text-gray-900 overflow-hidden",
        render: (value) => (
          <div className="flex items-center">
            <div className="w-5 h-5 sm:w-6 sm:h-6 admin-dark:bg-blue-900 bg-blue-100 rounded-full flex items-center justify-center mr-1 sm:mr-2 flex-shrink-0">
              <span className="admin-dark:text-blue-300 text-blue-600 font-semibold text-xs">
                {value.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="truncate">{value}</span>
          </div>
        ),
      },
      {
        key: "email",
        label: "Email",
        className: "overflow-hidden",
        render: (value) => (
          <span className="admin-dark:text-gray-300 text-gray-600 truncate block">
            {value}
          </span>
        ),
      },
      {
        key: "so_dien_thoai",
        label: "Điện thoại",
        className: "overflow-hidden",
        render: (value) => (
          <span className="font-mono text-xs sm:text-sm admin-dark:text-gray-200 text-gray-700 truncate">
            {value}
          </span>
        ),
      },
      {
        key: "trang_thai",
        label: "Trạng thái",
        className: "overflow-hidden",
        render: (value) => (
          <span
            className={` inline-flex items-center px-1 sm:px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap truncate ${
              value === "Đã phản hồi"
                ? "admin-dark:bg-emerald-900 admin-dark:text-emerald-300 admin-dark:border-emerald-700 bg-emerald-100 text-emerald-800 border border-emerald-200"
                : "admin-dark:bg-amber-900 admin-dark:text-amber-300 admin-dark:border-amber-700 bg-amber-100 text-amber-800 border border-amber-200"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 sm:mr-2 flex-shrink-0 ${
                value === "Đã phản hồi"
                  ? "admin-dark:bg-emerald-400 bg-emerald-400"
                  : "admin-dark:bg-amber-400 bg-amber-400"
              }`}
            ></div>
            {value}
          </span>
        ),
      },
      {
        key: "ngay_gui",
        label: "Ngày gửi",
        className: "overflow-hidden",
        render: (value) => {
          const date = new Date(value);
          return (
            <div className="text-xs sm:text-sm">
              <div className="font-medium admin-dark:text-gray-100 text-gray-900 truncate">
                {date.toLocaleDateString("vi-VN")}
              </div>
              <div className="admin-dark:text-gray-400 text-gray-500 text-xs truncate">
                {date.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        },
      },
    ];
    return baseColumns;
  };

  const columns = getResponsiveColumns();

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
    setSearchTerm("");
  };

  return (
    <div className="admin-dark:bg-gray-900 bg-white min-h-screen">
      <div className="mx-auto max-w-[100%]">
        <div className="flex xs:flex-col sm:flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-4 w-full">
          <h1 className="text-lg sm:text-xl text-center font-bold admin-dark:text-gray-100 text-gray-900">
            Quản lý liên hệ
          </h1>
          <div className="flex flex-col flex-wrap justify-between sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
            <input
              autoComplete="off"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, số điện thoại, email..."
              className="px-3 sm:px-1 py-2 border admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:placeholder-gray-400 admin-dark:focus:ring-blue-400 admin-dark:focus:border-blue-400 admin-dark:hover:bg-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 w-full sm:w-65 md:w-70 focus:border-none"
            />
            <select
              value={dateFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 sm:px-3 py-2 border admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:focus:ring-blue-400 admin-dark:focus:border-blue-400 admin-dark:hover:bg-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 w-full sm:w-40 focus:border-none cursor-pointer"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>
        </div>

        <div className="mb-4 sm:mb-6 xs:grid xs:grid-cols-1 md:grid-cols-6 gap-3 sm:gap-3">
          <div
            className={`col-span-2 admin-dark:bg-gray-800 bg-white overflow-hidden shadow-sm rounded-lg border-2 hover:shadow-md transition-all duration-200 cursor-pointer ${
              statusFilter === "all" && dateFilter === "all"
                ? "admin-dark:border-blue-500 admin-dark:bg-blue-900/20 border-blue-400 bg-blue-50"
                : "admin-dark:border-gray-600 admin-dark:hover:border-blue-400 border-gray-200 hover:border-blue-300"
            }`}
            onClick={handleShowAll}
          >
            <div className="p-3 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center ${
                      statusFilter === "all" && dateFilter === "all"
                        ? "bg-blue-600"
                        : "bg-blue-500"
                    }`}
                  >
                    <svg
                      className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h2"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-2 sm:ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-xs font-medium admin-dark:text-gray-400 text-gray-500 truncate">
                      Tổng liên hệ
                    </dt>
                    <dd className="text-lg sm:text-xl font-bold admin-dark:text-gray-100 text-gray-900">
                      {total}
                    </dd>
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
          <div className="xs:grid xs:grid-cols-2 md:col-span-4 gap-3 sm:gap-3">
            <div
              className={`admin-dark:bg-gray-800 bg-white overflow-hidden shadow-sm rounded-lg border-2 hover:shadow-md transition-all duration-200 cursor-pointer ${
                statusFilter === "pending"
                  ? "admin-dark:border-amber-500 admin-dark:bg-amber-900/20 border-amber-400 bg-amber-50"
                  : "admin-dark:border-gray-600 admin-dark:hover:border-amber-400 border-gray-200 hover:border-amber-300"
              }`}
              onClick={() =>
                handleStatusFilterChange(
                  statusFilter === "pending" ? "all" : "pending"
                )
              }
            >
              <div className="p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div
                      className={`xs:hidden  w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:flex items-center justify-center ${
                        statusFilter === "pending"
                          ? "bg-amber-600"
                          : "bg-amber-500"
                      }`}
                    >
                      <svg
                        className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-2 sm:ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-xs font-medium admin-dark:text-gray-400 text-gray-500 truncate">
                        Chờ phản hồi
                      </dt>
                      <dd className="text-lg sm:text-xl font-bold admin-dark:text-gray-100 text-gray-900">
                        {pending}
                      </dd>
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
              className={`admin-dark:bg-gray-800 bg-white overflow-hidden shadow-sm rounded-lg border-2 hover:shadow-md transition-all duration-200 cursor-pointer ${
                statusFilter === "responded"
                  ? "admin-dark:border-emerald-500 admin-dark:bg-emerald-900/20 border-emerald-400 bg-emerald-50"
                  : "admin-dark:border-gray-600 admin-dark:hover:border-emerald-400 border-gray-200 hover:border-emerald-300"
              }`}
              onClick={() =>
                handleStatusFilterChange(
                  statusFilter === "responded" ? "all" : "responded"
                )
              }
            >
              <div className="p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div
                      className={`xs:hidden  w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:flex items-center justify-center ${
                        statusFilter === "responded"
                          ? "bg-emerald-600"
                          : "bg-emerald-500"
                      }`}
                    >
                      <svg
                        className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-2 sm:ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-xs font-medium admin-dark:text-gray-400 text-gray-500 truncate">
                        Đã phản hồi
                      </dt>
                      <dd className="text-lg sm:text-xl font-bold admin-dark:text-gray-100 text-gray-900">
                        {responded}
                      </dd>
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
        </div>

        <div className="admin-dark:bg-gray-800 bg-white shadow-sm rounded-lg border admin-dark:border-gray-700 border-gray-200 overflow-hidden w-full">
          <div className="overflow-hidden">
            <Table
              columns={columns}
              data={currentContacts}
              onView={setShowDetail}
              onDelete={handleDelete}
            />
          </div>
        </div>
        <div className="w-full">
          <PageList
            data={filteredContacts}
            pageSize={itemsPerPage}
            onPageChange={(pageData) => {
              // pageData = dữ liệu đã cắt theo trang
              // bạn có thể truyền trực tiếp cho bảng thay vì currentContacts
              // nhưng mình vẫn giữ currentContacts cho dễ debug
            }}
            onPageNumberChange={(pageNum) => setCurrentPage(pageNum)}
          />
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

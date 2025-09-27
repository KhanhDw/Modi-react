import React, { useState, useMemo, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import UserForm from "@/components/admin/userForm/UserForm.jsx";
import "../../styles/scrollbar.css";
import PageList from "@/components/feature/pagination.jsx";

const DEFAULT_PAGE_SIZE = 8;

function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export default function AdminZonePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [fade, setFade] = useState(true);
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paginatedData, setPaginatedData] = useState([]);

  // quản lý form
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/users`
      );
      setUsers(res.data.data || []);
      setColumns(res.data.column || []);
    } catch (err) {
      console.error("Lỗi lấy users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentUser(res.data.user);
    } catch (err) {
      console.error("Lỗi lấy current user:", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const filteredData = useMemo(() => {
    if (!search.trim()) return users;
    const normalizedSearch = removeVietnameseTones(search.trim());
    return users.filter(
      (item) =>
        removeVietnameseTones(item.full_name).includes(normalizedSearch) ||
        removeVietnameseTones(item.email).includes(normalizedSearch) ||
        removeVietnameseTones(item.username).includes(normalizedSearch)
    );
  }, [search, users]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => setFade(true), 150);
    return () => clearTimeout(timeout);
  }, [page, search, pageSize]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_MAIN_BE_URL}/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  const formatValue = (value) => {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${date.getFullYear()}`;
    }
    return value;
  };

  return (
    <div>
      <div className="mx-auto rounded-xl border-gray-200 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-900 p-6 transition-all duration-500 ease-in-out">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 admin-dark:text-white">
            Quản lý tài khoản nhân viên
          </h2>

          <div className="relative w-full max-w-xs flex-grow">
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
            <input
              type="search"
              placeholder="Tìm kiếm..."
              value={search}
              spellCheck={false}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm sm:text-base bg-white admin-dark:bg-gray-800 text-gray-900 admin-dark:text-gray-200"
            />
          </div>

          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white border border-transparent
              admin-dark:bg-gray-800 admin-dark:hover:bg-gray-700 
              admin-dark:text-gray-200 admin-dark:border-gray-600
              px-2 py-2 rounded-lg transition flex-shrink-0 cursor-pointer text-sm sm:text-base min-w-[90px] whitespace-nowrap"
            type="button"
          >
            + Thêm mới
          </button>
        </div>

        {/* Table */}
        <div
          className={`overflow-x-auto rounded-xl border border-gray-200 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-900 transition-opacity duration-500 ease-in-out scrollbar-thin ${fade ? "opacity-100 shadow-md" : "opacity-0"
            }`}
        >
          <table className="min-w-full border-collapse table-auto text-sm sm:text-base leading-6">
            <thead>
              <tr className="bg-gray-50 admin-dark:bg-gray-800 text-gray-700 admin-dark:text-gray-300 uppercase tracking-wider text-xs sm:text-sm border-b border-gray-200 admin-dark:border-gray-700">
                {columns.map((col) => (
                  <th
                    key={col.name}
                    className="px-3 sm:px-4 py-3 text-left font-semibold whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-3 sm:px-4 py-3 text-center font-semibold whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="last:border-none hover:bg-purple-50 admin-dark:hover:bg-gray-800 transition-colors duration-150 border-b border-gray-100 admin-dark:border-gray-700"
                  >
                    {Object.keys(item)
                      .filter((key) => key !== "id")
                      .map((key, index) => {
                        let cellContent = item[key];
                        if (key === "created_at" || key === "updated_at") {
                          cellContent = formatValue(item[key]);
                        } else if (key === "avatar_url") {
                          const rawUrl = item[key];
                          let avatarUrl = rawUrl?.startsWith("/image/")
                            ? `${import.meta.env.VITE_MAIN_BE_URL}${rawUrl}`
                            : rawUrl;

                          cellContent = avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt="Avatar"
                              className="w-10 h-10 rounded-full object-cover border border-gray-200 admin-dark:border-gray-600"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
                              N/A
                            </div>
                          );
                        }
                        return (
                          <td
                            key={index}
                            className={`px-3 sm:px-4 py-3 text-gray-700 admin-dark:text-gray-300 ${index === 0 ? "whitespace-nowrap font-medium" : ""
                              }`}
                          >
                            {cellContent}
                          </td>
                        );
                      })}

                    <td className="px-3 sm:px-4 py-3 text-gray-700 admin-dark:text-gray-300 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => {
                            setEditingUser(item);
                            setShowForm(true);
                          }}
                          disabled={currentUser && item.id === currentUser.id}
                          className={`flex items-center gap-1 transition cursor-pointer ${currentUser && item.id === currentUser.id
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 admin-dark:text-blue-400 hover:text-blue-500"
                            }`}
                        >
                          <FiEdit2 size={18} />
                          <span className="text-sm font-medium">Sửa</span>
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={currentUser && item.id === currentUser.id}
                          className={`flex items-center gap-1 transition cursor-pointer ${currentUser && item.id === currentUser.id
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 admin-dark:text-red-500 hover:text-red-500"
                            }`}
                        >
                          <FiTrash2 size={18} />
                          <span className="text-sm font-medium">Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="h-20">
                  <td
                    colSpan={columns.length + 1}
                    className="text-center text-gray-500 admin-dark:text-gray-400 text-sm"
                  >
                    Không tìm thấy kết quả
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-4">
          <PageList
            data={filteredData}
            pageSize={pageSize}
            onPageChange={setPaginatedData}
            onPageNumberChange={setPage}
          />
        </div>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}

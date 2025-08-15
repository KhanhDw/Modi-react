import React, { useState, useMemo, useEffect } from 'react';
import {
    FiSearch,
    FiEdit2,
    FiTrash2,
} from 'react-icons/fi';
import '../../styles/scrollbar.css';

const PAGE_SIZE = 5;

const users = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'a.nguyen@example.com',
        username: 'nguyenvana',
        role: 'Quản trị viên',
        status: 'Hoạt động',
    },
    {
        id: 2,
        name: 'Trần Thị B',
        email: 'b.tran@example.com',
        username: 'tranthib',
        role: 'Nhân viên',
        status: 'Đang chờ',
    },
    {
        id: 3,
        name: 'Lê Văn C',
        email: 'c.le@example.com',
        username: 'levanc',
        role: 'Nhân viên',
        status: 'Đã khóa',
    },
    {
        id: 4,
        name: 'Phạm Thị D',
        email: 'd.pham@example.com',
        username: 'phamthid',
        role: 'Quản lý',
        status: 'Hoạt động',
    },
    {
        id: 5,
        name: 'Hoàng Văn E',
        email: 'e.hoang@example.com',
        username: 'hoangvane',
        role: 'Nhân viên',
        status: 'Hoạt động',
    },
    {
        id: 6,
        name: 'Đinh Văn F',
        email: 'f.dinh@example.com',
        username: 'dinhvanf',
        role: 'Nhân viên',
        status: 'Đang chờ',
    },
    {
        id: 7,
        name: 'Ngô Thị G',
        email: 'g.ngo@example.com',
        username: 'ngothig',
        role: 'Quản lý',
        status: 'Đã khóa',
    },
];

function removeVietnameseTones(str) {
    return str
        .normalize('NFD')                     // Tách ký tự và dấu
        .replace(/[\u0300-\u036f]/g, '')      // Xóa dấu
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();
}

export default function AdminZonePage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [fade, setFade] = useState(true);

    const filteredData = useMemo(() => {
        if (!search.trim()) return users;

        const normalizedSearch = removeVietnameseTones(search.trim());

        return users.filter((item) =>
            //tim kiem name email user
            removeVietnameseTones(item.name).includes(normalizedSearch) ||
            removeVietnameseTones(item.email).includes(normalizedSearch) ||
            removeVietnameseTones(item.username).includes(normalizedSearch)
        );
    }, [search]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredData.slice(start, start + PAGE_SIZE);
    }, [page, filteredData]);

    const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

    useEffect(() => {
        setFade(false);
        const timeout = setTimeout(() => setFade(true), 150);
        return () => clearTimeout(timeout);
    }, [page, search]);

    return (
        <div>
            <h2 className="text-2xl p-6 font-bold text-gray-900 admin-dark:text-white">
                Quản lý nhân viên
            </h2>

            <div className="max-w-6xl mx-auto rounded-xl shadow-xl border border-gray-200 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-900 p-6 transition-all duration-500 ease-in-out">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 admin-dark:text-white flex-shrink-0 whitespace-nowrap">
                        Tài khoản
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
                        className="bg-blue-600 hover:bg-blue-700 text-white border border-transparent
    admin-dark:bg-gray-800 admin-dark:hover:bg-gray-700 
    admin-dark:text-gray-200 admin-dark:border-gray-600
    px-4 py-2 rounded-lg transition flex-shrink-0 cursor-pointer text-sm sm:text-base min-w-[90px] whitespace-nowrap"
                        type="button"
                    >
                        + Thêm mới
                    </button>


                </div>

                {/* Table */}
                <div
                    className={`overflow-x-auto rounded-xl border border-gray-200 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-900 transition-opacity duration-500 ease-in-out scrollbar-thin ${fade ? 'opacity-100 shadow-md' : 'opacity-0'}`}
                >
                    <table className="min-w-full border-collapse table-auto text-sm sm:text-base leading-6">
                        <thead>
                            <tr className="bg-gray-100 admin-dark:bg-gray-800 text-left text-gray-600 admin-dark:text-gray-300 uppercase text-sm select-none border-b border-gray-200 admin-dark:border-gray-700">
                                <th className="py-3 px-6 whitespace-nowrap">Tên nhân viên</th>
                                <th className="py-3 px-6 whitespace-nowrap">Email</th>
                                <th className="py-3 px-6 whitespace-nowrap">Tên đăng nhập</th>
                                <th className="py-3 px-6 whitespace-nowrap">Vai trò</th>
                                <th className="py-3 px-6 whitespace-nowrap">Trạng thái</th>
                                <th className="py-3 px-6 whitespace-nowrap text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-purple-50 admin-dark:hover:bg-gray-800 transition duration-150 cursor-pointer border-b border-gray-100 admin-dark:border-gray-700"
                                    >
                                        <td className="py-3 px-6 text-gray-700 admin-dark:text-gray-300">{item.name}</td>
                                        <td className="py-3 px-6 text-gray-700 admin-dark:text-gray-300">{item.email}</td>
                                        <td className="py-3 px-6 text-gray-700 admin-dark:text-gray-300">{item.username}</td>
                                        <td className="py-3 px-6 text-gray-700 admin-dark:text-gray-300 whitespace-nowrap">{item.role}</td>
                                        <td className="py-3 px-6 text-gray-700 admin-dark:text-gray-300">{item.status}</td>
                                        <td className="py-3 px-6 text-gray-700 admin-dark:text-gray-300 text-center">
                                            <div className="flex justify-center gap-4">
                                                {/* Sửa */}
                                                <button
                                                    title="Chỉnh sửa"
                                                    onClick={() => console.log('Sửa', item.username)}
                                                    className="flex items-center gap-1 text-blue-600 admin-dark:text-blue-400 hover:text-blue-500 admin-dark:hover:text-blue-300 transition cursor-pointer"
                                                >
                                                    <FiEdit2 size={18} />
                                                    <span className="text-sm font-medium">Sửa</span>
                                                </button>

                                                {/* Xóa */}
                                                <button
                                                    title="Xóa"
                                                    onClick={() => console.log('Xóa', item.username)}
                                                    className="flex items-center gap-1 text-red-600 admin-dark:text-red-500 hover:text-red-500 admin-dark:hover:text-red-400 transition cursor-pointer"
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
                                    <td colSpan="6" className="text-center text-gray-500 admin-dark:text-gray-400">
                                        Không tìm thấy kết quả
                                    </td>
                                </tr>
                            )}
                            {paginatedData.length < PAGE_SIZE &&
                                [...Array(PAGE_SIZE - paginatedData.length)].map((_, idx) => (
                                    <tr key={`empty-${idx}`} className="h-12">
                                        <td colSpan="6" />
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-gray-500 admin-dark:text-gray-400 text-sm mt-6 gap-4 sm:gap-0">
                    <div>
                        Hiển thị {(page - 1) * PAGE_SIZE + 1} -{' '}
                        {Math.min(page * PAGE_SIZE, filteredData.length)} trong tổng số {filteredData.length}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {/* Trang trước */}
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-300 admin-dark:border-gray-600
                 text-gray-700 admin-dark:text-gray-300 
                 hover:bg-purple-100 admin-dark:hover:bg-gray-800 
                 disabled:text-gray-300 admin-dark:disabled:text-gray-500 
                 transition cursor-pointer"
                            aria-label="Trang trước"
                        >
                            &lt;
                        </button>

                        {/* Các số trang */}
                        {[...Array(totalPages).keys()].map((num) => {
                            const isActive = page === num + 1;
                            return (
                                <button
                                    key={num + 1}
                                    onClick={() => setPage(num + 1)}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center border 
    ${isActive
                                            ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-lg admin-dark:bg-gray-400 admin-dark:border-gray-400 admin-dark:text-white'
                                            : 'border-gray-300 admin-dark:border-gray-600 text-gray-700 admin-dark:text-gray-300 hover:bg-blue-100 admin-dark:hover:bg-gray-800'} 
    transition cursor-pointer`}
                                    aria-current={isActive ? 'page' : undefined}
                                    aria-label={`Trang ${num + 1}`}
                                >
                                    {num + 1}
                                </button>

                            );
                        })}


                        {/* Trang tiếp theo */}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-300 admin-dark:border-gray-600
                 text-gray-700 admin-dark:text-gray-300 
                 hover:bg-purple-100 admin-dark:hover:bg-gray-800 
                 disabled:text-gray-300 admin-dark:disabled:text-gray-500 
                 transition cursor-pointer"
                            aria-label="Trang tiếp theo"
                        >
                            &gt;
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

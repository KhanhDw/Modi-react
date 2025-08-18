import React, { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import productData from '../../data/productsTable';

const PAGE_SIZE = 4;

export default function TopSellingProducts() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        return productData.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Top Selling Product</h2>
                    <div className="relative w-full sm:w-64 mt-3 md:mt-0">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 dark:border-gray-600 text-sm 
                            focus:outline-none focus:ring-2 focus:ring-orange-400 
                            bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                        />
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[380px]"> {/* Giữ chiều cao cố định */}
                    <table className="min-w-full text-sm text-gray-700 dark:text-gray-200">
                        <thead className="text-left bg-white dark:bg-gray-800">
                            <tr className="text-gray-500 dark:text-gray-400">
                                <th className="py-3 px-6">Product</th>
                                <th className="py-3 px-6">Orders</th>
                                <th className="py-3 px-6">Price</th>
                                <th className="py-3 px-6">Ads Spent</th>
                                <th className="py-3 px-6">Refunds</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length > 0 ? (
                                <>
                                    {paginated.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition h-16">
                                            <td className="py-4 px-6 flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />

                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">{item.orders}</td>
                                            <td className="py-4 px-6">{item.price}</td>
                                            <td className="py-4 px-6">{item.adsSpent}</td>
                                            <td className="py-4 px-6">{item.refunds}</td>
                                        </tr>
                                    ))}
                                    {/* Fill empty rows giữ chiều cao */}
                                    {Array.from({ length: PAGE_SIZE - paginated.length }).map((_, idx) => (
                                        <tr key={`empty-${idx}`} className="h-16">
                                            <td colSpan={5} />
                                        </tr>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <tr className="h-24 text-center">
                                        <td colSpan="5" className="text-gray-400 dark:text-gray-500 py-10">
                                            No results found.
                                        </td>
                                    </tr>
                                    {/* Fill empty rows để giữ chiều cao */}
                                    {Array.from({ length: PAGE_SIZE - 1 }).map((_, idx) => (
                                        <tr key={`empty-${idx}`} className="h-16">
                                            <td colSpan={5} />
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-4 text-sm text-gray-500 dark:text-gray-400 gap-4">
                    <span>
                        Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} Products
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 disabled:opacity-30"
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPage(idx + 1)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition
                                    ${page === idx + 1
                                        ? 'bg-orange-500 text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400'
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 disabled:opacity-30"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

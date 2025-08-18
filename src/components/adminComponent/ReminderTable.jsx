import React, { useState, useMemo, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import reminders from '../../data/remindersTable';

const PAGE_SIZE = 5;

export default function ReminderTable() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [fade, setFade] = useState(true);

    const filteredData = useMemo(() => {
        if (!search.trim()) return reminders;
        return reminders.filter(item =>
            item.description.toLowerCase().includes(search.toLowerCase())
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
        <div className="max-w-6xl mx-auto mt-10 bg-white admin-dark:bg-gray-900 rounded-xl shadow-lg p-6 transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 admin-dark:text-gray-100 flex-shrink-0 whitespace-nowrap">
                    Reminder
                </h2>

                <div className="relative w-full max-w-xs flex-grow">
                    <FiSearch
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 admin-dark:text-gray-500 pointer-events-none"
                        size={20}
                    />
                    <input
                        type="search"
                        placeholder="Search..."
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 admin-dark:border-gray-600 bg-white admin-dark:bg-gray-800 text-gray-800 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm sm:text-base"
                    />
                </div>

                <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex-shrink-0 cursor-pointer text-sm sm:text-base min-w-[90px] whitespace-nowrap"
                    type="button"
                >
                    + Add New
                </button>
            </div>

            {/* Table */}
            <div
                className={`overflow-x-auto rounded-md pb-2 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'
                    } scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-200 admin-dark:scrollbar-track-gray-700`}
                style={{ scrollbarColor: '#7c3aed #374151' }}
            >
                <table className="min-w-full border-collapse table-auto">
                    <thead>
                        <tr className="bg-gray-100 admin-dark:bg-gray-800 text-left text-gray-600 admin-dark:text-gray-300 uppercase text-sm select-none">
                            <th className="py-3 px-6 whitespace-nowrap">Description</th>
                            <th className="py-3 px-6 whitespace-nowrap">Due</th>
                            <th className="py-3 px-6 whitespace-nowrap">Overdue</th>
                            <th className="py-3 px-6 whitespace-nowrap">Notify</th>
                            <th className="py-3 px-6 whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map(item => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-purple-50 admin-dark:hover:bg-gray-700 transition duration-150 cursor-pointer"
                                >
                                    <td className="py-3 px-6 text-gray-700 admin-dark:text-gray-200 max-w-[300px] break-words">
                                        {item.description}
                                    </td>
                                    <td className="py-3 px-6 text-gray-700 admin-dark:text-gray-200 whitespace-nowrap">{item.due}</td>
                                    <td className="py-3 px-6 text-gray-700 admin-dark:text-gray-200 whitespace-nowrap">{item.overdue}</td>
                                    <td className="py-3 px-6 text-gray-700 admin-dark:text-gray-200 whitespace-nowrap">{item.notify}</td>
                                    <td className="py-3 px-6 text-gray-700 admin-dark:text-gray-200 whitespace-nowrap">{item.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="h-20">
                                <td colSpan="5" className="text-center text-gray-500 admin-dark:text-gray-400">
                                    No results found
                                </td>
                            </tr>
                        )}

                        {/* Fill empty rows */}
                        {paginatedData.length < PAGE_SIZE &&
                            [...Array(PAGE_SIZE - paginatedData.length)].map((_, idx) => (
                                <tr key={`empty-${idx}`} className="h-12">
                                    <td colSpan="5" />
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-gray-500 admin-dark:text-gray-400 text-sm mt-6 gap-4 sm:gap-0">
                <div>
                    Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filteredData.length)} of {filteredData.length}
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-purple-100 admin-dark:hover:bg-gray-700 disabled:text-gray-300 admin-dark:disabled:text-gray-600 cursor-pointer transition"
                        aria-label="Previous page"
                    >
                        &lt;
                    </button>
                    {[...Array(totalPages).keys()].map(num => (
                        <button
                            key={num + 1}
                            onClick={() => setPage(num + 1)}
                            className={`rounded-full cursor-pointer w-8 h-8 flex items-center justify-center transition
                ${page === num + 1
                                    ? 'bg-purple-600 text-white font-semibold shadow-lg'
                                    : 'hover:bg-purple-100 admin-dark:hover:bg-gray-700 text-gray-700 admin-dark:text-gray-200'
                                }`}
                            aria-current={page === num + 1 ? 'page' : undefined}
                            aria-label={`Page ${num + 1}`}
                        >
                            {num + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-purple-100 admin-dark:hover:bg-gray-700 disabled:text-gray-300 admin-dark:disabled:text-gray-600 cursor-pointer transition"
                        aria-label="Next page"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}

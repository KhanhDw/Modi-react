import { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import paypal from "../assets/images/brand/brand-08.svg";
import apple from "../assets/images/brand/brand-07.svg";
import kickstarter from "../assets/images/brand/brand-15.svg";
import facebook from "../assets/images/brand/brand-02.svg";
import amazon from "../assets/images/brand/brand-10.svg";

const transactions = [
    {
        id: 1,
        name: "Bought PYPL",
        date: "Nov 23, 01:00 PM",
        price: "$2,567.88",
        category: "Finance",
        status: "Success",
        icon: paypal,
    },
    {
        id: 2,
        name: "Bought AAPL",
        date: "Nov 23, 01:00 PM",
        price: "$2,567.88",
        category: "Finance",
        status: "Pending",
        icon: apple,
    },
    {
        id: 3,
        name: "Sell KKST",
        date: "Nov 23, 01:00 PM",
        price: "$2,567.88",
        category: "Finance",
        status: "Success",
        icon: kickstarter,
    },
    {
        id: 4,
        name: "Bought FB",
        date: "Nov 23, 01:00 PM",
        price: "$2,567.88",
        category: "Finance",
        status: "Success",
        icon: facebook,
    },
    {
        id: 5,
        name: "Sell AMZN",
        date: "Nov 23, 01:00 PM",
        price: "$2,567.88",
        category: "Finance",
        status: "Failed",
        icon: amazon,
    },
];

const getStatusColor = (status) => {
    switch (status) {
        case "Success":
            return "bg-green-100 text-green-700";
        case "Pending":
            return "bg-orange-100 text-orange-700";
        case "Failed":
            return "bg-red-100 text-red-600";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

const PAGE_SIZE = 5;

export default function LatestTransactions() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx) =>
            tx.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);

    // Nếu search thay đổi hoặc currentPage vượt quá tổng trang, reset page về 1
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
    }

    const currentTransactions = filteredTransactions.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
    const handlePageClick = (page) => setCurrentPage(page);

    return (
        <div className="bg-white m-2 rounded-2xl p-6 shadow border border-gray-200 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">
                <h2 className="text-lg font-semibold text-gray-800">Latest Transactions</h2>
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm text-gray-600 outline-none focus:ring focus:ring-gray-100"
                    />
                    <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full min-w-[600px] text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-500">
                            <th className="text-left py-3 px-2 font-medium">Name</th>
                            <th className="text-left py-3 px-2 font-medium">Date</th>
                            <th className="text-left py-3 px-2 font-medium">Price</th>
                            <th className="text-left py-3 px-2 font-medium">Category</th>
                            <th className="text-left py-3 px-2 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.length > 0 ? (
                            currentTransactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                                >
                                    <td className="py-4 px-2">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={tx.icon}
                                                alt={tx.name}
                                                className="w-8 h-8 object-contain rounded-full"
                                            />
                                            <span className="text-gray-800 font-medium">{tx.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-gray-600">{tx.date}</td>
                                    <td className="py-4 px-2 text-gray-700">{tx.price}</td>
                                    <td className="py-4 px-2 text-gray-600">{tx.category}</td>
                                    <td className="py-4 px-2">
                                        <span
                                            className={`text-xs px-3 py-1 font-medium rounded-full ${getStatusColor(
                                                tx.status
                                            )}`}
                                        >
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-6 text-gray-400 italic"
                                >
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-center items-center gap-3 mt-6 select-none text-sm font-medium">
                {/* Prev */}
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded text-sm ${currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-orange-500 hover:bg-orange-100"
                        }`}
                >
                    Prev
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition ${currentPage === page
                            ? "bg-orange-500 text-white"
                            : "text-orange-500 hover:bg-orange-100"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Next */}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-1 rounded text-sm ${currentPage === totalPages || totalPages === 0
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-orange-500 hover:bg-orange-100"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

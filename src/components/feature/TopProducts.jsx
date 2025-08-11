import React, { useState } from 'react';

const topProducts = [
    { id: 1, name: 'Home Decor Range', color: '#3B82F6', sales: 45 },
    { id: 2, name: 'Disney Princess Pink Bag 18', color: '#10B981', sales: 29 },
    { id: 3, name: 'Bathroom Essentials', color: '#8B5CF6', sales: 18 },
    { id: 4, name: 'Apple Smartwatches', color: '#FB923C', sales: 25 },
    // thêm sản phẩm nếu muốn
];

const PAGE_SIZE = 2;

const TopProductRow = ({ product }) => {
    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-4 px-6 text-gray-500 text-sm whitespace-nowrap">0{product.id}</td>
            <td className="py-4 px-6 text-gray-700 text-sm whitespace-nowrap">{product.name}</td>
            <td className="py-4 px-6 w-64">
                <div className="bg-gray-200 rounded-full h-2.5 w-full overflow-hidden">
                    <div
                        style={{ width: `${product.sales}%`, backgroundColor: product.color }}
                        className="h-2.5 rounded-full transition-all duration-500"
                    />
                </div>
            </td>
            <td className="py-4 px-6">
                <span
                    style={{ borderColor: product.color, color: product.color }}
                    className="inline-block px-3 py-1 text-sm font-medium rounded-full border"
                >
                    {product.sales}%
                </span>
            </td>
        </tr>
    );
};

const TopProducts = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(topProducts.length / PAGE_SIZE);

    const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
    const handlePageClick = (page) => setCurrentPage(page);

    const currentProducts = topProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <div className="bg-white m-2 rounded-2xl shadow p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Products</h2>
            <table className="min-w-full table-fixed border-collapse">
                <thead className="border-b border-gray-300">
                    <tr>
                        <th className="py-3 px-6 text-left text-gray-400 text-sm font-normal">#</th>
                        <th className="py-3 px-6 text-left text-gray-400 text-sm font-normal">Name</th>
                        <th className="py-3 px-6 text-left text-gray-400 text-sm font-normal">Popularity</th>
                        <th className="py-3 px-6 text-left text-gray-400 text-sm font-normal">Sales</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product) => (
                        <TopProductRow key={product.id} product={product} />
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-6 select-none text-sm font-medium">
                {/* Prev */}
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 rounded text-sm ${currentPage === 1
                        ? 'text-gray-300 cursor-pointer'
                        : 'text-orange-500'
                        }`}
                >
                    Prev
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-semibold ${currentPage === page
                            ? 'bg-orange-500 text-white'
                            : 'text-orange-500'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Next */}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 rounded text-sm ${currentPage === totalPages
                        ? 'text-gray-300 cursor-pointer'
                        : 'text-orange-500'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TopProducts;

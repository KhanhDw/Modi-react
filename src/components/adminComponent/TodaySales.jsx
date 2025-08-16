import React from 'react';
import {
    MdBarChart,
    MdAssignment,
    MdLocalOffer,
    MdGroup,
    MdUpload
} from 'react-icons/md';

const sales = [
    {
        label: 'Total Sales',
        value: '$1k',
        growth: '+8%',
        bgColor: 'bg-red-200 admin-dark:bg-red-900',
        iconBgColor: 'bg-red-400 admin-dark:bg-red-700',
        Icon: MdBarChart,
    },
    {
        label: 'Total Order',
        value: '300',
        growth: '+5%',
        bgColor: 'bg-yellow-200 admin-dark:bg-yellow-900',
        iconBgColor: 'bg-orange-400 admin-dark:bg-orange-700',
        Icon: MdAssignment,
    },
    {
        label: 'Sold',
        value: '5',
        growth: '+1.2%',
        bgColor: 'bg-green-200 admin-dark:bg-green-900',
        iconBgColor: 'bg-green-500 admin-dark:bg-green-700',
        Icon: MdLocalOffer,
    },
    {
        label: 'Customers',
        value: '8',
        growth: '+0.5%',
        bgColor: 'bg-purple-200 admin-dark:bg-purple-900',
        iconBgColor: 'bg-purple-400 admin-dark:bg-purple-700',
        Icon: MdGroup,
    },
];

const SaleCard = ({ item }) => {
    const { label, value, growth, bgColor, iconBgColor, Icon } = item;
    return (
        <div
            className={`${bgColor} rounded-xl p-4 sm:p-6 flex flex-col items-start cursor-pointer transition hover:scale-[1.02]`}
        >
            <div className={`${iconBgColor} w-10 h-10 rounded-full flex items-center justify-center mb-4`}>
                <Icon className="text-white text-xl" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#151d48] admin-dark:text-gray-200 mb-1">
                {value}
            </h3>
            <p className="text-sm sm:text-base font-medium text-[#425166] admin-dark:text-gray-300 mb-1">
                {label}
            </p>
            <p className="text-xs sm:text-sm text-[#4079ed] admin-dark:text-blue-400">
                Last day {growth}
            </p>
        </div>
    );
};

const TodaySales = () => {
    return (
        <div className="bg-white admin-dark:bg-gray-800 m-2 rounded-xl p-4 sm:p-6 lg:p-8 shadow-md max-w-6xl mx-auto transition">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#0f3659] admin-dark:text-gray-100 mb-1">
                        Today's Sales
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-[#737791] admin-dark:text-gray-400">
                        Sales Summary
                    </p>
                </div>
                <button
                    type="button"
                    className="flex items-center gap-2 border border-[#c3d3e2] admin-dark:border-gray-600 rounded-md px-3 sm:px-4 py-2 text-gray-700 admin-dark:text-gray-200 hover:bg-gray-100 admin-dark:hover:bg-gray-700 transition cursor-pointer"
                >
                    <MdUpload className="text-base sm:text-lg" />
                    <span className="text-sm sm:text-base">Export</span>
                </button>
            </div>

            {/* Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {sales.map((item) => (
                    <SaleCard key={item.label} item={item} />
                ))}
            </div>
        </div>
    );
};

export default TodaySales;

import React from 'react';
import {
    MdBarChart,      // total sales icon
    MdAssignment,    // total order icon
    MdLocalOffer,    // sold icon
    MdGroup,         // customers icon
    MdUpload         // export button icon
} from 'react-icons/md';

const sales = [
    {
        label: 'Total Sales',
        value: '$1k',
        growth: '+8%',
        bgColor: 'bg-red-200',
        iconBgColor: 'bg-red-400',
        Icon: MdBarChart,
    },
    {
        label: 'Total Order',
        value: '300',
        growth: '+5%',
        bgColor: 'bg-yellow-200',
        iconBgColor: 'bg-orange-400',
        Icon: MdAssignment,
    },
    {
        label: 'Sold',
        value: '5',
        growth: '+1.2%',
        bgColor: 'bg-green-200',
        iconBgColor: 'bg-green-500',
        Icon: MdLocalOffer,
    },
    {
        label: 'Customers',
        value: '8',
        growth: '+0.5%',
        bgColor: 'bg-purple-200',
        iconBgColor: 'bg-purple-400',
        Icon: MdGroup,
    },
];

const SaleCard = ({ item }) => {
    const { label, value, growth, bgColor, iconBgColor, Icon } = item;
    return (
        <div className={`${bgColor} rounded-xl p-6 flex flex-col items-start`}>
            <div className={`${iconBgColor} w-10 h-10 rounded-full flex items-center justify-center mb-4`}>
                <Icon className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#151d48] mb-1">{value}</h3>
            <p className="text-base font-medium text-[#425166] mb-1">{label}</p>
            <p className="text-sm text-[#4079ed]">Last day {growth}</p>
        </div>
    );
};

const TodaySales = () => {
    return (
        <div className="bg-white m-2 rounded-xl p-8 shadow-md max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-[#0f3659] mb-1">Today's Sales</h2>
                    <p className="text-sm font-semibold text-[#737791]">Sales Summary</p>
                </div>
                <button
                    type="button"
                    className="flex items-center gap-2 border border-[#c3d3e2] rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                    <MdUpload className="text-lg" />
                    Export
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {sales.map((item) => (
                    <SaleCard key={item.label} item={item} />
                ))}
            </div>
        </div>
    );
};

export default TodaySales;

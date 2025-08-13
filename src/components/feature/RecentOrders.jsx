import { FiFilter } from "react-icons/fi";
import product1 from "../assets/images/product/product-01.jpg";
import product2 from "../assets/images/product/product-02.jpg";
import product3 from "../assets/images/product/product-03.jpg";
import product4 from "../assets/images/product/product-04.jpg";
import product5 from "../assets/images/product/product-05.jpg";

const orders = [
    {
        id: 1,
        name: "MacBook Pro 13”",
        variants: "2 Variants",
        category: "Laptop",
        price: "$2399.00",
        status: "Delivered",
        image: product1,
    },
    {
        id: 2,
        name: "Apple Watch Ultra",
        variants: "1 Variant",
        category: "Watch",
        price: "$879.00",
        status: "Pending",
        image: product2,
    },
    {
        id: 3,
        name: "iPhone 15 Pro Max",
        variants: "2 Variants",
        category: "SmartPhone",
        price: "$1869.00",
        status: "Delivered",
        image: product3,
    },
    {
        id: 4,
        name: "iPad Pro 3rd Gen",
        variants: "2 Variants",
        category: "Electronics",
        price: "$1699.00",
        status: "Canceled",
        image: product4,
    },
    {
        id: 5,
        name: "AirPods Pro 2nd Gen",
        variants: "1 Variant",
        category: "Accessories",
        price: "$240.00",
        status: "Delivered",
        image: product5,
    },
];

const getStatusColor = (status) => {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-700";
        case "Pending":
            return "bg-orange-100 text-orange-700";
        case "Canceled":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

export default function RecentOrders() {
    return (
        <div className="bg-white m-2 rounded-2xl p-4 sm:p-6 shadow border border-gray-200 w-full max-w-full sm:max-w-3xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                <div className="flex gap-3 flex-wrap">
                    <button className="flex items-center gap-2 border px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 shadow-sm transition">
                        <FiFilter className="text-lg" />
                        Filter
                    </button>
                    <button className="border px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 shadow-sm transition">
                        See all
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left py-3 text-gray-600 px-2 font-medium whitespace-nowrap">
                                Products
                            </th>
                            <th className="text-left py-3 text-gray-600 px-2 font-medium whitespace-nowrap">
                                Price
                            </th>
                            <th className="text-left py-3 text-gray-600 px-2 font-medium whitespace-nowrap">
                                Category
                            </th>
                            <th className="text-left py-3 text-gray-600 px-2 font-medium whitespace-nowrap">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition"
                            >
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={order.image}
                                            alt={order.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 truncate">
                                                {order.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {order.variants}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-2 text-gray-700">{order.price}</td>
                                <td className="py-4 px-2 text-gray-700">{order.category}</td>
                                <td className="py-4 px-2">
                                    <span
                                        className={`text-xs px-3 py-1 font-medium rounded-full ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

import { FiFilter } from "react-icons/fi";
import orders from "../../data/orders";

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700 admin-dark:bg-green-900 admin-dark:text-green-300";
    case "Pending":
      return "bg-orange-100 text-orange-700 admin-dark:bg-orange-900 admin-dark:text-orange-300";
    case "Canceled":
      return "bg-red-100 text-red-700 admin-dark:bg-red-900 admin-dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-700 admin-dark:bg-gray-700 admin-dark:text-gray-300";
  }
};

export default function RecentOrders() {
  return (
    <div className="bg-white admin-dark:bg-gray-900 m-2 rounded-2xl p-4 sm:p-6 shadow border border-gray-200 admin-dark:border-gray-700 w-full max-w-full sm:max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 admin-dark:text-gray-100">
          Recent Orders
        </h2>
        <div className="flex gap-3 flex-wrap">
          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm text-gray-700 admin-dark:text-gray-200 border-gray-200 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-800 shadow-sm transition">
            <FiFilter className="text-lg" />
            Filter
          </button>
          <button className="border px-4 py-2 rounded-lg text-sm text-gray-700 admin-dark:text-gray-200 border-gray-200 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-800 shadow-sm transition">
            See all
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-200 admin-dark:border-gray-700 bg-gray-50 admin-dark:bg-gray-800">
              <th className="text-left py-3 px-3 text-gray-600 admin-dark:text-gray-300 font-medium whitespace-nowrap">
                Product
              </th>
              <th className="text-left py-3 px-3 text-gray-600 admin-dark:text-gray-300 font-medium whitespace-nowrap">
                Price
              </th>
              <th className="text-left py-3 px-3 text-gray-600 admin-dark:text-gray-300 font-medium whitespace-nowrap">
                Category
              </th>
              <th className="text-left py-3 px-3 text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-800 transition"
              >
                {/* Product */}
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <img
                      loading="lazy"
                      src={order.image}
                      alt={order.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 admin-dark:text-gray-100 truncate">
                        {order.name}
                      </p>
                      <p className="text-xs text-gray-500 admin-dark:text-gray-400 truncate">
                        {order.variants}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="py-4 px-3 text-gray-700 admin-dark:text-gray-200 font-medium">
                  {order.price}
                </td>

                {/* Category */}
                <td className="py-4 px-3 text-gray-600 admin-dark:text-gray-300">
                  {order.category}
                </td>

                {/* Status */}
                <td className="py-4 px-3">
                  <span
                    className={`text-xs px-3 py-1.5 font-medium rounded-full ${getStatusColor(
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

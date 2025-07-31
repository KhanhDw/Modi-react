"use client"

export default function Table({ columns, data, onEdit, onDelete, onView }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {column.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={column.key} className={`px-6 py-4 text-sm ${column.className || "text-gray-500"}`}>
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </td>
              ))}
              <td className="px-6 py-4 text-sm space-x-2">
                {onView && (
                  <button onClick={() => onView(item)} className="text-blue-600 hover:text-blue-800">
                    👁️ Xem
                  </button>
                )}
                {onEdit && (
                  <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-800">
                    ✏️ Sửa
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-800">
                    🗑️ Xóa
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

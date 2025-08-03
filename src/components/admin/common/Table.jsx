
export default function Table({ columns, data, onEdit, onDelete, onView }) {

  const isDate = (value) => {
    const parsed = Date.parse(value);
    return !isNaN(parsed);
  };


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
          {data.map((item, index) => (
            <tr key={item.id}>
              {columns.map((column, colIndex) => {
                const value = item[column.key];

                // Hàm định dạng lại ngày thành dd/mm/yyyy
                const formatDate = (val) => {
                  const date = new Date(val);
                  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")
                    }/${date.getFullYear()}`;
                };
                return (
                  <td key={column.key} className={`px-6 py-4 text-sm ${column.className || "text-gray-500"}`}>
                    {colIndex === 0
                      ? index + 1
                      : column.render
                        ? column.render(value, item)
                        : isDate(value)
                          ? formatDate(value)
                          : value}
                  </td>)
              })}
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

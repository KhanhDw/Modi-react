
import useLenisLocal from '@/hook/useLenisLocal';


export default function Table({ columns, data, onEdit, onDelete, onView, h_table=`h-[80vh]` }) {
  useLenisLocal(".lenis-local");

  const isDate = (value) => {
    if (typeof value !== 'string') return false;
    const parsed = Date.parse(value);
    return !isNaN(parsed) && value.match(/^\d{4}-\d{2}-\d{2}/);
  };

  const formatDate = (value) => {
    const date = new Date(value);
    if (isDate(value)) {
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    }
    return value;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className={`lenis-local scroll-container  overflow-y-auto flex flex-col ${h_table}`}>
        <table className="min-w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">
                STT
              </th>
              {columns
                .filter((column) => column.key !== 'id')
                .map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50"
                  >
                    {column.label}
                  </th>
                ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={item.id || index}>
                {/* Cột STT */}
                <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                {/* Các cột từ columns */}
                {columns
                  .filter((column) => column.key !== 'id')
                  .map((column) => {
                    const value = item[column.key];
                    return (
                      <td
                        key={column.key}
                        className={`px-6 py-4 text-sm ${column.className || "text-gray-500"}`}
                      >
                        {column.render
                          ? column.render(value, item)
                          : isDate(value)
                            ? formatDate(value)
                            : value || '-'}
                      </td>
                    );
                  })}
                {/* Cột Thao tác */}
                <td className="px-6 py-4 text-sm space-x-2">
                  {onView && (
                    <button
                      onClick={() => onView(item)}
                      className="text-blue-600 hover:text-blue-800 inline-block mr-2"
                    >
                      👁️ Xem
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800 inline-block mr-2"
                    >
                      ✏️ Sửa
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 hover:text-red-800 inline-block"
                    >
                      🗑️ Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
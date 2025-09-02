import useLenisLocal from '../../../hook/useLenisLocal';

export default function Table({ columns, data, onEdit, onDelete, onView, h_table = `h-[80vh]` }) {
  useLenisLocal();

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
    <div className="bg-white admin-dark:bg-gray-800">
      <div className={`lenis-local scroll-container overflow-y-auto flex flex-col ${h_table}`}>
        <table className="min-w-full">
          <thead className="bg-gray-50/80 admin-dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 admin-dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 admin-dark:text-gray-300 uppercase tracking-wider">
                STT
              </th>
              {columns
                .filter((column) => column.key !== 'id')
                .map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 admin-dark:text-gray-300 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 admin-dark:text-gray-300 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 admin-dark:divide-gray-700 bg-white admin-dark:bg-gray-800">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.filter(c => c.key !== 'id').length + 2}
                  className="px-6 py-12 text-center text-gray-500 admin-dark:text-gray-400"
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 admin-dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-500 admin-dark:text-gray-300">Không có dữ liệu</span>
                    <span className="text-xs text-gray-400 admin-dark:text-gray-500 mt-1">Chưa có thông tin nào được tìm thấy</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="hover:bg-gray-50/50 admin-dark:hover:bg-gray-700/50 transition-colors duration-150 group"
                >
                  {/* Cột STT */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-400 admin-dark:text-gray-500 group-hover:text-gray-600 admin-dark:group-hover:text-gray-300">
                    {index + 1}
                  </td>
                  {/* Các cột từ columns */}
                  {columns
                    .filter((column) => column.key !== 'id')
                    .map((column) => {
                      const value = item[column.key];
                      return (
                        <td
                          key={column.key}
                          className={`px-6 py-4 text-sm ${column.className || "text-gray-700 admin-dark:text-gray-200"}`}
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
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      {onView && (
                        <button
                          onClick={() => onView(item)}
                          className="inline-flex items-center justify-center w-10 h-10 text-blue-600 admin-dark:text-blue-400 hover:text-blue-700 admin-dark:hover:text-blue-300 hover:bg-blue-50 admin-dark:hover:bg-blue-900/50 rounded-xl transition-all duration-200 group/btn shadow-sm hover:shadow-md"
                          title="Xem chi tiết"
                        >
                          <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="inline-flex items-center justify-center w-10 h-10 text-emerald-600 admin-dark:text-emerald-400 hover:text-emerald-700 admin-dark:hover:text-emerald-300 hover:bg-emerald-50 admin-dark:hover:bg-emerald-900/50 rounded-xl transition-all duration-200 group/btn shadow-sm hover:shadow-md"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className="inline-flex items-center justify-center w-10 h-10 text-red-600 admin-dark:text-red-400 hover:text-red-700 admin-dark:hover:text-red-300 hover:bg-red-50 admin-dark:hover:bg-red-900/50 rounded-xl transition-all duration-200 group/btn shadow-sm hover:shadow-md"
                          title="Xóa"
                        >
                          <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
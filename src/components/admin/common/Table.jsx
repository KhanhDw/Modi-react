
import useLenisLocal from '../../../hook/useLenisLocal';


export default function Table({ columns, data, onEdit, onDelete, onView }) {

  useLenisLocal();


  const isDate = (value) => {
    const parsed = Date.parse(value);
    return !isNaN(parsed);
  };



  return (
    <>

      <div className="  bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="lenis-local scroll-container max-h-[80vh] overflow-y-auto flex flex-col ">
          {/* <div className=" scroll-container max-h-[80vh] overflow-y-auto flex flex-col "> */}
          {/* {[...Array(50)].map((_, i) => (
            <div key={i} className="bg-blue-100 p-4">
              Nội dung số {i + 1}
            </div>
          ))} */}

          <table className="min-w-full ">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {columns.map((column) => (
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
            <tbody className="divide-y divide-gray-200 ">
              {data.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map((column, colIndex) => {
                    const value = item[column.key];

                    const formatDate = (val) => {
                      const date = new Date(val);
                      if (
                        typeof val === 'string' &&
                        !isNaN(date.getTime()) &&
                        val.match(/^\d{4}-\d{2}-\d{2}/)
                      ) {
                        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
                          .toString()
                          .padStart(2, "0")}/${date.getFullYear()}`;
                      }
                      return val;
                    };

                    return (
                      <td
                        key={column.key}
                        className={`px-6 py-4 text-sm ${column.className || "text-gray-500"}`}
                      >
                        {colIndex === 0
                          ? index + 1
                          : column.render
                            ? column.render(value, item)
                            : isDate(value)
                              ? formatDate(value)
                              : value}
                      </td>
                    );
                  })}
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
    </>
  );
}
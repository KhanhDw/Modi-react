import { RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";


export default function PageHeader({
  searchTerm,
  setSearchTerm,
  APISearch,
  title,
  buttonText,
  onButtonClick,
  isHiddenFilter = false,
  extra,
  toggleSortOrder,
  sortOrder
}) {




  return (
    <div className="flex justify-between items-center mb-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 admin-dark:text-gray-200">{title}</h1>
      <div className="flex items-center justify-between">
        {extra && <div className="text-sm text-gray-500">{extra}</div>}

        {!isHiddenFilter && searchTerm !== "" && (
          <button onClick={() => { APISearch(""); setSearchTerm(""); }} className="p-2 hover:bg-gray-300 hover:admin-dark:bg-gray-600 mr-2 rounded-2xl duration-300 transition-all">
            <RefreshCcw />
          </button>
        )}

        {!isHiddenFilter && (
          <form onSubmit={(e) => {
            e.preventDefault();
            APISearch(searchTerm);
          }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              className="mr-10 w-100 border-2 border-gray-300 admin-dark:border-gray-700 py-2 px-3 rounded-xl shadow focus:border-green-500 focus:outline-none"
            />
            <button hidden type="submit"></button>
          </form>
        )}

        <div className="flex items-center space-x-2">
          {buttonText && (
            <div className="flex items-center space-x-2">
              {!isHiddenFilter && (
                <button
                  onClick={toggleSortOrder}
                  className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Sắp xếp theo ngày ({sortOrder === "asc" ? "Cũ nhất" : "Mới nhất"})
                </button>
              )}

              <button
                onClick={onButtonClick}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {buttonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}

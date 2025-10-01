import { RefreshCcw } from "lucide-react";

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
  sortOrder,
}) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Hàng chứa tiêu đề + search + nút */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full">
        {/* Title */}
        <h1 className="text-xl text-center sm:text-xl font-bold text-gray-900 admin-dark:text-gray-200">
          {title}
        </h1>

        {/* Search + Buttons */}
        <div className="flex flex-wrap gap-3 flex-1 sm:flex-none justify-center">
          {/* Search */}
          {!isHiddenFilter && (
            <div className="flex gap-2 flex-1 min-w-[250px] md:min-w-[300px] lg:min-w-[350px]">
              {searchTerm !== "" && (
                <button
                  onClick={() => {
                    APISearch("");
                    setSearchTerm("");
                  }}
                  className="p-2 rounded-xl hover:bg-gray-200 admin-dark:hover:bg-gray-700 transition"
                >
                  <RefreshCcw size={18} />
                </button>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  APISearch(searchTerm);
                }}
                className="flex flex-1"
              >
                <input autoComplete="off"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="flex-1 border-2 border-gray-300 admin-dark:border-gray-700 py-2 px-3 rounded-xl shadow-sm focus:border-green-500 focus:outline-none min-w-[250px] md:min-w-[300px] lg:min-w-[350px]"
                />
                <button hidden type="submit"></button>
              </form>
            </div>
          )}

          {/* Buttons */}
          {buttonText && (
            <div className="flex flex-wrap gap-2 justify-end">
              {!isHiddenFilter && (
                <button
                  onClick={toggleSortOrder}
                  className="px-4 py-2 rounded-lg bg-[#5B8FB9]  text-white transition text-sm text-center cursor-pointer"
                >
                  Sắp xếp: {sortOrder === "asc" ? "Cũ nhất" : "Mới nhất"}
                </button>
              )}
              <button
                onClick={onButtonClick}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm text-center cursor-pointer"
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

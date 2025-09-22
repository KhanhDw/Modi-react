import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, X } from "lucide-react";
import useLenisLocal from "@/hook/useLenisLocal";
import { useNavigate } from "react-router-dom";

const categoryConfig = {
  lienhe: { label: "Liên hệ" },
  blogs: { label: "Tin tức" },
  marketing: { label: "Truyền thông" },
  webTemplate: { label: "Website mẫu" },
};

export default function AdminSearch({ isFullScreen = false }) {
  useLenisLocal(".lenis-local");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [blogResults, setBlogResults] = useState([]);
  const [lienHeResults, setLienHeResults] = useState([]);
  const [marketingResults, setMarketingResults] = useState([]);
  const [websiteTemplateResults, setWebsiteTemplateResults] = useState([]);
  const searchInputRef = useRef(null);

  const safeFetch = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`❌ API không tồn tại hoặc 404: ${url}`);
        return [];
      }
      return await res.json();
    } catch (err) {
      console.error("Lỗi fetch:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setBlogResults([]);
        setLienHeResults([]);
        setMarketingResults([]);
        setWebsiteTemplateResults([]);
        return;
      }

      // --- Blogs ---
      const blogsData = await safeFetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/blogs/search?term=${encodeURIComponent(searchQuery)}`
      );
      setBlogResults(
        Array.isArray(blogsData)
          ? blogsData.map((blog) => ({
              id: `blog-${blog.id}`,
              title: blog.title,
              category: "blogs",
              url: `/managers/news/${blog.id}/view`,
            }))
          : []
      );

      // --- Liên hệ ---
      const lienheData = await safeFetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/lienhe/search?term=${encodeURIComponent(searchQuery)}`
      );
      setLienHeResults(
        Array.isArray(lienheData)
          ? lienheData.map((lh) => ({
              id: `lienhe-${lh.id}`,
              title: `${lh.ho_ten} – "${lh.noi_dung?.slice(0, 50)}..."`,
              category: "lienhe",
              url: `/managers/contact`,
            }))
          : []
      );

      // --- Marketing ---
      const marketingRaw = await safeFetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/marketing/search?term=${encodeURIComponent(searchQuery)}&status=published`
      );
      const marketingData = marketingRaw?.data || [];
      setMarketingResults(
        Array.isArray(marketingData)
          ? marketingData.map((mk) => ({
              id: `marketing-${mk.id}`,
              title: mk.title,
              category: "marketing",
              url: `/managers/marketing/${mk.id}/view`,
            }))
          : []
      );

      // --- Website template ---
      const wsRaw = await safeFetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/web-samples/search?term=${encodeURIComponent(searchQuery)}&lang=vi`
      );
      const websiteTemplateData = wsRaw?.data || wsRaw;
      setWebsiteTemplateResults(
        Array.isArray(websiteTemplateData)
          ? websiteTemplateData.map((ws) => ({
              id: `web-${ws.id}`,
              title: ws.name,
              category: "webTemplate",
              url: `/managers/website-templates/${ws.id}`,
            }))
          : []
      );
    };

    const delayDebounce = setTimeout(fetchResults, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const showResults = searchQuery.trim().length > 0 && isFocused;

  const combinedResults = [
    ...blogResults,
    ...lienHeResults,
    ...marketingResults,
    ...websiteTemplateResults,
  ];

  const groupedResults = combinedResults.reduce((acc, result) => {
    if (!acc[result.category]) acc[result.category] = [];
    acc[result.category].push(result);
    return acc;
  }, {});

  const totalResults = combinedResults.length;

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  return (
    <div className={cn("relative", isFullScreen && "flex-1")}>
      <div className={cn("rounded-lg", isFullScreen && "w-full max-w-4xl mx-auto")}>
        <div className={cn("relative", isFullScreen && "w-full")}>
          <Search
            className={cn(
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400",
              "sm:h-5 sm:w-5",
              "lg:h-6 lg:w-6"
            )}
          />
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={cn(
              "pl-10 pr-10 py-3 rounded-xl shadow-md border-[3px]",
              "border-gray-400 admin-dark:border-gray-600",
              "bg-white placeholder:text-gray-400 focus:outline-none",
              "hover:shadow-lg transition-all duration-300 ease-in-out",
              "admin-dark:bg-gray-800 admin-dark:text-white admin-dark:placeholder:text-gray-400",
              isFocused
                ? "  md:w-[30.5rem] lg:w-[31.6rem] xl:w-[35.3rem] 2xl:w-[35.3rem]"
                : "  md:w-[10rem] lg:w-[10rem] xl:w-[15rem] 2xl:w-[15rem]"
            )}
            ref={searchInputRef}
          />  
          {searchQuery && (
            <button
              onClick={clearSearch}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 admin-dark:text-gray-400 admin-dark:hover:text-gray-200",
                "sm:h-5 sm:w-5",
                "lg:h-6 lg:w-6"
              )}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </button>
          )}
        </div>
      </div>

      {showResults && (
        <div
              data-lenis-prevent
              className={cn(
            "absolute top-full left-0 mt-2",
            "bg-slate-50 admin-dark:bg-gray-800 text-gray-800 admin-dark:text-white",
            "border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50",
            "transition-all duration-300 ease-in-out",
            // ⬇️ đồng bộ width với input
            isFocused
              ? "w-[18rem] sm:w-[28rem] md:w-[30.5rem] lg:w-[31.6rem] xl:w-[35.3rem] "
              : "  md:w-[30.5rem] lg:w-[31.6rem]  xl:w-[35.3rem] ",
          )}
        >
          <div className="z-100 px-4 py-3 border-b border-gray-700 sticky top-0 admin-dark:bg-gray-800 bg-slate-50 text-gray-800">
            <h3
              className={cn(
                "text-gray-800 admin-dark:text-white font-medium flex gap-2 items-center text-sm sm:text-base"
              )}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              Kết quả cho "
              <span
                className={cn(
                  "break-words",
                  "max-w-[calc(100%-4rem)] xs:max-w-[12rem] sm:max-w-[20rem] md:max-w-[calc(100%-6rem)] lg:max-w-[calc(100%-6rem)] xl:max-w-[calc(100%-6rem)] 2xl:max-w-[calc(100%-6rem)]"
                )}
              >
                {searchQuery}
              </span>
              " ({totalResults})
            </h3>
          </div>
          <div>
            {Object.entries(groupedResults).map(([category, categoryResults], index) => {
              const config = categoryConfig[category];
              return (
                <div key={category}>
                  <div className="px-4 py-2 text-xs sm:text-sm font-medium admin-dark:text-gray-300 admin-dark:bg-gray-800/50 bg-slate-50 text-gray-800 sticky top-12">
                    {config?.label || category} ({categoryResults.length})
                  </div>
                  <div>
                    {categoryResults.map((result) => (
                      <div
                        key={result.id}
                        onMouseDown={() => navigate(result.url)}
                        className="group cursor-pointer transition-colors hover:bg-gray-300 admin-dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3">
                          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-400 group-hover:text-gray-800 transition-colors" />
                          <span className="text-gray-800 admin-dark:text-white font-medium group-hover:text-gray-800 transition-colors text-sm sm:text-base">
                            {result.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {index < Object.entries(groupedResults).length - 1 && (
                    <div className="border-b border-gray-700"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
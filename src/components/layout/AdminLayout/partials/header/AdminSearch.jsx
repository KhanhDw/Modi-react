import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, X } from "lucide-react"
import useLenisLocal from '@/hook/useLenisLocal';

const mockResults = [
    {
        id: "1",
        title: 'Nguyễn Văn A – "Tôi cần landing page bán hàng"',
        category: "lienhe",
    },
    {
        id: "2",
        title: "Dịch vụ thiết kế landing page chuẩn SEO",
        category: "dichvu",
    },
    {
        id: "3",
        title: "Landing page giới thiệu công ty",
        category: "dichvu",
    },
    {
        id: "4",
        title: "Mẫu Landing 01 (Bán hàng)",
        category: "giaodien",
    },
    {
        id: "5",
        title: "Mẫu Landing 02 (Giới thiệu)",
        category: "giaodien",
    },
    {
        id: "6",
        title: '"Tại sao landing page lại quan trọng?"',
        category: "tintuc",
    },
]

const categoryConfig = {
    lienhe: {
        label: "Liên hệ",
        count: 1,
    },
    dichvu: {
        label: "Dịch vụ",
        count: 2,
    },
    giaodien: {
        label: "Giao diện website",
        count: 2,
    },
    tintuc: {
        label: "Tin tức",
        count: 1,
    },
}

export default function SearchPage() {
    useLenisLocal(".lenis-local");
    const [searchQuery, setSearchQuery] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const [results] = useState(mockResults)
    const searchInputRef = useRef(null)

    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.category]) {
            acc[result.category] = []
        }
        acc[result.category].push(result)
        return acc
    }, {})

    const totalResults = results.length
    const showResults = searchQuery.trim().length > 0

    // Function to clear the input
    const clearSearch = () => {
        setSearchQuery("")
        searchInputRef.current?.focus() // Optional: refocus input after clearing
    }

    return (
        <div className="">
            <div className="max-w-4xl mx-auto">
                <div ref={searchInputRef} className="relative">
                    <div className="rounded-lg">
                        <div className={`transition-all duration-300 ${isFocused ? 'w-2xl' : 'w-sm'}`}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className="w-full pl-10 pr-10 py-5 text-gray-800 border-2 border-slate-300 admin-dark:border-slate-500 rounded-lg shadow-sm
                                    bg-white placeholder:text-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-gray-500
                                    transition-colors duration-200 ease-in-out
                                    admin-dark:bg-gray-700 admin-dark:text-white admin-dark:placeholder:text-gray-400
                                    admin-dark:hover:bg-gray-600 admin-dark:focus:ring-gray-400"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 admin-dark:text-gray-400 admin-dark:hover:text-gray-200"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {showResults && (
                        <div data-lenis-prevent className={`scroll-container lenis-local absolute top-full left-0 right-0 mt-2 admin-dark:bg-gray-800  bg-slate-50 text-gray-800     rounded-lg border border-gray-700 shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto transition-all duration-300 ${isFocused ? 'w-2xl' : 'w-md'}`}>
                            <div className="z-100 px-4 py-3 border-b border-gray-700 sticky top-0 admin-dark:bg-gray-800 bg-slate-50 text-gray-800">
                                <h3 className="text-gray-800 admin-dark:text-white font-medium flex gap-2 ">
                                    <Search /> Kết quả cho "{searchQuery}" ({totalResults})
                                </h3>
                            </div>

                            <div>
                                {Object.entries(groupedResults).map(([category, categoryResults], index) => {
                                    const config = categoryConfig[category]

                                    return (
                                        <div key={category}>
                                            <div className="px-4 py-2 text-sm font-medium admin-dark:text-gray-300 admin-dark:bg-gray-800/50   bg-slate-50 text-gray-800    sticky top-12">
                                                {config.label} ({config.count})
                                            </div>

                                            <div>
                                                {categoryResults.map((result) => (
                                                    <div key={result.id} className="group cursor-pointer transition-colors hover:bg-gray-300  admin-dark:hover:bg-gray-700">
                                                        <div className="flex items-center gap-3 px-4 py-3">
                                                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-800 transition-colors" />
                                                            <span className="text-gray-800 admin-dark:text-white font-medium group-hover:text-gray-800 transition-colors">
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
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
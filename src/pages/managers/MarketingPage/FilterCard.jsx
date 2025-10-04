import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function FilterCard({ searchTerm, setSearchTerm, selectedStatus, setSelectedStatus }) {
    return (
        <div className="bg-transparent admin-dark:bg-slate-900 w-full">
            <div className={"p-0 shadow-none rounded-none border-none"}>
                <div className="flex flex-col sm:flex-row sm:justify-between xl:justify-start gap-4 w-full">
                    {/* <div className="flex items-center"><span className="font-bold">Bộ lọc tìm kiếm</span></div> */}
                    <div className="relative w-full xl:w-xl">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 admin-dark:text-gray-500 h-5 w-5" />
                        <Input
                            placeholder="Tìm kiếm theo tiêu đề, tác giả, tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-2 border-gray-300 bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600 focus:ring-2 focus:ring-blue-500 admin-dark:focus:ring-blue-400 admin-dark:focus:border-none focus:border-none"
                        />
                    </div>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="border-2 border-gray-300 w-50 md:w-58 bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600 cursor-pointer">
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-800 admin-dark:bg-gray-700 admin-dark:text-white">
                            <SelectItem className="cursor-pointer" value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem className="cursor-pointer" value="published">Đã xuất bản</SelectItem>
                            <SelectItem className="cursor-pointer" value="draft">Bản nháp</SelectItem>
                            <SelectItem className="cursor-pointer" value="archived">Lưu trữ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

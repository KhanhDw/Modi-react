import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function FilterCard({ searchTerm, setSearchTerm, selectedStatus, setSelectedStatus }) {
    return (
        <div className=" bg-transparent admin-dark:bg-slate-900  px-2 py-8  w-1/2">
            <div className={"p-0 shadow-none rounded-none border-none"}>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* <div className="flex items-center"><span className="font-bold">Bộ lọc tìm kiếm</span></div> */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 admin-dark:text-gray-500 h-5 w-5" />
                        <Input
                            placeholder="Tìm kiếm theo tiêu đề, tác giả, tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-2 border-gray-400 bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600 focus:ring-2 focus:ring-blue-500 admin-dark:focus:ring-blue-600"
                        />
                    </div>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="border-2 border-gray-400 w-full md:w-48 bg-white admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600">
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-800 admin-dark:bg-gray-700 admin-dark:text-white">
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="published">Đã xuất bản</SelectItem>
                            <SelectItem value="draft">Bản nháp</SelectItem>
                            <SelectItem value="archived">Lưu trữ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CustomSelect from "./OptionsSelect";

export default function FilterCard({ searchTerm, setSearchTerm, selectedStatus, setSelectedStatus }) {

    const options = [
        { label: "Tất cả trạng thái", value: "all" },
        { label: "Đã xuất bản", value: "published" },
        { label: "Bản nháp", value: "draft" },
        { label: "Lưu trữ", value: "archived" },
    ];

    return (
        <div className="bg-transparent admin-dark:bg-slate-900 w-full">
            <div className="p-0 shadow-none rounded-none border-none">
                <div className="flex flex-col sm:flex-row sm:justify-between xl:justify-start gap-4 w-full">
                    <div className="relative w-full xl:w-xl">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 admin-dark:text-gray-500 h-5 w-5" />
                        <Input
                            placeholder="Tìm kiếm theo tiêu đề, tác giả, tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-2 border-gray-300 bg-white admin-dark:bg-gray-800 admin-dark:text-white admin-dark:border-gray-600 focus:ring-2 focus:ring-blue-500 admin-dark:focus:ring-blue-400 admin-dark:focus:border-none focus:border-none"
                        />
                    </div>

                    <CustomSelect
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                        placeholder="Lọc theo trạng thái"
                        options={options}
                        className={'md:w-58'}
                    />
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import { X } from "lucide-react"; // có thể bỏ nếu không dùng icon

export default function WarningMessage() {
    const [hidden, setHidden] = useState(false);

    if (hidden) return null;

    return (
        <div className="flex items-center gap-2 text-sm text-gray-500 admin-dark:text-gray-400 bg-gray-100 admin-dark:bg-gray-800 px-3 py-2 rounded-md">
            <div className="flex flex-col gap-1">
                <span>
                    Vui lòng cập nhật đầy đủ nội dung cho các trang dịch vụ, bao gồm cả tiếng Việt (VI) và tiếng Anh (EN)
                </span>
                <span>
                    Nếu thiếu bất kỳ bản dịch nào, dịch vụ đó sẽ không hiển thị trên giao diện hệ thống người dùng tương ứng
                </span>
            </div>
            <button
                onClick={() => setHidden(true)}
                className="ml-auto text-gray-500 hover:text-red-500 transition"
                aria-label="Ẩn cảnh báo"
            >
                <X size={16} />
            </button>
        </div>
    );
}

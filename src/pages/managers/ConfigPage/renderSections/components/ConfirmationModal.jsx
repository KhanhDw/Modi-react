
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white admin-dark:bg-gray-800 rounded-lg shadow-xl p-3 md:p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center border-b pb-3 admin-dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 admin-dark:bg-red-900/30 p-2 rounded-full">
                            <AlertTriangle className="w-5 h-5 text-red-600 admin-dark:text-red-400" />
                        </div>
                        <h3 className="text-base md:text-lg font-medium text-gray-900 admin-dark:text-white">{title}</h3>
                    </div>
                    <Button theme="admin" variant="ghost" size="icon" onClick={onClose}
                        className="cursor-pointer shadow bg-gray-100 hover:bg-gray-200 admin-dark:bg-gray-600 admin-dark:hover:bg-gray-700">
                        <X className="w-5 h-5 text-gray-600 admin-dark:text-gray-300" />
                    </Button>
                </div>
                <div className="py-4">
                    <p className="text-xs sm:text-sm text-gray-600 admin-dark:text-gray-300">{message}</p>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t admin-dark:border-gray-700">
                    <Button theme="admin" variant="outline" onClick={onClose}
                        className="cursor-pointer shadow border-none bg-gray-400 hover:bg-gray-500 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800">
                        <span className="font-semibold text-xs sm:text-sm text-white">Hủy bỏ</span>
                    </Button>
                    <Button
                        theme="admin"
                        variant="destructive"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="hover:bg-red-500 bg-red-400 admin-dark:bg-red-400 admin-dark:hover:bg-red-500 cursor-pointer shadow"
                    >
                        <span className="font-semibold text-xs sm:text-sm text-white">Xác nhận Xóa</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

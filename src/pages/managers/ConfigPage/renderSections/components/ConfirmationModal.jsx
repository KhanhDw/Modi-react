
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from 'lucide-react';

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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white admin-dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center border-b pb-3 admin-dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 admin-dark:bg-red-900/30 p-2 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-red-600 admin-dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 admin-dark:text-white">{title}</h3>
                    </div>
                    <Button theme="admin" variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <div className="py-4">
                    <p className="text-sm text-gray-600 admin-dark:text-gray-300">{message}</p>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t admin-dark:border-gray-700">
                    <Button theme="admin" variant="outline" onClick={onClose}>
                        Hủy bỏ
                    </Button>
                    <Button
                        theme="admin"
                        variant="destructive"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Xác nhận Xóa
                    </Button>
                </div>
            </div>
        </div>
    );
}

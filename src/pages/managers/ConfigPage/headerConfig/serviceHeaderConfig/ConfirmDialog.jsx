import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useRef } from "react";

// form xác nhận xóa
export default function ConfirmDialog({ open, setOpen, type, target, onConfirmDelete }) {

    const dialogRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dialogRef.current && !dialogRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, setOpen]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                ref={dialogRef}
                className="w-75 sm:w-100 bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 font-semibold admin-dark:text-gray-100 text-base sm:text-lg text-center">
                        Xác nhận xóa
                    </DialogTitle>
                </DialogHeader>

                <p className="text-gray-800 admin-dark:text-gray-300 text-sm sm:text-base">
                    Bạn có chắc chắn muốn xóa{" "}
                    {type === "category" ? "Danh mục dịch vụ này" : "dịch vụ"} này không?
                </p>

                <div className="flex gap-2 mt-2 justify-end items-center">
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirmDelete(type, target);
                            setOpen(false);
                        }}
                        className="cursor-pointer bg-red-500 hover:bg-red-600"
                    >
                        <span className="font-semibold text-sm sm:text-base">Xóa</span>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="border-gray-300 bg-gray-800 hover:bg-gray-700
                       admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:hover:bg-gray-900 cursor-pointer"
                    >
                        <span className="font-semibold text-sm sm:text-base text-gray-200">Hủy</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

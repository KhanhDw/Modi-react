import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDialog({ open, setOpen, type, target, onConfirmDelete }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 admin-dark:text-gray-100">
                        Xác nhận xóa
                    </DialogTitle>
                </DialogHeader>

                <p className="text-gray-700 admin-dark:text-gray-300 mt-2">
                    Bạn có chắc chắn muốn xóa{" "}
                    {type === "category" ? "Danh mục dịch vụ này" : "dịch vụ"} này không?
                </p>

                <div className="flex gap-2 mt-6 justify-end items-center">
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirmDelete(type, target);
                            setOpen(false);
                        }}
                    >
                        Xóa
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="border-gray-300 text-gray-200 hover:bg-gray-600
                       admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:hover:bg-gray-800"
                    >
                        Hủy
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteDialog({ post, handleDeletePost }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-white hover:text-black border-gray-300 text-red-600 admin-dark:border-gray-600 admin-dark:text-red-500 admin-dark:bg-gray-800 hover:bg-red-50 admin-dark:hover:bg-red-900/10"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white admin-dark:bg-gray-800">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900 admin-dark:text-white">
                        Xác nhận xóa
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 admin-dark:text-gray-300">
                        Bạn có chắc chắn muốn xóa bài viết "{post.title}"? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-300 text-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800">
                        Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => handleDeletePost(post.id)}
                        className="bg-red-600 hover:bg-red-700 admin-dark:bg-red-500 admin-dark:hover:bg-red-600"
                    >
                        Xóa
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
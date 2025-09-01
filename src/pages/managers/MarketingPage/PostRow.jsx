import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, User, SquarePen } from "lucide-react";
import { Link, useOutletContext, useLocation } from "react-router-dom";
import DeleteDialog from "./DeleteDialog";
import { TriangleAlert } from 'lucide-react';

export default function PostRow({ post, indexSTT, handleDeletePost }) {
    const location = useLocation();

    return (
        <TableRow className="border-b  border-gray-200 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-700/30 transition-colors duration-200">

            {/* Tiêu đề */}
            <TableCell className="w-1/25">
                <span>{indexSTT + 1}</span>
            </TableCell>
            <TableCell className="w-1/20 pl-0">
                {post.image ? (
                    <img
                        src={post.image}
                        alt="Ảnh bài viết"
                        className="w-12 h-12 rounded-md object-cover border border-gray-200 admin-dark:border-gray-600"
                        onError={(e) => {
                            e.currentTarget.style.display = "none"; // ẩn ảnh bị lỗi
                            e.currentTarget.nextSibling.style.display = "flex"; // hiện fallback
                        }}
                    />
                ) : null}

                {/* Fallback nếu ảnh lỗi */}
                <div
                    className="w-12 h-12 hidden items-center justify-center rounded-md border border-red-400 bg-red-50 text-red-500"
                >
                    <TriangleAlert className="w-6 h-6" />
                </div>
            </TableCell>

            <TableCell className="w-5/12 p-0 cursor-pointer admin-dark:hover:bg-gray-700/50 hover:bg-gray-100 transition-colors duration-200">
                <Link to={`${location.pathname}/${post.id}/view`} className="group p-0 m-0 flex items-center gap-3">
                    <div className="group-hover:text-yellow-400 transition-colors">
                        <div className="font-medium text-gray-900 admin-dark:text-white line-clamp-1 admin-dark:group-hover:text-yellow-400 group-hover:text-blue-700 group-hover:font-bold transition-colors">
                            {post.title}
                        </div>
                        <div className="text-sm text-gray-500 admin-dark:text-gray-400 flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {post.tags}
                        </div>
                    </div>
                </Link>
            </TableCell>

            {/* Nền tảng */}
            <TableCell>
                <Badge className={`admin-dark:text-white font-medium text-white `}
                    style={{ backgroundColor: post.platform_color }}>
                    {post.platform_name}
                </Badge>
            </TableCell>

            {/* Ngôn ngữ */}
            {/* <TableCell>
                <Badge className="text-white font-medium bg-indigo-500">
                    {post.lang}
                </Badge>
            </TableCell> */}

            {/* Trạng thái */}
            <TableCell>
                <Badge className={`text-white font-medium ${post.status === "published" ? "bg-green-500" : post.status === "draft" ? "bg-gray-700" : "bg-orange-700"} `}>
                    {post.status === "published" ? "Đã đăng" : post.status === "draft" ? "Nháp" : "Lưu trữ"}
                </Badge>
            </TableCell>

            {/* Tác giả */}
            <TableCell>
                <div className="flex items-center gap-1 text-gray-900 admin-dark:text-white">
                    <User className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
                    {post.author_name}
                </div>
            </TableCell>



            {/* Ngày tạo */}
            <TableCell>
                {post.created_at ? new Date(post.created_at).toLocaleDateString("vi-VN") : "—"}
            </TableCell>

            {/* Cập nhật */}
            <TableCell>
                {post.updated_at ? new Date(post.updated_at).toLocaleDateString("vi-VN") : "—"}
            </TableCell>



            {/* Actions */}
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Link to={`${location.pathname}/${post.id}/edit`}>
                        <Button
                            theme="admin"
                            variant="outline"
                            size="sm"
                            className="bg-white hover:text-black border-gray-300 text-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800 hover:bg-gray-100 admin-dark:hover:bg-gray-700"
                        >
                            <SquarePen className="h-4 w-4" />
                        </Button>
                    </Link>
                    <DeleteDialog post={post} handleDeletePost={handleDeletePost} />
                </div>
            </TableCell>
        </TableRow>
    );
}

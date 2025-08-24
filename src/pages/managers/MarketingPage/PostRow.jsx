import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, User, SquarePen } from "lucide-react";
import { Link, useOutletContext, useLocation } from "react-router-dom";
import DeleteDialog from "./DeleteDialog";
import { platformColors, platformNames, statusColors, statusNames } from "./constants";

export default function PostRow({ post }) {
    const location = useLocation();
    const { handleDeletePost } = useOutletContext();

    return (
        <TableRow
            className=" border-b border-gray-200 admin-dark:border-gray-700 hover:bg-gray-50 admin-dark:hover:bg-gray-700 transition-colors duration-200"
        >
            <TableCell className="w-2/5">
                <div className="flex items-center gap-3">
                    {post.image && (
                        <img
                            src={post.image || "/placeholder.svg"}
                            alt=""
                            className="w-12 h-12 rounded-md object-cover border border-gray-200 admin-dark:border-gray-600"
                        />
                    )}
                    <div>
                        <div className="font-medium text-gray-900 admin-dark:text-white line-clamp-1">
                            {post.title}
                        </div>
                        <div className="text-sm text-gray-500 admin-dark:text-gray-400 flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {post.tags}
                        </div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Badge className={`text-white font-medium ${platformColors[post.platform]}`}>
                    {platformNames[post.platform]}
                </Badge>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1 text-gray-900 admin-dark:text-white">
                    <User className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
                    {post.author}
                </div>
            </TableCell>
            <TableCell>
                <Badge className={`text-white font-medium ${statusColors[post.status]}`}>
                    {statusNames[post.status]}
                </Badge>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1 text-gray-900 admin-dark:text-white">
                    <Calendar className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
                    {new Date(post.date).toLocaleDateString("vi-VN")}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col text-sm text-gray-700 admin-dark:text-gray-200">
                    <div className="grid grid-cols-2 p-0 m-0 box-sizeing:border border-gray-200 admin-dark:border-gray-700 mb-1">
                        <p>👍 {post.likes}</p>
                        <p>🔄 {post.shares} </p>
                    </div>
                    <div className="grid grid-cols-2">
                        <p>💬 {post.comments}</p>
                        <p>👁️ {post.views}</p>
                    </div>
                </div>
            </TableCell>
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
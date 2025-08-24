import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import PageList from "@/components/feature/pagination";
import PostRow from "./PostRow";
// import { columns } from "./constants";
import { useState } from "react";

export default function PostsTable({ posts, columns }) {
    // phân trang
    const [pageSize, setPageSize] = useState(8);
    const [pagedPosts, setPagedPosts] = useState([]); // 👉 dữ liệu sau khi phân trang

    return (
        <div className="bg-white admin-dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-400 admin-dark:border-gray-700">
            <Table>
                <TableHeader className="admin-dark:bg-gray-700">
                    <TableRow className="border-b border-gray-200 admin-dark:border-gray-700">
                        {columns.map((col, index) => (
                            <TableHead
                                key={index}
                                className={`text-gray-900 admin-dark:text-white ${col.align === "right" ? "text-right" : "text-left"}`}
                            >
                                {col.label}
                            </TableHead>
                        ))}
                        <TableHead className="text-gray-900 admin-dark:text-white text-center">
                            Hành động
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pagedPosts.length > 0 &&
                        pagedPosts.map((post) => <PostRow key={post.id} post={post} />)}
                </TableBody>
            </Table>

            {posts.length > 0 && (
                <PageList data={posts} pageSize={pageSize} onPageChange={setPagedPosts} />
            )}

            {posts.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 admin-dark:text-gray-400 text-lg font-medium mb-2">
                        Không tìm thấy bài viết nào
                    </div>
                    <p className="text-sm text-gray-400 admin-dark:text-gray-500">
                        Thử thay đổi bộ lọc hoặc thêm bài viết mới
                    </p>
                </div>
            )}
        </div>
    );
}

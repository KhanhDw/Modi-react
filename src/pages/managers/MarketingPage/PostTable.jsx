import PageList from "@/components/feature/pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import PostRow from "./PostRow";

export default function PostsTable({ posts, columns, handleDeletePost }) {
  // phân trang
  const [pageSize, setPageSize] = useState(6);
  const [pagedPosts, setPagedPosts] = useState([]); // 👉 dữ liệu sau khi phân trang
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (posts.length === 0) {
      setPagedPosts([]); // reset lại khi posts trống
    }
  }, [posts]);

  return (
    <div className="bg-white admin-dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-300 admin-dark:border-gray-700 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200 admin-dark:border-gray-700 admin-dark:bg-gray-800 bg-gray-100">
            <TableHead className="text-gray-900 admin-dark:text-white text-left">
              STT
            </TableHead>
            {columns
              .filter((col) => col.label !== "Ngôn ngữ")
              .map((col, index) => (
                <TableHead
                  key={index}
                  className="text-gray-900 admin-dark:text-white text-left"
                >
                  {col.label}
                </TableHead>
              ))}
            <TableHead className="text-gray-900 admin-dark:text-white text-right">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white admin-dark:bg-gray-900">
          {pagedPosts.length > 0 &&
            pagedPosts.map((post, index) => (
              <PostRow
                key={post.id ?? index}
                post={post}
                indexSTT={(currentPage - 1) * pageSize + index}
                handleDeletePost={handleDeletePost}
              />
            ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {posts.length > 0 && (
        <PageList
          data={posts}
          pageSize={pageSize}
          onPageChange={setPagedPosts}
          onPageNumberChange={setCurrentPage}
        />
      )}

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="text-center py-12 bg-white admin-dark:bg-gray-900">
          <span className="text-gray-600 text-sm sm:text-base md:text-lg admin-dark:text-gray-300 font-medium mb-2">
            Không tìm thấy bài viết nào
          </span>
          <p className="text-sm sm:text-base text-gray-500 admin-dark:text-gray-400">
            Thử thay đổi bộ lọc hoặc thêm bài viết mới
          </p>
        </div>
      )}
    </div>
  );
}

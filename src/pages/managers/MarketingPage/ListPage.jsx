import { useLocation, Link, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FilterCard from "./FilterCard";
import PostsTable from "./PostTable";
import { Plus } from "lucide-react";

export default function ListPage() {
    const location = useLocation();
    const {
        posts,
        columns,
        searchTerm,
        setSearchTerm,
        selectedStatus,
        setSelectedStatus,
        handleDeletePost, // Thêm handleDeletePost vào destructuring
    } = useOutletContext();

    const filteredPosts = posts.filter((post) => {
        const lowerSearch = (searchTerm || "").toLowerCase();

        const matchesSearch =
            (post.title || "").toLowerCase().includes(lowerSearch) ||
            (post.author || "").toLowerCase().includes(lowerSearch) ||
            (post.tags || "").toLowerCase().includes(lowerSearch) ||
            (post.platform_name || "").toLowerCase().includes(lowerSearch); // ✅ tìm theo network name

        const matchesStatus =
            selectedStatus === "all" || post.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <h1 className="mb-8 text-2xl font-bold text-gray-900 admin-dark:text-white">
                Quản lý bài viết Marketing
            </h1>
            <div className="flex justify-between items-center">
                <FilterCard
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                />
                <Link to={`${location.pathname}/add`}>
                    <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4" />
                        Thêm bài viết
                    </Button>
                </Link>
            </div>
            <PostsTable
                // posts={posts}
                posts={filteredPosts}
                columns={columns}
                handleDeletePost={handleDeletePost}
            />
        </>
    );
}
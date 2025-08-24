import { useLocation, Link, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FilterCard from "./FilterCard";
import PostsTable from "./PostTable";
import { Plus } from "lucide-react";

export default function ListPage() {
    const location = useLocation();
    const {
        posts,
        searchTerm,
        setSearchTerm,
        selectedStatus,
        setSelectedStatus,
        activeClass,
        handleDeletePost, // Thêm handleDeletePost vào destructuring
        setIsAddDialogOpen,
        setIsEditDialogOpen,
        setEditingPost,
        setFormData,
        handleAddPost,
        handleEditPost,
        openEditDialog,
    } = useOutletContext();

    const filteredPosts = posts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "all" || post.status === selectedStatus;
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
                    <Button className={activeClass}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm bài viết
                    </Button>
                </Link>
            </div>
            <PostsTable
                posts={filteredPosts}
                handleDeletePost={handleDeletePost} // Truyền handleDeletePost vào PostsTable
                openEditDialog={openEditDialog} // Truyền openEditDialog nếu cần
            />
        </>
    );
}
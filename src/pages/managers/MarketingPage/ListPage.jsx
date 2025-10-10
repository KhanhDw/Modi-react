import { Button } from "@/components/ui/button";
import { useMarketing } from "@/pages/managers/MarketingPage/hooks/MarketingContext";
import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import FilterCard from "./FilterCard";
import PostsTable from "./PostTable";

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
  } = useMarketing();

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
      <div className="w-full">
        <h1 className="mb-4 text-center xl:text-start font-bold text-xl text-gray-900 admin-dark:text-white">
          Quản lý bài viết Marketing
        </h1>
        <div className="flex flex-col md:flex-row-reverse gap-3 items-center w-full mb-4">
          <Link to={`${location.pathname}/add`}>
            <Button className="cursor-pointer bg-[#B6EADA] hover:bg-[#5B8FB9] text-black hover:text-white">
              <Plus className="h-4 w-4" />
              Thêm bài viết
            </Button>
          </Link>
          <FilterCard
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </div>
        <PostsTable
          // posts={posts}
          posts={filteredPosts}
          columns={columns}
          handleDeletePost={handleDeletePost}
        />
      </div>
    </>
  );
}

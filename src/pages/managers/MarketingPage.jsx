import { useState, createContext } from "react";
import { Outlet, Routes, Route } from "react-router-dom";
import ListPage from "@/pages/managers/MarketingPage/ListPage";
import AddPage from "@/pages/managers/MarketingPage/AddPage";
import EditPage from "@/pages/managers/MarketingPage/EditPage";
import { initialPosts } from "@/pages/managers/MarketingPage/constants";

// export const MarketingContext = createContext();

export default function MarketingPage() {
  const activeClass =
    "bg-blue-500 text-white admin-dark:bg-blue-600 admin-dark:text-white font-medium rounded-md px-4 py-2 transition-colors duration-200";

  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    platform: "",
    author: "",
    status: "draft",
    tags: "",
    image: "",
  });

  const handleAddPost = () => {
    const newPost = {
      id: Math.max(...posts.map((p) => p.id)) + 1,
      ...formData,
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
    };
    setPosts([...posts, newPost]);
    setFormData({
      title: "",
      content: "",
      platform: "",
      author: "",
      status: "draft",
      tags: "",
      image: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditPost = (postId) => {
    setPosts(posts.map((post) => (post.id === parseInt(postId) ? { ...post, ...formData } : post)));
    setIsEditDialogOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const openEditDialog = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      platform: post.platform,
      author: post.author,
      status: post.status,
      tags: post.tags,
      image: post.image,
    });
    setIsEditDialogOpen(true);
  };

  return (
    // <MarketingContext.Provider value={contextValue}>
    <div className=" mx-auto ">
      <Outlet context={{
        posts,
        setPosts,
        searchTerm,
        setSearchTerm,
        selectedStatus,
        setSelectedStatus,
        isAddDialogOpen,
        setIsAddDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        editingPost,
        setEditingPost,
        formData,
        setFormData,
        handleAddPost,
        handleEditPost,
        handleDeletePost,
        openEditDialog,
        activeClass,
      }
      } />
    </div>
    // </MarketingContext.Provider>
  );
}
import { useState, createContext, useEffect } from "react";
import { Outlet, Routes, Route } from "react-router-dom";
import axios from "axios";

export default function MarketingPage() {
  const activeClass =
    "bg-blue-500 text-white admin-dark:bg-blue-600 admin-dark:text-white font-medium rounded-md px-4 py-2 transition-colors duration-200";

  const [posts, setPosts] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [socialNetworks, setSocialNetworks] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author_id: 1,
    status: "draft",
    platform_id: "",
    platform_name: "",
    platform_color: "",
    tags: "",
    image: "",
    lang: "vi",
  });

  // Gọi API lấy dữ liệu user (giữ nguyên logic gốc)
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Chưa có token, cần login trước");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data.user);
    } catch (err) {
      console.error("Lỗi lấy user:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialNetWorks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/social-networks`);
      if (!res.ok) throw new Error("Không thể tải mạng xã hội");
      const data = await res.json();
      setSocialNetworks(data);
    } catch (err) {
      console.error("Lỗi mạng xã hội:", err);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/marketing`);
      if (!res.ok) throw new Error("Không thể tải dữ liệu");
      let result = await res.json();

      setPosts(result.data);
      setColumns(result.colums);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      setError("Không thể tải danh sách bài viết. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchUser();
    fetchSocialNetWorks();
    fetchPosts();
  }, []);



  const handleAddPost = async () => {
    try {
      const payload = {
        author_id: user?.id || null,
        platform_id: formData.platform_id || null,
        image: formData.image,
        tags: formData.tags,
        status: formData.status || "draft",
        translations: [
          {
            lang: formData.lang || "vi",
            title: formData.title,
            content: formData.content,
          },
        ],
      };

      const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/marketing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Backend error:", errData);
        alert("Thêm bài viết thất bại. Vui lòng thử lại.");
        return;
      }

      const newPost = await res.json();
      console.log("Thêm dữ liệu mới thành công:", newPost);

      setPosts([...posts, newPost]);

      // Reset form
      setFormData({
        title: "",
        content: "",
        author_id: 1,
        status: "draft",
        tags: "",
        image: "",
        lang: "vi",
        platform_name: "",
      });

      fetchPosts();
    } catch (error) {
      console.error("Lỗi khi thêm bài viết:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };


  const handleEditPost = async () => {
    try {
      const payload = {
        // author_id: formData.author_id ?? null, không được thay đổi chủ bài viết
        platform_id: formData.platform_id ?? null,
        image: formData.image,
        tags: formData.tags,
        status: formData.status ?? "draft",
        translations: [
          {
            lang: formData.lang,
            title: formData.title,
            content: formData.content,
          },
        ],
      };

      const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/marketing/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Lỗi khi cập nhật bài viết");
      }

      fetchPosts();
    } catch (err) {
      console.error("PUT thất bại:", err);
    }
  };



  const handleDeletePost = async (id) => {
    await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/marketing/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Xóa không thành công");
        return res.json();
      })
      .then(() => fetchPosts())
      .catch((err) => {
        console.error("Lỗi khi xóa:", err);
        setError("Xóa bài viết thất bại. Vui lòng thử lại.");
      });
  };


  const searchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/marketing/search?term=${encodeURIComponent(searchTerm)}&status=${encodeURIComponent(selectedStatus)}`);
      if (!res.ok) throw new Error("Không thể tải dữ liệu");
      let result = await res.json();

      setPosts(result.data);
      setColumns(result.colums);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      setError("Không thể tải danh sách bài viết. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };


  //------------------------------

  const handleAddNetwork = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/social-networks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.platform_name }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Backend error:", errData);
        alert("Thêm mạng xã hội thất bại. Vui lòng thử lại.");
        return;
      }

      const newNetwork = await res.json();
      console.log("Thêm mạng xã hội mới thành công:", newNetwork);

      setSocialNetworks([...socialNetworks, newNetwork]);

      // Reset form
      setFormData((prev) => ({
        ...prev,
        platform_id: newNetwork.id,
        platform_name: "",
      }));

    } catch (error) {
      console.error("Lỗi khi thêm mạng xã hội:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  }


  return (
    <div className=" mx-auto ">
      <Outlet context={{
        posts,
        setPosts,
        columns,
        setColumns,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        selectedStatus,
        setSelectedStatus,
        formData,
        setFormData,
        handleAddPost,
        handleEditPost,
        handleDeletePost,
        activeClass,
        searchPosts,
        handleAddNetwork
      }} />
    </div>
  );
}
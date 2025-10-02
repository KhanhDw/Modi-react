import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { MarketingContext } from "./MarketingContext";

export default function MarketingProvider({ children }) {
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

    // API user
    const fetchUser = useCallback(async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) return;

            const res = await axios.get(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/auth/me`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUser(res.data.user);
        } catch (err) {
            console.error("Lỗi lấy user:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // API social networks
    const fetchSocialNetworks = useCallback(async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/social-networks`);
            if (!res.ok) throw new Error("Không thể tải mạng xã hội");
            const data = await res.json();
            setSocialNetworks(data);
        } catch (err) {
            console.error("Lỗi mạng xã hội:", err);
        }
    }, []);

    // API posts
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/marketing`);
            if (!res.ok) throw new Error("Không thể tải dữ liệu");
            const result = await res.json();
            setPosts(result.data);
            setColumns(result.colums);
        } catch (err) {
            setError("Không thể tải danh sách bài viết. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, []);

    // CRUD posts
    const handleAddPost = async (data) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/marketing`, {
                method: "POST",
                body: data,  // FormData
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error("Backend error:", errData);
                alert("Thêm bài viết thất bại. Vui lòng thử lại.");
                return;
            }

            await res.json();

            // reset form
            setFormData({
                title: "",
                content: "",
                author_id: 1,
                status: "draft",
                platform_id: "",
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
    const handleEditPost = async (id, data) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/marketing/${id}`, {
                method: "PUT",
                body: data, // FormData
            });

            if (!res.ok) throw new Error("Cập nhật thất bại");

            await res.json();
            fetchPosts(); // refresh lại danh sách
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Không thể cập nhật bài viết");
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

    useEffect(() => {
        fetchUser();
        fetchSocialNetworks();
        fetchPosts();
    }, [fetchUser, fetchSocialNetworks, fetchPosts]);

    const value = useMemo(() => ({
        posts, setPosts,
        columns, setColumns,
        loading, error,
        searchTerm, setSearchTerm,
        selectedStatus, setSelectedStatus,
        formData, setFormData,
        user, socialNetworks,
        activeClass,
        fetchPosts,
        handleAddPost, handleEditPost, handleDeletePost,
        searchPosts,
        handleAddNetwork,
    }), [posts, columns, loading, error, searchTerm, selectedStatus, formData, user, socialNetworks]);

    return (
        <MarketingContext.Provider value={value}>
            {children}
        </MarketingContext.Provider>
    );
}

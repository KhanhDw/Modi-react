import PageHeader from "@/components/admin/common/PageHeader";
import BlogForm from "@/components/admin/blogForm/BlogForm";
import useBlogs from "@/hook/useBlogsAdmin";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function BlogsNewPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const {
        blogs,
        columns,
        showForm,
        editingBlog,
        loading,
        error,
        currentPage,
        totalPages,
        paginatedBlogs,
        itemsPerPage,
        sortOrder,
        handleAdd,
        handleEdit,
        handleDelete,
        handleSubmit,
        handleCancel,
        toggleSortOrder,
        handlePageChange,
        setEditingBlog,
    } = useBlogs();


    // Nếu có id (edit mode) thì tìm blog trong list hoặc fetch riêng
    useEffect(() => {
        if (id) {
            fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/blogs/${id}`)
                .then((res) => res.json())
                .then((data) => setEditingBlog(data))
                .catch((err) => { console.error("Lỗi khi xóa:", err); });
        } else {
            setEditingBlog(null);
        }
    }, [id, blogs]);



    // params: lang = "" | "en"
    const handleChangeLang = async (lang = "") => {
        if (!editingBlog) return;

        // thêm "/" nếu có lang
        const langPath = lang === 'en' ? `/${lang}` : "";

        const url = `${import.meta.env.VITE_MAIN_BE_URL}${langPath}/api/blogs/${editingBlog.id}`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);

            const blogData = await res.json();
            if (blogData) {
                // merge để không mất field cũ
                setEditingBlog((prev) => ({ ...prev, ...blogData }));
            }
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu:", err);
            setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        }

        console.log("Đang load lang:", lang);
    };


    if (loading) return <div className="p-4 text-center text-green-800">Đang tải...</div>;
    if (error) return <div className="p-4 text-center text-red-600">{error}</div>;






    if (!blogs) {
        return <div>Đang tải...</div>;  // ✅ return sau hook
    }

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-6">
                <PageHeader
                    isHiddenFilter={id ? true : true} // id có hay không, miến trong form là không được hiển thị
                    title={id ? "Sửa tin tức" : "Thêm tin tức"}
                    buttonText="Quay lại"
                    onButtonClick={() => navigate(-1)}
                    className="mb-4 sm:mb-6 w-full"
                />
            </div>

            <div className=" bg-white admin-dark:bg-slate-900 rounded-lg shadow-md ">
                <BlogForm
                    blog={editingBlog}
                    handleChangeLang={handleChangeLang}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        handleCancel();
                        navigate(-1);
                    }}
                />
            </div>
        </div>
    );
}
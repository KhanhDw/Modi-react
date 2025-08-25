import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditPage() {
    const { formData, setFormData, handleEditPost } = useOutletContext();
    const { id } = useParams();
    const navigate = useNavigate();

    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [socialNetworks, setSocialNetworks] = useState([]);
    // Fetch dữ liệu bài viết theo id
    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchSocialNetworks = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/social-networks`);
                if (!res.ok) throw new Error("Không thể tải dữ liệu mạng xã hội");
                const data = await res.json();
                setSocialNetworks(data);
            } catch (err) {
                console.error("Lỗi khi lấy mạng xã hội:", err);
                return [];
            }
        };

        const fetchData = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/marketing/${id}`);
                if (!res.ok) throw new Error("Không thể tải dữ liệu");
                const data = await res.json();

                setFormData(data);
                setPreview(data.image || "");
            } catch (err) {
                console.error("Lỗi khi tải:", err);
                setError("Không thể tải dữ liệu bài viết");
            } finally {
                setLoading(false);
            }
        };


        fetchSocialNetworks();
        fetchData();
    }, [id, setFormData]);

    const onSubmit = async () => {
        try {

            const payload = {
                id,
                author_id: formData.author_id || 1,   // nếu có author_id
                platform_id: formData.platform_id, // lấy thẳng số id
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

            console.log("Cập nhật bài viết với payload:", payload);
            await handleEditPost(payload);
            navigate(-1);
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
            setError("Không thể cập nhật bài viết");
        }
    };


    if (loading) {
        return <p className="text-center py-6">Đang tải dữ liệu...</p>;
    }

    if (error) {
        return (
            <div className="text-center py-6 text-red-500">
                {error}
                <div>
                    <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white admin-dark:bg-gray-900 rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 admin-dark:text-white">
                    Chỉnh sửa bài viết
                </h2>
                <div className="flex justify-end gap-4 mt-8">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="border-gray-300 text-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800 hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-base px-6 py-2 rounded-md"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={onSubmit}
                        className="bg-blue-500 hover:bg-blue-600 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700 text-white text-base px-6 py-2 rounded-md"
                    >
                        Cập nhật
                    </Button>
                </div>
            </div>

            {/* Form */}
            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-6">
                {/* Cột trái */}
                <div className="grid grid-cols-1 p-4 h-fit border-2 border-slate-700 rounded-2xl overflow-hidden">
                    {/* Tiêu đề & tác giả */}
                    <div className="bg-gray-50 admin-dark:bg-gray-900 rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 gap-2 py-2">
                            <div>
                                <Label>Tiêu đề</Label>
                                <Input
                                    value={formData.title || ""}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Nhập tiêu đề bài viết"
                                />
                            </div>
                            <div hidden>
                                <Label>Tác giả</Label>
                                <Input
                                    value={formData.author || ""}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    placeholder="Nhập tên tác giả"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mạng xã hội + Trạng thái + Tags */}
                    <div className="bg-gray-50 admin-dark:bg-gray-900 py-4 rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <Label>Mạng xã hội</Label>
                                <Select
                                    value={String(formData.platform_id || "")}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, platform_id: Number(value) })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn mạng xã hội" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {socialNetworks.map((network) => (
                                            <SelectItem key={network.id} value={String(network.id)}>
                                                {network.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>



                            </div>
                            <div>
                                <Label>Trạng thái</Label>
                                <Select
                                    value={formData.status || ""}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Bản nháp</SelectItem>
                                        <SelectItem value="published">Đã xuất bản</SelectItem>
                                        <SelectItem value="archived">Lưu trữ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>Tags</Label>
                            <Input
                                value={formData.tags || ""}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="Nhập tags (cách nhau bằng dấu phẩy)"
                            />
                        </div>
                    </div>

                    {/* Hình ảnh */}
                    <div className="bg-gray-50 admin-dark:bg-gray-900 pb-6 rounded-lg shadow-sm">
                        <Label>URL Hình ảnh</Label>
                        <div className="flex gap-2">
                            <Input
                                value={formData.image || ""}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="Nhập URL hình ảnh"
                            />
                            <Button type="button" onClick={() => setPreview(formData.image)}>
                                Xem ảnh
                            </Button>
                        </div>
                        <div className="text-sm text-gray-500 mt-3 border p-2 rounded">
                            {!preview && <p>Hình ảnh sẽ hiển thị nếu URL hợp lệ</p>}
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="object-cover rounded mt-2 max-h-60 mx-auto"
                                    onError={() => setPreview("")}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Cột phải */}
                <div className="box-border col-span-2 p-4 bg-gray-50 admin-dark:bg-gray-800 rounded-lg shadow-sm">
                    <Label>Nội dung bài viết</Label>
                    <Textarea
                        value={formData.content || ""}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Nhập nội dung bài viết"
                        rows={6}
                    />
                </div>
            </div>
        </div>
    );
}

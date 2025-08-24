import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddPage() {
    const { formData, setFormData, handleAddPost } = useOutletContext();

    useEffect(() => {
        // Reset form khi vào AddPage
        setFormData({
            title: "",
            content: "",
            platform_name: "",
            author_name: "",
            status: "draft",
            tags: "",
            image: "",
            lang: "vi",
            published_at: "",
        });
    }, [setFormData]);

    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onSubmit = () => {
        handleAddPost();
        navigate(-1);
    };


    const handlePreview = () => {
        if (!formData.image) {
            setError("Vui lòng nhập URL hình ảnh");
            setPreview("");
            return;
        }
        setPreview(formData.image);
        setError(""); // clear error trước khi load
    };

    return (
        <div className="w-full bg-white admin-dark:bg-gray-900 rounded-xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 admin-dark:text-white">
                    Tạo bài viết mới
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
                        Tạo mới
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-6">
                {/* Cột trái */}
                <div className="grid grid-cols-1 p-4 h-fit border-2 border-slate-700 rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 admin-dark:bg-gray-900 rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 gap-2 py-2">
                            {/* Tiêu đề */}
                            <div>
                                <Label
                                    htmlFor="add-title"
                                    className="text-sm font-medium text-gray-700 admin-dark:text-gray-200 mb-2"
                                >
                                    Tiêu đề
                                </Label>
                                <Input
                                    id="add-title"
                                    value={formData.title ?? ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    placeholder="Nhập tiêu đề bài viết"
                                    className="w-full bg-white admin-dark:bg-gray-600 admin-dark:text-white admin-dark:border-gray-500 border-gray-300 focus:ring-2 focus:ring-blue-500 admin-dark:focus:ring-blue-600 rounded-md px-4 py-2"
                                />
                            </div>
                            {/* Tác giả */}
                            <div>
                                <Label
                                    htmlFor="add-author"
                                    className="text-sm font-medium text-gray-700 admin-dark:text-gray-200 mb-2"
                                >
                                    Tác giả
                                </Label>
                                <Input
                                    id="add-author"
                                    value={formData.author_name ?? ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, author_name: e.target.value })
                                    }
                                    placeholder="Nhập tên tác giả"
                                    className="w-full bg-white admin-dark:bg-gray-600 admin-dark:text-white admin-dark:border-gray-500 border-gray-300 focus:ring-2 focus:ring-blue-500 admin-dark:focus:ring-blue-600 rounded-md px-4 py-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Platform + Status + Tags */}
                    <div className="bg-gray-50 admin-dark:bg-gray-900 py-4 rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-700 admin-dark:text-gray-200 mb-2">
                                    Mạng xã hội
                                </Label>
                                <Select
                                    value={formData.platform_name ?? ""}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, platform_name: value })
                                    }
                                >
                                    <SelectTrigger className="w-full bg-white admin-dark:bg-gray-600 admin-dark:text-white admin-dark:border-gray-500 border-gray-300">
                                        <SelectValue placeholder="Chọn mạng xã hội" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-black admin-dark:bg-gray-900">
                                        <SelectItem value="facebook">Facebook</SelectItem>
                                        <SelectItem value="youtube">YouTube</SelectItem>
                                        <SelectItem value="tiktok">TikTok</SelectItem>
                                        <Separator />
                                        <Button
                                            theme="admin"
                                            type="button"
                                            className="mt-2 px-2 w-full flex items-center hover:bg-gray-300 admin-dark:hover:bg-gray-700"
                                        >
                                            Thêm mạng xã hội khác
                                        </Button>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-700 admin-dark:text-gray-200 mb-2">
                                    Trạng thái
                                </Label>
                                <Select
                                    value={formData.status ?? ""}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, status: value })
                                    }
                                >
                                    <SelectTrigger className="w-full bg-white admin-dark:bg-gray-600 admin-dark:text-white admin-dark:border-gray-500 border-gray-300">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-black admin-dark:bg-gray-900">
                                        <SelectItem value="draft">Bản nháp</SelectItem>
                                        <SelectItem value="published">Đã xuất bản</SelectItem>
                                        <SelectItem value="archived">Lưu trữ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-700 admin-dark:text-gray-200 mb-2">
                                Tags
                            </Label>
                            <Input
                                value={formData.tags ?? ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, tags: e.target.value })
                                }
                                placeholder="Nhập tags (cách nhau bằng dấu phẩy)"
                                className="w-full bg-white admin-dark:bg-gray-600 admin-dark:text-white admin-dark:border-gray-500 border-gray-300 px-4 py-2"
                            />
                        </div>
                    </div>

                    {/* Ảnh */}
                    <div className="bg-gray-50 admin-dark:bg-gray-900 pb-6 rounded-lg shadow-sm">
                        <Label className="text-sm font-medium text-gray-700 admin-dark:text-gray-200 mb-2">
                            URL Hình ảnh
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                value={formData.image ?? ""}
                                onChange={(e) => {
                                    setFormData({ ...formData, image: e.target.value });
                                    setError(""); // reset error khi nhập lại
                                }}
                                placeholder="Nhập URL hình ảnh"
                                className="w-full bg-white admin-dark:bg-gray-600 admin-dark:text-white admin-dark:border-gray-500 border-gray-300 px-4 py-2"
                            />
                            <Button type="button" onClick={handlePreview}>
                                Xem ảnh
                            </Button>
                        </div>

                        <div className="text-sm text-gray-500 admin-dark:text-gray-400 mt-3 border border-gray-300 admin-dark:border-gray-500 p-2 rounded">
                            {!preview && !error && <p>Hình ảnh sẽ hiển thị nếu URL hợp lệ</p>}
                            {error && (
                                <p className="text-red-500 font-medium">{error}</p>
                            )}
                            {preview && (
                                <img
                                    key={preview}
                                    src={preview}
                                    alt="Preview"
                                    className="object-cover rounded mt-2 max-h-60 mx-auto"
                                    onError={() => {
                                        setError("Không tìm thấy hình ảnh từ URL đã nhập");
                                        setPreview("");
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Cột phải */}
                <div className="box-border col-span-2 p-4 overflow-hidden bg-gray-50 admin-dark:bg-gray-800 rounded-lg shadow-sm">
                    <Label
                        htmlFor="add-content"
                        className="text-sm font-medium text-gray-700 admin-dark:text-gray-200 mb-2"
                    >
                        Nội dung bài viết
                    </Label>
                    <Textarea
                        id="add-content"
                        value={formData.content ?? ""}
                        onChange={(e) =>
                            setFormData({ ...formData, content: e.target.value })
                        }
                        placeholder="Nhập nội dung bài viết"
                        rows={6}
                        className="px-4 py-2 w-full h-11/12 overflow-y-auto bg-white admin-dark:bg-gray-600 admin-dark:text-white admin-dark:border-gray-500 border-gray-300 rounded-md"
                    />
                </div>
            </div>
        </div>
    );
}

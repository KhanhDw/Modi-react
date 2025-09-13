
// AddPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import SocialNetworkManager from "./SocialNetworkManager";
import TextEditorWrapper from "@/components/feature/TextEditor/TextEditor";

export default function AddPage() {
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const { formData, setFormData, handleAddPost, reloadPostsAndSocialNetWorks } = useOutletContext();
    const [socialNetworks, setSocialNetworks] = useState([]);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [isOpenEditNetwork, setIsOpenEditNetwork] = useState(false);
    const [user, setUser] = useState(null);

    const handleOpenEditNetwork = () => setIsOpenEditNetwork(true);

    const fetchSocialNetworks = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/social-networks`);
            if (!res.ok) throw new Error("Không thể tải mạng xã hội");
            const data = await res.json();
            setSocialNetworks(data);
        } catch (err) {
            console.error("Lỗi mạng xã hội:", err);
        }
    };

    useEffect(() => {
        fetchUser();
        setFormData({
            title: "",
            content: "",
            author_id: user?.id || null,
            platform_id: null,
            status: "draft",
            tags: "",
            imageFile: null, // lưu file
            lang: "vi",
        });
        fetchSocialNetworks();
        setPreview(null);
    }, [setFormData]);

    const onSubmit = () => {
        const content = editorRef.current?.getHTML()?.trim() ?? "";

        if (!formData.title || !content || !formData.platform_id || !formData.imageFile) {
            setError("Vui lòng điền đầy đủ thông tin và chọn hình ảnh");
            return;
        }

        setError("");

        const payload = {
            author_id: formData.author_id || 1,
            platform_id: formData.platform_id,
            tags: formData.tags,
            status: formData.status || "draft",
            translations: [
                {
                    lang: formData.lang || "vi",
                    title: formData.title,
                    content,
                },
            ],
        };

        console.log("Payload gửi:", payload);
        handleAddPost(payload, formData.imageFile);
        navigate(-1);
    };

    return (
        <div className="w-full admin-dark:bg-gray-900 rounded-xl p-2 sm:p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 admin-dark:text-white">
                    Tạo bài viết mới
                </h2>
                <div className="flex flex-wrap sm:flex-nowrap justify-end gap-2 sm:gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="text-sm sm:text-base px-4 sm:px-6 py-2 rounded-md border-gray-300 admin-dark:border-gray-600 admin-dark:text-gray-200 bg-gray-600 admin-dark:bg-gray-800 hover:bg-gray-700 admin-dark:hover:bg-gray-700 cursor-pointer"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={onSubmit}
                        className="text-sm sm:text-base px-4 sm:px-6 py-2 rounded-md bg-blue-500 hover:bg-blue-600 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700 text-white cursor-pointer"
                    >
                        Tạo mới
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Form (cột trái trên mobile, desktop bên trái) */}
                <div className="lg:w-1/3 flex flex-col gap-3">
                    {!isOpenEditNetwork ? (
                        <div className="flex flex-col gap-3 p-3 border-2 border-slate-300 rounded-2xl bg-gray-50 admin-dark:bg-gray-800">
                            {/* Tiêu đề */}
                            <div className="space-y-2">
                                <Label>Tiêu đề</Label>
                                <Input
                                    value={formData.title || ""}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Nhập tiêu đề bài viết"
                                    className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg focus:outline-none text-sm sm:text-base focus:border-none"
                                />
                            </div>

                            {/* Mạng xã hội + Trạng thái */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Mạng xã hội</Label>
                                    <Select
                                        value={formData.platform_id || ""}
                                        onValueChange={(value) => setFormData({ ...formData, platform_id: value })}
                                        className="w-full border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"
                                    >
                                        <SelectTrigger className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg cursor-pointer">
                                            <SelectValue placeholder="Chọn mạng xã hội" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {socialNetworks.map((network, index) => (
                                                <SelectItem key={network.id ?? `temp-${index}`} value={network.id}>
                                                    {network.name}
                                                </SelectItem>
                                            ))}
                                            <Separator className="mt-2" />
                                            <Button onClick={handleOpenEditNetwork} theme="admin" className="w-full mt-2">
                                                Thêm mạng xã hội mới
                                            </Button>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Trạng thái</Label>
                                    <Select
                                        value={formData.status || ""}
                                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                                        className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"
                                    >
                                        <SelectTrigger className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg cursor-pointer">
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

                            {/* Tags */}
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <Input
                                    value={formData.tags || ""}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="Nhập tags (cách nhau bằng dấu phẩy)"
                                    className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg focus:outline-none text-sm sm:text-base focus:border-none"
                                />
                            </div>

                            {/* Hình ảnh */}
                            <div className="space-y-2">
                                <Label>Chọn hình ảnh</Label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg p-2 cursor-pointer focus:outline-none"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFormData({ ...formData, imageFile: file });
                                            setPreview(URL.createObjectURL(file));
                                            setError("");
                                        }
                                    }}
                                />
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="object-cover rounded-xl max-h-60 w-full"
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <SocialNetworkManager
                            socialNetworks={socialNetworks}
                            setSocialNetworks={setSocialNetworks}
                            fetchSocialNetworks={fetchSocialNetworks}
                            reloadPostsAndSocialNetWorks={reloadPostsAndSocialNetWorks}
                            onClose={() => setIsOpenEditNetwork(false)}
                        />
                    )}
                </div>

                {/* Editor (cột phải trên desktop, dưới mobile) */}
                <div className="lg:w-2/3 flex flex-col gap-3 p-3 border-2 border-slate-300 rounded-2xl bg-gray-50 admin-dark:bg-gray-800">
                    <Label>Nội dung bài viết</Label>
                    <TextEditorWrapper
                        ref={editorRef}
                        value={formData.content}
                        key={formData.lang + "-" + (formData.id || "new")}
                    />
                </div>
            </div>
        </div>

    );
}

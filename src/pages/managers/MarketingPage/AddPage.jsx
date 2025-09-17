// AddPage.jsx (component tổng đã được cập nhật)
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator"
import SocialNetworkManager from "./SocialNetworkManager";
import TextEditorWrapper from "@/components/feature/TextEditor/TextEditor";
import axios from "axios";


export default function AddPage() {
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const { formData, setFormData, handleAddPost, reloadPostsAndSocialNetWorks } = useOutletContext();
    const [socialNetworks, setSocialNetworks] = useState([]);
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const [isOpenEditNetwork, setIsOpenEditNetwork] = useState(false);
    const [user, setUser] = useState(null);

    const handleOpenEditNetwork = () => {
        setIsOpenEditNetwork(true);
    };

    // Fetch social networks
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
        }
    };

    // Reset form
    useEffect(() => {
        fetchUser();
        setFormData({
            title: "",
            content: "",
            author_id: user?.id || null,
            platform_id: null,
            status: "draft",
            tags: "",
            image: "",
            lang: "vi",
        });

        fetchSocialNetworks();
    }, [setFormData]);

    const onSubmit = () => {

        const content = editorRef.current?.getHTML();

        // if (!formData.title || !formData.content || !formData.platform_id || !formData.image) {
        if (!formData.title || !content || !formData.platform_id || !formData.image) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setError("");

        formData.content = content
        // const payload = {
        //     author_id: formData.author_id || 1,
        //     platform_id: formData.platform_id,
        //     image: formData.image,
        //     tags: formData.tags,
        //     status: formData.status || "draft",
        //     translations: [
        //         {
        //             lang: formData.lang || "vi",
        //             title: formData.title,
        //             content: formData.content,
        //         },
        //     ],
        // };
        // console.log("Payload gửi:", payload);
        handleAddPost();
        navigate(-1);
    };

    return (
        <div className="w-full admin-dark:bg-gray-900 rounded-xl p-2 sm:p-4 md:p-4 lg:p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 admin-dark:text-white">
                    Tạo bài viết mới
                </h2>

                <div className="w-full sm:w-auto flex justify-center sm:justify-center">
                    <div className="flex flex-wrap sm:flex-nowrap items-end gap-2 sm:gap-4">
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
            </div>


            {/* Content */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Cột trái */}
                {!isOpenEditNetwork ? (
                    <div className="lg:w-1/3 flex flex-col gap-3">

                        {/* Mạng xã hội + Trạng thái + Tags */}
                        <div className="p-3 border-2 border-slate-300 rounded-2xl bg-gray-50 admin-dark:bg-gray-800 space-y-3">
                            {/* Tiêu đề */}
                            <div className="rounded-2xl bg-gray-50 admin-dark:bg-gray-800 space-y-3">
                                <Label>Tiêu đề</Label>
                                <Input
                                    value={formData.title || ""}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Nhập tiêu đề bài viết"
                                    className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg focus:outline-none text-sm sm:text-base focus:border-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                                {/* Mạng xã hội */}
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
                                            <Button
                                                onClick={handleOpenEditNetwork}
                                                theme="admin"
                                                className="w-full mt-2 cursor-pointer"
                                            >
                                                Thêm mạng xã hội mới
                                            </Button>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Trạng thái */}
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

                            {/* Ảnh */}
                            <Label>URL Hình ảnh</Label>
                            <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                                <Input
                                    value={formData.image || ""}
                                    onChange={(e) => {
                                        setFormData({ ...formData, image: e.target.value });
                                        setError("");
                                    }}
                                    placeholder="Nhập URL hình ảnh"
                                    className="border-2 focus:border-none border-slate-300 admin-dark:border-slate-600 rounded-lg"
                                />
                                <Button
                                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700 text-white"
                                    type="button"
                                    onClick={() => setPreview(formData.image)}
                                >
                                    Xem ảnh
                                </Button>
                            </div>
                            <div className="text-sm text-gray-500 space-y-2">
                                {!preview && <p>Hình ảnh sẽ hiển thị nếu URL hợp lệ</p>}
                                {error && <p className="text-red-500 font-medium">{error}</p>}
                                {preview && (
                                    <img
                                        key={preview}
                                        src={preview}
                                        alt="Preview"
                                        className="object-cover rounded-xl max-h-60 w-full mx-auto"
                                        onError={() => {
                                            setError("Không tìm thấy hình ảnh từ URL đã nhập");
                                            setPreview("");
                                        }}
                                    />
                                )}
                            </div>
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

                {/* Cột phải */}
                <div className="lg:w-2/3 flex flex-col gap-3 p-3 border-2 border-slate-300 rounded-2xl bg-gray-50 admin-dark:bg-gray-800 shadow-sm">
                    <Label>Nội dung bài viết</Label>
                    <TextEditorWrapper ref={editorRef} value={formData.content} />
                </div>
            </div>
        </div>
    );

}
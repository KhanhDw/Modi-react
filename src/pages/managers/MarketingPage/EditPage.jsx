import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SocialNetworkManager from "./SocialNetworkManager";
import TextEditorWrapper from "@/components/feature/TextEditor/TextEditor";

export default function EditPage() {
    const editorRef = useRef(null);
    const { formData, setFormData, handleEditPost, reloadPostsAndSocialNetWorks } = useOutletContext();
    const { id } = useParams();
    const navigate = useNavigate();

    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOpenEditNetwork, setIsOpenEditNetwork] = useState(false);
    const [socialNetworks, setSocialNetworks] = useState([]);


    const handleOpenEditNetwork = () => {
        setIsOpenEditNetwork(true);
    };

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

    // Fetch dữ liệu bài viết theo id
    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/marketing/id/${id}`);
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
            const content = editorRef.current?.getHTML();
            formData.content = content
            await handleEditPost();
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
        <div className="w-full admin-dark:bg-gray-900 rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 admin-dark:text-white">
                    Chỉnh sửa bài viết
                </h2>
                <div className="flex justify-end gap-4 mt-8">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="border-gray-300  admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800 text-white hover:text-black hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-base px-6 py-2 rounded-md"
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
                {!isOpenEditNetwork ?
                    <div className="grid grid-cols-1 p-4 h-fit border-2 border-slate-300 admin-dark:border-slate-600 rounded-2xl overflow-hidden">
                        {/* Tiêu đề & tác giả */}
                        <div className="bg-gray-50 admin-dark:bg-gray-900 rounded-lg ">
                            <div className="grid grid-cols-1 gap-2 py-2 ">
                                <div className="space-y-3">
                                    <Label>Tiêu đề</Label>
                                    <Input
                                        value={formData.title || ""}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Nhập tiêu đề bài viết"
                                        className={"border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"}

                                    />
                                </div>
                                <div hidden>
                                    <Label>Tác giả</Label>
                                    <Input
                                        value={formData.author || ""}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        placeholder="Nhập tên tác giả"
                                        className={"border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mạng xã hội + Trạng thái + Tags */}
                        <div className="bg-gray-50 admin-dark:bg-gray-900 py-4 rounded-lg ">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div className="space-y-3">
                                    <Label>Mạng xã hội</Label>
                                    <Select
                                        value={String(formData.platform_id || "")}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, platform_id: Number(value) })
                                        }
                                        className={"border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"}
                                    >
                                        <SelectTrigger className={"border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"}>
                                            <SelectValue placeholder="Chọn mạng xã hội" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {socialNetworks.map((network) => (
                                                <SelectItem key={network.id} value={String(network.id)}>
                                                    {network.name}
                                                </SelectItem>
                                            ))}
                                            <Separator />

                                            <Button
                                                onClick={handleOpenEditNetwork}

                                                theme="admin" className="w-full  mt-4  ">
                                                Thêm mạng xã hội mới
                                            </Button>
                                        </SelectContent>
                                    </Select>



                                </div>
                                <div className="space-y-3">
                                    <Label>Trạng thái</Label>
                                    <Select
                                        value={formData.status || ""}
                                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                                        className={"border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"}
                                    >
                                        <SelectTrigger className={"border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"}>
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
                            <div className="space-y-3">
                                <Label>Tags</Label>
                                <Input
                                    value={formData.tags || ""}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="Nhập tags (cách nhau bằng dấu phẩy)"
                                    className={"border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"}

                                />
                            </div>
                        </div>

                        {/* Hình ảnh */}
                        <div className="bg-gray-50 admin-dark:bg-gray-900 pb-6 rounded-lg  space-y-3">
                            <Label>URL Hình ảnh</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={formData.image || ""}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="Nhập URL hình ảnh"
                                    className={"border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"}
                                />
                                <Button type="button" onClick={() => setPreview(formData.image)}
                                    className={"border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"}>
                                    Xem ảnh
                                </Button>
                            </div>
                            <div className="text-sm text-gray-500 mt-3 border-2 border-slate-400 admin-dark:border-slate-600 p-2 rounded-xl space-y-3">
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
                    :
                    <SocialNetworkManager
                        socialNetworks={socialNetworks}
                        setSocialNetworks={setSocialNetworks}
                        fetchSocialNetworks={fetchSocialNetworks}
                        reloadPostsAndSocialNetWorks={reloadPostsAndSocialNetWorks}
                        onClose={() => setIsOpenEditNetwork(false)}
                    />
                }
                {/* Cột phải */}
                <div className="space-y-3 box-border col-span-2 p-4 border-2 border-slate-300 admin-dark:border-slate-600 bg-gray-50 admin-dark:bg-gray-800 rounded-lg shadow-sm">
                    <Label>Nội dung bài viết</Label>
                    {/* <Textarea
                        value={formData.content || ""}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Nhập nội dung bài viết"
                        rows={6}
                        className={"border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"}
                    /> */}

                    {/* <TextEditor
                        valueContextNews={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    /> */}

                    <TextEditorWrapper ref={editorRef} value={formData.content} />
                </div>
            </div>
        </div>
    );
}

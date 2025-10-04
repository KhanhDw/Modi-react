// AddPage.jsx
import TextEditorWrapper from "@/components/feature/TextEditor/TextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMarketing } from "@/pages/managers/MarketingPage/hooks/MarketingContext";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocialNetworkManager from "./SocialNetworkManager";

export default function AddPage() {
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const { handleAddPost, reloadPostsAndSocialNetWorks } = useMarketing();

    // Local states
    const [socialNetworks, setSocialNetworks] = useState([]);
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const [isOpenEditNetwork, setIsOpenEditNetwork] = useState(false);
    const [user, setUser] = useState(null);

    // Form fields (local state)
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [status, setStatus] = useState("draft");
    const [platformId, setPlatformId] = useState("");
    const [image, setImage] = useState(null);

    const handleOpenEditNetwork = () => setIsOpenEditNetwork(true);

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

    // Fetch user
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) return;

            const res = await axios.get(`${import.meta.env.VITE_MAIN_BE_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(res.data.user);
        } catch (err) {
            console.error("Lỗi lấy user:", err);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchSocialNetworks();
    }, []);

    // Submit handler
    const onSubmit = () => {
        const content = editorRef.current?.getHTML();

        if (!title || !content || !platformId || !image) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setError("");

        const data = new FormData();
        data.append("author_id", user?.id || 1);
        data.append("platform_id", platformId);
        data.append("tags", tags);
        data.append("status", status);

        data.append(
            "translations",
            JSON.stringify([
                {
                    lang: "vi",
                    title,
                    content,
                },
            ])
        );

        if (image instanceof File) {
            data.append("image", image);
        }

        handleAddPost(data);
        navigate(-1);
    };

    return (
        <div className="w-full admin-dark:bg-gray-900 rounded-xl md:p-2">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-900 admin-dark:text-white">
                    Tạo bài viết mới
                </h2>

                <div className="w-full sm:w-auto flex justify-center">
                    <div className="flex flex-wrap sm:flex-nowrap items-end gap-2 sm:gap-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="px-4 sm:px-6 py-2 rounded-md border-gray-300 admin-dark:border-gray-600 bg-gray-600 admin-dark:bg-gray-800 hover:bg-gray-700 admin-dark:hover:bg-gray-700 cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-semibold admin-dark:text-gray-200">Hủy</span>
                        </Button>
                        <Button
                            onClick={onSubmit}
                            className="px-4 sm:px-6 py-2 rounded-md bg-blue-500 hover:bg-blue-600 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700 cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-semibold text-white">Tạo mới</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Left column */}
                {!isOpenEditNetwork ? (
                    <div className="lg:w-1/3 flex flex-col gap-3 admin-dark:border-gray-700">
                        <div className="p-3 border-2 border-slate-300 admin-dark:border-gray-700 rounded-2xl bg-gray-50 admin-dark:bg-gray-800 space-y-3">
                            {/* Title */}
                            <div className="space-y-3">
                                <Label>Tiêu đề</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Nhập tiêu đề bài viết"
                                    className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg text-sm sm:text-base"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {/* Social network */}
                                <div className="space-y-2">
                                    <Label>Mạng xã hội</Label>
                                    <Select
                                        value={platformId || ""}
                                        onValueChange={setPlatformId}
                                        className="w-full border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"
                                    >
                                        <SelectTrigger className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg">
                                            <SelectValue placeholder="Chọn mạng xã hội" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {socialNetworks.map((network, index) => (
                                                <SelectItem className={'cursor-pointer'} key={network.id ?? `temp-${index}`} value={network.id}>
                                                    {network.name}
                                                </SelectItem>
                                            ))}
                                            <Separator className="mt-2" />
                                            <Button onClick={handleOpenEditNetwork} className="w-full mt-2 cursor-pointer">
                                                Thêm mạng xã hội mới
                                            </Button>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label>Trạng thái</Label>
                                    <Select
                                        value={status}
                                        onValueChange={setStatus}
                                        className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"
                                    >
                                        <SelectTrigger className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg cursor-pointer">
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem className={'cursor-pointer'} value="draft">Bản nháp</SelectItem>
                                            <SelectItem className={'cursor-pointer'} value="published">Đã xuất bản</SelectItem>
                                            <SelectItem className={'cursor-pointer'} value="archived">Lưu trữ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <Input
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="Nhập tags (cách nhau bằng dấu phẩy)"
                                    className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg text-sm sm:text-base"
                                />
                            </div>

                            {/* Image */}
                            <Label>Ảnh bài viết</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setImage(file);
                                        setPreview(URL.createObjectURL(file));
                                        setError("");
                                    }
                                }}
                                className="border-2 cursor-pointer border-slate-300 admin-dark:border-slate-600 rounded-lg"
                            />

                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="object-cover rounded-xl max-h-60 w-full mx-auto mt-2"
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

                {/* Right column */}
                <div className="lg:w-2/3 flex flex-col gap-3 p-3 border-2 border-slate-300 admin-dark:border-gray-700 rounded-2xl bg-gray-50 admin-dark:bg-gray-800 shadow-sm">
                    <Label>Nội dung bài viết</Label>
                    <TextEditorWrapper ref={editorRef} />
                </div>
            </div>

            {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>
    );
}

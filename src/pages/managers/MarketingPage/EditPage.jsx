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
    const [activeLang, setActiveLang] = useState("vi");
    const [file, setFile] = useState(null);

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

                // setPreview(data.image ?? "");
                setPreview(data.image ? `${import.meta.env.VITE_MAIN_BE_URL}/${data.image.replace(/^\/?/, '')}` : "");


                setActiveLang(data.lang ?? "vi");
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


    // params: lang = "" | "en"
    const handleChangeLang = async (lang = "") => {
        if (!id) return;


        try {
            // thêm "/" nếu có lang
            const langPath = lang === 'en' ? `/${lang}` : "";
            const url = `${import.meta.env.VITE_MAIN_BE_URL}${langPath}/api/marketing/id/${id}`;
            const res = await fetch(url);

            let marketingData = {};
            if (res.ok) {
                marketingData = await res.json();
            }

            if (!marketingData || Object.keys(marketingData).length === 0) {
                setFormData((prev) => ({
                    ...prev,
                    lang,
                    title: "",
                    content: "<p></p>",
                }));
            } else {
                // ✅ Có dữ liệu -> hiển thị bình thường
                setFormData(marketingData);
            }

            setActiveLang(lang);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu:", err);
            setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        }

        console.log("Đang load lang:", lang);
    };

    const onSubmit = async () => {
        try {
            const content = editorRef.current?.getHTML() || "";

            const payload = {
                id: formData.id,
                author_id: formData.author_id ?? 1,
                platform_id: formData.platform_id ?? null,
                status: formData.status ?? "draft",
                tags: formData.tags ?? "",
                translations: [
                    {
                        lang: activeLang,
                        title: formData.title,
                        content,
                    },
                ],
            };

            await handleEditPost(payload, formData.imageFile); // gửi file nếu có
            navigate(-1);
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
            setError("Không thể cập nhật bài viết");
        }
    };


    if (loading) {
        return <p className="text-center py-6 admin-dark:text-white">Đang tải dữ liệu...</p>;
    }

    if (error) {
        return (
            <div className="text-center py-6 text-red-500">
                {error}
                <div>
                    <Button variant="outline" onClick={() => navigate(-1)} className="mt-4 cursor-pointer">
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    const handleActiveLangbtn = (lang) => {
        if (lang !== activeLang) {
            // cảnh báo nếu chuyển từ vi sang en
            const confirmMsg =
                lang === "en"
                    ? "Bạn đang chuyển sang Tiếng Anh. Khi cập nhật, dữ liệu sẽ được lưu ở Tiếng Anh."
                    : "Bạn đang chuyển về Tiếng Việt. Khi cập nhật, dữ liệu sẽ được lưu ở Tiếng Việt.";

            const proceed = window.confirm(confirmMsg);
            if (!proceed) return; // nếu user nhấn Hủy thì không chuyển
        }

        setActiveLang(lang);
        handleChangeLang(lang);
    };

    return (
        <div className="w-full admin-dark:bg-gray-900 rounded-xl p-2 sm:p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 admin-dark:text-white">
                    Chỉnh sửa bài viết
                </h2>

                <div className="flex flex-wrap sm:flex-nowrap justify-end gap-2 sm:gap-4">
                    <button
                        type="button"
                        name="vi"
                        onClick={() => handleActiveLangbtn("vi")}
                        className={`cursor-pointer flex px-2 py-1 rounded-md text-sm font-semibold ${activeLang === "vi"
                                ? "bg-blue-500 text-white admin-dark:bg-blue-500 admin-dark:text-white"
                                : "bg-gray-300 text-gray-700 admin-dark:bg-gray-700 admin-dark:text-gray-300"
                            }`}
                    >
                        Tiếng Việt
                    </button>

                    <button
                        type="button"
                        name="en"
                        onClick={() => handleActiveLangbtn("en")}
                        className={`cursor-pointer flex px-2 py-1 rounded-md text-sm font-semibold ${activeLang === "en"
                                ? "bg-blue-500 text-white admin-dark:bg-blue-500 admin-dark:text-white"
                                : "bg-gray-300 text-gray-700 admin-dark:bg-gray-700 admin-dark:text-gray-300"
                            }`}
                    >
                        Tiếng Anh
                    </button>
                </div>


                <div className="flex justify-end gap-4 mt-4 sm:mt-0">
                    <Button variant="outline" onClick={() => navigate(-1)}
                        className="border-gray-300 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800 text-white hover:text-white hover:bg-gray-800 admin-dark:hover:bg-gray-700 text-base px-6 py-2 rounded-md cursor-pointer">
                        Hủy
                    </Button>
                    <Button onClick={onSubmit}
                        className="bg-blue-500 hover:bg-blue-600 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700 text-white text-base px-6 py-2 rounded-md cursor-pointer">
                        Cập nhật
                    </Button>
                </div>
            </div>

            {/* Content: Responsive */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Form: top on mobile, left on desktop */}
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
                                        value={String(formData.platform_id || "")}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, platform_id: Number(value) })
                                        }
                                        className="w-full border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"
                                    >
                                        <SelectTrigger className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg cursor-pointer">
                                            <SelectValue placeholder="Chọn mạng xã hội" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {socialNetworks.map((network) => (
                                                <SelectItem key={network.id} value={String(network.id)}>
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
                                    className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg focus:outline-none"
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

                {/* Editor: bottom on mobile, right on desktop */}
                <div className="lg:w-2/3 flex flex-col gap-3 p-3 border-2 border-slate-300 rounded-2xl bg-gray-50 admin-dark:bg-gray-800">
                    <Label>Nội dung bài viết</Label>
                    <TextEditorWrapper ref={editorRef} value={formData.content} />
                </div>
            </div>
        </div>

    );
}

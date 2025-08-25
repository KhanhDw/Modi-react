import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SquarePen, Trash2 } from 'lucide-react';

export default function AddPage() {
    const navigate = useNavigate();
    const { formData, setFormData, handleAddPost } = useOutletContext();
    const [socialNetworks, setSocialNetworks] = useState([]);
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const [isOpenEditNetwork, setIsOpenEditNetwork] = useState(false);
    const [isOpenUpdateNetwork2, setIsOpenUpdateNetwork2] = useState(false);
    const [isOpenUpdateNetwork, setIsOpenUpdateNetwork] = useState(false);  // trạng thái mở form chỉnh sửa mạng xã hội


    const handleShowForm = (state) => {
        if (state === "add") {
            setIsOpenUpdateNetwork(true);
            setIsOpenUpdateNetwork2(false);
        } else if (state === "edit") {
            setIsOpenUpdateNetwork2(true);
            setIsOpenUpdateNetwork(false);
        } else if (state === "close") {
            setIsOpenUpdateNetwork(false);
            setIsOpenUpdateNetwork2(false);
        }
    }

    //

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

    // Reset form
    useEffect(() => {
        setFormData({
            title: "",
            content: "",
            author_id: 1,
            platform_id: null,
            status: "draft",
            tags: "",
            image: "",
            lang: "vi",
        });


        fetchSocialNetworks();
    }, [setFormData]);

    const onSubmit = () => {
        if (!formData.title || !formData.content || !formData.platform_id || !formData.image) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setError("");

        const payload = {
            author_id: formData.author_id || 1,
            platform_id: formData.platform_id,
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


        console.log("Payload gửi:", payload);
        handleAddPost(payload);
        navigate(-1);
    };


    const [name, setName] = useState("");
    const [color, setColor] = useState("#000000");

    const handleAddNetwork = () => {
        if (name) {

            // Gọi API thêm mới ở đây
            fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/social-networks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, HEX_color: color }), // gửi cả name + color
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Thêm mới thất bại");
                    return res.json();
                })
                .then((newNetwork) => {
                    // Cập nhật lại danh sách sau khi thêm mới
                    // setSocialNetworks([...socialNetworks, newNetwork]);
                    fetchSocialNetworks();
                    setName("");
                    setColor("#000000");
                })
                .catch((err) => {
                    console.error("Lỗi khi thêm mới:", err);
                    alert("Thêm mạng xã hội thất bại. Vui lòng thử lại.");
                });
        }
    };


    return (
        <div className="w-full bg-white admin-dark:bg-gray-900 rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 admin-dark:text-white">Tạo bài viết mới</h2>
                <div className="flex justify-end gap-4 mt-8">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="border-gray-300 bg-gray-400  text-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800 hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-base px-6 py-2 rounded-md"
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
                {!isOpenEditNetwork ?
                    <div className="grid grid-cols-1 p-4 h-fit border-2 border-slate-700 rounded-2xl overflow-hidden">
                        {/* Tiêu đề */}
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
                            </div>
                        </div>

                        {/* Mạng xã hội + Trạng thái + Tags */}
                        <div className="bg-gray-50 admin-dark:bg-gray-900 py-4 rounded-lg shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <Label>Mạng xã hội</Label>
                                    <Select
                                        value={formData.platform_id || ""} // để undefined hoặc "" khi chưa chọn
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, platform_id: value })
                                        }
                                    >

                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn mạng xã hội" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {socialNetworks.map((network) => (
                                                <SelectItem key={network.id} value={network.id}>
                                                    {network.name}
                                                </SelectItem>
                                            ))}
                                            <Button
                                                onClick={handleOpenEditNetwork}
                                                theme="admin" className="w-full  mt-2">
                                                Thêm mạng xã hội mới
                                            </Button>
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

                        {/* Ảnh */}
                        <div className="bg-gray-50 admin-dark:bg-gray-900 pb-6 rounded-lg shadow-sm">
                            <Label>URL Hình ảnh</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={formData.image || ""}
                                    onChange={(e) => {
                                        setFormData({ ...formData, image: e.target.value });
                                        setError("");
                                    }}
                                    placeholder="Nhập URL hình ảnh"
                                />
                                <Button

                                    type="button" onClick={() => setPreview(formData.image)}>
                                    Xem ảnh
                                </Button>
                            </div>
                            <div className="text-sm text-gray-500 mt-3 border p-2 rounded">
                                {!preview && <p>Hình ảnh sẽ hiển thị nếu URL hợp lệ</p>}
                                {error && <p className="text-red-500 font-medium">{error}</p>}
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
                    :
                    <div className="grid grid-cols-1 p-4 h-fit border-2 border-slate-700 rounded-2xl overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-gray-900 admin-dark:text-white">
                                Danh sách mạng xã hội
                            </h1>
                            <button type="button" onClick={() => setIsOpenEditNetwork(false)} className="text-blue-500 hover:underline font-bold">
                                Quay lại
                            </button>
                        </div>
                        <div>
                            <div>
                                {socialNetworks.map((network, index) => (
                                    <div key={network.id || network + 1} className="p-2 border-b border-gray-200 admin-dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium text-gray-900 admin-dark:text-white px-2 py-1 rounded-lg" style={{ background: network.HEX_color }}>{network.name}</div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline"
                                                    size="sm"
                                                    onClick={() => handleShowForm("edit")}
                                                    className="border-gray-300 bg-gray-400  text-xs text-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800 hover:bg-gray-100 admin-dark:hover:bg-gray-700  px-1 py-2 rounded-md"><SquarePen /></Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        // Xử lý xóa mạng xã hội
                                                        if (window.confirm(`Bạn có chắc chắn muốn xóa mạng xã hội "${network.name}" không?`)) {
                                                            // Gọi API xóa ở đây
                                                            fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/social-networks/${network.id}`, {
                                                                method: 'DELETE',
                                                            })
                                                                .then((res) => {
                                                                    if (!res.ok) throw new Error("Xóa thất bại");
                                                                    // Cập nhật lại danh sách sau khi xóa
                                                                    setSocialNetworks(socialNetworks.filter((n) => n.id !== network.id));
                                                                })
                                                                .catch((err) => {
                                                                    console.error("Lỗi khi xóa:", err);
                                                                    alert("Xóa mạng xã hội thất bại. Vui lòng thử lại.");
                                                                });
                                                        }
                                                    }}
                                                    className="border-red-400 text-red-500 hover:bg-red-50 admin-dark:text-red-400 admin-dark:hover:bg-red-900"
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div>
                                    {isOpenUpdateNetwork2 &&
                                        <div className="p-2 border-2 border-dashed border-gray-400 rounded-lg mt-4">
                                            <h2 className="text-lg font-medium  mb-2">Điều chỉnh thông tin mạng xã hội</h2>
                                            <div className="grid grid-cols-1 gap-2 border ">
                                                <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full admin-dark:text-white admin-dark:bg-gray-800 bg-gray-200 text-black py-3 px-2 border-b border-gray-500 focus:outline-none" placeholder="Nhập tên mạng xã hội" />
                                                <div className="flex items-center justify-between gap-3">
                                                    <input value={color} onChange={(e) => setColor(e.target.value)} type="text" className="w-full admin-dark:text-white admin-dark:bg-gray-800 bg-gray-200 text-black py-3 px-2 border-b border-gray-500 focus:outline-none" placeholder="Nhập mã màu HEX (ví dụ: #ff0000)" />
                                                    <Button
                                                        onClick={() => {
                                                            const query = "color picker"; // 👈 nội dung cần search
                                                            const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                                                            window.open(url, "_blank"); // mở tab mới
                                                        }}
                                                        variant="outline"
                                                        className="mt-2"
                                                    >
                                                        Tìm trên Google
                                                    </Button>

                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 space-x-2 justify-between items-center mt-4">
                                                <Button
                                                    onClick={() => handleShowForm("close")}
                                                    theme="admin"
                                                    className=" "
                                                >
                                                    Hủy
                                                </Button>

                                                <Button
                                                    onClick={handleAddNetwork}
                                                    theme="admin"
                                                    className=""
                                                >
                                                    Cập nhật
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                    {isOpenUpdateNetwork &&
                                        <div className="p-2 border-2 border-dashed border-gray-400 rounded-lg mt-4">
                                            <h2 className="text-lg font-medium  mb-2">Thêm mạng xã hội mới</h2>
                                            <div className="grid grid-cols-1 gap-2 border ">
                                                <div className="flex items-center justify-between gap-3">
                                                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full admin-dark:text-white admin-dark:bg-gray-800 bg-gray-200 text-black py-3 px-2 border-b border-gray-500 focus:outline-none" placeholder="Nhập tên mạng xã hội" />
                                                    <div className="flex w-10 h-10 rounded-3xl" style={{ backgroundColor: color }}></div>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <input value={color} onChange={(e) => setColor(e.target.value)} type="text" className="w-full admin-dark:text-white admin-dark:bg-gray-800 bg-gray-200 text-black py-3 px-2 border-b border-gray-500 focus:outline-none" placeholder="Nhập mã màu HEX (ví dụ: #ff0000)" />
                                                    <Button
                                                        onClick={() => {
                                                            const query = "color picker"; // 👈 nội dung cần search
                                                            const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                                                            window.open(url, "_blank"); // mở tab mới
                                                        }}
                                                        variant="outline"
                                                        className="mt-2"
                                                    >
                                                        Tìm trên Google
                                                    </Button>

                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 space-x-2 justify-between items-center mt-4">
                                                <Button
                                                    onClick={() => handleShowForm("close")}
                                                    theme="admin"
                                                    className=" "
                                                >
                                                    Hủy
                                                </Button>
                                                <Button
                                                    onClick={handleAddNetwork}
                                                    theme="admin"
                                                    className=""
                                                >
                                                    Thêm mạng xã hội mới
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                </div>

                                {!isOpenUpdateNetwork && !isOpenUpdateNetwork2 &&
                                    <div className="flex justify-center mt-4">
                                        <Button
                                            onClick={() => handleShowForm("add")}
                                            theme="admin"
                                            className="w-full "
                                        >
                                            Thêm mạng xã hội mới
                                        </Button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                }
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
        </div >
    );
}

// SocialNetworkManager.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from 'lucide-react';

export default function SocialNetworkManager({
    socialNetworks,
    setSocialNetworks,
    fetchSocialNetworks,
    reloadPostsAndSocialNetWorks,
    onClose
}) {
    const [isOpenUpdateNetwork, setIsOpenUpdateNetwork] = useState(false);
    const [isOpenUpdateNetwork2, setIsOpenUpdateNetwork2] = useState(false);
    const [name, setName] = useState("");
    const [color, setColor] = useState("#000000");
    const [editingNetwork, setEditingNetwork] = useState(null);

    const handleShowForm = (state, network) => {
        if (state === "add") {
            setIsOpenUpdateNetwork(true);
            setIsOpenUpdateNetwork2(false);
            setName(""); // Xóa dữ liệu cũ khi thêm mới
            setColor("#000000"); // Xóa dữ liệu cũ khi thêm mới
            setEditingNetwork(null); // Đảm bảo không còn dữ liệu chỉnh sửa
        } else if (state === "edit") {
            setIsOpenUpdateNetwork2(true);
            setIsOpenUpdateNetwork(false);
            if (network) { // Kiểm tra network có tồn tại không
                setName(network.name);
                setColor(network.HEX_color);
                setEditingNetwork(network); // Lưu đối tượng để sử dụng khi cập nhật
            }
        } else if (state === "close") {
            setIsOpenUpdateNetwork(false);
            setIsOpenUpdateNetwork2(false);
            setName("");
            setColor("#000000");
            setEditingNetwork(null);
        }
    };

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
                    fetchSocialNetworks();
                    setName("");
                    setColor("#000000");
                    handleShowForm("close");
                })
                .catch((err) => {
                    console.error("Lỗi khi thêm mới:", err);
                    alert("Thêm mạng xã hội thất bại. Vui lòng thử lại.");
                });
        }
    };

    const handleUpdateNetwork = () => {
        if (editingNetwork && name) {
            fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/social-networks/${editingNetwork.id}`, {
                method: 'PUT', // hoặc 'PATCH' tùy vào API của bạn
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, HEX_color: color }),
            })
                .then(res => {
                    if (!res.ok) throw new Error("Cập nhật thất bại");
                    return res.json();
                })
                .then(updatedNetwork => {
                    // Cập nhật lại danh sách mạng xã hội trong state
                    fetchSocialNetworks();
                    reloadPostsAndSocialNetWorks();
                    handleShowForm("close"); // Đóng form sau khi cập nhật
                })
                .catch(err => {
                    console.error("Lỗi khi cập nhật:", err);
                    alert("Cập nhật mạng xã hội thất bại. Vui lòng thử lại.");
                });
        }
    };

    const handleDeleteNetwork = async (id, name, total_posts) => {
        if (total_posts > 0) {
            alert(`Không thể xóa mạng xã hội "${name}" vì đang có ${total_posts} bài viết sử dụng.`);
            return;
        }

        if (window.confirm(`Bạn có chắc chắn muốn xóa mạng xã hội [ "${name}" ] không?`)) {
            try {
                const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/social-networks/${id}`, {
                    method: "DELETE",
                });

                if (!res.ok) throw new Error("Xóa thất bại");

                fetchSocialNetworks();
            } catch (err) {
                console.error("Lỗi khi xóa:", err);
                alert("Xóa mạng xã hội thất bại. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="grid grid-cols-1 p-4 h-fit border-2 border-slate-700 rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900 admin-dark:text-white">
                    Danh sách mạng xã hội
                </h1>
                <button type="button" onClick={onClose} className="text-blue-500 hover:underline font-bold">
                    Quay lại
                </button>
            </div>
            <div>
                <div>
                    {socialNetworks.map((network, index) => (
                        <div key={network.id ?? `tempsocialNetworks-${index}`} className="p-2 border-b border-gray-200 admin-dark:border-gray-700">
                            <div className="grid grid-cols-3 space-x-2">
                                <div className="flex justify-start items-center gap-2 ">
                                    <span className="flex justify-start font-medium text-gray-900 admin-dark:text-white px-2 py-1 rounded-lg"
                                        style={{ background: network.HEX_color }}>{network.name}</span>
                                </div>

                                <div className="flex justify-center items-center gap-2">
                                    <span className="text-sm text-center flex justify-center items-center font-bold rounded-4xl py-1 px-2">
                                        {network.total_posts} Bài đang dùng
                                    </span>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="outline"
                                        size="sm"
                                        onClick={() => handleShowForm("edit", network)}
                                        className="border-gray-300 bg-gray-400 text-xs text-gray-700 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800 hover:bg-gray-100 admin-dark:hover:bg-gray-700 px-1 py-2 rounded-md">
                                        <SquarePen />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteNetwork(network.id, network.name, network.total_posts)}
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
                                <h2 className="text-lg font-medium mb-2">Điều chỉnh thông tin mạng xã hội</h2>
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
                                        onClick={handleUpdateNetwork}
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
                                <h2 className="text-lg font-medium mb-2">Thêm mạng xã hội mới</h2>
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
    );
}
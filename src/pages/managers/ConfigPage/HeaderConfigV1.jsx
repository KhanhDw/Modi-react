import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NotificationToast from "@/components/feature/notification-toast.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { useMenuData } from "./headerConfig/use-menu-data";

// --- Custom File Input ---
function FileInput({ label, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 admin-dark:text-gray-300">{label}</label>
            <div className="relative">
                <input autoComplete="off"
                    type="file"
                    accept="image/*"
                    onChange={onChange}
                    className="w-full p-3 rounded-xl bg-gray-50 admin-dark:bg-gray-800 border border-gray-300 admin-dark:border-gray-600 shadow-sm
                     cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 admin-dark:text-gray-400 font-semibold">
                    📁
                </span>
            </div>
        </div>
    );
}

// --- Menu Item Editor ---
function MenuItemEditor({ item, level, onUpdate, onDelete, onAddChild }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingChild, setIsAddingChild] = useState(false);
    const [editForm, setEditForm] = useState({ title: item.title, href: item.href || "", order: item.order });
    const [newChildForm, setNewChildForm] = useState({ title: "", href: "", order: 1 });

    const handleUpdate = () => {
        onUpdate(item.id, editForm);
        setIsEditing(false);
    };

    const handleAddChild = () => {
        if (level < 2) {
            onAddChild(item.id, newChildForm);
            setNewChildForm({ title: "", href: "", order: 1 });
            setIsAddingChild(false);
        }
    };

    const levelColors = [
        "bg-blue-50 admin-dark:bg-gray-800",
        "bg-green-50 admin-dark:bg-gray-700",
        "bg-purple-50 admin-dark:bg-slate-600",
    ];
    const levelBadges = ["Cấp 1", "Cấp 2", "Cấp 3"];

    return (
        <div className={`border border-gray-300 admin-dark:border-gray-700 rounded-lg p-4 ${levelColors[level]} ml-${level * 4}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="admin-dark:text-white">{levelBadges[level]}</Badge>
                    <span className="font-medium text-gray-800 admin-dark:text-gray-200">{item.title}</span>
                    {item.href && <span className="text-sm text-muted-foreground admin-dark:text-gray-400">({item.href})</span>}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4 text-gray-600 admin-dark:text-gray-300" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700">
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </DropdownMenuItem>
                        {level < 2 && (
                            <DropdownMenuItem onClick={() => setIsAddingChild(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm mục con
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* --- Dialog Edit --- */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="bg-white admin-dark:bg-gray-900">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 admin-dark:text-gray-100">Chỉnh sửa mục menu</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 admin-dark:text-gray-300">Tiêu đề</label>
                            <Input
                                value={editForm.title}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                                className="bg-gray-50 admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-800 admin-dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 admin-dark:text-gray-300">Đường dẫn</label>
                            <Input
                                value={editForm.href}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, href: e.target.value }))}
                                placeholder="/path/to/page"
                                className="bg-gray-50 admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-800 admin-dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 admin-dark:text-gray-300">Thứ tự</label>
                            <Input
                                type="number"
                                value={editForm.order}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, order: Number.parseInt(e.target.value) }))}
                                className="bg-gray-50 admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-800 admin-dark:text-gray-100"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleUpdate}>Lưu</Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Hủy</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* --- Dialog Add Child --- */}
            <Dialog open={isAddingChild} onOpenChange={setIsAddingChild}>
                <DialogContent className="bg-white admin-dark:bg-gray-900">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 admin-dark:text-gray-100">Thêm mục con</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 admin-dark:text-gray-300">Tiêu đề</label>
                            <Input
                                value={newChildForm.title}
                                onChange={(e) => setNewChildForm((prev) => ({ ...prev, title: e.target.value }))}
                                className="bg-gray-50 admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-800 admin-dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 admin-dark:text-gray-300">Đường dẫn</label>
                            <Input
                                value={newChildForm.href}
                                onChange={(e) => setNewChildForm((prev) => ({ ...prev, href: e.target.value }))}
                                placeholder="/path/to/page"
                                className="bg-gray-50 admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-800 admin-dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 admin-dark:text-gray-300">Thứ tự</label>
                            <Input
                                type="number"
                                value={newChildForm.order}
                                onChange={(e) => setNewChildForm((prev) => ({ ...prev, order: Number.parseInt(e.target.value) }))}
                                className="bg-gray-50 admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-800 admin-dark:text-gray-100"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleAddChild}>Thêm</Button>
                            <Button variant="outline" onClick={() => setIsAddingChild(false)}>Hủy</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {item.children && item.children.length > 0 && (
                <div className="mt-4 space-y-2">
                    {item.children.map((child) => (
                        <MenuItemEditor
                            key={child.id}
                            item={child}
                            level={level + 1}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            onAddChild={onAddChild}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Admin Menu Editor Wrapper ---
export function AdminMenuEditorWrapper({ menuData, isLoading, updateMenuItem, addMenuItem, deleteMenuItem }) {
    const [isAddingRoot, setIsAddingRoot] = useState(false);
    const [newRootForm, setNewRootForm] = useState({ title: "", href: "", order: 1 });

    const handleAddRoot = () => {
        addMenuItem(null, newRootForm);
        setNewRootForm({ title: "", href: "", order: 1 });
        setIsAddingRoot(false);
    };

    return (
        <Card className="mt-12 bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 admin-dark:text-gray-100">Quản lý Menu 3 Cấp</CardTitle>
                    <Button onClick={() => setIsAddingRoot(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Thêm mục chính
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading && <p className="text-gray-700 admin-dark:text-gray-300">Loading menu...</p>}
                <div className="space-y-4">
                    {menuData.items.map((item) => (
                        <MenuItemEditor key={item.id} item={item} level={0} onUpdate={updateMenuItem} onDelete={deleteMenuItem} onAddChild={addMenuItem} />
                    ))}
                </div>

                <Dialog open={isAddingRoot} onOpenChange={setIsAddingRoot}>
                    <DialogContent className="bg-white admin-dark:bg-gray-900">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 admin-dark:text-gray-100">Thêm mục menu chính</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-700 admin-dark:text-gray-300">Tiêu đề</label>
                                <Input value={newRootForm.title} onChange={(e) => setNewRootForm((prev) => ({ ...prev, title: e.target.value }))} className="bg-gray-50 admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-800 admin-dark:text-gray-100" />
                            </div>
                            <div>
                                <label className="text-gray-700 admin-dark:text-gray-300">Đường dẫn</label>
                                <Input value={newRootForm.href} onChange={(e) => setNewRootForm((prev) => ({ ...prev, href: e.target.value }))} placeholder="/path/to/page" className="bg-gray-50 admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-800 admin-dark:text-gray-100" />
                            </div>
                            <div>
                                <label className="text-gray-700 admin-dark:text-gray-300">Thứ tự</label>
                                <Input type="number" value={newRootForm.order} onChange={(e) => setNewRootForm((prev) => ({ ...prev, order: Number.parseInt(e.target.value) }))} className="bg-gray-50 admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-800 admin-dark:text-gray-100" />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleAddRoot}>Thêm</Button>
                                <Button variant="outline" onClick={() => setIsAddingRoot(false)}>Hủy</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}




export default function HeaderConfigLogo() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [logo, setLogo] = useState("/logoModi.png");
    const [logoItem, setLogoItem] = useState(null); // lưu section_item hiện tại
    const [toast, setToast] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

    // 🔹 Chuẩn hóa image_url (tránh lưu cả domain)
    function normalizeImageUrl(url) {
        if (!url) return "";
        try {
            const u = new URL(url, import.meta.env.VITE_MAIN_BE_URL);
            return u.pathname; // chỉ lấy path
        } catch {
            return url;
        }
    }

    // 🔹 Load logo từ API
    const fetchLogo = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/section-items/type/logo?slug=header`);
            if (!res.ok) throw new Error("Không thể tải logo");
            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
                const item = data[0];
                const fullUrl = item.image_url ? `${API_BASE_URL}${item.image_url}` : "/logoModi.png";

                setLogoItem(item);
                setLogo(fullUrl);

                // ✅ cập nhật localStorage
                localStorage.setItem("app_logo", fullUrl);
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi tải logo: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Lấy logo ban đầu từ localStorage (nếu có) → rồi fetch từ API để làm mới
    useEffect(() => {
        const cachedLogo = localStorage.getItem("app_logo");
        if (cachedLogo) {
            setLogo(cachedLogo);
        }
        fetchLogo();
    }, []);

    // 🔹 Chọn file mới
    const handleLogoChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        setLogo(URL.createObjectURL(selectedFile));
    };

    // 🔹 Upload ảnh
    const uploadImage = async (file, id, section = "logo", field = "image_url") => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", id);
        formData.append("field", field);
        formData.append("section", section);

        const res = await fetch(`${API_BASE_URL}/api/upload?field=${field}`, {
            method: "POST",
            body: formData,
        });
        const result = await res.json();
        return result?.data?.url || result?.url || null;
    };

    // 🔹 Lưu logo (update section_item)
    const handleSave = async () => {
        if (!logoItem) return alert("Chưa có logo trong database");
        try {
            setLoading(true);

            let updatedItem = { ...logoItem };

            // Nếu có file mới thì upload
            if (file) {
                const url = await uploadImage(file, logoItem.id, "logo");
                if (url) {
                    updatedItem.image_url = normalizeImageUrl(url);
                }
            }

            await fetch(`${API_BASE_URL}/api/section-items/${logoItem.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedItem),
            });

            const fullUrl = `${API_BASE_URL}${updatedItem.image_url}`;
            setLogo(fullUrl);
            setLogoItem(updatedItem);

            // ✅ cập nhật localStorage sau khi save
            localStorage.setItem("app_logo", fullUrl);

            setToast({ message: "Lưu thành công!", type: "success" });
            setFile(null);
        } catch (err) {
            console.error(err);
            setToast({ message: "Lỗi khi lưu: " + err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };
    const { menuData, isLoading, updateMenuItem, addMenuItem, deleteMenuItem } = useMenuData();

    if (loading) return <p className="text-center text-gray-700 admin-dark:text-gray-300">⏳ Đang tải...</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-12">
            {/* ===== Header Preview ===== */}
            <motion.div
                className="flex items-center justify-center bg-indigo-50 admin-dark:bg-gray-800 rounded-3xl shadow-2xl p-8  md:flex-row  gap-8 "
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <motion.img
                    src={logo}
                    alt="Logo"
                    className="w-60 shadow-lg rounded-xl object-cover cursor-pointer"
                    whileHover={{ scale: 1.1, rotate: 1 }}
                    onError={(e) => (e.currentTarget.src = "/logoModi.png")}
                />
            </motion.div>

            {/* ===== Config Form ===== */}
            <motion.div
                className="bg-white admin-dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-gray-200 admin-dark:border-gray-700 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <FileInput label="Cập nhật Logo Website" onChange={handleLogoChange} />


                <AdminMenuEditorWrapper
                    menuData={menuData}
                    isLoading={isLoading}
                    updateMenuItem={updateMenuItem}
                    addMenuItem={addMenuItem}
                    deleteMenuItem={deleteMenuItem}
                />


                <motion.button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg
                     transition-all flex justify-center items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    {loading ? "Đang lưu..." : "Save Logo"}
                </motion.button>
            </motion.div>



            {toast && (
                <NotificationToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

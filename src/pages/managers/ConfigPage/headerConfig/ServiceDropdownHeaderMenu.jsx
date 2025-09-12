import React, { useEffect, useState } from "react";
import NotificationToast from "@/components/feature/notification-toast.jsx";
import ConfirmDialog from "@/pages/managers/ConfigPage/headerConfig/serviceHeaderConfig/ConfirmDialog";
import DialogForm from "@/pages/managers/ConfigPage/headerConfig/serviceHeaderConfig/DialogForm";
import ChildList from "@/pages/managers/ConfigPage/headerConfig/serviceHeaderConfig/ChildList";
import CategoryList from "@/pages/managers/ConfigPage/headerConfig/serviceHeaderConfig/CategoryList";

export default function ServiceDropdownHeaderMenu({ lang = "vi" }) {
    const [menuData, setMenuData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [dialog, setDialog] = useState({
        open: false,
        type: "category",
        valueEn: "",
        valueVi: "",
    });

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: null, // "category" | "child"
        target: null, // object cần xóa
    });


    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

    // ----- API: fetch dữ liệu -----
    const fetchAllServicesMenu = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/sections?slug=header`);
            if (!res.ok) throw new Error("Không thể tải danh mục cha");
            const sectionsRes = await res.json();

            if (!sectionsRes.success || !Array.isArray(sectionsRes.data)) {
                throw new Error("Dữ liệu sections không hợp lệ");
            }

            const requests = sectionsRes.data
                .filter(section => section.type !== 'logo')
                .map(section =>
                    fetch(`${API_BASE_URL}/api/section-items/type/${section.type}?slug=header`)
                        .then(r => r.json())
                        .then(items => ({
                            id: section.id,
                            name: section.title,
                            type: section.type,
                            children: items.data?.map(child => ({
                                id: child.id,
                                title: child.title,
                            })) || [],
                        }))
                );


            const merged = await Promise.all(requests);
            setMenuData(merged);
            console.log('ds:', merged);
        } catch (err) {
            console.error(err);
            setToast({ message: "Lỗi tải dữ liệu: " + err.message, type: "error" });
        }
    };


    const fetchChildren = async (category) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/section-items/type/${category.type}?slug=header`);
            if (!res.ok) throw new Error("Không thể tải mục con");

            const data = await res.json();
            console.log("fetchChildren response:", data);

            // data là mảng trực tiếp
            const childrenArray = Array.isArray(data) ? data : [];

            setMenuData((prev) =>
                prev.map((cat) =>
                    cat.id === category.id
                        ? {
                            ...cat,
                            children: childrenArray.map(child => ({
                                id: child.id,
                                title: child.title,
                            })),
                        }
                        : cat
                )
            );

            // Cập nhật selectedCategory để render luôn
            setSelectedCategory((prev) =>
                prev && prev.id === category.id
                    ? {
                        ...prev,
                        children: childrenArray.map(child => ({
                            id: child.id,
                            title: child.title,
                        })),
                    }
                    : prev
            );

        } catch (err) {
            console.error(err);
            setToast({ message: "Lỗi tải mục con: " + err.message, type: "error" });
        }
    };

    useEffect(() => {
        fetchAllServicesMenu();
    }, []);

    // ----- CRUD helper -----
    const addCategory = async (nameEn, nameVi) => {
        try {
            setLoading(true);

            const type = `services_${nameEn.toLowerCase().replace(/\s+/g, "_")}`;

            const body = {
                slug: "header",
                type,
                title: { en: nameEn, vi: nameVi },
            };

            const res = await fetch(`${API_BASE_URL}/api/sections`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || "Không thể thêm");

            const newCat = {
                id: data.data.id,
                name: data.data.title,
                type: data.data.type,
                children: [],
            };

            setMenuData([...menuData, newCat]);
            setSelectedCategory(newCat);
            setToast({ message: "Thêm danh mục thành công!", type: "success" });
        } catch (err) {
            console.error(err);
            setToast({ message: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const addChild = async (nameEn, nameVi) => {
        if (!selectedCategory) return;
        try {
            setLoading(true);
            console.log(selectedCategory.type);
            const body = {
                type: selectedCategory.type,
                slug: "header", // vì bạn đang thao tác với menu header
                title: { en: nameEn, vi: nameVi },
                description: { en: "", vi: "" }, // nếu không có thì để trống
                image_url: ""
            };

            const res = await fetch(`${API_BASE_URL}/api/section-items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || "Không thể thêm mục con");

            // cập nhật state
            const newChild = {
                id: data.data.id,
                title: data.data.title,
            };

            const updatedCat = {
                ...selectedCategory,
                children: [...(selectedCategory.children || []), newChild],
            };

            setMenuData(menuData.map((cat) =>
                cat.id === selectedCategory.id ? updatedCat : cat
            ));
            setSelectedCategory(updatedCat);

            setToast({ message: "Thêm mục con thành công!", type: "success" });
        } catch (err) {
            console.error(err);
            setToast({ message: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async (catId, nameEn, nameVi) => {
        try {
            setLoading(true);

            const body = {
                title: { en: nameEn, vi: nameVi },
            };

            const res = await fetch(`${API_BASE_URL}/api/sections/${catId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || "Không thể cập nhật danh mục");

            const updatedCat = {
                id: data.data.id,
                name: data.data.title,
                type: data.data.type,
                children: menuData.find((c) => c.id === catId)?.children || [],
            };

            setMenuData(menuData.map((c) => (c.id === catId ? updatedCat : c)));
            if (selectedCategory?.id === catId) setSelectedCategory(updatedCat);

            setToast({ message: "Cập nhật danh mục thành công!", type: "success" });
        } catch (err) {
            console.error(err);
            setToast({ message: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };


    const updateChild = async (childId, nameEn, nameVi) => {
        if (!selectedCategory) return;

        try {
            setLoading(true);

            const body = {
                title: { en: nameEn, vi: nameVi },
            };

            const res = await fetch(`${API_BASE_URL}/api/section-items/${childId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || "Không thể cập nhật mục con");

            const updatedChild = {
                id: data.data.id,
                title: data.data.title,
            };

            const updatedCat = {
                ...selectedCategory,
                children: selectedCategory.children.map((c) =>
                    c.id === childId ? updatedChild : c
                ),
            };

            setMenuData(menuData.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat)));
            setSelectedCategory(updatedCat);

            setToast({ message: "Cập nhật mục con thành công!", type: "success" });
        } catch (err) {
            console.error(err);
            setToast({ message: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const selectSubItemSection = (cat) => {
        console.log("ds:::", cat);
        setSelectedCategory(cat);
        fetchChildren(cat);
    }

    const deleteCategory = async (cat) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/sections/${cat.id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || "Không thể xóa danh mục");

            setMenuData(menuData.filter((c) => c.id !== cat.id));
            if (selectedCategory?.id === cat.id) setSelectedCategory(null);

            setToast({ message: "Xóa danh mục thành công!", type: "success" });
        } catch (err) {
            console.error(err);
            setToast({ message: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const deleteChild = async (child) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/section-items/${child.id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || "Không thể xóa mục con");

            const updatedCat = {
                ...selectedCategory,
                children: selectedCategory.children.filter((c) => c.id !== child.id),
            };
            setMenuData(menuData.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat)));
            setSelectedCategory(updatedCat);

            setToast({ message: "Xóa mục con thành công!", type: "success" });
        } catch (err) {
            console.error(err);
            setToast({ message: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
            {/* Parent Categories */}
            <CategoryList
                categories={menuData}
                selectedCategory={selectedCategory}
                lang={lang}
                onSelect={(cat) => selectSubItemSection(cat)}
                onAdd={() => setDialog({ open: true, type: "category", valueEn: "", valueVi: "", target: null })}
                onDelete={(cat) => setConfirmDialog({ open: true, type: "category", target: cat })}
                onEdit={(cat) =>
                    setDialog({
                        open: true,
                        type: "category",
                        valueEn: cat.name?.en || "",
                        valueVi: cat.name?.vi || "",
                        target: cat,
                    })
                }

            />


            {/* Child Items */}
            <ChildList
                selectedCategory={selectedCategory}
                lang={lang}
                onAdd={() => setDialog({ open: true, type: "child", valueEn: "", valueVi: "", target: null })}
                onDelete={(child) => setConfirmDialog({ open: true, type: "child", target: child })}
                onEdit={(child) =>
                    setDialog({
                        open: true,
                        type: "child",
                        valueEn: child.title?.en || "",
                        valueVi: child.title?.vi || "",
                        target: child,
                    })
                }
            />

            {/* Dialog thêm hoặc điều chỉnh*/}
            {dialog.open && (
                <DialogForm
                    open={dialog.open}
                    setOpen={(val) => setDialog((s) => ({ ...s, open: val }))}
                    title={
                        dialog.target
                            ? dialog.type === "category"
                                ? "Sửa danh mục"
                                : "Sửa mục con"
                            : dialog.type === "category"
                                ? "Thêm danh mục"
                                : "Thêm mục con"
                    }
                    valueEn={dialog.valueEn}
                    setValueEn={(val) => setDialog((s) => ({ ...s, valueEn: val }))}
                    valueVi={dialog.valueVi}
                    setValueVi={(val) => setDialog((s) => ({ ...s, valueVi: val }))}
                    onSubmit={() => {
                        if (dialog.type === "category") {
                            if (dialog.target) {
                                updateCategory(dialog.target.id, dialog.valueEn, dialog.valueVi);
                            } else {
                                addCategory(dialog.valueEn, dialog.valueVi);
                            }
                        } else {
                            if (dialog.target) {
                                updateChild(dialog.target.id, dialog.valueEn, dialog.valueVi);
                            } else {
                                addChild(dialog.valueEn, dialog.valueVi);
                            }
                        }
                    }}
                />
            )}



            {/* confirmdialog xóa*/}
            <ConfirmDialog
                open={confirmDialog.open}
                setOpen={(val) => setConfirmDialog((s) => ({ ...s, open: val }))}
                type={confirmDialog.type}
                target={confirmDialog.target}
                onConfirmDelete={(type, target) => {
                    if (type === "category") {
                        deleteCategory(target);
                    } else {
                        deleteChild(target);
                    }
                    setConfirmDialog({ open: false, type: null, target: null });
                }}
            />

            {/* Toast */}
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





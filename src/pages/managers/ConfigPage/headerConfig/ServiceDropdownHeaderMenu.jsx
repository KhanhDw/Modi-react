import NotificationToast from "@/components/feature/notification-toast.jsx";
import CategoryList from "@/pages/managers/ConfigPage/headerConfig/serviceHeaderConfig/CategoryList";
import ChildList from "@/pages/managers/ConfigPage/headerConfig/serviceHeaderConfig/ChildList";
import ConfirmDialog from "@/pages/managers/ConfigPage/headerConfig/serviceHeaderConfig/ConfirmDialog";
import DialogForm from "@/pages/managers/ConfigPage/headerConfig/serviceHeaderConfig/DialogForm";
import slugify from "@/utils/slug";
import { useEffect, useState } from "react";

export default function ServiceDropdownHeaderMenu({ lang = "vi" }) {
    const [menuData, setMenuData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [listServiceOfParent, setListServiceOfParent] = useState([]); // is item of menu2

    const [dialog, setDialog] = useState({
        open: false,
        type: "category",       // "category" | "child"
        target: null,           // object when editing, null when adding
        valueEn: "",
        valueVi: "",
        valueSlug: "",
        listIdServices: [],     // array of slugs
    });

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: null, // "category" | "child"
        target: null,
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

    // ----- fetch menus -----
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
                                description: child.description,
                            })) || [],
                        }))
                );

            const merged = await Promise.all(requests);
            setMenuData(merged);
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
            const childrenArray = Array.isArray(data) ? data : [];

            const updatedChildren = childrenArray.map(child => ({
                id: child.id,
                title: child.title,
                description: child.description,
            }));

            setMenuData(prev =>
                prev.map(cat => cat.id === category.id ? { ...cat, children: updatedChildren } : cat)
            );

            setSelectedCategory(prev =>
                prev && prev.id === category.id ? { ...prev, children: updatedChildren } : prev
            );
        } catch (err) {
            console.error(err);
            setToast({ message: "Lỗi tải mục con: " + err.message, type: "error" });
        }

    };

    useEffect(() => {
        fetchAllServicesMenu();
    }, []);

    const addCategory = async (nameEn, nameVi, listIdServices) => {
        try {
            setLoading(true);
            const servicesArray = Array.isArray(listIdServices)
                ? listIdServices
                : typeof listIdServices === "string"
                    ? listIdServices.split(",").map(s => s.trim()).filter(Boolean)
                    : [];

            const type = `services_${nameEn.toLowerCase().replace(/\s+/g, "_")}`;

            const body = {
                slug: "header",
                type,
                title: {
                    en: nameEn,
                    vi: nameVi,
                    groupServices: servicesArray.join(","),
                },
            };

            const res = await fetch(`${API_BASE_URL}/api/service-header-config`, {
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

            setMenuData(prev => [...prev, newCat]);
            setSelectedCategory(newCat);
            setToast({ message: "Thêm danh mục thành công!", type: "success" });

            // close & reset dialog
            resetDialog();
        } catch (err) {
            console.error(err);
            setToast({ message: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const addChild = async (nameEn, nameVi, slug) => {
        if (!selectedCategory) return;
        try {
            setLoading(true);
            const body = {
                type: selectedCategory.type,
                slug: "header",
                title: { en: nameEn, vi: nameVi },
                description: { en: slug, vi: slug },
                image_url: ""
            };

            const res = await fetch(`${API_BASE_URL}/api/section-items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || "Không thể thêm mục con");

            const newChild = {
                id: data.data.id,
                title: data.data.title,
                description: body.description,
            };

            const updatedCat = {
                ...selectedCategory,
                children: [...(selectedCategory.children || []), newChild],
            };

            setMenuData(prev => prev.map(cat => cat.id === selectedCategory.id ? updatedCat : cat));
            setSelectedCategory(updatedCat);

            setToast({ message: "Thêm mục con thành công!", type: "success" });
            resetDialog();
        } catch (err) {
            console.error(err);
            setToast({ message: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async (catId, nameEn, nameVi, listIdServices) => {
        try {
            setLoading(true);

            const servicesArray = Array.isArray(listIdServices)
                ? listIdServices
                : typeof listIdServices === "string"
                    ? listIdServices.split(",").map(s => s.trim()).filter(Boolean)
                    : [];

            const body = {
                title: {
                    en: nameEn,
                    vi: nameVi,
                    groupServices: servicesArray.join(","),
                },
                description: { en: slugify(nameEn), vi: "" },
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

            setMenuData(prev => prev.map((c) => (c.id === catId ? updatedCat : c)));
            if (selectedCategory?.id === catId) setSelectedCategory(updatedCat);

            setToast({ message: "Cập nhật danh mục thành công!", type: "success" });
            resetDialog();
        } catch (err) {
            console.error(err);
            setToast({ message: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const updateChild = async (childId, nameEn, nameVi, slug) => {
        if (!selectedCategory) return;
        try {
            setLoading(true);
            const body = {
                title: { en: nameEn, vi: nameVi },
                description: { en: slug, vi: slug },
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
                description: body.description,
            };

            const updatedCat = {
                ...selectedCategory,
                children: selectedCategory.children.map((c) =>
                    c.id === childId ? updatedChild : c
                ),
            };

            setMenuData(prev => prev.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat)));
            setSelectedCategory(updatedCat);

            setToast({ message: "Cập nhật mục con thành công!", type: "success" });
            resetDialog();
        } catch (err) {
            console.error(err);
            setToast({ message: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (cat) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/sections/${cat.id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || "Không thể xóa danh mục");

            setMenuData(prev => prev.filter((c) => c.id !== cat.id));
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
            setMenuData(prev => prev.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat)));
            setSelectedCategory(updatedCat);

            setToast({ message: "Xóa mục con thành công!", type: "success" });
        } catch (err) {
            console.error(err);
            setToast({ message: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const selectSubItemSection = (cat) => {
        setSelectedCategory(cat);
        setListServiceOfParent(cat.name.groupServices.split(",").map(s => s.trim()).filter(Boolean))
        fetchChildren(cat);
    };

    const resetDialog = () => {

        setDialog({
            open: false,
            type: "category",
            target: null,
            valueEn: "",
            valueVi: "",
            valueSlug: "",
            listIdServices: [],
        });

    };

    const openAddCategory = () => {
        setDialog({
            open: true,
            type: "category",
            target: null,
            valueEn: "",
            valueVi: "",
            valueSlug: "",
            listIdServices: [],
        });
    };

    const openAddChild = (parentCategory) => {
        setSelectedCategory(parentCategory || selectedCategory);
        setDialog({
            open: true,
            type: "child",
            target: null,
            valueEn: "",
            valueVi: "",
            valueSlug: "",
            listIdServices: [],
        });
    };

    const openEditCategory = (cat) => {

        const groupServices = String(cat.name?.groupServices || cat.name?.groupServices || "")
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);


        setDialog({
            open: true,
            type: "category",
            target: cat,
            valueEn: cat.name?.en || "",
            valueVi: cat.name?.vi || "",
            valueSlug: cat.description?.vi || "",
            listIdServices: groupServices,
        });

    };

    const openEditChild = (child, parentCategory) => {
        setSelectedCategory(parentCategory || selectedCategory);

        // Lấy dữ liệu listIdServices từ child.description
        const childServices = child.description
            ? [child.description.en].filter(Boolean) // hoặc map nếu nhiều
            : [];

        setDialog({
            open: true,
            type: "child",
            target: child,
            valueEn: child.title?.en || "",
            valueVi: child.title?.vi || "",
            valueSlug: child.description?.vi || "",
            listIdServices: childServices, // quan trọng: giữ dữ liệu ban đầu
        });
    };

    const setDialogListIdServices = (valOrUpdater) => {

        setDialog(prev => {
            const current = Array.isArray(prev.listIdServices)
                ? prev.listIdServices
                : typeof prev.listIdServices === "string"
                    ? (prev.listIdServices ? prev.listIdServices.split(",") : [])
                    : [];
            const newList = typeof valOrUpdater === "function" ? valOrUpdater(current) : valOrUpdater;
            const normalized = Array.isArray(newList) ? newList : (typeof newList === "string" ? newList.split(",").map(s => s.trim()).filter(Boolean) : []);

            if (prev.target && normalized.length === 0) return prev;

            if (JSON.stringify(normalized) === JSON.stringify(current)) return prev;
            return { ...prev, listIdServices: normalized };
        });


    };

    const setDialogValueEn = (val) => {
        setDialog(prev => prev.valueEn === val ? prev : { ...prev, valueEn: val })
    };

    const setDialogValueVi = (val) => {
        setDialog(prev => prev.valueVi === val ? prev : { ...prev, valueVi: val })

    };

    const setDialogValueSlug = (val) => {
        setDialog(prev => prev.valueSlug === val ? prev : { ...prev, valueSlug: val })

    };

    const setDialogOpen = (isOpen) => {
        setDialog(prev => ({ ...prev, open: isOpen }))

    };


    const handleSubmitDialog = async () => {

        // decide action based on dialog.type + dialog.target
        if (dialog.type === "category") {
            if (dialog.target) {
                await updateCategory(dialog.target.id, dialog.valueEn, dialog.valueVi, dialog.listIdServices);
            } else {
                await addCategory(dialog.valueEn, dialog.valueVi, dialog.listIdServices);
            }
        } else {
            if (dialog.target) {
                await updateChild(dialog.target.id, dialog.valueEn, dialog.valueVi, dialog.valueSlug);
            } else {
                await addChild(dialog.valueEn, dialog.valueVi, dialog.valueSlug);
            }
        }
        // chỉ reset dialog ở đây, sau khi submit xong
        resetDialog();
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
            {/* Parent Categories */}
            <CategoryList
                categories={menuData}
                selectedCategory={selectedCategory}
                lang={lang}
                onSelect={(cat) => selectSubItemSection(cat)}
                onAdd={() => openAddCategory()}
                onDelete={(cat) => setConfirmDialog({ open: true, type: "category", target: cat })}
                onEdit={(cat) => openEditCategory(cat)}
            />

            {/* Child Items */}
            <ChildList
                selectedCategory={selectedCategory}
                lang={lang}
                onAdd={() => openAddChild(selectedCategory)}
                onDelete={(child) => setConfirmDialog({ open: true, type: "child", target: child })}
                onEdit={(child) => openEditChild(child, selectedCategory)}
            />

            {/* Dialog */}
            {dialog.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 ">
                    <DialogForm
                        open={dialog.open}
                        dialog={dialog}
                        setOpen={setDialogOpen}
                        isAdd={dialog.target === null}
                        title={
                            dialog.target
                                ? dialog.type === "category"
                                    ? "Sửa danh mục"
                                    : "Sửa mục con"
                                : dialog.type === "category"
                                    ? "Thêm danh mục"
                                    : "Thêm mục con"
                        }
                        isTitleGroupService={
                            dialog.target
                                ? dialog.type === "category"
                                    ? "Sửa nhóm dịch vụ"
                                    : "Sửa dịch vụ"
                                : dialog.type === "category"
                                    ? "Thêm nhóm dịch vụ"
                                    : "Thêm dịch vụ"
                        }

                        valueSlug={dialog.valueSlug}
                        setValueSlug={setDialogValueSlug}
                        valueEn={dialog.valueEn}
                        setValueEn={setDialogValueEn}
                        valueVi={dialog.valueVi}
                        setValueVi={setDialogValueVi}
                        listIdServices={dialog.listIdServices}
                        setListIdServices={setDialogListIdServices}
                        listServiceOfParent={listServiceOfParent}
                        onSubmit={handleSubmitDialog}
                    />
                </div>
            )}

            {/* confirmdialog xóa */}
            <ConfirmDialog
                open={confirmDialog.open}
                setOpen={(val) => setConfirmDialog((s) => ({ ...s, open: val }))}
                type={confirmDialog.type}
                target={confirmDialog.target}
                onConfirmDelete={(type, target) => {
                    if (type === "category") deleteCategory(target);
                    else deleteChild(target);
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

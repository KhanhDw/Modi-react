import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateMiniService } from "@/pages/managers/ConfigPage/renderSections/hook/use_list_mini_service.jsx";
import { Save, X } from "lucide-react";
import { useState } from "react";

export default function EditServiceGroupForm({ item, onCancel, onReload }) {
    const [nameEn, setNameEn] = useState(item.title_en);
    const [nameVi, setNameVi] = useState(item.title_vi);

    const handleSave = () => {
        if (nameEn.trim() && nameVi.trim()) {
            updateMiniService(item.id, { title_en: nameEn, title_vi: nameVi })
                .then(() => {
                    onReload();
                    onCancel();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <div className="space-y-2 w-full">
            <div className="grid grid-cols-1 gap-2 w-full">
                <Input
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="English name"
                    className="text-sm"
                />
                <Input
                    value={nameVi}
                    onChange={(e) => setNameVi(e.target.value)}
                    placeholder="Tên tiếng Việt"
                    className="text-sm"
                />
            </div>
            <div className="flex gap-2 w-full justify-end mt-2">
                <Button size="sm" onClick={handleSave} className="cursor-pointer shadow bg-blue-500 hover:bg-blue-600">
                    <Save className="w-3 h-3 text-white" />
                    <span className="font-semibold text-xs sm:text-sm text-white">Lưu</span>
                </Button>
                <Button size="sm" variant="outline" onClick={onCancel} className="cursor-pointer shadow border-none bg-red-500 hover:bg-red-600 admin-dark:bg-red-500 admin-dark:hover:bg-red-600">
                    <X className="w-3 h-3 text-white" />
                    <span className="font-semibold text-xs sm:text-sm text-white">Hủy</span>
                </Button>
            </div>
        </div>
    );
}

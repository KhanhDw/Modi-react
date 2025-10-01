import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, X } from "lucide-react";
import { updateMiniService } from "@/pages/managers/ConfigPage/renderSections/hook/use_list_mini_service.jsx"

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
        <div className="flex-1 space-y-2">
            <div className="grid grid-cols-1 gap-2">
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
            <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                    <Save className="w-3 h-3 mr-1" />
                    Lưu
                </Button>
                <Button size="sm" variant="outline" onClick={onCancel}>
                    <X className="w-3 h-3 mr-1" />
                    Hủy
                </Button>
            </div>
        </div>
    );
}
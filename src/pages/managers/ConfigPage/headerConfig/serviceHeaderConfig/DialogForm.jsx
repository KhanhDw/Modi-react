import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DialogForm({
    open,
    setOpen,
    title,
    valueEn,
    setValueEn,
    valueVi,
    setValueVi,
    onSubmit,
}) {
    const [canSave, setCanSave] = useState(false);

    useEffect(() => {
        if (valueEn && valueVi) {
            setCanSave(valueEn.trim() !== "" && valueVi.trim() !== "");
        } else {
            setCanSave(false);
        }
    }, [valueEn, valueVi]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 admin-dark:text-gray-100">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label
                            htmlFor="input-vi"
                            className="text-gray-800 admin-dark:text-gray-200"
                        >
                            Tên (Tiếng Việt)
                        </Label>
                        <Input
                            id="input-vi"
                            value={valueVi}
                            onChange={(e) => setValueVi(e.target.value)}
                            placeholder="Nhập tên tiếng Việt..."
                            className="bg-white admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-900 admin-dark:text-gray-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="input-en"
                            className="text-gray-800 admin-dark:text-gray-200"
                        >
                            Tên (English)
                        </Label>
                        <Input
                            id="input-en"
                            value={valueEn}
                            onChange={(e) => setValueEn(e.target.value)}
                            placeholder="Enter English name..."
                            className="bg-white admin-dark:bg-gray-800 border-gray-300 admin-dark:border-gray-600 text-gray-900 admin-dark:text-gray-100"
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                        <Button
                            disabled={!canSave}
                            onClick={() => {
                                onSubmit();
                                setValueEn("");
                                setValueVi("");
                                setOpen(false);
                            }}
                            className="bg-primary text-primary-foreground hover:bg-green-300 disabled:opacity-50"
                        >
                            Lưu
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="border-gray-300 text-gray-300 hover:bg-gray-700
                         admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:hover:bg-gray-800"
                        >
                            Hủy
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

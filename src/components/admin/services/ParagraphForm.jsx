import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";

export default function ParagraphForm({
    partOfArticle,
    paraErrors,
    selectedType,
    isEditingParagraph,
    setSelectedType,
    handleChangeForArticle,
    handleSubmitParagraph,
    handleCancelAddParagraph,
}) {
    // State cục bộ chỉ dành cho component này
    const [preview, setPreview] = useState(null);
    const [fileKey, setFileKey] = useState(Date.now()); // Dùng để reset input file ảnh
    const [excelKey, setExcelKey] = useState(Date.now()); // Dùng để reset input file excel

    // Cập nhật preview khi partOfArticle.img thay đổi (khi đang chỉnh sửa)
    useEffect(() => {
        if (selectedType === "img") {
            const imageSource = partOfArticle.img;
            if (imageSource instanceof File) {
                const objectUrl = URL.createObjectURL(imageSource);
                setPreview(objectUrl);

                // Dọn dẹp URL object để tránh rò rỉ bộ nhớ
                return () => URL.revokeObjectURL(objectUrl);
            } else if (typeof imageSource === "string") {
                // Nếu là URL có sẵn (khi edit)
                setPreview(imageSource);
            } else {
                setPreview(null);
            }
        }
    }, [partOfArticle.img, selectedType]);

    // Hàm xử lý khi thay đổi loại nội dung
    const onTypeChange = (value) => {
        setSelectedType(value);
        // Reset state cục bộ khi đổi loại
        setPreview(null);
        setFileKey(Date.now());
        setExcelKey(Date.now());
    };

    // Hàm render các trường nhập liệu dựa trên `selectedType`
    const renderFieldsForType = () => {
        switch (selectedType) {
            case "content":
                return (
                    <div className="flex justify-between gap-4 pt-2">
                        <div className="space-y-2 flex-1/3">
                            <Label className="text-black" htmlFor="paraTitle">Tiêu đề *</Label>
                            <Input
                                className="text-black border border-black/30"
                                id="paraTitle"
                                value={partOfArticle.paraTitle || ""}
                                onChange={(e) => handleChangeForArticle("paraTitle", e.target.value)}
                                placeholder="Nhập tiêu đề đoạn văn"
                            />
                            {paraErrors.paraTitle && <p className="text-red-500 text-xs">{paraErrors.paraTitle}</p>}
                        </div>
                        <div className="space-y-2 flex-1/3">
                            <Label className="text-black" htmlFor="paragraph">Nội dung *</Label>
                            <Textarea
                                className="text-black border border-black/30"
                                id="paragraph"
                                value={partOfArticle.paragraph || ""}
                                onChange={(e) => handleChangeForArticle("paragraph", e.target.value)}
                                placeholder="Nhập nội dung"
                            />
                            {paraErrors.paragraph && <p className="text-red-500 text-xs">{paraErrors.paragraph}</p>}
                        </div>
                        <div className="space-y-2 flex-1/3">
                            <Label className="text-black" htmlFor="subPara">Nội dung nhỏ *</Label>
                            <Textarea
                                className="text-black border border-black/30"
                                id="subPara"
                                value={partOfArticle.subPara || ""}
                                onChange={(e) => handleChangeForArticle("subPara", e.target.value)}
                                placeholder="Nhập nội dung nhỏ"
                            />
                            {paraErrors.subPara && <p className="text-red-500 text-xs">{paraErrors.subPara}</p>}
                        </div>
                    </div>
                );

            case "img":
                return (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                            <Label className="text-black" htmlFor="imgTitle">Tiêu đề *</Label>
                            <Input
                                className="text-black border border-black/30"
                                id="imgTitle"
                                value={partOfArticle.imgTitle || ""}
                                onChange={(e) => handleChangeForArticle("imgTitle", e.target.value)}
                                placeholder="Nhập tiêu đề"
                            />
                            {paraErrors.imgTitle && <p className="text-red-500 text-xs">{paraErrors.imgTitle}</p>}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-center space-x-2">
                                <div className="flex-1">
                                    <Label className="text-black mb-2" htmlFor="img">Chọn hình ảnh *</Label>
                                    <Input
                                        key={fileKey}
                                        type="file"
                                        className="text-black border border-black/30 file:bg-gray-950/30 file:text-center file:text-black file:rounded file:border-none hover:file:bg-gray-950/50 hover:file:text-white file:px-2"
                                        id="img"
                                        accept="image/*"
                                        onChange={(e) => handleChangeForArticle("img", e.target.files[0])}
                                    />
                                    {paraErrors.img && <p className="text-red-500 text-xs">{paraErrors.img}</p>}
                                </div>
                                <div className="flex-1/2">
                                    {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover" />}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-black" htmlFor="imgPara">Nội dung *</Label>
                            <Textarea
                                className="text-black border border-black/30"
                                id="imgPara"
                                value={partOfArticle.imgPara || ""}
                                onChange={(e) => handleChangeForArticle("imgPara", e.target.value)}
                                placeholder="Nhập nội dung"
                            />
                            {paraErrors.imgPara && <p className="text-red-500 text-xs">{paraErrors.imgPara}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-black" htmlFor="imgSubPara">Nội dung nhỏ *</Label>
                            <Textarea
                                className="text-black border border-black/30"
                                id="imgSubPara"
                                value={partOfArticle.imgSubPara || ""}
                                onChange={(e) => handleChangeForArticle("imgSubPara", e.target.value)}
                                placeholder="Nhập nội dung nhỏ"
                            />
                            {paraErrors.imgSubPara && <p className="text-red-500 text-xs">{paraErrors.imgSubPara}</p>}
                        </div>
                    </div>
                );

            case "tbl":
                return (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                            <Label className="text-black" htmlFor="tblTitle">Tiêu đề *</Label>
                            <Input
                                className="text-black border border-black/30"
                                id="tblTitle"
                                value={partOfArticle.tblTitle || ""}
                                onChange={(e) => handleChangeForArticle("tblTitle", e.target.value)}
                                placeholder="Nhập tiêu đề"
                            />
                            {paraErrors.tblTitle && <p className="text-red-500 text-xs">{paraErrors.tblTitle}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-black mb-2" htmlFor="tbl">Chọn file dữ liệu (.xlsx, .xls) *</Label>
                            <Input
                                key={excelKey}
                                type="file"
                                className="text-black border border-black/30 file:bg-gray-950/30 file:text-center file:text-black file:rounded file:border-none hover:file:bg-gray-950/50 hover:file:text-white file:px-2"
                                id="tbl"
                                accept=".xlsx, .xls"
                                onChange={(e) => handleChangeForArticle("tbl", e.target.files[0])}
                            />
                            {paraErrors.tbl && <p className="text-red-500 text-xs">{paraErrors.tbl}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-black" htmlFor="tblPara">Nội dung *</Label>
                            <Textarea
                                className="text-black border border-black/30"
                                id="tblPara"
                                value={partOfArticle.tblPara || ""}
                                onChange={(e) => handleChangeForArticle("tblPara", e.target.value)}
                                placeholder="Nhập nội dung"
                            />
                            {paraErrors.tblPara && <p className="text-red-500 text-xs">{paraErrors.tblPara}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-black" htmlFor="tblSubPara">Nội dung nhỏ *</Label>
                            <Textarea
                                className="text-black border border-black/30"
                                id="tblSubPara"
                                value={partOfArticle.tblSubPara || ""}
                                onChange={(e) => handleChangeForArticle("tblSubPara", e.target.value)}
                                placeholder="Nhập nội dung nhỏ"
                            />
                            {paraErrors.tblSubPara && <p className="text-red-500 text-xs">{paraErrors.tblSubPara}</p>}
                        </div>
                    </div>
                );

            case "link":
                return (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                            <Label className="text-black" htmlFor="linkTitle">Tiêu đề *</Label>
                            <Input
                                className="text-black border border-black/30"
                                id="linkTitle"
                                value={partOfArticle.linkTitle || ""}
                                onChange={(e) => handleChangeForArticle("linkTitle", e.target.value)}
                                placeholder="Nhập tiêu đề"
                            />
                            {paraErrors.linkTitle && <p className="text-red-500 text-xs">{paraErrors.linkTitle}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-black mb-2" htmlFor="link">Đường dẫn URL *</Label>
                            <Input
                                className="text-black border border-black/30"
                                id="link"
                                value={partOfArticle.link || ""}
                                onChange={(e) => handleChangeForArticle("link", e.target.value)}
                                placeholder="https://example.com"
                            />
                            {paraErrors.link && <p className="text-red-500 text-xs">{paraErrors.link}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-black" htmlFor="linkPara">Nội dung *</Label>
                            <Textarea
                                className="text-black border border-black/30"
                                id="linkPara"
                                value={partOfArticle.linkPara || ""}
                                onChange={(e) => handleChangeForArticle("linkPara", e.target.value)}
                                placeholder="Nhập nội dung"
                            />
                            {paraErrors.linkPara && <p className="text-red-500 text-xs">{paraErrors.linkPara}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-black" htmlFor="linkSubPara">Nội dung nhỏ *</Label>
                            <Textarea
                                className="text-black border border-black/30"
                                id="linkSubPara"
                                value={partOfArticle.linkSubPara || ""}
                                onChange={(e) => handleChangeForArticle("linkSubPara", e.target.value)}
                                placeholder="Nhập nội dung nhỏ"
                            />
                            {paraErrors.linkSubPara && <p className="text-red-500 text-xs">{paraErrors.linkSubPara}</p>}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-2 pt-4 border-t mt-4">
            <RadioGroup
                value={selectedType}
                className="flex gap-4 justify-center text-black"
                onValueChange={onTypeChange}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="content" id="content" className="data-[state=checked]:bg-black border-black" />
                    <Label htmlFor="content">Nội dung</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="img" id="img" className="data-[state=checked]:bg-black border-black" />
                    <Label htmlFor="img">Hình ảnh</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tbl" id="tbl" className="data-[state=checked]:bg-black border-black" />
                    <Label htmlFor="tbl">Bảng</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="link" id="link" className="data-[state=checked]:bg-black border-black" />
                    <Label htmlFor="link">Liên kết</Label>
                </div>
            </RadioGroup>

            {renderFieldsForType()}

            <div className="flex gap-2 pt-4">
                <Button type="button" onClick={handleSubmitParagraph}>
                    {isEditingParagraph ? "Cập nhật đoạn" : "Thêm đoạn"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelAddParagraph}
                >
                    Hủy
                </Button>
            </div>
        </div>
    );
}
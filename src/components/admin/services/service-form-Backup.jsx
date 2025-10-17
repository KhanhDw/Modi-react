import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe } from "lucide-react";
import { UploadAPI } from "@/api/serviceAPI";
import ArticleDetailModal from "./articles/article_modal_detail";
import * as XLSX from "xlsx";

export default function ServiceForm() {
  // Cac state
  const [isAddingParagraph, setIsAddingParagraph] = useState(false);
  const [cancelAddParagraph, setCancelAddParagraph] = useState(false);
  const [selectedType, setSelectedType] = useState("content");
  const [fileKey, setFileKey] = useState(Date.now()); //key cho input file img
  const [excelKey, setExcelKey] = useState(Date.now()); //key cho input file excel
  const [preview, setPreview] = useState(null);
  const [countContent, setCountContent] = useState(1);
  const [countImg, setCountImg] = useState(1);
  const [countTbl, setCountTbl] = useState(1);
  const [countLink, setCountLink] = useState(1);
  const [lang, setLang] = useState("vi");
  const {
    editingService,
    handleEditService,
    handleClose,
    handleCreateService,
  } = useOutletContext();
  const [formData, setFormData] = useState({});
  const [partOfArticle, setPartOfArticle] = useState({});
  const [dataArticle, setDataArticle] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [isEditingParagraph, setIsEditingParagraph] = useState(false);
  const [editKey, setEditKey] = useState(null);
  const [errors, setErrors] = useState({});
  const [paraErrors, setParaErrors] = useState({});

  const validateParagraph = (type, part) => {
    const newErrors = {};

    if (type === "content") {
      if (!part.paraTitle?.trim())
        newErrors.paraTitle = "Tiêu đề đoạn văn không được bỏ trống";
      if (!part.paragraph?.trim())
        newErrors.paragraph = "Nội dung đoạn văn không được bỏ trống";
      if (!part.subPara?.trim())
        newErrors.subPara = "Nội dung nhỏ không được bỏ trống";
    }

    if (type === "img") {
      if (!part.imgTitle?.trim())
        newErrors.imgTitle = "Tiêu đề ảnh không được bỏ trống";
      if (!part.img) newErrors.img = "Phải chọn ảnh";
      if (!part.imgPara?.trim())
        newErrors.imgPara = "Nội dung ảnh không được bỏ trống";
      if (!part.imgSubPara?.trim())
        newErrors.imgSubPara = "Nội dung nhỏ không được bỏ trống";
    }

    if (type === "tbl") {
      if (!part.tblTitle?.trim())
        newErrors.tblTitle = "Tiêu đề bảng không được bỏ trống";
      if (!part.tbl || !Array.isArray(part.tbl) || part.tbl.length === 0)
        newErrors.tbl = "Phải chọn file dữ liệu hợp lệ";
      if (!part.tblPara?.trim())
        newErrors.tblPara = "Nội dung bảng không được bỏ trống";
      if (!part.tblSubPara?.trim())
        newErrors.tblSubPara = "Nội dung nhỏ không được bỏ trống";
    }

    if (type === "link") {
      if (!part.linkTitle?.trim())
        newErrors.linkTitle = "Tiêu đề liên kết không được bỏ trống";
      if (!part.link?.trim() || !/^https?:\/\/.+/.test(part.link))
        newErrors.link = "URL không hợp lệ";
      if (!part.linkPara?.trim())
        newErrors.linkPara = "Nội dung liên kết không được bỏ trống";
      if (!part.linkSubPara?.trim())
        newErrors.linkSubPara = "Nội dung nhỏ không được bỏ trống";
    }

    setParaErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xu ly modal article detail
  const handleDeleteParagraph = (key) => {
    setDataArticle((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleEditParagraph = (key, value) => {
    const type = key.replace(/[0-9]/g, "");
    setEditKey(key);
    setPartOfArticle(value);

    if (type === "content") {
      setSelectedType("content");
    } else if (type === "img") {
      setSelectedType("img");
      // nếu là URL (ảnh đã upload), set preview luôn
      if (value?.img && typeof value.img === "string") {
        setPreview(value.img);
      }
    } else if (type === "tbl") {
      setSelectedType("tbl");
    } else {
      setSelectedType("link");
    }

    setOpenDetailModal(false);
    setIsEditingParagraph(true);
    setIsAddingParagraph(true);
  };

  // xu ly event

  // khi co du lieu va yeu cau edit tu component cha
  useEffect(() => {
    if (editingService) {
      setFormData({
        serviceName: editingService.ten_dich_vu || "",
        desc: editingService.mo_ta || "",
        price: editingService.price || "",
        header: editingService.header || "",
        footer: editingService.footer || "",
      });
    }
  }, [editingService]);

  // gui data ve component cha ServicesPage
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    console.log("xinchoaf");

    const submitData = {
      ...formData,
      lg: lang,
      ...(!editingService ? { content: dataArticle } : {}),
    };

    if (!editingService) {
      handleCreateService(submitData);
    } else {
      handleEditService(submitData, editingService.id);
    }

    setDataArticle(null);
    setPartOfArticle({});
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeForArticle = (field, value) => {
    setPartOfArticle((prev) => ({ ...prev, [field]: value }));
  };

  const openAddParagraph = () => {
    setIsAddingParagraph(true);
  };

  // const newArticle = { ...partOfArticle };

  //Them tung phan cua bai viet vao BIG CONTENT
  // Hàm thêm/sửa từng phần của bài viết vào BIG CONTENT
  const handleSubmitParagraph = async (field) => {
    // 1. Validate trước khi thêm
    if (!validateParagraph(selectedType, partOfArticle)) {
      return;
    }

    let updatedArticle = { ...partOfArticle }; // copy state hiện tại
    let key = field;

    // 2. Nếu đang sửa đoạn cũ
    if (isEditingParagraph && editKey) {
      // Nếu là ảnh và người dùng upload file mới thì re-upload
      if (selectedType === "img" && updatedArticle.img instanceof File) {
        const data = new FormData();
        data.append("image", updatedArticle.img);

        try {
          const res = await fetch(UploadAPI.uploadImg(), {
            method: "POST",
            body: data,
          });
          if (!res.ok) throw new Error("Error when upload file");

          const result = await res.json();
          if (result.success) {
            updatedArticle.img = result.data.url; // cập nhật lại URL
          }
        } catch (err) {
          console.log("Error upload khi edit: ", err);
        }
      }

      // Nếu là bảng (tbl) thì đọc lại file Excel (nếu người dùng chọn lại file mới)
      if (selectedType === "tbl" && updatedArticle.tbl instanceof File) {
        try {
          const tableData = await handleExcelUpload(updatedArticle.tbl);
          updatedArticle.tbl = tableData;
        } catch (err) {
          console.log("Error reading excel: ", err);
        }
      }

      // Cập nhật vào dataArticle
      setDataArticle((prev) => ({ ...prev, [editKey]: updatedArticle }));
    }

    // 3. Nếu thêm mới
    else {
      if (field === "content") {
        key = field + countContent.toString();
        setCountContent((c) => c + 1);
      } else if (field === "img") {
        key = field + countImg.toString();
        setCountImg((c) => c + 1);

        if (updatedArticle.img instanceof File) {
          const data = new FormData();
          data.append("image", updatedArticle.img);

          try {
            const res = await fetch(UploadAPI.uploadImg(), {
              method: "POST",
              body: data,
            });
            if (!res.ok) throw new Error("Error when upload file");

            const result = await res.json();
            if (result.success) {
              updatedArticle.img = result.data.url;
            }
          } catch (err) {
            console.log("Error: ", err);
          }
        }
      } else if (field === "tbl") {
        key = field + countTbl.toString();
        setCountTbl((c) => c + 1);

        if (updatedArticle.tbl instanceof File) {
          try {
            const tableData = await handleExcelUpload(updatedArticle.tbl);
            updatedArticle.tbl = tableData; // Lưu dữ liệu bảng
          } catch (err) {
            console.log("Error reading excel: ", err);
          }
        }
      } else if (field === "link") {
        key = field + countLink.toString();
        setCountLink((c) => c + 1);
      }

      // Thêm vào BIG CONTENT
      setDataArticle((prev) => ({ ...prev, [key]: updatedArticle }));
    }

    // 4. Reset state sau khi submit thành công
    setIsAddingParagraph(false);
    setIsEditingParagraph(false);
    setEditKey(null);
    setPartOfArticle({});
    setSelectedType("content");
    setParaErrors({});
  };

  const handleCancelAddParagraph = () => {
    setIsAddingParagraph(false);
    setIsEditingParagraph(false);
    setEditKey(null);
    setPartOfArticle({});
    setSelectedType("content");
  };

  const handleFileChange = (file) => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChangeLang = () => {
    const newLang = lang === "vi" ? "en" : "vi"; // đổi giá trị trực tiếp
    setLang(newLang);
  };
  // Đọc file Excel
  const handleExcelUpload = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Lấy sheet đầu tiên
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Parse dữ liệu sheet ra mảng 2 chiều
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(jsonData);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
  };

  // 🔹 Parse từ input về số
  const parseCurrency = (value) => {
    if (!value) return 0;
    // Bỏ ký tự không phải số
    const numericValue = value.replace(/[^\d]/g, "");
    return Number(numericValue);
  };

  //Validation
  const validateForm = () => {
    const newErrors = {};
    // 🔹 Tên dịch vụ
    if (
      typeof formData.serviceName !== "string" ||
      !formData.serviceName.trim()
    ) {
      newErrors.serviceName = "Tên dịch vụ không được bỏ trống";
    }

    // 🔹 Mô tả
    if (typeof formData.desc !== "string" || !formData.desc.trim()) {
      newErrors.desc = "Mô tả không được bỏ trống";
    }

    // 🔹 Giá
    if (
      formData.price === null ||
      formData.price === undefined ||
      formData.price === "" ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      newErrors.price = "Giá phải là số và không âm";
    }

    // 🔹 Trường chỉ check khi thêm mới (không phải edit)
    if (!editingService) {
      if (typeof formData.header !== "string" || !formData.header.trim()) {
        newErrors.header = "Tiêu đề bài viết không được bỏ trống";
      }

      if (
        !dataArticle ||
        typeof dataArticle !== "object" ||
        Object.keys(dataArticle).length === 0
      ) {
        newErrors.dataArticle = "Bài viết phải có ít nhất một phần nội dung";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <div className="max-h-[80vh] overflow-y-auto p-2">
        <Card className="bg-white w-full mx-auto">
          <CardHeader className="relative">
            <CardTitle className="flex gap-2 items-center">
              <Target className="h-5 w-5" />
              {editingService ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}
            </CardTitle>
            <CardDescription className="text-black/50">
              {editingService
                ? "Cập nhật thông tin dịch vụ"
                : "Điền thông tin để tạo dịch vụ mới"}
            </CardDescription>
            <div className="absolute right-0 top-0 text-black mr-4 rounded-4xl cursor-pointer hover:scale-110">
              <Button
                onClick={handleChangeLang}
                className="flex flex-row gap-2 bg-green-500/90 hover:bg-green-600/90"
              >
                <Globe className="w-4 h-4 text-white space-x-2" />
                {lang === "vi" && (
                  <span className="text-xs font-bold text-white">VI</span>
                )}
                {lang === "en" && (
                  <span className="text-xs font-bold text-white">EN</span>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="space-y-6"
            >
              <div className="space-y-6">
                <div
                  className={`flex ${
                    editingService ? `flex-col` : ""
                  } justify-between gap-6`}
                >
                  <div className="space-y-2 flex-1/3">
                    <Label
                      className="text-black"
                      htmlFor="serviceName"
                    >
                      Tên dịch vụ *
                    </Label>
                    <Input
                      className="text-black border border-black/30"
                      id="serviceName"
                      value={formData.serviceName || ""}
                      onChange={(e) =>
                        handleChange("serviceName", e.target.value)
                      }
                      placeholder="Nhập tên dịch vụ"
                    />
                    {errors.serviceName && (
                      <p className="text-red-500 text-sm">
                        {errors.serviceName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 flex-1/3">
                    <Label
                      className="text-black"
                      htmlFor="description"
                    >
                      Mô tả *
                    </Label>
                    <Textarea
                      className="text-black border border-black/30"
                      id="description"
                      value={formData.desc}
                      onChange={(e) => handleChange("desc", e.target.value)}
                      placeholder="Nhập mô tả dịch vụ"
                    />
                    {errors.desc && (
                      <p className="text-red-500 text-sm">{errors.desc}</p>
                    )}
                  </div>
                  <div className="space-y-2 flex-1/3">
                    <Label
                      className="text-black"
                      htmlFor="price"
                    >
                      Giá
                    </Label>
                    <Input
                      className="text-black border border-black/30"
                      id="price"
                      type="text" // dùng text để hiển thị số có dấu chấm
                      value={
                        formData.price !== null && formData.price !== undefined
                          ? formatCurrency(formData.price)
                          : ""
                      }
                      onChange={(e) => {
                        // Bỏ ký tự không phải số
                        const rawValue = e.target.value.replace(/\D/g, "");
                        handleChange(
                          "price",
                          rawValue ? parseInt(rawValue, 10) : 0
                        );
                      }}
                      placeholder="Nhập giá của dịch vụ"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm">{errors.price}</p>
                    )}
                  </div>
                </div>
                {!editingService && (
                  <>
                    <div className="space-y-2">
                      <div className="space-y-2">
                        <Label
                          className="text-black"
                          htmlFor="header"
                        >
                          Tiêu đề của bài viết *
                        </Label>
                        <Input
                          className="text-black border border-black/30"
                          id="header"
                          type={"text"}
                          // value={
                          //   editingService
                          //     ? editingService.ten_dich_vu
                          //     : formData.serviceName
                          // }
                          value={formData.header || ""}
                          onChange={(e) =>
                            handleChange("header", e.target.value)
                          }
                          placeholder="Nhập tiêu đề bài viết"
                        />
                        {errors.header && (
                          <p className="text-red-500 text-sm">
                            {errors.header}
                          </p>
                        )}
                      </div>
                      {!isAddingParagraph ? (
                        <div className="space-y-2 flex">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={openAddParagraph}
                          >
                            Thêm đoạn văn
                          </Button>

                          {dataArticle && (
                            <div className="ml-2">
                              <Button
                                type="button"
                                onClick={() => setOpenDetailModal(true)}
                              >
                                Xem chi tiết
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2 pt-4">
                          <RadioGroup
                            value={selectedType}
                            className="flex gap-4 justify-center text-black"
                            onValueChange={(value) => {
                              setSelectedType(value);
                              setPartOfArticle({});
                              setFileKey(Date.now());
                              setExcelKey(Date.now());
                              setPreview(null); // reset preview
                            }}
                          >
                            <div className="flex">
                              <RadioGroupItem
                                className="data-[state=checked]:bg-black border-black mr-1"
                                value="content"
                                id="content"
                              />
                              <Label htmlFor="content">Nội dung</Label>
                            </div>
                            <div className="flex">
                              <RadioGroupItem
                                className="data-[state=checked]:bg-black border-black mr-1"
                                value="img"
                                id="img"
                              />
                              <Label htmlFor="img">Hình ảnh</Label>
                            </div>
                            <div className="flex data-[state=checked]:bg-black border-black mr-1">
                              <RadioGroupItem
                                className="data-[state=checked]:bg-black border-black mr-1"
                                value="tbl"
                                id="tbl"
                              />
                              <Label htmlFor="tbl">Bảng</Label>
                            </div>
                            <div className="flex data-[state=checked]:bg-black border-black mr-1">
                              <RadioGroupItem
                                className="data-[state=checked]:bg-black border-black mr-1"
                                value="link"
                                id="link"
                              />
                              <Label htmlFor="link">Liên kết </Label>
                            </div>
                          </RadioGroup>
                          {selectedType === "content" && (
                            <>
                              <div className="flex justify-between gap-4 pt-2">
                                <div className="space-y-2 flex-1/3">
                                  <Label
                                    className="text-black"
                                    htmlFor="paraTitle"
                                  >
                                    Tiêu đề *
                                  </Label>
                                  <Input
                                    className="text-black border border-black/30"
                                    id="paraTitle"
                                    type={"text"}
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    value={partOfArticle.paraTitle || ""}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "paraTitle",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập tiêu đề đoạn văn"
                                    required
                                  />
                                  {paraErrors.paragraph && (
                                    <p className="text-red-500 text-xs">
                                      {paraErrors.paragraph}
                                    </p>
                                  )}
                                </div>
                                <div className="space-y-2 flex-1/3">
                                  <Label
                                    className="text-black"
                                    htmlFor="paragraph"
                                  >
                                    Nội dung*
                                  </Label>
                                  <Textarea
                                    className="text-black border border-black/30"
                                    id="paragraph"
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    value={partOfArticle.paragraph}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "paragraph",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập nội dung"
                                    required
                                  />
                                  {paraErrors.paraTitle && (
                                    <p className="text-red-500 text-xs">
                                      {paraErrors.paraTitle}
                                    </p>
                                  )}
                                </div>
                                <div className="space-y-2 flex-1/3">
                                  <Label
                                    className="text-black"
                                    htmlFor="subPara"
                                  >
                                    Nội dung nhỏ *
                                  </Label>
                                  <Textarea
                                    className="text-black border border-black/30"
                                    id="subPara"
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    value={partOfArticle.subPara}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "subPara",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập nội dung nhỏ"
                                    required
                                  />
                                  {selectedType === "content" &&
                                    paraErrors.subPara && (
                                      <p className="text-red-500 text-xs">
                                        {paraErrors.subPara}
                                      </p>
                                    )}
                                </div>
                              </div>
                            </>
                          )}

                          {selectedType === "img" && (
                            <>
                              <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                  <Label
                                    className="text-black"
                                    htmlFor="imgTitle"
                                  >
                                    Tiêu đề *
                                  </Label>
                                  <Input
                                    className="text-black border border-black/30"
                                    id="imgTitle"
                                    type={"text"}
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    value={partOfArticle.imgTitle || ""}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "imgTitle",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập tiêu đề "
                                    required
                                  />
                                  {selectedType === "img" &&
                                    paraErrors.imgTitle && (
                                      <p className="text-red-500 text-xs">
                                        {paraErrors.imgTitle}
                                      </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-center space-x-2">
                                    <div className="flex-1/2">
                                      <Label
                                        className="text-black mb-2"
                                        htmlFor="img"
                                      >
                                        Chọn hình ảnh *
                                      </Label>
                                      <Input
                                        key={fileKey}
                                        type="file"
                                        className="text-black border border-black/30 file:bg-gray-950/30
                              file:text-center file:text-black file:rounded file:border-none
                              hover:file:bg-gray-950/50 hover:file:text-white file:px-2"
                                        id="img"
                                        accept="image/*"
                                        // value={
                                        //   editingService ? editingService.mo_ta : formData.desc
                                        // }
                                        onChange={(e) => {
                                          const file = e.target.files[0];

                                          handleChangeForArticle("img", file);
                                          handleFileChange(file);
                                        }}
                                        required
                                      />
                                      {selectedType === "img" &&
                                        paraErrors.img && (
                                          <p className="text-red-500 text-xs">
                                            {paraErrors.img}
                                          </p>
                                        )}
                                    </div>
                                    <div className="flex-1/2">
                                      {preview && (
                                        <img
                                          loading="lazy"
                                          src={preview}
                                          alt="Preview"
                                          className="min-w-20 min-h-20"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    className="text-black"
                                    htmlFor="imgPara"
                                  >
                                    Nội dung*
                                  </Label>
                                  <Textarea
                                    className="text-black border border-black/30"
                                    id="imgPara"
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    value={partOfArticle.imgPara}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "imgPara",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập nội dung"
                                    required
                                  />
                                  {selectedType === "img" &&
                                    paraErrors.imgPara && (
                                      <p className="text-red-500 text-xs">
                                        {paraErrors.imgPara}
                                      </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    className="text-black"
                                    htmlFor="imgSubPara"
                                  >
                                    Nội dung nhỏ *
                                  </Label>
                                  <Textarea
                                    className="text-black border border-black/30"
                                    id="imgSubPara"
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    value={partOfArticle.imgSubPara}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "imgSubPara",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập nội dung nhỏ"
                                    required
                                  />
                                  {selectedType === "img" &&
                                    paraErrors.imgSubPara && (
                                      <p className="text-red-500 text-xs">
                                        {paraErrors.imgSubPara}
                                      </p>
                                    )}
                                </div>
                              </div>
                            </>
                          )}
                          {selectedType === "tbl" && (
                            <>
                              <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                  <Label
                                    className="text-black"
                                    htmlFor="tblTitle"
                                  >
                                    Tiêu đề *
                                  </Label>
                                  <Input
                                    className="text-black border border-black/30"
                                    id="tblTitle"
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    value={partOfArticle.tblTitle || ""}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "tblTitle",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập tiêu đề "
                                    required
                                  />
                                  {selectedType === "tbl" &&
                                    paraErrors.tblTitle && (
                                      <p className="text-red-500 text-xs">
                                        {paraErrors.tblTitle}
                                      </p>
                                    )}
                                </div>
                                <div className="space-y-">
                                  <Label
                                    className="text-black mb-2"
                                    htmlFor="tbl"
                                  >
                                    Chọn file dữ liệu *
                                  </Label>
                                  <Input
                                    key={excelKey}
                                    type="file"
                                    className="text-black border border-black/30 file:bg-gray-950/30
                              file:text-center file:text-black file:rounded file:border-none
                              hover:file:bg-gray-950/50 hover:file:text-white file:px-2"
                                    id="tbl"
                                    accept=".xlsx, .xls"
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        try {
                                          const tableData =
                                            await handleExcelUpload(file);
                                          handleChangeForArticle(
                                            "tbl",
                                            tableData
                                          ); // Lưu data mảng vào state
                                        } catch (err) {
                                          console.error(
                                            "Error parsing Excel: ",
                                            err
                                          );
                                        }
                                      }
                                    }}
                                    required
                                  />
                                  {selectedType === "tbl" && paraErrors.tbl && (
                                    <p className="text-red-500 text-xs">
                                      {paraErrors.tbl}
                                    </p>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    className="text-black"
                                    htmlFor="tblPara"
                                  >
                                    Nội dung*
                                  </Label>
                                  <Textarea
                                    className="text-black border border-black/30"
                                    id="tblPara"
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    value={partOfArticle.tblPara}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "tblPara",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập nội dung"
                                    required
                                  />
                                  {selectedType === "tbl" &&
                                    paraErrors.tblPara && (
                                      <p className="text-red-500 text-xs">
                                        {paraErrors.tblPara}
                                      </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    className="text-black"
                                    htmlFor="tblSubPara"
                                  >
                                    Nội dung nhỏ *
                                  </Label>
                                  <Textarea
                                    className="text-black border border-black/30"
                                    id="tblSubPara"
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    value={partOfArticle.tblSubPara}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "tblSubPara",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập nội dung nhỏ"
                                    required
                                  />
                                  {selectedType === "tbl" &&
                                    paraErrors.tblSubPara && (
                                      <p className="text-red-500 text-xs">
                                        {paraErrors.tblSubPara}
                                      </p>
                                    )}
                                </div>
                              </div>
                            </>
                          )}

                          {selectedType === "link" && (
                            <>
                              <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                  <Label
                                    className="text-black"
                                    htmlFor="linkTitle"
                                  >
                                    Tiêu đề *
                                  </Label>
                                  <Input
                                    className="text-black border border-black/30"
                                    id="linkTitle"
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    value={partOfArticle.linkTitle || ""}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "linkTitle",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập tiêu đề "
                                    required
                                  />
                                  {selectedType === "link" &&
                                    paraErrors.linkTitle && (
                                      <p className="text-red-500 text-xs">
                                        {paraErrors.linkTitle}
                                      </p>
                                    )}
                                </div>
                                <div className="space-y-">
                                  <Label
                                    className="text-black mb-2"
                                    htmlFor="link"
                                  >
                                    Đường dẫn URL *
                                  </Label>
                                  <Input
                                    className="text-black border border-black/30 "
                                    id="link"
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    value={partOfArticle.link || ""}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "link",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập đường dẫn URL..."
                                    required
                                  />
                                  {selectedType === "link" &&
                                    paraErrors.link && (
                                      <p className="text-red-500 text-xs">
                                        {paraErrors.link}
                                      </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    className="text-black"
                                    htmlFor="linkPara"
                                  >
                                    Nội dung*
                                  </Label>
                                  <Textarea
                                    className="text-black border border-black/30"
                                    id="linkPara"
                                    value={partOfArticle.linkPara}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "linkPara",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập nội dung"
                                    required
                                  />
                                  {selectedType === "link" &&
                                    paraErrors.linkPara && (
                                      <p className="text-red-500 text-xs">
                                        {paraErrors.linkPara}
                                      </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    className="text-black"
                                    htmlFor="linkSubPara"
                                  >
                                    Nội dung nhỏ *
                                  </Label>
                                  <Textarea
                                    className="text-black border border-black/30"
                                    id="linkSubPara"
                                    // value={
                                    //   editingService ? editingService.mo_ta : formData.desc
                                    // }
                                    value={partOfArticle.linkSubPara}
                                    onChange={(e) =>
                                      handleChangeForArticle(
                                        "linkSubPara",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nhập nội dung nhỏ"
                                    required
                                  />
                                  {selectedType === "link" &&
                                    paraErrors.linkSubPara && (
                                      <p className="text-red-500 text-xs">
                                        {paraErrors.linkSubPara}
                                      </p>
                                    )}
                                </div>
                              </div>
                            </>
                          )}
                          <div className="flex gap-2 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                handleSubmitParagraph(selectedType)
                              }
                            >
                              {isEditingParagraph ? "Chỉnh sửa" : "Thêm"}
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
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 hover:bg-gray-500/25"
                >
                  {editingService ? "Cập nhật dịch vụ" : "Tạo dịch vụ"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Thoát
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <ArticleDetailModal
        open={openDetailModal}
        onOpenChange={setOpenDetailModal}
        dataArticle={dataArticle}
        onEdit={handleEditParagraph}
        onDelete={handleDeleteParagraph}
      />
    </>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLenisLocal from "@/hook/useLenisLocal";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CustomerCombobox from "./selectOldCustomer";
import CustomSelect from "./CustomSelect";

import { banks } from "@/data/banks.js";
import { Switch } from "@/components/ui/switch";

export default function BookingForm() {
  useLenisLocal(".lenis-local");
  const {
    initDataService,
    initDataCustomer,
    handleClose,
    editingBooking,
    handleCreateBooking,
    handleEditingBooking,
  } = useOutletContext(); //src\pages\managers\ServicesPage.jsx

  const initialFormData = {
    cusName: "",
    cusPhone: "",
    cusEmail: "",
    cusAddress: "",
    cccd: "",
    bankAccount: "",
    bankName: "",
    service: "",
    price: "",
    quantity: 1,
    total: "",
    status: "pending",
    bookingDate: new Date().toISOString().split("T")[0],
    completedDate: "",
    customerId: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({}); // 👈 state chứa lỗi
  const [customerMode, setCustomerMode] = useState("new");
  const [floorPriceOfservice, setFloorPriceOfservice] = useState(0);
  const [showCustomerInfo, setShowCustomerInfo] = useState(!editingBooking);

  useEffect(() => {
    if (editingBooking) {
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const dateOnly = editingBooking.booking_date
        ? formatDate(editingBooking.booking_date)
        : formatDate(new Date());

      setFormData({
        cusName: editingBooking.customer_name ?? "",
        cusPhone: editingBooking.phone ?? "",
        cusEmail: editingBooking.customer_email ?? editingBooking.email ?? "",
        cusAddress:
          editingBooking.customer_address ?? editingBooking.address ?? "",
        cccd: editingBooking.customer_cccd ?? editingBooking.cccd ?? "",
        bankAccount:
          editingBooking.customer_number_bank ??
          editingBooking.bank_account ??
          "",
        bankName:
          editingBooking.customer_name_bank ?? editingBooking.bank_name ?? "",
        service: editingBooking.service_id
          ? editingBooking.service_id.toString()
          : "",
        price: editingBooking.price ?? "",
        quantity: editingBooking.quantity ?? 1,
        total: editingBooking.total ?? "",
        status: editingBooking.status?.toLowerCase() || "",
        bookingDate: dateOnly,
        completedDate: editingBooking.completed_date
          ? formatDate(editingBooking.completed_date)
          : "",
      });
    }
  }, [editingBooking]);

  // Recalculate total whenever price or quantity changes
  useEffect(() => {
    const price = parseFloat(formData.price) || 0;
    const quantity = parseInt(formData.quantity, 10) || 0;
    const newTotal = price * quantity;

    // Only update if the total is different to avoid re-renders
    if (formData.total !== newTotal) {
      setFormData((prev) => ({ ...prev, total: newTotal }));
    }
  }, [formData.price, formData.quantity, formData.total]);

  const handleModeChange = (mode) => {
    setCustomerMode(mode);
    if (mode === "new") {
      setFormData(initialFormData); // Reset form to initial state
      setErrors({}); // Clear any validation errors
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // reset lỗi khi người dùng nhập

    if (field === "service") {
      const selected = initDataService.find(
        (s) => String(s.id) === String(value)
      );
      if (selected) {
        setFloorPriceOfservice(selected.floor_price);
      }
    }
    if (field === "price") {
      const priceValue = parseFloat(value);
      if (priceValue < floorPriceOfservice) {
        setErrors((prev) => ({
          ...prev,
          price: `Giá không được thấp hơn ${Number(
            floorPriceOfservice
          ).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`,
        }));
      }
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, ""); // chỉ giữ số
    const number = parseInt(numericValue, 10);
    if (isNaN(number)) return "";
    return number.toLocaleString("vi-VN");
  };

  const handlePriceChange = (value) => {
    const rawValue = value.replace(/\D/g, ""); // bỏ dấu phẩy
    const numeric = rawValue ? parseInt(rawValue, 10) : "";

    setFormData((prev) => ({
      ...prev,
      price: numeric,
    }));

    // validate realtime
    if (numeric && numeric < floorPriceOfservice) {
      setErrors((prev) => ({
        ...prev,
        price: `Giá không được thấp hơn ${Number(
          floorPriceOfservice
        ).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, price: "" }));
    }
  };

  const handleCheckCustomer = () => {
    const phone = formData.cusPhone?.trim();
    if (!phone) return;

    const existCustomer = initDataCustomer?.find((c) => c.phone === phone);

    if (existCustomer) {
      // Nếu có khách cũ → fill vào form + khóa field
      setFormData((prev) => ({
        ...prev,
        cusName: existCustomer.name || prev.cusName,
        cusEmail: existCustomer.email || prev.cusEmail,
        cusAddress: existCustomer.address || prev.cusAddress,
        cccd: existCustomer.cccd || "",
        bankAccount: existCustomer.number_bank || "",
        bankName: existCustomer.name_bank || "",
      }));
      setCustomerMode("existing");
    } else {
      // Nếu không có khách cũ → KHÔNG xoá giá trị đang nhập
      // chỉ bật chế độ nhập mới
      setCustomerMode("new");
    }
  };

  // Validation logic
  const validateForm = () => {
    let newErrors = {};

    if (!editingBooking) {
      if (!formData.cusName?.trim()) {
        newErrors.cusName = "Tên khách hàng là bắt buộc.";
      }

      if (!formData.cusPhone?.trim()) {
        newErrors.cusPhone = "Số điện thoại là bắt buộc.";
      } else if (!/^\d{10}$/.test(formData.cusPhone.trim())) {
        newErrors.cusPhone = "Số điện thoại phải gồm 10 chữ số.";
      }

      if (!formData.cusEmail) {
        newErrors.cusEmail = "Vui lòng nhập email khách hàng";
      } else if (!/\S+@\S+\.\S+/.test(formData.cusEmail)) {
        newErrors.cusEmail = "Email không hợp lệ";
      }

      if (!formData.cusAddress?.trim()) {
        newErrors.cusAddress = "Địa chỉ là bắt buộc.";
      }
    }

    if (!formData.service) {
      newErrors.service = "Vui lòng chọn dịch vụ.";
    }

    if (!formData.price) {
      newErrors.price = "Vui lòng nhập giá.";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Giá phải là số lớn hơn 0.";
    } else if (parseFloat(formData.price) < floorPriceOfservice) {
      newErrors.price = `Giá không được thấp hơn ${Number(
        floorPriceOfservice
      ).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`;
    }

    if (!formData.bookingDate) {
      newErrors.bookingDate = "Vui lòng chọn ngày đặt.";
    }

    if (!formData.completedDate) {
      newErrors.completedDate = "Vui lòng chọn ngày bàn giao.";
    }
    if (formData.completedDate) {
      if (new Date(formData.completedDate) < new Date(formData.bookingDate)) {
        newErrors.completedDate = "Ngày bàn giao phải sau ngày đặt.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (!isValid) return;
    if (!editingBooking) {
      handleCreateBooking(formData);
    } else {
      handleEditingBooking(formData, editingBooking.id);
    }
  };

  return (
    <ScrollArea
      className="lenis-local w-full h-full"
      data-lenis-prevent
    >
      {/* Header */}
      <div className="bg-white admin-dark:bg-gray-800 w-full h-full mx-auto p-3 md:p-5 flex justify-between items-center flex-col md:flex-row">
        <div className="flex flex-col items-center md:items-start">
          <span className="sm:text-lg md:text-lg font-bold uppercase text-gray-900 admin-dark:text-gray-100">
            {editingBooking ? "Chỉnh sửa đơn đặt" : "Tạo đơn mới"}
          </span>
          <span className="text-xs sm:text-sm text-gray-600 admin-dark:text-gray-300">
            {editingBooking
              ? "Cập nhật thông tin đơn đặt"
              : "Điền thông tin để tạo đơn mới"}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white admin-dark:bg-gray-800 w-full h-full mx-auto px-3 md:px-5">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Customer Information Group */}
          <fieldset className="border p-4 rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <legend className="text-lg font-semibold px-2 text-gray-800 admin-dark:text-gray-200">
                Thông tin khách hàng
              </legend>
              {editingBooking && (
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="customer-info-toggle"
                    className="text-sm font-medium text-gray-700 admin-dark:text-gray-300 cursor-pointer"
                  >
                    {showCustomerInfo
                      ? "Ẩn thông tin"
                      : "Chỉnh sửa thông tin"}
                  </Label>
                  <Switch
                    id="customer-info-toggle"
                    checked={showCustomerInfo}
                    onCheckedChange={setShowCustomerInfo}
                  />
                </div>
              )}
            </div>

            {showCustomerInfo && (
              <div className="space-y-4 pt-4">
                {/* Mode Switch */}
                {!editingBooking && (
                  <div className="flex gap-4 mt-3 mb-2">
                    {["existing", "new"].map((mode) => (
                      <Button
                        key={mode}
                        type="button"
                        onClick={() => handleModeChange(mode)}
                        className={`cursor-pointer shadow border-none transition-all
                    ${
                      customerMode === mode
                        ? "bg-blue-500 hover:bg-blue-600 text-white admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700"
                        : "bg-gray-200 hover:bg-gray-300 text-black admin-dark:bg-gray-700 admin-dark:hover:bg-gray-600 admin-dark:text-white"
                    }
                  `}
                      >
                        <span className="text-xs sm:text-sm md:text-base font-semibold">
                          {mode === "existing"
                            ? "Khách hàng cũ"
                            : "Khách hàng mới"}
                        </span>
                      </Button>
                    ))}
                  </div>
                )}

                {/* Khách hàng cũ */}
                {customerMode === "existing" && !editingBooking && (
                  <div className="space-y-2">
                    <Label className="text-black admin-dark:text-gray-100">
                      Khách hàng *
                    </Label>
                    <CustomerCombobox
                      customers={initDataCustomer}
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </div>
                )}

                {/* Số điện thoại */}
                <div className="space-y-2">
                  <Label
                    htmlFor="cusPhone"
                    className="text-black admin-dark:text-gray-100"
                  >
                    Số điện thoại *
                  </Label>
                  <Input
                    id="cusPhone"
                    maxLength={10}
                    className="text-black w-full border border-black/30 admin-dark:text-gray-100 admin-dark:border-gray-600 shadow-none"
                    value={formData.cusPhone || ""}
                    onChange={(e) => handleChange("cusPhone", e.target.value)}
                    onBlur={handleCheckCustomer}
                    placeholder="Nhập số điện thoại của khách hàng..."
                    readOnly={customerMode === "existing"}
                  />
                  {errors.cusPhone && (
                    <p className="text-red-500 text-sm">{errors.cusPhone}</p>
                  )}
                </div>

                {/* Tên khách hàng */}
                <div className="space-y-2">
                  <Label
                    htmlFor="cusName"
                    className="text-black admin-dark:text-gray-100"
                  >
                    Tên khách hàng *
                  </Label>
                  <Input
                    id="cusName"
                    className="text-black w-full border border-black/30 admin-dark:text-gray-100 admin-dark:border-gray-600 shadow-none"
                    value={formData.cusName || ""}
                    onChange={(e) => handleChange("cusName", e.target.value)}
                    placeholder="Nhập Họ và Tên khách hàng..."
                    readOnly={customerMode === "existing"}
                  />
                  {errors.cusName && (
                    <p className="text-red-500 text-sm">{errors.cusName}</p>
                  )}
                </div>

                {/* Email + Địa chỉ (khi tạo mới) */}

                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="cusEmail"
                      className="text-black admin-dark:text-gray-100"
                    >
                      Email
                    </Label>
                    <Input
                      id="cusEmail"
                      className="text-black w-full border border-black/30 admin-dark:text-gray-100 admin-dark:border-gray-600 shadow-none"
                      value={formData.cusEmail || ""}
                      onChange={(e) =>
                        handleChange("cusEmail", e.target.value)
                      }
                      placeholder="Nhập email của khách hàng..."
                      readOnly={customerMode === "existing"}
                    />
                    {errors.cusEmail && (
                      <p className="text-red-500 text-sm">{errors.cusEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="cusAddress"
                      className="text-black admin-dark:text-gray-100"
                    >
                      Địa chỉ *
                    </Label>
                    <Input
                      id="cusAddress"
                      className="w-full border border-gray-400 rounded-md text-black admin-dark:text-gray-100 admin-dark:border-gray-600 shadow-none"
                      value={formData.cusAddress || ""}
                      onChange={(e) =>
                        handleChange("cusAddress", e.target.value)
                      }
                      placeholder="Nhập địa chỉ của khách hàng..."
                      readOnly={customerMode === "existing"}
                    />
                    {errors.cusAddress && (
                      <p className="text-red-500 text-sm">
                        {errors.cusAddress}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="cccd"
                      className="text-black admin-dark:text-gray-100"
                    >
                      CCCD/CMND
                    </Label>
                    <Input
                      id="cccd"
                      className="w-full border border-gray-400 rounded-md text-black admin-dark:text-gray-100 admin-dark:border-gray-600 shadow-none"
                      value={formData.cccd || ""}
                      onChange={(e) => handleChange("cccd", e.target.value)}
                      placeholder="Nhập số CCCD/CMND..."
                      readOnly={customerMode === "existing"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="bankAccount"
                      className="text-black admin-dark:text-gray-100"
                    >
                      Số tài khoản ngân hàng
                    </Label>
                    <Input
                      id="bankAccount"
                      className="w-full border border-gray-400 rounded-md text-black admin-dark:text-gray-100 admin-dark:border-gray-600 shadow-none"
                      value={formData.bankAccount || ""}
                      onChange={(e) =>
                        handleChange("bankAccount", e.target.value)
                      }
                      placeholder="Nhập số tài khoản..."
                      readOnly={customerMode === "existing"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="bankName"
                      className="text-black admin-dark:text-gray-100"
                    >
                      Tên ngân hàng
                    </Label>
                    <CustomSelect
                      value={formData.bankName || ""}
                      onValueChange={(value) =>
                        handleChange("bankName", value)
                      }
                      placeholder="Chọn ngân hàng..."
                      options={banks}
                      className="w-full"
                      disabled={customerMode === "existing"}
                    />
                  </div>
                </>
              </div>
            )}
          </fieldset>

          {/* Service and Time Information Group */}
          <fieldset className="border p-4 rounded-md space-y-4">
            <legend className="text-lg font-semibold px-2 text-gray-800 admin-dark:text-gray-200">
              Thông tin dịch vụ & thời gian
            </legend>

            {/* Trạng thái (chỉ khi chỉnh sửa) */}
            {editingBooking && (
              <div className="space-y-2 p-3 rounded-lg bg-blue-50 admin-dark:bg-blue-900/20 border-2 border-dashed border-blue-400 shadow-md">
                <Label
                  htmlFor="status"
                  className="text-black admin-dark:text-gray-100 font-semibold"
                >
                  Cập nhật trạng thái
                </Label>

                <CustomSelect
                  value={formData.status || ""}
                  onValueChange={(value) => handleChange("status", value)}
                  placeholder="Chọn trạng thái"
                  options={[
                    { value: "pending", label: "Chờ xác nhận" },
                    { value: "confirmed", label: "Đã xác nhận" },
                    { value: "processing", label: "Đang xử lý" },
                    { value: "completed", label: "Hoàn thành" },
                    { value: "cancelled", label: "Hủy" },
                  ]}
                  className="w-full"
                />
              </div>
            )}

            {/* Dịch vụ */}
            {initDataService && (
              <div className="space-y-2">
                <Label className="text-black admin-dark:text-gray-100">
                  Chọn dịch vụ *
                </Label>

                <CustomSelect
                  value={formData.service || ""}
                  onValueChange={(value) => handleChange("service", value)}
                  placeholder="Chọn dịch vụ"
                  options={initDataService.map((service) => ({
                    value: String(service?.id ?? ""),
                    label:
                      service?.translation?.ten_dich_vu || "Dịch vụ không tên",
                  }))}
                  className="w-full"
                />

                {errors.service && (
                  <p className="text-red-500 text-sm">{errors.service}</p>
                )}
              </div>
            )}

            {/* Giá */}
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-black admin-dark:text-gray-100 flex items-center justify-between sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <span>Giá *</span>
                <span className="text-sm text-gray-600 admin-dark:text-gray-300">
                  Giá thấp nhất:{" "}
                  {Number(floorPriceOfservice).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </Label>
              <Input
                id="price"
                type="text"
                className="text-black w-full border border-black/30 admin-dark:text-gray-100 admin-dark:border-gray-600 shadow-none"
                value={formatCurrency(String(formData.price))}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="Nhập giá dịch vụ..."
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>

            {/* Số lượng */}
            <div className="space-y-2">
              <Label
                htmlFor="quantity"
                className="text-black admin-dark:text-gray-100"
              >
                Số lượng
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                className="text-black w-full border border-black/30 admin-dark:text-gray-100 admin-dark:border-gray-600 shadow-none"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                placeholder="1"
              />
            </div>

            {/* Tổng tiền */}
            <div className="space-y-2">
              <Label
                htmlFor="total"
                className="text-black admin-dark:text-gray-100"
              >
                Tổng tiền
              </Label>
              <Input
                id="total"
                type="text"
                className="text-black w-full border border-black/30 admin-dark:text-gray-100 admin-dark:border-gray-600 shadow-none bg-gray-100 admin-dark:bg-gray-700"
                value={formatCurrency(String(formData.total))}
                readOnly
              />
            </div>

            {/* Ngày đặt & Ngày bàn giao */}
            <div className="flex flex-col sm:flex-row sm:gap-4">
              {[
                ["bookingDate", "Ngày đặt đơn", errors.bookingDate],
                ["completedDate", "Ngày bàn giao", errors.completedDate],
              ].map(([field, label, err]) => (
                <div
                  key={field}
                  className="w-full space-y-2"
                >
                  <Label className="text-black admin-dark:text-gray-100">
                    {label}
                  </Label>
                  <div className="relative w-full">
                    <input
                      type="date"
                      value={formData[field] || ""}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-950/30 admin-dark:border-gray-600 rounded-lg text-black admin-dark:text-gray-100 focus:outline-none"
                    />
                    <Calendar
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 admin-dark:hidden cursor-pointer"
                      onClick={(e) =>
                        e.currentTarget.previousSibling.showPicker?.()
                      }
                    />
                  </div>
                  {err && <p className="text-red-500 text-sm">{err}</p>}
                </div>
              ))}
            </div>
          </fieldset>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pb-5">
            <Button
              type="submit"
              className="w-fit md:w-50 text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
            >
              <span className="text-sm sm:text-base font-semibold">
                {editingBooking ? "Cập nhật đơn đặt" : "Tạo đơn"}
              </span>
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              className="w-fit md:w-50 cursor-pointer bg-black hover:bg-black/80 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-900 text-white py-1.5"
            >
              <span className="text-sm sm:text-base font-semibold">Thoát</span>
            </Button>
          </div>
        </form>
      </div>
    </ScrollArea>
  );
}

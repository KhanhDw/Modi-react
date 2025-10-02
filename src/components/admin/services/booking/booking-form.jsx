import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useLenisLocal from "@/hook/useLenisLocal";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CustomerCombobox from "./selectOldCustomer";

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
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({}); // 👈 state chứa lỗi
  const [customerMode, setCustomerMode] = useState("new");
  const [floorPriceOfservice, setFloorPriceOfservice] = useState(0);


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

      console.log("--1>", editingBooking);



      setFormData({
        cusName: editingBooking.customer_name || "",
        cusPhone: editingBooking.phone || "",
        cusEmail: editingBooking.email || "",
        cusAddress: editingBooking.address || "",
        service: editingBooking.service_id
          ? editingBooking.service_id.toString()
          : "",
        price: editingBooking.price || "",
        status: editingBooking.status?.toLowerCase() || "",
        bookingDate: dateOnly,
        completedDate: editingBooking.completed_date
          ? formatDate(editingBooking.completed_date)
          : "",
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, bookingDate: today }));
    }
  }, [editingBooking, initDataService]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // reset lỗi khi người dùng nhập

    if (field === "service") {
      const selected = initDataService.find((s) => String(s.id) === String(value));
      if (selected) {
        setFloorPriceOfservice(selected.floor_price);
      }
    }
    if (field === "price") {
      const priceValue = parseFloat(value);
      if (priceValue < floorPriceOfservice) {
        setErrors((prev) => ({
          ...prev,
          price: `Giá không được thấp hơn ${Number(floorPriceOfservice).toLocaleString(
            "vi-VN",
            { style: "currency", currency: "VND" }
          )}`
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
        cusName: existCustomer.customer_name || prev.cusName,
        cusEmail: existCustomer.email || prev.cusEmail,
        cusAddress: existCustomer.address || prev.cusAddress,
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
      newErrors.price = `Giá không được thấp hơn ${Number(floorPriceOfservice).toLocaleString(
        "vi-VN",
        { style: "currency", currency: "VND" }
      )}`;
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


      console.log("-->>>", formData);
      handleCreateBooking(formData);
    } else {
      handleEditingBooking(formData, editingBooking.id);
    }
  };



  const floor_price_service = (id) => {
    const service = initDataService.find((s) => String(s.id) === String(id));
    if (service) {
      setFloorPriceOfservice(service.floor_price);
    } else {
      setFloorPriceOfservice(0); // fallback khi không tìm thấy
    }
  };


  return (
    <ScrollArea className="lenis-local overflow-auto" data-lenis-prevent>
      <div className="w-full mx-auto bg-white admin-dark:bg-gray-800 admin-dark:border-gray-700 border border-gray-300 rounded-lg">

        <CardHeader className="px-2 sm:px-4">
          <CardTitle className="flex flex-col sm:flex-row gap-2 items-start sm:items-center text-base sm:text-lg md:text-xl font-bold text-gray-900 admin-dark:text-gray-100">
            {editingBooking ? "Chỉnh sửa đơn đặt" : "Tạo đơn mới"}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm mt-1 text-gray-600 admin-dark:text-gray-100">
            {editingBooking
              ? "Cập nhật thông tin đơn đặt"
              : "Điền thông tin để tạo đơn mới"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="gap-4">
              <div className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    variant={customerMode === "existing" ? "default" : "outline"}
                    onClick={() => setCustomerMode("existing")}
                    className="cursor-pointer admin-dark:bg-blue-500 admin-dark:hover:bg-black/40"
                  >
                    Khách hàng cũ
                  </Button>
                  <Button
                    type="button"
                    variant={customerMode === "new" ? "default" : "outline"}
                    onClick={() => setCustomerMode("new")}
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 admin-dark:hover:bg-blue-600"
                  >
                    <span className="text-white">Khách hàng mới</span>
                  </Button>
                </div>

                {customerMode === "existing" && (
                  <div className="space-y-2">
                    <Label className="text-black admin-dark:text-gray-100">Khách hàng *</Label>
                    <CustomerCombobox
                      customers={initDataCustomer}
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </div>
                )}

                {/* Số điện thoại */}
                <div className="space-y-2">
                  <Label className="text-black admin-dark:text-gray-100" htmlFor="cusPhone">
                    Số điện thoại *
                  </Label>
                  <Input
                    className="text-black border border-black/30 admin-dark:text-gray-100"
                    id="cusPhone"
                    value={formData.cusPhone || ""}
                    onChange={(e) => handleChange("cusPhone", e.target.value)}
                    onBlur={handleCheckCustomer}
                    placeholder="Nhập số điện thoại của khách hàng... "
                    readOnly={customerMode === "existing" || editingBooking}  // 👈 THÊM ĐIỀU KIỆN NÀY
                  />
                  {errors.cusPhone && (
                    <p className="text-red-500 text-sm">{errors.cusPhone}</p>
                  )}
                </div>
                {/* Tên khách hàng */}

                <div className="space-y-2">
                  <Label className="text-black admin-dark:text-gray-100" htmlFor="cusName">
                    Tên khách hàng *
                  </Label>
                  <Input
                    className="text-black border border-black/30 admin-dark:text-gray-100"
                    id="cusName"
                    value={formData.cusName || ""}
                    onChange={(e) => handleChange("cusName", e.target.value)}
                    placeholder="Nhập Họ và Tên khách hàng... "
                    readOnly={customerMode === "existing" || editingBooking}
                  />

                  {errors.cusName && (
                    <p className="text-red-500 text-sm">{errors.cusName}</p>
                  )}
                </div>
                {/* Email + Address (chỉ khi tạo mới) */}
                {!editingBooking && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-black admin-dark:text-gray-100" htmlFor="cusEmail">
                        Email
                      </Label>
                      <Input
                        className="text-black border border-black/30 admin-dark:text-gray-100"
                        id="cusEmail"
                        value={formData.cusEmail || ""}
                        onChange={(e) => handleChange("cusEmail", e.target.value)}
                        placeholder="Nhập email của khách hàng... "
                        readOnly={customerMode === "existing" || editingBooking}
                      />
                      {errors.cusEmail && (
                        <p className="text-red-500 text-sm">{errors.cusEmail}</p>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label className="text-xs sm:text-sm text-gray-900 admin-dark:text-gray-100" htmlFor="cusAddress">
                        Địa chỉ *
                      </Label>
                      <Input
                        className="text-xs sm:text-sm w-full border border-gray-400 rounded-md text-gray-900 placeholder-gray-500 admin-dark:text-gray-100"
                        id="cusAddress"
                        value={formData.cusAddress || ""}
                        onChange={(e) => handleChange("cusAddress", e.target.value)}
                        placeholder="Nhập địa chỉ của khách hàng..."
                        readOnly={
                          (!!formData.cusPhone &&
                            initDataCustomer.some((c) => c.phone === formData.cusPhone)) ||
                          editingBooking
                        }
                      />
                      {errors.cusAddress && (
                        <p className="text-red-500 text-xs sm:text-sm">{errors.cusAddress}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Trạng thái (chỉ khi chỉnh sửa) */}
                {editingBooking && (
                  <div className="space-y-2">
                    <Label className="text-black" htmlFor="status">
                      Trạng thái
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value)}
                      // Thêm key để đảm bảo Select component được re-render khi formData.status thay đổi
                      key={formData.status}
                    >
                      <SelectTrigger className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2">
                        <SelectValue placeholder="Chọn trạng thái">
                          {/* Hiển thị giá trị đã chọn hoặc placeholder */}
                          {formData.status ?
                            (formData.status === "pending" ? "Chờ xác nhận" :
                              formData.status === "completed" ? "Hoàn thành" :
                                formData.status === "cancelled" ? "Hủy" :
                                  formData.status === "processing" ? "Đang xử lý" :
                                    formData.status === "confirmed" ? "Đã xác nhận" : "Chọn trạng thái")
                            : "Chọn trạng thái"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white text-black rounded-lg shadow-lg">
                        <SelectItem value="pending">Chờ xác nhận</SelectItem>
                        <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                        <SelectItem value="processing">Đang xử lý</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="cancelled">Hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {initDataService && (
                  <div className="space-y-2">
                    <Label className="text-black admin-dark:text-gray-100">Chọn dịch vụ*</Label>
                    <Select
                      value={formData.service || ""}
                      onValueChange={(value) => handleChange("service", value)}
                      key={formData.service}
                    >
                      <SelectTrigger className="w-full px-3 py-2 text-black rounded-lg shadow-sm focus:outline-none focus:ring-2 cursor-pointer border border-gray-400">
                        <SelectValue placeholder="Chọn dịch vụ" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-black rounded-lg shadow-lg">
                        {initDataService
                          .map((service, index) => (
                            <SelectItem
                              key={`${index}`}
                              value={String(service?.id ?? "")}
                              className="cursor-pointer px-3 py-2 hover:bg-blue-50"
                            >
                              {service?.translation?.ten_dich_vu || "Dịch vụ không tên"}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {errors.service && (
                      <p className="text-red-500 text-sm">{errors.service}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-black flex w-full items-center justify-between admin-dark:text-gray-100" htmlFor="price" >
                    <span>Giá *</span>
                    <span>Giá thấp nhất của dịch vụ: {Number(floorPriceOfservice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                  </Label>
                  <Input
                    type="text"
                    id="price"
                    className="text-black border border-black/30 admin-dark:text-gray-100"
                    value={formatCurrency(String(formData.price))}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="Nhập giá dịch vụ... không được thấp hơn giá thấp nhất của dịch vụ"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price}</p>
                  )}

                </div>


                {/* Dịch vụ + ngày đặt */}
                <div className="flex gap-4">
                  {/* Ngày đặt đơn */}
                  <div className="space-y-2 relative w-full">
                    <Label className="text-black admin-dark:text-gray-100">Ngày đặt đơn</Label>
                    <input
                      type="date"
                      value={formData.bookingDate || ""}
                      onChange={(e) => handleChange("bookingDate", e.target.value)}
                      className="w-full px-3 py-2 focus:outline-none admin-dark:border-gray-600 border admin-dark:text-gray-100 border-gray-950/30 rounded-lg text-black focus:ring-2 pr-10"
                    />
                    <Calendar
                      className="absolute right-3 top-[50%] text-gray-500 cursor-pointer"
                      size={18}
                      onClick={(e) => {
                        // focus input khi nhấn icon → trigger datepicker
                        e.currentTarget.previousSibling.showPicker?.();
                      }}
                    />
                    {errors.bookingDate && (
                      <p className="text-red-500 text-sm">{errors.bookingDate}</p>
                    )}
                  </div>

                  {/* Ngày bàn giao */}
                  <div className="space-y-2 relative w-full">
                    <Label className="text-black admin-dark:text-gray-100">Ngày bàn giao</Label>
                    <input
                      type="date"
                      value={formData.completedDate || ""}
                      onChange={(e) => handleChange("completedDate", e.target.value)}
                      className="w-full px-3 py-2 admin-dark:border-gray-600 admin-dark:text-gray-100 border border-gray-950/30 rounded-lg text-black focus:ring-2 pr-10 focus:outline-none"
                    />
                    <Calendar
                      className="absolute right-3 top-[50%] text-gray-500 cursor-pointer"
                      size={18}
                      onClick={(e) => {
                        // focus input khi nhấn icon → trigger datepicker
                        e.currentTarget.previousSibling.showPicker?.();
                      }}
                    />
                    {errors.completedDate && (
                      <p className="text-red-500 text-sm">{errors.completedDate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
              <Button
                type="submit"
                className="flex-1 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                {editingBooking ? "Cập nhật đơn đặt" : "Tạo đơn"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 text-xs text-white sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 admin-dark:hover:bg-black/40 hover:bg-gray-100 cursor-pointer"
              >
                Thoát
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
    </ScrollArea>
  );
}

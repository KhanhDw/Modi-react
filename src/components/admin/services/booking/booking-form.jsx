import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import CustomerCombobox from "./selectOldCustomer"


export default function BookingForm() {
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
  };

  const handleCheckCustomer = () => {
    const phone = formData.cusPhone?.trim();
    if (!phone) return;

    const existCustomer = initDataCustomer?.find((c) => c.phone === phone);
    if (existCustomer) {
      // Nếu có thì fill dữ liệu khách cũ
      setFormData({
        ...formData,
        cusName: existCustomer.customer_name,
        cusEmail: existCustomer.email,
        cusAddress: existCustomer.address,
        // có thể thêm các field khác nếu có
      });
    } else {
      // Nếu không có thì clear name/email/address để nhập mới
      setFormData({
        ...formData,
        cusName: "",
        cusEmail: "",
        cusAddress: "",
      });
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
    const isValid = validateForm(); // chỉ gọi 1 lần
    console.log("validate result:", isValid);

    if (!isValid) return;
    if (!editingBooking) {
      handleCreateBooking(formData);
    } else {
      handleEditingBooking(formData, editingBooking.id);
    }
  };

  return (
    <Card className="bg-white w-full mx-auto">
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 items-center">
          {editingBooking ? "Chỉnh sửa đơn đặt" : "Tạo đơn mới"}
        </CardTitle>
        <CardDescription className="text-black/50">
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
                >
                  Khách hàng cũ
                </Button>
                <Button
                  type="button"
                  variant={customerMode === "new" ? "default" : "outline"}
                  onClick={() => setCustomerMode("new")}
                >
                  Khách hàng mới
                </Button>
              </div>


              {customerMode === "existing" && (
                <div className="space-y-2">
                  <Label className="text-black">Khách hàng *</Label>
                  <CustomerCombobox
                    customers={initDataCustomer}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              )}




              {/* Số điện thoại */}
              <div className="space-y-2">
                <Label className="text-black" htmlFor="cusPhone">
                  Số điện thoại *
                </Label>
                <Input
                  className="text-black border border-black/30"
                  id="cusPhone"
                  value={formData.cusPhone || ""}
                  onChange={(e) => handleChange("cusPhone", e.target.value)}
                  onBlur={handleCheckCustomer}
                  placeholder="Nhập số điện thoại của khách hàng... "
                  // required={!editingBooking}
                  readOnly={editingBooking}
                />
                {errors.cusPhone && (
                  <p className="text-red-500 text-sm">{errors.cusPhone}</p>
                )}
              </div>
              {/* Tên khách hàng */}

              <div className="space-y-2">
                <Label className="text-black" htmlFor="cusName">
                  Tên khách hàng *
                </Label>
                <Input
                  className="text-black border border-black/30"
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
                    <Label className="text-black" htmlFor="cusEmail">
                      Email
                    </Label>
                    <Input
                      className="text-black border border-black/30"
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

                  <div className="space-y-2">
                    <Label className="text-black" htmlFor="cusAddress">
                      Địa chỉ *
                    </Label>
                    <Input
                      className="text-black border border-black/30"
                      id="cusAddress"
                      value={formData.cusAddress || ""}
                      onChange={(e) =>
                        handleChange("cusAddress", e.target.value)
                      }
                      placeholder="Nhập địa chỉ của khách hàng... "
                      readOnly={
                        (!!formData.cusPhone &&
                          initDataCustomer.some(
                            (c) => c.phone === formData.cusPhone
                          )) ||
                        editingBooking
                      }
                    />
                    {errors.cusAddress && (
                      <p className="text-red-500 text-sm">
                        {errors.cusAddress}
                      </p>
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
                  <Label className="text-black">Chọn dịch vụ*</Label>
                  <Select
                    value={formData.service || ""}
                    onValueChange={(value) => handleChange("service", value)}
                    key={formData.service}
                  >
                    <SelectTrigger className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2">
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
                <Label className="text-black" htmlFor="price">Giá *</Label>
                <Input
                  type="number"
                  id="price"
                  className="text-black border border-black/30"
                  value={formData.price || ""}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="Nhập giá dịch vụ..."
                  min="0"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>


              {/* Dịch vụ + ngày đặt */}
              <div className="flex gap-4">
                <div className="space-y-2 relative">
                  <Label className="text-black">Ngày đặt đơn</Label>
                  <input
                    type="date"
                    value={formData.bookingDate || ""}
                    onChange={(e) =>
                      handleChange("bookingDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-950/30 rounded-lg text-black focus:ring-2 pr-10"
                  // required
                  />
                  {errors.bookingDate && (
                    <p className="text-red-500 text-sm">{errors.bookingDate}</p>
                  )}
                </div>
                <div className="space-y-2 relative">
                  <Label className="text-black">Ngày bàn giao</Label>
                  <input
                    type="date"
                    value={formData.completedDate || ""}
                    onChange={(e) =>
                      handleChange("completedDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-950/30 rounded-lg text-black focus:ring-2 pr-10"
                  // required
                  />
                  {errors.completedDate && (
                    <p className="text-red-500 text-sm">
                      {errors.completedDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="submit" className="flex-1 hover:bg-gray-500/25">
              {editingBooking ? "Cập nhật đơn đặt" : "Tạo đơn"}
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
  );
}

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function BookingForm() {
  const {
    initDataService,
    initDataCustomer,
    handleClose,
    editingBooking,
    handleCreateBooking,
    handleEditingBooking,
  } = useOutletContext();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

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
        cusName: editingBooking.name || "",
        cusPhone: editingBooking.phone || "",
        cusEmail: editingBooking.email || "",
        cusAddress: editingBooking.address || "",
        service: editingBooking.service_id
          ? editingBooking.service_id.toString()
          : "",
        status: editingBooking.status || "",
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
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleCheckCustomer = () => {
    const phone = formData.cusPhone?.trim();
    if (!phone) return;

    const existCustomer = initDataCustomer?.find((c) => c.phone === phone);
    if (existCustomer) {
      setFormData({
        ...formData,
        cusName: existCustomer.name,
        cusEmail: existCustomer.email,
        cusAddress: existCustomer.address,
      });
    } else {
      setFormData({
        ...formData,
        cusName: "",
        cusEmail: "",
        cusAddress: "",
      });
    }
  };

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

    if (!formData.bookingDate) {
      newErrors.bookingDate = "Vui lòng chọn ngày đặt.";
    }

    if (!formData.completedDate) {
      newErrors.completedDate = "Vui lòng chọn ngày hoàn thành.";
    }
    if (formData.completedDate) {
      if (new Date(formData.completedDate) < new Date(formData.bookingDate)) {
        newErrors.completedDate = "Ngày hoàn thành phải sau ngày đặt.";
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
    <Card className="w-full mx-auto bg-white border border-gray-300 rounded-lg">
      <CardHeader className="px-2 sm:px-4">
        <CardTitle className="flex flex-col sm:flex-row gap-2 items-start sm:items-center text-base sm:text-lg md:text-xl font-bold text-gray-900">
          {editingBooking ? "Chỉnh sửa đơn đặt" : "Tạo đơn mới"}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm mt-1 text-gray-600">
          {editingBooking
            ? "Cập nhật thông tin đơn đặt"
            : "Điền thông tin để tạo đơn mới"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col space-y-2">
              <Label className="text-xs sm:text-sm text-gray-900" htmlFor="cusPhone">
                Số điện thoại *
              </Label>
              <Input
                className="text-xs sm:text-sm w-full border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                id="cusPhone"
                value={formData.cusPhone || ""}
                onChange={(e) => handleChange("cusPhone", e.target.value)}
                onBlur={handleCheckCustomer}
                placeholder="Nhập số điện thoại của khách hàng..."
                readOnly={editingBooking}
              />
              {errors.cusPhone && (
                <p className="text-red-500 text-xs sm:text-sm">{errors.cusPhone}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Label className="text-xs sm:text-sm text-gray-900" htmlFor="cusName">
                Tên khách hàng *
              </Label>
              <Input
                className="text-xs sm:text-sm w-full border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                id="cusName"
                value={formData.cusName || ""}
                onChange={(e) => handleChange("cusName", e.target.value)}
                placeholder="Nhập Họ và Tên khách hàng..."
                readOnly={
                  (!!formData.cusPhone &&
                    initDataCustomer.some((c) => c.phone === formData.cusPhone)) ||
                  editingBooking
                }
              />
              {errors.cusName && (
                <p className="text-red-500 text-xs sm:text-sm">{errors.cusName}</p>
              )}
            </div>

            {!editingBooking && (
              <>
                <div className="flex flex-col space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-900" htmlFor="cusEmail">
                    Email
                  </Label>
                  <Input
                    className="text-xs sm:text-sm w-full border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                    id="cusEmail"
                    value={formData.cusEmail || ""}
                    onChange={(e) => handleChange("cusEmail", e.target.value)}
                    placeholder="Nhập email của khách hàng..."
                    readOnly={
                      (!!formData.cusPhone &&
                        initDataCustomer.some((c) => c.phone === formData.cusPhone)) ||
                      editingBooking
                    }
                  />
                  {errors.cusEmail && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors.cusEmail}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-900" htmlFor="cusAddress">
                    Địa chỉ *
                  </Label>
                  <Input
                    className="text-xs sm:text-sm w-full border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
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

            {editingBooking && (
              <div className="flex flex-col space-y-2">
                <Label className="text-xs sm:text-sm text-gray-900" htmlFor="status">
                  Trạng thái
                </Label>
                <Select
                  value={formData.status || ""}
                  onValueChange={(value) => handleChange("status", value)}
                  key={formData.status}
                >
                  <SelectTrigger className="w-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md text-gray-900">
                    <SelectValue placeholder="Chọn trạng thái">
                      {formData.status === "pending"
                        ? "Chưa hoàn thành"
                        : formData.status === "completed"
                        ? "Hoàn thành"
                        : formData.status === "cancelled"
                        ? "Hủy"
                        : "Chọn trạng thái"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="text-xs sm:text-sm border border-gray-300 rounded-md bg-white">
                    <SelectItem value="pending">Chưa hoàn thành</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {initDataService && (
              <div className="flex flex-col space-y-2">
                <Label className="text-xs sm:text-sm text-gray-900">Chọn dịch vụ *</Label>
                <Select
                  value={formData.service || ""}
                  onValueChange={(value) => handleChange("service", value)}
                  key={formData.service}
                >
                  <SelectTrigger className="w-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md text-gray-900">
                    <SelectValue placeholder="Chọn dịch vụ" />
                  </SelectTrigger>
                  <SelectContent className="text-xs sm:text-sm border border-gray-300 rounded-md bg-white">
                    {initDataService.map((service) => (
                      <SelectItem
                        key={service.service_id}
                        value={service.service_id.toString()}
                        className="px-2 sm:px-3 py-1 sm:py-2"
                      >
                        {service.ten_dich_vu}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service && (
                  <p className="text-red-500 text-xs sm:text-sm">{errors.service}</p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex flex-col space-y-2 flex-1">
                <Label className="text-xs sm:text-sm text-gray-900">Ngày đặt đơn</Label>
                <input
                  type="date"
                  value={formData.bookingDate || ""}
                  onChange={(e) => handleChange("bookingDate", e.target.value)}
                  className="w-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md text-gray-900"
                />
                {errors.bookingDate && (
                  <p className="text-red-500 text-xs sm:text-sm">{errors.bookingDate}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2 flex-1">
                <Label className="text-xs sm:text-sm text-gray-900">Ngày Hoàn thành</Label>
                <input
                  type="date"
                  value={formData.completedDate || ""}
                  onChange={(e) => handleChange("completedDate", e.target.value)}
                  className="w-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md text-gray-900"
                />
                {errors.completedDate && (
                  <p className="text-red-500 text-xs sm:text-sm">{errors.completedDate}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            <Button
              type="submit"
              className="flex-1 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              {editingBooking ? "Cập nhật đơn đặt" : "Tạo đơn"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 text-xs text-white sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border border-gray-300  hover:bg-gray-100"
            >
              Thoát
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
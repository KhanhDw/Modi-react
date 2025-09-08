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
    handleClose,
    editingBooking,
    handleCreateBooking,
    handleEditingBooking,
  } = useOutletContext();
  const [formData, setFormData] = useState({});

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
      });
    } else {
      // nếu tạo mới thì gán mặc định = hôm nay
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, bookingDate: today }));
    }
  }, [editingBooking, initDataService]); // Thêm initDataService vào dependency

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  console.log(editingBooking);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingBooking) {
      handleCreateBooking(formData);
    } else {
      handleEditingBooking(formData, editingBooking.id);
    }
  };

  return (
    <>
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <div className="gap-4">
              <div className="space-y-4">
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
                    required={!editingBooking}
                    readOnly={editingBooking}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="cusPhone">
                    Số điện thoại *
                  </Label>
                  <Input
                    className="text-black border border-black/30"
                    id="cusPhone"
                    value={formData.cusPhone || ""}
                    onChange={(e) => handleChange("cusPhone", e.target.value)}
                    placeholder="Nhập số điện thoại của khách hàng... "
                    required={!editingBooking}
                    readOnly={editingBooking}
                  />
                </div>
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
                        onChange={(e) =>
                          handleChange("cusEmail", e.target.value)
                        }
                        placeholder="Nhập email của khách hàng... "
                      />
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
                      />
                    </div>
                  </>
                )}

                {editingBooking && (
                  <div className="space-y-2">
                    <Label className="text-black" htmlFor="status">
                      Trạng thái
                    </Label>
                    <Select
                      value={formData.status || ""}
                      onValueChange={(value) => handleChange("status", value)}
                      key={formData.status}
                    >
                      <SelectTrigger className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2">
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

                      <SelectContent className="bg-white text-black rounded-lg shadow-lg">
                        <SelectItem value="pending">Chưa hoàn thành</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="cancelled">Hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex gap-4">
                  {initDataService && (
                    <div className="space-y-2 flex-1">
                      <Label className="text-black">Chọn dịch vụ*</Label>
                      <Select
                        value={formData.service || ""}
                        onValueChange={(value) =>
                          handleChange("service", value)
                        }
                        key={formData.service}
                      >
                        <SelectTrigger className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2">
                          <SelectValue placeholder="Chọn dịch vụ" />
                        </SelectTrigger>

                        <SelectContent className="bg-white text-black rounded-lg shadow-lg">
                          {initDataService.map((service) => (
                            <SelectItem
                              key={service.id}
                              value={service.id.toString()} // Đảm bảo value là string
                              className="cursor-pointer px-3 py-2 hover:bg-blue-50"
                            >
                              {service.ten_dich_vu}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2 relative">
                    <Label className="text-black">Ngày đặt đơn</Label>
                    <input
                      type="date"
                      value={formData.bookingDate || ""}
                      onChange={(e) =>
                        handleChange("bookingDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-950/30 rounded-lg text-black focus:ring-2 pr-10"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4"></div>
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
    </>
  );
}

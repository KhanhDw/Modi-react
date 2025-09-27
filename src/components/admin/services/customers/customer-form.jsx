import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function CustomerForm() {
  const {
    handleClose,
    editingCustomer,
    handleEditingCustomer,
    initDataCustomer,
  } = useOutletContext();

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        cusName: editingCustomer.name || "",
        cusPhone: editingCustomer.phone || "",
        cusEmail: editingCustomer.email || "",
        cusAddress: editingCustomer.address || "",
      });
    }
  }, [editingCustomer]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Tên bắt buộc
    if (!formData.cusName?.trim()) {
      newErrors.cusName = "Tên khách hàng là bắt buộc.";
    }

    // Số điện thoại
    if (!formData.cusPhone?.trim()) {
      newErrors.cusPhone = "Số điện thoại là bắt buộc.";
    } else if (!/^0\d{9}$/.test(formData.cusPhone.trim())) {
      newErrors.cusPhone = "Số điện thoại phải bắt đầu bằng 0 và gồm 10 số.";
    } else if (
      initDataCustomer?.some(
        (c) =>
          c.phone === formData.cusPhone.trim() && c.id !== editingCustomer?.id // bỏ qua chính khách hàng đang edit
      )
    ) {
      newErrors.cusPhone = "Số điện thoại đã tồn tại.";
    }

    // Email (nếu nhập thì validate + check trùng)
    if (formData.cusEmail?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.cusEmail.trim())) {
        newErrors.cusEmail = "Email không hợp lệ.";
      } else if (
        initDataCustomer?.some(
          (c) =>
            c.email === formData.cusEmail.trim() && c.id !== editingCustomer?.id
        )
      ) {
        newErrors.cusEmail = "Email đã tồn tại.";
      }
    }

    // Địa chỉ bắt buộc
    if (!formData.cusAddress?.trim()) {
      newErrors.cusAddress = "Địa chỉ là bắt buộc.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editingCustomer) {
        handleEditingCustomer(formData, editingCustomer.id);
      }
    }
  };

  return (
    <Card className="bg-white w-full mx-auto">
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 items-center">
          Chỉnh sửa người dùng
        </CardTitle>
        <CardDescription className="text-black/50">
          Cập nhật thông tin người dùng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="gap-4">
            <div className="space-y-4">
              {/* Tên */}
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
                />
                {errors.cusName && (
                  <p className="text-red-500 text-sm">{errors.cusName}</p>
                )}
              </div>

              {/* SĐT */}
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
                />
                {errors.cusPhone && (
                  <p className="text-red-500 text-sm">{errors.cusPhone}</p>
                )}
              </div>

              {/* Email */}
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
                />
                {errors.cusEmail && (
                  <p className="text-red-500 text-sm">{errors.cusEmail}</p>
                )}
              </div>

              {/* Địa chỉ */}
              <div className="space-y-2">
                <Label className="text-black" htmlFor="cusAddress">
                  Địa chỉ *
                </Label>
                <Input
                  className="text-black border border-black/30"
                  id="cusAddress"
                  value={formData.cusAddress || ""}
                  onChange={(e) => handleChange("cusAddress", e.target.value)}
                  placeholder="Nhập địa chỉ của khách hàng... "
                />
                {errors.cusAddress && (
                  <p className="text-red-500 text-sm">{errors.cusAddress}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="submit" className="flex-1 hover:bg-gray-500/25 cursor-pointer">
              Cập nhật người dùng
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 cursor-pointer"
            >
              Thoát
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

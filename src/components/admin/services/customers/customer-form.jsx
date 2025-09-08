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

export default function CustomerForm() {
  const { handleClose, editingCustomer, handleEditingCustomer } =
    useOutletContext();
  const [formData, setFormData] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      handleEditingCustomer(formData, editingCustomer.id);
    }
  };

  return (
    <>
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
                    required
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
                    required
                  />
                </div>
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
                </div>
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
                </div>
                {/* {editingCustomer && (
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
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent className="bg-white text-black rounded-lg shadow-lg">
                        <SelectItem value="pending">Chưa hoàn thành</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="cancelled">Hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )} */}
              </div>
              <div className="space-y-4"></div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="submit" className="flex-1 hover:bg-gray-500/25">
                Cập nhật người dùng
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

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit, Trash2, MoreHorizontal, Car } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function ServiceTable({ services, onSubmit, onCancel }) {
  // const [formData, setFormData] = useState({
  //   ten_dich_vu: "",
  //   mo_ta: "",
  // });

  // // Reset form khi service thay đổi hoặc khi chuyển sang chế độ thêm mới
  // useEffect(() => {
  //   if (service) {
  //     setFormData({
  //       ten_dich_vu: service.ten_dich_vu || "",
  //       mo_ta: service.mo_ta || "",
  //     });
  //   } else {
  //     // Reset form về trống khi không có service (chế độ thêm mới)
  //     setFormData({ ten_dich_vu: "", mo_ta: "" });
  //   }
  // }, [service]);

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!formData.ten_dich_vu.trim()) {
  //     alert("Vui lòng nhập tên dịch vụ");
  //     return;
  //   }
  //   onSubmit(formData);
  //   // Không reset form sau submit để giữ dữ liệu cho lần tiếp theo
  // };

  // const handleCancel = () => {
  //   if (!service) {
  //     // Reset form khi hủy thêm mới
  //     setFormData({ ten_dich_vu: "", mo_ta: "" });
  //   }
  //   onCancel();
  // };

  return (
    <Card className="bg-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách dịch vụ</CardTitle>
            <CardDescription className="text-gray-600">
              Quản lý tất cả dịch vụ
            </CardDescription>
          </div>
          {/* Code more for search, filter */}
          <div className="flex items-center gap-2">
            <div className="relative bg-white rounded-md shadow-sm text-black">
              <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm dịch vụ..." className="pl-10 w-64" />
            </div>
            {/* <Select>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả</SelectItem>
                <SelectItem value="">Đang hoạt động </SelectItem>
                <SelectItem value="">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-black">
        <div className="rounded-md border border-gray-300 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Tên dịch vụ</TableHead>
                <TableHead className="text-black">Mô tả</TableHead>
                <TableHead className="text-black">Giá</TableHead>
                <TableHead className="text-black">Trạng thái</TableHead>
                <TableHead className="text-black">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Example data, replace with actual data */}
              {services.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.desc}</TableCell>
                  <TableCell>{`₫${item.price.toLocaleString()}`}</TableCell>
                  <TableCell>
                    {/* {item.status ? ( */}
                    <Badge className="bg-green-500">Hoạt động</Badge>
                    {/* // ) : (
                  //   <Badge className="bg-red-500">Ngừng hoạt động</Badge>
                  // )} */}
                  </TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* Add more actions here */}
                        <DropdownMenuItem onClick={() => console.log("Edit")}>
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Edit")}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Delete")}>
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

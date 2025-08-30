import { useState, useEffect, use } from "react";
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
import { Search, MoreHorizontal, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useOutletContext } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ServiceTable() {
  const {
    initDataService,
    openEditServiceForm,
    handleEditService,
    viewDetail,
    handleDeleteService,
  } = useOutletContext();
  const [search, setSearch] = useState("");

  const filteredService = initDataService.filter((service) =>
    service.ten_dich_vu.toLowerCase().includes(search.toLowerCase())
  );
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
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm dịch vụ..."
                className="pl-10 w-64"
              />
            </div>
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
              {filteredService.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.ten_dich_vu}</TableCell>
                  <TableCell>{item.mo_ta}</TableCell>
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
                        <DropdownMenuItem
                          onClick={() => console.log("View Detail")}
                        >
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditServiceForm(item)}
                        >
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteService(item.id)}
                        >
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

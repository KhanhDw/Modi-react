import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useLenisLocal from "@/hook/useLenisLocal";

export default function TopSpendingCustomers({ initDataCustomer }) {
  useLenisLocal(".lenis-local-top-customers");

  const topCustomers = [...initDataCustomer]
    .filter((customer) => (customer.total_spent || 0) > 0)
    .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
    .slice(0, 20); // Display top 20 customers

  return (
    <Card
      className="bg-white rounded-xl shadow-md shadow-gray-300/50 border border-[#e5e7eb]
        admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
    >
      <CardHeader>
        <CardTitle className="text-gray-900 admin-dark:text-gray-100">
          Khách hàng chi tiêu hàng đầu
        </CardTitle>
        <CardDescription className="text-[#5ea25e] admin-dark:text-green-400">
          Danh sách khách hàng có tổng chi tiêu cao nhất.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          data-lenis-prevent
          className="max-h-[400px] overflow-y-auto scrollbar-hide overscroll-y-auto lenis-local-top-customers"
        >
          <Table>
            <TableHeader>
              <TableRow className="admin-dark:border-gray-700">
                <TableHead className="text-black admin-dark:text-white">
                  STT
                </TableHead>
                <TableHead className="text-black admin-dark:text-white">
                  Tên
                </TableHead>
                <TableHead className="text-black admin-dark:text-white">
                  SĐT
                </TableHead>
                <TableHead className="text-black admin-dark:text-white text-right">
                  Đã chi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer, index) => (
                <TableRow key={customer.id} className="admin-dark:border-gray-700">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    {Number(customer.total_spent || 0).toLocaleString("vi-VN")}{" "}
                    ₫
                  </TableCell>
                </TableRow>
              ))}
              {topCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan="4" className="h-24 text-center">
                    Chưa có dữ liệu chi tiêu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import Pagination from "@/components/admin/services/utils/Pagination.jsx"; // import component pagination
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";

export default function DailyRevenueTable({ data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // số dòng mỗi trang

    const totalPages = Math.ceil(data.length / pageSize);

    const pagedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [currentPage, data]);

    return (
        <Card className="bg-white admin-dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 admin-dark:border-gray-700">
            <CardHeader>
                <CardTitle className="text-gray-900 admin-dark:text-white">Doanh thu theo ngày</CardTitle>
                <CardDescription className="text-gray-600 admin-dark:text-gray-400">
                    Bảng hiển thị chi tiết các booking đã hoàn tất, tổng hợp theo ngày
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className={'text-gray-500 admin-dark:text-gray-200'}>STT</TableHead>
                            <TableHead className={'text-gray-500 admin-dark:text-gray-200'}>Ngày</TableHead>
                            <TableHead className={'text-gray-500 admin-dark:text-gray-200'}>Dịch vụ</TableHead>
                            <TableHead className={'text-gray-500 admin-dark:text-gray-200'}>Khách hàng</TableHead>
                            <TableHead className={'text-gray-500 admin-dark:text-gray-200'}>Số điện thoại</TableHead>
                            <TableHead className={'text-gray-500 admin-dark:text-gray-200'}>Doanh thu</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagedData.length > 0 ? (
                            pagedData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                    <TableCell>{new Date(item.completed_date).toLocaleDateString("vi-VN")}</TableCell>
                                    <TableCell>{item.service_name}</TableCell>
                                    <TableCell>{item.customer_name}</TableCell>
                                    <TableCell>{item.phone}</TableCell>
                                    <TableCell>
                                        {Number(item.total).toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-500 admin-dark:text-gray-400">
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

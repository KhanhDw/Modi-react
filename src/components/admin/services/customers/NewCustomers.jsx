import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import useLenisLocal from "@/hook/useLenisLocal";

// Hàm format thời gian tương đối
function formatRelativeTime(dateString) {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now - created;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return `${diffDays} ngày trước`;
}

export default function NewCustomers({ initDataCustomer, initDataBooking }) {
  const containerRef = useRef(null);
  const [shouldPrevent, setShouldPrevent] = useState(false);

  useLenisLocal(".lenis-local");

  const sortCustomersByCreatedAt = initDataCustomer
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20); // lấy 20 khách hàng mới nhất

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const hasScroll = el.scrollHeight > el.clientHeight;
    setShouldPrevent(hasScroll);
  }, [sortCustomersByCreatedAt]);

  return (
    <Card
      className="bg-white rounded-xl shadow-md shadow-gray-300/50 border border-[#e5e7eb]
        admin-dark:bg-gray-800 admin-dark:border-gray-700 admin-dark:shadow-gray-900/50"
    >
      <div className="px-2 sm:px-5">
        <CardTitle className="text-gray-900 admin-dark:text-gray-100">
          Khách hàng mới
        </CardTitle>
        <CardDescription className="text-[#5ea25e] admin-dark:text-green-400 mt-1">
          Danh sách khách hàng mới nhất trong tháng
        </CardDescription>
      </div>

      <CardContent className="space-y-2 mt-1">
        <div
          ref={containerRef}
          className="space-y-2 scrollbar-hide max-h-100 overflow-y-auto overscroll-y-auto lenis-local"
          {...(shouldPrevent ? { "data-lenis-prevent": true } : {})}
        >
          {sortCustomersByCreatedAt
            .filter((c) => c.status === "active")
            .map((customer, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row md:flex-col xl:flex-row items-center justify-between gap-2 p-3 border border-gray-300 rounded-md bg-gray-50 admin-dark:bg-gray-700 admin-dark:border-gray-600 w-full"
              >
                <div className="flex flex-col items-start w-full">
                  <p className="font-medium text-xs lg:text-sm text-black admin-dark:text-gray-200">
                    {customer.name}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500 admin-dark:text-gray-400">
                    {customer.email || "Chưa có email"}
                  </p>
                </div>

                <div className="flex items-center justify-start sm:justify-end md:justify-start xl:justify-end gap-5 w-full">
                  <Badge
                    variant="secondary"
                    className="bg-blue-200 shadow text-blue-700 px-2 py-1 admin-dark:bg-blue-900 admin-dark:text-gray-200"
                  >
                    {
                      initDataBooking.filter(
                        (o) =>
                          o.status !== "cancelled" &&
                          o.customer_id === customer.id
                      ).length
                    }
                    <span className="ml-1 text-xs">đơn</span>
                  </Badge>

                  <div className="text-right">
                    <p className="text-xs font-medium text-[#5ea25e] admin-dark:text-green-400">
                      {formatRelativeTime(customer.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {sortCustomersByCreatedAt.length === 0 && (
          <p className="text-xs text-gray-500 admin-dark:text-gray-400">
            Chưa có khách hàng mới
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Sprout, DollarSign, TrendingUp } from "lucide-react";

export default function KpiCards({
  contacts,
  contactsLastMonth,
  bookingCount,
  bookingRevenue,
  visits,
  visitsLastMonth,
}) {
  let contactsChange = "N/A";
  if (contacts !== null && contactsLastMonth !== null) {
    if (contactsLastMonth === 0) {
      if (contacts === 0) {
        contactsChange = "0%";
      } else {
        contactsChange = `tăng +${contacts} lượt`;
      }
    } else {
      const percent =
        ((contacts - contactsLastMonth) / contactsLastMonth) * 100;
      contactsChange = `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`;
    }
  }
  // =============================
  // tính lượt Đơn đặt va doanh thu trong tháng
  // =============================

  console.log(bookingRevenue);
  let bookingChange = "N/A";
  if (
    bookingCount.totalBefore !== undefined &&
    bookingCount.totalCurrent !== undefined
  ) {
    if (bookingCount.totalCurrent > bookingCount.totalBefore) {
      bookingChange = `Tăng ${
        bookingCount.totalCurrent - bookingCount.totalBefore
      } đơn đặt`;
    } else if (bookingCount.totalCurrent < bookingCount.totalBefore) {
      bookingChange = `Giảm ${
        bookingCount.totalBefore - bookingCount.totalCurrent
      } đơn đặt`;
    } else {
      bookingChange = `Không thay đổi`;
    }
  }

  let bookingChangeRevenue = "N/A";

  function formatLargeNumber(num) {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
    return num.toString();
  }

  const revenueCurrent = Number(bookingRevenue.revenueCurrent);
  const revenueBefore = Number(bookingRevenue.revenueBefore);

  if (revenueBefore === 0 && revenueCurrent > 0) {
    bookingChangeRevenue = `Tăng 100%`;
  } else if (revenueBefore > 0) {
    const percent = ((revenueCurrent - revenueBefore) / revenueBefore) * 100;
    if (percent > 0) bookingChangeRevenue = `Tăng ${percent.toFixed(1)}%`;
    else if (percent < 0)
      bookingChangeRevenue = `Giảm ${Math.abs(percent).toFixed(1)}%`;
    else bookingChangeRevenue = "Không thay đổi";
  }
  const formattedRevenue = formatLargeNumber(revenueCurrent);

  // =============================
  // tính lượt truy cập trong tháng
  // =============================

  let visitsChange = "N/A";
  if (visits !== null && visitsLastMonth !== null) {
    if (visitsLastMonth === 0) {
      if (visits === 0) {
        visitsChange = "0%";
      } else {
        visitsChange = `tăng +${visits} lượt`;
      }
    } else {
      const percent = ((visits - visitsLastMonth) / visitsLastMonth) * 100;
      visitsChange = `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`;
    }
  }

  const cards = [
    {
      title: "Liên hệ tháng này",
      value: contacts !== null ? contacts : "...",
      change: contactsChange,
      icon: MessageSquare,
    },
    {
      title: "Đơn đặt website tháng này",
      value: bookingCount.totalCurrent ?? 0,
      change: bookingChange,
      icon: Sprout,
    },
    {
      title: "Doanh thu tháng này",
      value: formattedRevenue ?? 0,
      change: bookingChangeRevenue,
      icon: DollarSign,
    },
    {
      title: "Lượt khách truy cập tháng này",
      value: visits !== null ? visits : "...",
      change: visitsChange,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map(({ title, value, change, icon: Icon }, i) => (
        <Card
          key={i}
          className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-800 admin-dark:text-gray-100">
              {title}
            </CardTitle>
            <Icon className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 admin-dark:text-gray-100">
              {value}
            </div>
            <p className="text-xs text-gray-500 admin-dark:text-gray-400">
              <span
                className={
                  change.startsWith("-")
                    ? "text-red-600 admin-dark:text-red-400"
                    : "text-green-600 admin-dark:text-green-400"
                }
              >
                {change} so với tháng trước
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

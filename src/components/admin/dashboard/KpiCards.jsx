import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Sprout, DollarSign, TrendingUp } from "lucide-react";

// Helper: format số lớn (2300000 -> 2.3M)
function formatLargeNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + " triệu";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "nghìn";
  return num.toString();
}

function formatCurrency(number) {
  // Chuyển số thành chuỗi và sử dụng biểu thức chính quy
  // để chèn dấu phẩy (,) sau mỗi 3 chữ số từ cuối lên.
  // Điều này hoạt động cho định dạng tiếng Anh/Mỹ.
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Helper: format % thay đổi
function formatChange(current, before, unit = "") {
  if (before === 0) {
    if (current === 0) return "0";
    const formattedCurrent = formatCurrency(current);
    return `tăng +${formattedCurrent}${unit}`;
  }
  const percent = ((current - before) / before) * 100;
  if (percent > 0) return `Tăng ${percent.toFixed(1)}%`;
  if (percent < 0) return `Giảm ${Math.abs(percent).toFixed(1)}%`;
  return "Không thay đổi";
}

export default function KpiCards({
  contacts,
  contactsLastMonth,
  bookingCount,
  bookingRevenue,
  visits,
  visitsLastMonth,
}) {
  // Liên hệ
  const contactsChange = formatChange(
    contacts ?? 0,
    contactsLastMonth ?? 0,
    " lượt"
  );

  // Đơn hàng
  const bookingChange = formatChange(
    bookingCount?.totalCurrent ?? 0,
    bookingCount?.totalBefore ?? 0,
    " đơn"
  );

  // Doanh thu
  const revenueCurrent = Number(bookingRevenue?.revenueCurrent ?? 0);
  const revenueBefore = Number(bookingRevenue?.revenueBefore ?? 0);
  const bookingChangeRevenue = formatChange(revenueCurrent, revenueBefore);
  const formattedRevenue = formatLargeNumber(revenueCurrent);

  // Truy cập
  const visitsChange = formatChange(visits ?? 0, visitsLastMonth ?? 0, " lượt");

  const cards = [
    {
      title: "Liên hệ tháng này",
      value: contacts ?? "...",
      change: contactsChange,
      icon: MessageSquare,
    },
    {
      title: "Đơn hàng tháng này",
      value: bookingCount?.totalCurrent ?? 0,
      change: bookingChange,
      icon: Sprout,
    },
    {
      title: "Doanh thu tháng này",
      value: formattedRevenue,
      change: bookingChangeRevenue,
      icon: DollarSign,
    },
    {
      title: "Lượt khách truy cập tháng này",
      value: visits ?? "...",
      change: visitsChange,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      {cards.map(({ title, value, change, icon: Icon }, i) => {
        const isNeutral = change === "Không thay đổi" || change === "N/A";
        const isNegative = change.startsWith("Giảm") || change.startsWith("-");
        const textColor = isNeutral
          ? "text-gray-500 admin-dark:text-gray-400"
          : isNegative
          ? "text-red-600 admin-dark:text-red-400"
          : "text-green-600 admin-dark:text-green-400";

        return (
          <Card
            key={i}
            className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 shadow-sm p-3 sm:p-4"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-800 admin-dark:text-gray-100 line-clamp-2">
                {title}
              </CardTitle>
              <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 admin-dark:text-gray-400 flex-shrink-0 ml-1" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-lg sm:text-2xl font-bold text-gray-800 admin-dark:text-gray-100">
                {value}
              </div>
              <p className="text-xs mt-1 sm:mt-2">
                <span className={textColor}>{change}</span>
                <span className="text-gray-500 admin-dark:text-gray-400 text-xs hidden sm:inline">
                  {" "}
                  so với tháng trước
                </span>
                <span className="text-gray-500 admin-dark:text-gray-400 text-xs sm:hidden">
                  {" "}
                  vs T.trước
                </span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function RevenueChart({ bookings }) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: `T${i + 1}`,
    revenue: 0,
  }));

  bookings.forEach((b) => {
    if (b.status === "completed" && b.price && b.created_at) {
      const revenue = parseFloat(b.price) || 0;
      const monthIndex = new Date(b.created_at).getMonth(); // 0 - 11
      months[monthIndex].revenue += revenue;
    }
  });

  return (
    <Card className="bg-white text-gray-900 border border-gray-200 admin-dark:border-gray-700 admin-dark:bg-gray-900 admin-dark:text-gray-100">
      <CardHeader>
        <CardTitle className="text-base sm:text-[18px] md:text-xl font-bold text-gray-900 admin-dark:text-gray-100">
          Doanh thu trong 12 tháng
        </CardTitle>
        <CardDescription className={"admin-dark:text-gray-400"}>
          Biểu đồ doanh thu theo tháng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <LineChart data={months}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="opacity-20"
            />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `${v / 1000000}M`} />
            <Tooltip
              formatter={(value) => [`${value.toLocaleString()}`, "Doanh thu"]}
              labelFormatter={(label) => {
                label = label.slice(1);
                return "Tháng " + label;
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect, useRef } from "react";
import PageHeader from "../../components/admin/common/PageHeader";
import Chart from "chart.js/auto";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    tinTuc: 0,
    tuyenDung: 0,
    lienHe: 0,
    dailyContacts: Array(31).fill(0),
  });

  const chartRef = useRef(null);
  const canvasRef = useRef(null); // Add ref for canvas to ensure it exists

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tinTucRes, tuyenDungRes, lienHeRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/tintuc`),
          fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/tuyendung`),
          fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/lienhe`),
        ]);

        const [tinTucData, tuyenDungData, lienHeData] = await Promise.all([
          tinTucRes.json(),
          tuyenDungRes.json(),
          lienHeRes.json(),
        ]);

        console.log("Dữ liệu lienHe:", lienHeData);

        setStats((prevStats) => {
          const newDailyContacts = calculateDailyContacts(lienHeData);
          const isDailyContactsEqual = prevStats.dailyContacts.every(
            (value, index) => value === newDailyContacts[index]
          );

          if (
            prevStats.tinTuc === tinTucData.length &&
            prevStats.tuyenDung === tuyenDungData.length &&
            prevStats.lienHe === lienHeData.length &&
            isDailyContactsEqual
          ) {
            return prevStats;
          }

          return {
            tinTuc: tinTucData.length,
            tuyenDung: tuyenDungData.length,
            lienHe: lienHeData.length,
            dailyContacts: newDailyContacts,
          };
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchStats();
    // Optional: Add setInterval for periodic updates
    // const interval = setInterval(fetchStats, 30000);
    // return () => clearInterval(interval);
  }, []); // Empty dependency array

  const calculateDailyContacts = (data) => {
    const dailyCounts = Array(31).fill(0);
    const currentMonth = new Date().getMonth() + 1; // August is 8
    const currentYear = new Date().getFullYear(); // 2025

    data.forEach((item) => {
      const itemDate = new Date(item.ngay_gui);
      if (itemDate && !isNaN(itemDate.getTime())) {
        // console.log("Ngày gửi:", item.ngay_gui, "Parsed:", itemDate);
        if (
          itemDate.getMonth() + 1 === currentMonth &&
          itemDate.getFullYear() === currentYear
        ) {
          const day = itemDate.getDate() - 1; // 0-based index
          if (day >= 0 && day < 31) {
            dailyCounts[day]++;
          }
        }
      } else {
        console.log("Ngày không hợp lệ:", item.ngay_gui);
      }
    });

    // console.log("Daily Counts:", JSON.stringify(dailyCounts)); // Improved logging
    return dailyCounts;
  };

  useEffect(() => {
    // Ensure canvas exists before initializing chart
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (!chartRef.current) {
      chartRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Array.from({ length: 31 }, (_, i) => i + 1),
          datasets: [
            {
              label: "Số khách hàng liên hệ",
              data: stats.dailyContacts,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Số lượng khách hàng", font: { size: 12 } },
              ticks: { font: { size: 10 } },
            },
            x: {
              title: { display: true, text: "Ngày trong tháng", font: { size: 12 } },
              ticks: { font: { size: 10 } },
            },
          },
          plugins: {
            legend: { display: false },
          },
        },
      });
    } else {
      chartRef.current.data.datasets[0].data = stats.dailyContacts;
      chartRef.current.update();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null; // Ensure chart is fully cleared
      }
    };
  }, [stats.dailyContacts]);

  return (
    <div className="p-6">
      <PageHeader title="Tổng quan hệ thống" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Tin tức", value: stats.tinTuc, icon: "" },
          { label: "Tuyển dụng", value: stats.tuyenDung, icon: "" },
          { label: "Liên hệ", value: stats.lienHe, icon: "" },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <span className="text-3xl mr-4">{stat.icon}</span>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê tổng quan</h2>
        <div className="chart-container" style={{ width: "100%", height: "200px" }}>
          <canvas id="statsChart" ref={canvasRef}></canvas>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/managers/news" className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-medium">Viết tin tức</div>
          </a>
          <a href="/managers/recruitment" className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="text-2xl mb-2">💼</div>
            <div className="font-medium">Đăng tuyển dụng</div>
          </a>
          <a href="/managers/contact" className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="text-2xl mb-2">👁️</div>
            <div className="font-medium">Xem liên hệ</div>
          </a>
        </div>
      </div>
    </div>
  );
}
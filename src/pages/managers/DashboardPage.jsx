import { useState, useEffect, useRef } from "react";
import PageHeader from "../../components/admin/common/PageHeader";
import Chart from "chart.js/auto";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    tinTuc: 0,
    tuyenDung: 0,
    lienHe: 0,
  });

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tinTucRes, tuyenDungRes, lienHeRes] = await Promise.all([
          fetch('http://localhost:3000/api/tintuc'),
          fetch('http://localhost:3000/api/tuyendung'),
          fetch('http://localhost:3000/api/lienhe'),
        ]);

        const [tinTucData, tuyenDungData, lienHeData] = await Promise.all([
          tinTucRes.json(),
          tuyenDungRes.json(),
          lienHeRes.json(),
        ]);

        setStats({
          tinTuc: tinTucData.length,
          tuyenDung: tuyenDungData.length,
          lienHe: lienHeData.length,
        });
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const ctx = document.getElementById('statsChart')?.getContext('2d');
    if (ctx) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Tin tức', 'Tuyển dụng', 'Liên hệ'],
          datasets: [{
            label: 'Số lượng',
            data: [stats.tinTuc, stats.tuyenDung, stats.lienHe],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          maintainAspectRatio: false, // Cho phép điều chỉnh kích thước thủ công
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Số lượng',
                font: { size: 12 } // Giảm kích thước font tiêu đề
              },
              ticks: { font: { size: 10 } } // Giảm kích thước font trục y
            },
            x: {
              ticks: { font: { size: 10 } } // Giảm kích thước font trục x
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [stats]);

  return (
    <div className="p-6">
      <PageHeader title="Tổng quan hệ thống" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Tin tức", value: stats.tinTuc, icon: "📰" },
          { label: "Tuyển dụng", value: stats.tuyenDung, icon: "💼" },
          { label: "Liên hệ", value: stats.lienHe, icon: "📞" },
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

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê tổng quan</h2>
        <div className="chart-container" style={{ width: '90%', height: '400px' }}>
          <canvas id="statsChart"></canvas>
        </div>
      </div>

      {/* Quick Actions */}
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
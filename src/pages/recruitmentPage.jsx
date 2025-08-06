// src/components/RecruitmentPage.js
import { MapPin, Clock, DollarSign, Users, Briefcase } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useEffect, useState } from "react";
import { recruitmentData } from "../data/MockData"; // Import dữ liệu mẫu

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const apiUrl = "http://localhost:3000/api/tuyendung";
  const { t } = useLanguage();

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Kiểm tra dữ liệu từ API
        if (data && Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => new Date(b.ngay_dang) - new Date(a.ngay_dang));
          setJobs(sorted);
        } else {
          // Sử dụng dữ liệu mẫu nếu API trả về mảng rỗng
          const sortedMockData = [...recruitmentData].sort((a, b) => new Date(b.ngay_dang) - new Date(a.ngay_dang));
          setJobs(sortedMockData);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        // Sử dụng dữ liệu mẫu khi API thất bại
        const sortedMockData = [...recruitmentData].sort((a, b) => new Date(b.ngay_dang) - new Date(a.ngay_dang));
        setJobs(sortedMockData);
      });
  }, []);

  // Phân trang
  const totalPages = Math.ceil(jobs.length / pageSize) || 1;
  const jobsToShow = jobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Hàm format ngày
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tiêu đề trang */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{t("careers.title")}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t("careers.slogan")}</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>
              {jobs.length} {t("careers.position")}
            </span>
          </div>
        </div>

        {/* Danh sách việc làm */}
        <div className="space-y-8">
          {jobsToShow.length === 0 && (
            <div className="text-center text-gray-500">Hiện chưa có vị trí tuyển dụng nào.</div>
          )}
          {jobsToShow.map((job) => (
            <div
              key={job.id}
              className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold text-blue-600 mb-3">{job.vi_tri}</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="flex items-center text-gray-700 dark:text-gray-300">
                  <MapPin className="inline-block w-4 h-4 mr-1" />
                  <b>Địa điểm:</b>&nbsp;{job.dia_diem}
                </span>
                <span className="flex items-center text-gray-700 dark:text-gray-300">
                  <DollarSign className="inline-block w-4 h-4 mr-1" />
                  <b>Mức lương:</b>&nbsp;{job.muc_luong}
                </span>
                <span className="flex items-center text-gray-700 dark:text-gray-300">
                  <Briefcase className="inline-block w-4 h-4 mr-1" />
                  <b>Kinh nghiệm:</b>&nbsp;{job.kinh_nghiem} năm
                </span>
                <span className="flex items-center text-gray-700 dark:text-gray-300">
                  <Clock className="inline-block w-4 h-4 mr-1" />
                  <b>Thời gian làm việc:</b>&nbsp;{job.thoi_gian_lam_viec}
                </span>
                <span className="flex items-center text-gray-700 dark:text-gray-300">
                  <b>Số lượng:</b>&nbsp;{job.so_luong}
                </span>
              </div>
              <div className="mb-2 text-gray-700 dark:text-gray-300">
                <b>Mô tả công việc:</b>
                <div className="whitespace-pre-line mt-1">{job.mo_ta_cong_viec}</div>
              </div>
              <div className="mb-2 text-gray-700 dark:text-gray-300">
                <b>Yêu cầu:</b>
                <div className="whitespace-pre-line mt-1">{job.yeu_cau_ung_vien || "Không có yêu cầu cụ thể"}</div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-1 mt-2">
                <span>
                  Hạn nộp: <b>{formatDate(job.han_nop_ho_so)}</b>
                </span>
                <span>
                  Ngày đăng: <b>{formatDate(job.ngay_dang)}</b>
                </span>
              </div>
              <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                <b>Cách ứng tuyển:</b>
                <span>
                  Gửi CV về email:{" "}
                  <a href="mailto:careers@company.com" className="text-blue-500 hover:underline">
                    careers@company.com
                  </a>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        <div className="text-center mt-10 flex justify-center gap-2">
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Trang trước
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={`px-4 py-2 rounded ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                }`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Trang sau
          </button>
        </div>

        {/* Thông tin liên hệ */}
        <div className="text-center mt-12 p-6 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          <p className="text-sm">
            Mọi thắc mắc vui lòng gửi về&nbsp;
            <a href="mailto:careers@company.com" className="text-blue-500 hover:underline">
              careers@company.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
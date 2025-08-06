

import { useState, useEffect } from "react"
import FormCard from "../common/FormCard"
import FormButtons from "../common/FormButtons"

export default function RecruitmentForm({ job, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    vi_tri: job?.vi_tri || "",
    mo_ta_cong_viec: job?.mo_ta_cong_viec || "",
    yeu_cau_ung_vien: job?.yeu_cau_ung_vien || "",
    so_luong: job?.so_luong || "",
    han_nop_ho_so: job?.han_nop_ho_so || "",
    dia_diem: job?.dia_diem || "",
    muc_luong: job?.muc_luong || "",
    kinh_nghiem: job?.kinh_nghiem || "1+ năm", // Thêm trường này
    thoi_gian_lam_viec: job?.thoi_gian_lam_viec || "Full-time", // Thêm trường này
  })

  // Cập nhật lại formData khi job thay đổi
  useEffect(() => {
    setFormData({
      vi_tri: job?.vi_tri || "",
      mo_ta_cong_viec: job?.mo_ta_cong_viec || "",
      yeu_cau_ung_vien: job?.yeu_cau_ung_vien || "",
      so_luong: job?.so_luong || "",
      han_nop_ho_so: job?.han_nop_ho_so || "",
      dia_diem: job?.dia_diem || "",
      muc_luong: job?.muc_luong || "",
      kinh_nghiem: job?.kinh_nghiem || "1+ năm", // Cập nhật trường này
      thoi_gian_lam_viec: job?.thoi_gian_lam_viec || "Full-time", // Cập nhật trường này
    })
  }, [job])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <FormCard title={job ? "Sửa tin tuyển dụng" : "Thêm tin tuyển dụng mới"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí</label>
            <input
              type="text"
              value={formData.vi_tri}
              onChange={(e) => setFormData({ ...formData, vi_tri: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
            <input
              type="number"
              value={formData.so_luong}
              onChange={(e) => setFormData({ ...formData, so_luong: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
            <input
              type="text"
              value={formData.dia_diem}
              onChange={(e) => setFormData({ ...formData, dia_diem: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mức lương</label>
            <input
              type="text"
              value={formData.muc_luong}
              onChange={(e) => setFormData({ ...formData, muc_luong: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hạn nộp hồ sơ</label>
            <input
              type="date"
              value={formData.han_nop_ho_so}
              onChange={(e) => setFormData({ ...formData, han_nop_ho_so: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between gap-2 ">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian làm việc</label>
              <select
                value={formData.thoi_gian_lam_viec}
                onChange={(e) => setFormData({ ...formData, thoi_gian_lam_viec: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Năm kinh nghiệm</label>
              <select
                value={formData.kinh_nghiem}
                onChange={(e) => setFormData({ ...formData, kinh_nghiem: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1+ năm</option>
                <option value="2">2+ năm</option>
                <option value="3">3+ năm</option>
                <option value="4">4+ năm</option>
                <option value="5">5+ năm</option>
                <option value="6">6+ năm</option>
                <option value="7">7+ năm</option>
                <option value="8">8+ năm</option>
                <option value="9">9+ năm</option>
                <option value="10">10+ năm</option>
              </select>
            </div>
          </div>

        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả công việc</label>
          <textarea
            value={formData.mo_ta_cong_viec}
            onChange={(e) => setFormData({ ...formData, mo_ta_cong_viec: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Yêu cầu ứng viên</label>
          <textarea
            value={formData.yeu_cau_ung_vien}
            onChange={(e) => setFormData({ ...formData, yeu_cau_ung_vien: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <FormButtons onSubmit={handleSubmit} onCancel={onCancel} isEditing={!!job} />
      </form>
    </FormCard>
  )
}



import { useState, useEffect } from "react"
import FormCard from "../common/FormCard"
import FormButtons from "../common/FormButtons"

export default function ServiceForm({ service, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    ten_dich_vu: service?.ten_dich_vu || "",
    mo_ta: service?.mo_ta || "",
  })

  // Thêm useEffect để cập nhật formData khi service thay đổi
  useEffect(() => {
    setFormData({
      ten_dich_vu: service?.ten_dich_vu || "",
      mo_ta: service?.mo_ta || "",
    })
  }, [service])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <FormCard title={service ? "Sửa dịch vụ" : "Thêm dịch vụ mới"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên dịch vụ</label>
          <input
            type="text"
            value={formData.ten_dich_vu}
            onChange={(e) => setFormData({ ...formData, ten_dich_vu: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
          <textarea
            value={formData.mo_ta}
            onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <FormButtons onSubmit={handleSubmit} onCancel={onCancel} isEditing={!!service} />
      </form>
    </FormCard>
  )
}

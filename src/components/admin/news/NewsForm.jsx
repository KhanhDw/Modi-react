
import { useState, useEffect } from "react"
import FormCard from "../common/FormCard"
import FormButtons from "../common/FormButtons"

export default function NewsForm({ news, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    tieu_de: news?.tieu_de || "",
    noi_dung: news?.noi_dung || "",
    tac_gia: news?.tac_gia || "",
  })

  useEffect(() => {
    setFormData({
      tieu_de: news?.tieu_de || "",
      noi_dung: news?.noi_dung || "",
      tac_gia: news?.tac_gia || "",
    })
  }, [news])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Nếu là sửa, không gửi trường tac_gia
    if (news) {
      const { tieu_de, noi_dung } = formData
      onSubmit({ tieu_de, noi_dung })
    } else {
      onSubmit(formData)
    }
  }

  return (
    <FormCard title={news ? "Sửa tin tức" : "Thêm tin tức mới"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Banner tin tức</label>
          <input type="file" className="border-2 border-gray-500 px-2 py-1 rounded-4xl"></input>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
          <input
            type="text"
            value={formData.tieu_de}
            onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
          <textarea
            value={formData.noi_dung}
            onChange={(e) => setFormData({ ...formData, noi_dung: e.target.value })}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tác giả</label>
          <input
            type="text"
            value={formData.tac_gia}
            onChange={(e) => setFormData({ ...formData, tac_gia: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!!news} // Disable khi sửa
          />
        </div>
        <FormButtons onSubmit={handleSubmit} onCancel={onCancel} isEditing={!!news} />
      </form>
    </FormCard>
  )
}

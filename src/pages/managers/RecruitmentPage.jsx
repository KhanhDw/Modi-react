import PageHeader from "../../components/admin/common/PageHeader"
import Table from "../../components/admin/common/Table"
import RecruitmentForm from "../../components/admin/recruitment/RecruitmentForm"
import { useState, useEffect } from "react"

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  const apiUrl = "MAIN_BE_URL/api/tuyendung"

  // Lấy danh sách tin tuyển dụng từ backend khi component mount
  const fetchJobs = () => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((data) => setJobs(data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error))
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const columns = [
    { key: "id", label: "ID", className: "text-gray-900" },
    { key: "vi_tri", label: "Vị trí", className: "font-medium text-gray-900" },
    { key: "dia_diem", label: "Địa điểm" },
    { key: "muc_luong", label: "Mức lương" },
    { key: "so_luong", label: "Số lượng" },
    { key: "kinh_nghiem", label: "Kinh nghiệm" },
    { key: "thoi_gian_lam_viec", label: "Thời gian làm việc" },
    { key: "han_nop_ho_so", label: "Hạn nộp" },
    { key: "ngay_dang", label: "Ngày đăng" },
  ]

  const handleAdd = () => {
    setEditingJob(null)
    setShowForm(true)
  }

  const handleEdit = (job) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa tin tuyển dụng này?")) {
      fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok")
          }
          setJobs(jobs.filter((j) => j.id !== id))
        })
        .catch((error) => console.error("Lỗi khi xóa:", error))
    }
  }

  const handleSubmit = (formData) => {
    const method = editingJob ? "PUT" : "POST"
    const url = editingJob ? `${apiUrl}/${editingJob.id}` : apiUrl

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then(() => {
        // Sau khi thêm/sửa thành công, gọi lại hàm fetchJobs để cập nhật danh sách
        fetchJobs()
        setShowForm(false)
      })
      .catch((error) => console.error("Lỗi khi submit:", error))
  }

  return (
    <div className="p-6">
      <PageHeader title="Quản lý tuyển dụng" buttonText="Thêm tin tuyển dụng" onButtonClick={handleAdd} />

      {showForm && (
        <RecruitmentForm
          job={editingJob}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
      {!showForm && <Table columns={columns} data={jobs} onEdit={handleEdit} onDelete={handleDelete} />}
    </div>
  )
}
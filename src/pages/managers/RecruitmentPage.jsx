"use client"
import AdminLayout from "../../components/admin/AdminLayout"
import PageHeader from "../../components/admin/common/PageHeader"
import Table from "../../components/admin/common/Table"
import RecruitmentForm from "../../components/admin/recruitment/RecruitmentForm"
import { useState, useEffect } from "react"

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  // Lấy danh sách tin tuyển dụng từ backend khi component mount
  useEffect(() => {
    fetch('http://localhost:3000/api/tuyendung')
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error))
  }, [])

  const columns = [
    { key: "id", label: "ID", className: "text-gray-900" },
    { key: "vi_tri", label: "Vị trí", className: "font-medium text-gray-900" },
    { key: "dia_diem", label: "Địa điểm" },
    { key: "muc_luong", label: "Mức lương" },
    { key: "so_luong", label: "Số lượng" },
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
      fetch(`http://localhost:3000/api/tuyendung/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(() => setJobs(jobs.filter((j) => j.id !== id)))
        .catch((error) => console.error('Lỗi khi xóa:', error))
    }
  }

  const handleSubmit = (formData) => {
    const method = editingJob ? 'PUT' : 'POST'
    const url = editingJob
      ? `http://localhost:3000/api/tuyendung/${editingJob.id}`
      : 'http://localhost:3000/api/tuyendung'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (editingJob) {
          setJobs(jobs.map((j) => (j.id === editingJob.id ? { ...j, ...formData } : j)))
        } else {
          setJobs([
            ...jobs,
            { id: data.data?.id || Date.now(), ...formData, ngay_dang: new Date().toISOString().split("T")[0] },
          ])
        }
        setShowForm(false)
      })
      .catch((error) => console.error('Lỗi khi submit:', error))
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <PageHeader title="Quản lý tuyển dụng" buttonText="Thêm tin tuyển dụng" onButtonClick={handleAdd} />

        {showForm && (
          <RecruitmentForm
            job={editingJob}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}

        <Table columns={columns} data={jobs} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </AdminLayout>
  )
}

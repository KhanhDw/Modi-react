"use client"
import AdminLayout from "../../components/admin/AdminLayout"
import PageHeader from "../../components/admin/common/PageHeader"
import Table from "../../components/admin/common/Table"
import RecruitmentForm from "../../components/admin/recruitment/RecruitmentForm"
import { useState } from "react"

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      vi_tri: "Frontend Developer",
      mo_ta_cong_viec: "Phát triển giao diện website",
      yeu_cau_ung_vien: "Biết React, HTML, CSS",
      so_luong: 2,
      han_nop_ho_so: "2024-02-15",
      dia_diem: "Hà Nội",
      muc_luong: "15-20 triệu",
      ngay_dang: "2024-01-15",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  const columns = [
    { key: "vi_tri", label: "Vị trí", className: "font-medium text-gray-900" },
    { key: "dia_diem", label: "Địa điểm" },
    { key: "muc_luong", label: "Mức lương" },
    { key: "so_luong", label: "Số lượng" },
    { key: "han_nop_ho_so", label: "Hạn nộp" },
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
      setJobs(jobs.filter((j) => j.id !== id))
    }
  }

  const handleSubmit = (formData) => {
    if (editingJob) {
      setJobs(jobs.map((j) => (j.id === editingJob.id ? { ...j, ...formData } : j)))
    } else {
      const newJob = {
        id: Date.now(),
        ...formData,
        ngay_dang: new Date().toISOString().split("T")[0],
      }
      setJobs([...jobs, newJob])
    }
    setShowForm(false)
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <PageHeader title="Quản lý tuyển dụng" buttonText="Thêm tin tuyển dụng" onButtonClick={handleAdd} />

        {showForm && <RecruitmentForm job={editingJob} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />}

        <Table columns={columns} data={jobs} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </AdminLayout>
  )
}

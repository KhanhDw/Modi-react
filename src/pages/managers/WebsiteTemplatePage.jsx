
import { useState } from "react"
import { Outlet } from "react-router-dom";



// export type ViewMode = "list" | "edit" | "detail"

export default function WebsiteTemplatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templates, setTemplates] = useState([
    {
      id: "1",
      name: "E-commerce Modern",
      description: "Mẫu website thương mại điện tử hiện đại với giao diện sạch sẽ",
      imageUrl: "https://github.com/shadcn.png",
      category: "E-commerce",
      tags: [".jsx", "TailwindCSS"],
      exportState: true,
      urlGitHub: "https://github.com/shadcn/ui",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
    },
    {
      id: "2",
      name: "Portfolio Creative",
      description: "Mẫu portfolio sáng tạo cho designer và developer",
      imageUrl: "https://github.com/shadcn.png",
      category: "Portfolio",
      tags: [".jsx", "TailwindCSS"],
      exportState: false,
      urlGitHub: "https://github.com/shadcn/ui",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
    },
    {
      id: "3",
      name: "Corporate Business",
      description: "Mẫu website doanh nghiệp chuyên nghiệp",
      imageUrl: "https://github.com/shadcn.png",
      category: "Business",
      tags: [".jsx", "TailwindCSS"],
      exportState: true,
      urlGitHub: "https://github.com/shadcn/ui",
      createdAt: "2024-01-05",
      updatedAt: "2024-01-15",
    },
    {
      id: "4",
      name: "Blog Minimal",
      description: "Mẫu blog tối giản, tập trung vào nội dung",
      imageUrl: "https://github.com/shadcn.png",
      category: "Blog",
      tags: [".jsx", "TailwindCSS"],
      exportState: false,
      urlGitHub: "https://github.com/shadcn/ui",
      createdAt: "2024-01-12",
      updatedAt: "2024-01-22",
    },
  ])

  const handleEdit = (template) => {
    setSelectedTemplate(template)
    setViewMode("edit")
  }

  const handleView = (template) => {
    setSelectedTemplate(template)
    setViewMode("detail")
  }

  const handleSave = (updatedTemplate) => {
    setTemplates((prev) => prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)))
    setViewMode("list")
    setSelectedTemplate(null)
  }

//   const handleAdd = (newTemplate: Omit<WebsiteTemplate, "id" | "createdAt" | "updatedAt">) => {
  const handleAdd = (newTemplate) => {
    const template = {
      ...newTemplate,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setTemplates((prev) => [...prev, template])
    setViewMode("list")
    setSelectedTemplate(null)
  }

  const handleDelete = (templateId) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
  }

  const handleBack = () => {
    setViewMode("list")
    setSelectedTemplate(null)
  }  

  const handleAddNew = () => {
    setSelectedTemplate(null)
    setViewMode("edit")
  }
  return (
    <div>
      <Outlet
        context={{
    templates,
    handleSave,
    handleAdd,
    handleDelete,
    handleEdit,
    handleView,
    handleBack,
    handleAddNew,
    selectedTemplate,
  }}
      />
    </div>
  );
}

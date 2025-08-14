// export {default as WebsiteTemplateDetail} from "./DetailWebsite" 
// export {default as WebsiteTemplateEdit} from "./EditWebsite" 
// export {default as WebsiteTemplateList} from "./ListWebsite" 


import { useState } from "react"
import  WebsiteTemplateList from "./ListWebsite"
import  WebsiteTemplateEdit from "./EditWebsite"
import  WebsiteTemplateDetail from "./DetailWebsite"



// export type ViewMode = "list" | "edit" | "detail"

export default function WebsiteTemplatePage() {
  const [viewMode, setViewMode] = useState("list")
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
    <div className="">
      {viewMode === "list" && (
        <WebsiteTemplateList
          templates={templates}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
        />
      )}

      {viewMode === "edit" && (
        <WebsiteTemplateEdit template={selectedTemplate} onSave={handleSave} onAdd={handleAdd} onBack={handleBack} />
      )}

      {viewMode === "detail" && selectedTemplate && (
        <WebsiteTemplateDetail
          template={selectedTemplate}
          onBack={handleBack}
          onEdit={() => handleEdit(selectedTemplate)}
        />
      )}
    </div>
  )
}

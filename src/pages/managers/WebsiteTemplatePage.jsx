import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

const baseUrl = import.meta.env.VITE_MAIN_BE_URL || 'http://localhost:3000';

export default function WebsiteTemplatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/web-samples`);
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      const parsedData = data.map(item => ({
        ...item,
        tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags,
        export_state: !!item.export_state,
      }));
      setTemplates(parsedData);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
  };

  const handleView = (template) => {
    setSelectedTemplate(template);
  };

  const handleSave = async (updatedTemplate) => {
    try {
      const response = await fetch(`${baseUrl}/api/web-samples/${updatedTemplate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedTemplate,
          tags: Array.isArray(updatedTemplate.tags) ? updatedTemplate.tags : [],
          export_state: updatedTemplate.export_state ? 1 : 0,
          url_github: updatedTemplate.url_github,
          updated_at: updatedTemplate.updated_at,
        }),
      });
      if (!response.ok) throw new Error('Failed to update template');
      await fetchTemplates();
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error saving template:", error);
      throw error;
    }
  };

  const handleAdd = async (newTemplate) => {
    try {
      const response = await fetch(`${baseUrl}/api/web-samples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTemplate,
          tags: Array.isArray(newTemplate.tags) ? newTemplate.tags : [],
          export_state: newTemplate.export_state ? 1 : 0,
          url_github: newTemplate.url_github,
          created_at: newTemplate.created_at,
          updated_at: newTemplate.updated_at,
        }),
      });
      if (!response.ok) throw new Error('Failed to add template');
      await fetchTemplates();
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error adding template:", error);
      throw error;
    }
  };

  const handleDelete = async (templateId) => {
    try {
      const response = await fetch(`${baseUrl}/api/web-samples/${templateId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete template');
      await fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleBack = () => {
    setSelectedTemplate(null);
  };

  const handleAddNew = () => {
    setSelectedTemplate(null);
  };

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
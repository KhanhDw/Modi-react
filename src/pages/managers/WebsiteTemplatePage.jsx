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
        tech: typeof item.tech === 'string' ? JSON.parse(item.tech) : item.tech,
        export_state: item.export_state ? 1 : 0,
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

  const handleSave = async (updatedTemplate, id) => {
    try {
      const response = await fetch(`${baseUrl}/api/web-samples/${id}`, {
        method: 'PUT',
        body: updatedTemplate,
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
        body: newTemplate,
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
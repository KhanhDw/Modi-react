const API_URL = `${import.meta.env.VITE_MAIN_BE_URL}/api/list-mini-service`;

// Lấy tất cả mini services
export const getAllMiniServices = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to get all mini services");
    }
  } catch (error) {
    console.error("Error getAllMiniServices:", error);
    throw error;
  }
};

// Lấy mini service theo ID
export const getMiniServiceById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Không tìm thấy
      }
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      throw new Error(
        result.message || `Failed to get mini service with id ${id}`
      );
    }
  } catch (error) {
    console.error(`Error getMiniServiceById with id ${id}:`, error);
    throw error;
  }
};

// Lấy danh sách mini service theo services_stage_id
export const getMiniServicesByStageId = async (stageId) => {
  try {
    const response = await fetch(`${API_URL}/stage/${stageId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      throw new Error(
        result.message || `Failed to get mini services for stage id ${stageId}`
      );
    }
  } catch (error) {
    console.error(
      `Error getMiniServicesByStageId with stageId ${stageId}:`,
      error
    );
    throw error;
  }
};

// Tạo mới mini service
export const createMiniService = async (miniServiceData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title_en: miniServiceData.title_en,
        title_vi: miniServiceData.title_vi,
      }),
    });

    // Check status HTTP
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP ${response.status} - ${errData.message || response.statusText}`
      );
    }

    // Lấy JSON từ BE
    const result = await response.json();

    if (result.success) {
      return result;
    } else {
      throw new Error(result.message || "Failed to create mini service");
    }
  } catch (error) {
    console.error("Error createMiniService:", error);
    throw error;
  }
};

// Cập nhật mini service theo ID
export const updateMiniService = async (id, miniServiceData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(miniServiceData), // { services_stage_id, title_en, title_vi }
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Mini service not found for update");
      }
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    if (result.success) {
      return result;
    } else {
      throw new Error(
        result.message || `Failed to update mini service with id ${id}`
      );
    }
  } catch (error) {
    console.error(`Error updateMiniService with id ${id}:`, error);
    throw error;
  }
};

// Xóa mini service theo ID
export const deleteMiniService = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Mini service not found for deletion");
      }
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    if (result.success) {
      return result;
    } else {
      throw new Error(
        result.message || `Failed to delete mini service with id ${id}`
      );
    }
  } catch (error) {
    console.error(`Error deleteMiniService with id ${id}:`, error);
    throw error;
  }
};

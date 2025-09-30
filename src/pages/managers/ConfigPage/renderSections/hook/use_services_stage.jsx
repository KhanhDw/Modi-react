const API_URL = `${import.meta.env.VITE_MAIN_BE_URL}/api/services-stage`;
const API_URL_service = `${import.meta.env.VITE_MAIN_BE_URL}/api/services`;

// Helper chung cho API calls
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Network response was not ok");
        }

        if (!result.success) {
            throw new Error(result.message || "Request failed");
        }

        return result;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

/* ========================= SERVICES ========================= */

export const getAllServices = async () => {
    const result = await apiRequest(API_URL_service);
    return result.data;
};

/* ========================= SERVICES_STAGE ========================= */

// Lấy tất cả services-stage
export const getAllServiceStages = async () => {
    const result = await apiRequest(API_URL);
    return result.data;
};

// Lấy service stage theo ID
export const getServiceStageById = async (id) => {
    const result = await apiRequest(`${API_URL}/${id}`);
    return result.data;
};

// Tạo mới service stage
export const createServiceStage = async (serviceStageData) => {
    return await apiRequest(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceStageData), // { service_id, stage_id }
    });
};

// Cập nhật service stage theo ID
export const updateServiceStage = async (id, serviceStageData) => {
    return await apiRequest(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceStageData),
    });
};

// Xóa service stage theo ID
export const deleteServiceStage = async (id) => {
    return await apiRequest(`${API_URL}/${id}`, {
        method: "DELETE",
    });
};

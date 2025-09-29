
const API_URL = `${import.meta.env.VITE_MAIN_BE_URL}/api/services-stage`;


// Lấy tất cả service stages
export const getAllServices = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/services`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message || "Failed to get all service stages");
        }
    } catch (error) {
        console.error("Error getAllServiceStages:", error);
        throw error;
    }
};




// Lấy tất cả service stages
export const getAllServiceStages = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message || "Failed to get all service stages");
        }
    } catch (error) {
        console.error("Error getAllServiceStages:", error);
        throw error;
    }
};

// Lấy service stage theo ID
export const getServiceStageById = async (id) => {
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
            throw new Error(result.message || `Failed to get service stage with id ${id}`);
        }
    } catch (error) {
        console.error(`Error getServiceStageById with id ${id}:`, error);
        throw error;
    }
};

// Tạo mới service stage
export const createServiceStage = async (serviceStageData) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(serviceStageData), // { service_id, stage }
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.success) {
            return result;
        } else {
            throw new Error(result.message || "Failed to create service stage");
        }
    } catch (error) {
        console.error("Error createServiceStage:", error);
        throw error;
    }
};

// Cập nhật service stage theo ID
export const updateServiceStage = async (id, serviceStageData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(serviceStageData), // { service_id, stage }
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Service stage not found for update");
            }
            throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.success) {
            return result;
        } else {
            throw new Error(result.message || `Failed to update service stage with id ${id}`);
        }
    } catch (error) {
        console.error(`Error updateServiceStage with id ${id}:`, error);
        throw error;
    }
};

// Xóa service stage theo ID
export const deleteServiceStage = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Service stage not found for deletion");
            }
            throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.success) {
            return result;
        } else {
            throw new Error(result.message || `Failed to delete service stage with id ${id}`);
        }
    } catch (error) {
        console.error(`Error deleteServiceStage with id ${id}:`, error);
        throw error;
    }
};

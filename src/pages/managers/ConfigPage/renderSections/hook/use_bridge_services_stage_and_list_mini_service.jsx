const API_URL = `${import.meta.env.VITE_MAIN_BE_URL}/api/bridge-services-stage-and-list-mini-service`;

// Lấy tất cả bridge
export const getAllBridge = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message || "Failed to get all bridges");
        }
    } catch (error) {
        console.error("Error getAllBridge:", error);
        throw error;
    }
};

// Lấy bridge theo ID
export const getBridgeById = async (id) => {
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
            throw new Error(result.message || `Failed to get bridge with id ${id}`);
        }
    } catch (error) {
        console.error(`Error getBridgeById with id ${id}:`, error);
        throw error;
    }
};

// Tạo mới bridge
export const createBridge = async (bridgeData) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                list_mini_service_id: bridgeData.list_mini_service_id,
                services_stage_id: bridgeData.services_stage_id,
            }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(`HTTP ${response.status} - ${errData.message || response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
            return result;
        } else {
            throw new Error(result.message || "Failed to create bridge");
        }
    } catch (error) {
        console.error("Error createBridge:", error);
        throw error;
    }
};

// Cập nhật bridge theo ID
export const updateBridge = async (id, bridgeData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bridgeData), // { list_mini_service_id, services_stage_id }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Bridge not found for update");
            }
            throw new Error("Network response was not ok");
        }

        const result = await response.json();
        if (result.success) {
            return result;
        } else {
            throw new Error(result.message || `Failed to update bridge with id ${id}`);
        }
    } catch (error) {
        console.error(`Error updateBridge with id ${id}:`, error);
        throw error;
    }
};

// Xóa bridge theo ID
export const deleteBridge = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Bridge not found for deletion");
            }
            throw new Error("Network response was not ok");
        }

        const result = await response.json();
        if (result.success) {
            return result;
        } else {
            throw new Error(result.message || `Failed to delete bridge with id ${id}`);
        }
    } catch (error) {
        console.error(`Error deleteBridge with id ${id}:`, error);
        throw error;
    }
};

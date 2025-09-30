const API_URL = `${import.meta.env.VITE_MAIN_BE_URL}/api/bridge-service-and-list-mini-service`;

// Lấy tất cả bridge
export const getAllBridge = async (lang = "vi") => {
    try {
        const baseUrl = `${import.meta.env.VITE_MAIN_BE_URL}${lang === "vi" ? "" : "/en"}`;
        const response = await fetch(`${baseUrl}/api/bridge-service-and-list-mini-service`);

        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        if (result.success) return result.data;

        throw new Error(result.message || "Failed to get all bridges");
    } catch (error) {
        console.error("Error getAllBridge:", error);
        throw error;
    }
};

// Lấy tất cả mini service theo service_id + stage_id
export const getBridgeByServiceAndStage = async (service_id, stage_id) => {
    try {
        const response = await fetch(`${API_URL}/${service_id}/${stage_id} `);

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error("Network response was not ok");
        }

        const result = await response.json();
        if (result.success) return result.data;

        throw new Error(result.message || `Failed to get bridge with service_id = ${service_id}, stage_id = ${stage_id} `);
    } catch (error) {
        console.error(`Error getBridgeByServiceAndStage service_id = ${service_id}, stage_id = ${stage_id}: `, error);
        throw error;
    }
};

// Tạo mới bridge
export const createBridge = async ({ service_id, list_mini_service_id, stage_id }) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ service_id, list_mini_service_id, stage_id }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(`HTTP ${response.status} - ${errData.message || response.statusText} `);
        }

        const result = await response.json();
        if (result.success) return result;

        throw new Error(result.message || "Failed to create bridge");
    } catch (error) {
        console.error("Error createBridge:", error);
        throw error;
    }
};

// Xóa bridge (cần service_id, list_mini_service_id, stage_id)
export const deleteBridge = async (service_id, list_mini_service_id, stage_id) => {
    try {
        const response = await fetch(API_URL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ service_id, list_mini_service_id, stage_id }),
        });

        if (!response.ok) {
            if (response.status === 404) throw new Error("Bridge not found for deletion");
            throw new Error("Network response was not ok");
        }

        const result = await response.json();
        if (result.success) return result;

        throw new Error(result.message || `Failed to delete bridge for service_id = ${service_id}, list_mini_service_id = ${list_mini_service_id}, stage_id = ${stage_id} `);
    } catch (error) {
        console.error(`Error deleteBridge service_id = ${service_id}, list_mini_service_id = ${list_mini_service_id}, stage_id = ${stage_id}: `, error);
        throw error;
    }
};

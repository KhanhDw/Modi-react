const API_STAGE_URL = `${import.meta.env.VITE_MAIN_BE_URL}/api/stage-master`;

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


// ========================== StageMaster ======================

// Cập nhật code (vị trí) cho từng stage master
export const updateStageOrder = async (id, newCode) => {
    return await apiRequest(`${API_STAGE_URL}/code/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newCode: newCode }),
    });
};

// Cập nhật vị trí (code) hàng loạt
export const bulkUpdateStageCodes = async (stages) => {
    return await apiRequest(`${API_STAGE_URL}/bulk-update-codes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stages }), // Gửi một mảng các object { id, code }
    });
};


// Lấy tất cả stage master
export const getAllStages = async () => {
    const result = await apiRequest(API_STAGE_URL);
    return result.data;
};

// Lấy stage master theo ID
export const getStageById = async (id) => {
    const result = await apiRequest(`${API_STAGE_URL}/${id}`);
    return result.data;
};

// Tạo mới stage master
export const createStage = async (stageData) => {
    const result = await apiRequest(API_STAGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stageData),
    });
    return result.data || { id: result.id }; // BE trả id
};


// Cập nhật stage master theo ID
export const updateStage = async (id, stageData) => {
    return await apiRequest(`${API_STAGE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stageData),
    });
};

// Xóa stage master theo ID
export const deleteStage = async (id) => {
    return await apiRequest(`${API_STAGE_URL}/${id}`, {
        method: "DELETE",
    });
};

import { getAllMiniServices } from "@/pages/managers/ConfigPage/renderSections/hook/use_list_mini_service.jsx";
import { getAllServiceStages } from "@/pages/managers/ConfigPage/renderSections/hook/use_services_stage.jsx";
import { getAllBridge } from "@/pages/managers/ConfigPage/renderSections/hook/use_bridge_services_stage_and_list_mini_service.jsx";

/**
 * Lấy danh sách mini services để làm header cột
 */
async function getDataServiceMini() {
    try {
        const minis = await getAllMiniServices(); // [{id, title_vi, title_en}, ...]
        console.log(minis);
        return minis;
    } catch (error) {
        console.error("Error getDataServiceMini:", error);
        return [];
    }
}

/**
 * Lấy danh sách service stages
 */
async function getDataServiceStage() {
    try {
        const stages = await getAllServiceStages(); // [{id, service_id, stage}, ...]
        console.log(stages);
        return stages;
    } catch (error) {
        console.error("Error getDataServiceStage:", error);
        return [];
    }
}
async function getDataAllBridge() {
    try {
        const bridge = await getAllBridge();
        console.log(bridge);
        return bridge;
    } catch (error) {
        console.error("Error getDataServiceStage:", error);
        return [];
    }
}




/**
 * Định dạng lại dữ liệu thô từ Stages và Minis thành cấu trúc bảng mong muốn.
 * @returns {Promise<{tableData: Array<Object>, columnHeaders: Array<string>}>}
 */
async function formatServiceData() {
    console.log("--- Bắt đầu hàm formatServiceData ---");
    // 1. Lấy dữ liệu
    const [stages, minis, bridges] = await Promise.all([
        getDataServiceStage(),
        getDataServiceMini(),
        getDataAllBridge()
    ]);
    console.log("========");
    console.log(stages);
    console.log(minis);
    console.log(bridges);
    console.log("========");

    const mock_tableData = {
        name: "",
    }


    const TableData1 = minis.map(item => ({
        id: item.id,
        title_en: item.title_en,
        title_vi: item.title_vi
    }));






    const tableData = []
    const columnHeaders = []



    return {
        tableData,
        columnHeaders,
    };
}

export default {
    formatServiceData,
    getDataServiceStage,
    getDataServiceMini
};


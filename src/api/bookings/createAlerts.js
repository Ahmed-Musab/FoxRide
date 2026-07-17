import api from "../api";

export const createAlert = async (alertData) => {
    try {
        const response = await api.post("/api/services/app/WorkOrder/Create", alertData);
        return response.data;
    } catch (error) {
        throw error;
    }
};